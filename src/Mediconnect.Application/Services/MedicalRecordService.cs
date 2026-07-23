using Mediconnect.Application.DTOs;
using Mediconnect.Application.Helpers;
using Mediconnect.Application.Interfaces;
using Mediconnect.Domain.Entities;
using System.Net.Http;
using System.Text.Json;

namespace Mediconnect.Application.Services;

public class MedicalRecordService : IMedicalRecordService
{
    private readonly IRepository<OutpatientVisit> _visitRepository;
    private readonly IRepository<LabOrder> _labOrderRepository;
    private readonly IRepository<QueueTicket> _ticketRepository;
    private readonly IRepository<Appointment> _appointmentRepository;
    private readonly HttpClient _httpClient;

    public MedicalRecordService(
        IRepository<OutpatientVisit> visitRepository,
        IRepository<LabOrder> labOrderRepository,
        IRepository<QueueTicket> ticketRepository,
        IRepository<Appointment> appointmentRepository,
        HttpClient httpClient)
    {
        _visitRepository = visitRepository;
        _labOrderRepository = labOrderRepository;
        _ticketRepository = ticketRepository;
        _appointmentRepository = appointmentRepository;
        _httpClient = httpClient;
    }

    public async Task<IReadOnlyList<ICD10ResultDto>> SearchICD10Async(string query, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return Array.Empty<ICD10ResultDto>();
        }

        try
        {
            var encodedQuery = Uri.EscapeDataString(query);
            var url = $"https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?terms={encodedQuery}&sf=code,name&df=code,name";

            var response = await _httpClient.GetAsync(url, ct);
            if (!response.IsSuccessStatusCode)
            {
                return Array.Empty<ICD10ResultDto>();
            }

            var jsonString = await response.Content.ReadAsStringAsync(ct);
            using var document = JsonDocument.Parse(jsonString);
            var root = document.RootElement;

            if (root.ValueKind == JsonValueKind.Array && root.GetArrayLength() >= 4)
            {
                var displayList = root[3];
                if (displayList.ValueKind == JsonValueKind.Array)
                {
                    var results = new List<ICD10ResultDto>();
                    foreach (var item in displayList.EnumerateArray())
                    {
                        if (item.ValueKind == JsonValueKind.Array && item.GetArrayLength() >= 2)
                        {
                            var code = item[0].GetString() ?? string.Empty;
                            var description = item[1].GetString() ?? string.Empty;
                            results.Add(new ICD10ResultDto
                            {
                                Code = code,
                                Description = description
                            });
                        }
                    }
                    return results;
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error calling NLM ICD-10 API: {ex.Message}");
        }

        return Array.Empty<ICD10ResultDto>();
    }

    public async Task<IReadOnlyList<PatientDiagnosisHistoryDto>> GetPatientDiagnosisHistoryAsync(
        Guid patientId,
        CancellationToken ct = default)
    {
        var visits = await _visitRepository.ListAsync(v => v.PatientId == patientId, ct);

        return visits
            .Where(v => !string.IsNullOrWhiteSpace(v.DiagnosisCode) || !string.IsNullOrWhiteSpace(v.DiagnosisDescription))
            .OrderByDescending(v => v.VisitDate)
            .Select(v => new PatientDiagnosisHistoryDto
            {
                DiagnosisCode = v.DiagnosisCode,
                DiagnosisDescription = v.DiagnosisDescription,
                VisitDate = v.VisitDate
            })
            .ToList();
    }

    public async Task SaveMedicalRecordAsync(MedicalRecordDtos dto, CancellationToken ct = default)
    {
        if (dto is null) throw new ArgumentNullException(nameof(dto));

        var visit = await _visitRepository.GetByIdAsync(dto.VisitId, ct);
        if (visit is null)
            throw new InvalidOperationException("Outpatient visit not found.");

        visit.ChiefComplaint = dto.ChiefComplaint;
        visit.DiagnosisCode = string.IsNullOrWhiteSpace(dto.DiagnosisCode) ? null : dto.DiagnosisCode.Trim();
        visit.DiagnosisDescription = string.IsNullOrWhiteSpace(dto.DiagnosisDescription)
            ? null
            : dto.DiagnosisDescription.Trim();

        if (!string.IsNullOrWhiteSpace(dto.Symptoms))
        {
            visit.Notes = string.IsNullOrWhiteSpace(dto.Notes)
                ? dto.Symptoms.Trim()
                : $"{dto.Symptoms.Trim()}\n{dto.Notes.Trim()}";
        }
        else
        {
            visit.Notes = dto.Notes;
        }

        visit.Status = VisitStatus.Completed;
        _visitRepository.Update(visit);

        if (dto.OrderedTests != null && dto.OrderedTests.Any())
        {
            foreach (var test in dto.OrderedTests.Where(t => !string.IsNullOrWhiteSpace(t)))
            {
                var order = new LabOrder
                {
                    Id = Guid.NewGuid(),
                    OutpatientVisitId = visit.Id,
                    OrderedById = dto.DoctorId,
                    TestName = test,
                    Status = LabOrderStatus.Ordered,
                    OrderedAt = DateTime.UtcNow
                };

                await _labOrderRepository.AddAsync(order, ct);
            }
        }

        if (visit.QueueTicketId.HasValue)
        {
            var ticket = await _ticketRepository.GetByIdAsync(visit.QueueTicketId.Value, ct);
            if (ticket is not null)
            {
                ticket.Status = QueueStatus.Completed;
                _ticketRepository.Update(ticket);

                // Cascade to the scheduled appointment, if this ticket came from one — walk-in
                // tickets have no AppointmentId and are silently skipped.
                if (ticket.AppointmentId.HasValue)
                {
                    var appointment = await _appointmentRepository.GetByIdAsync(ticket.AppointmentId.Value, ct);
                    if (appointment is not null
                        && appointment.Status != AppointmentStatus.Completed
                        && appointment.Status != AppointmentStatus.Cancelled)
                    {
                        appointment.Status = AppointmentStatus.Completed;
                        _appointmentRepository.Update(appointment);
                    }
                }
            }
        }

        await _visitRepository.SaveChangesAsync(ct);
    }
}
