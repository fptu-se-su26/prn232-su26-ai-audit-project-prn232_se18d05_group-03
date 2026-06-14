using Mediconnect.Application.DTOs;
using Mediconnect.Application.Interfaces;
using Mediconnect.Domain.Entities;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mediconnect.Application.Services
{
    public class MedicalRecordService : IMedicalRecordService
    {
        private readonly IRepository<OutpatientVisit> _visitRepository;
        private readonly IRepository<LabOrder> _labOrderRepository;
        private readonly IRepository<QueueTicket> _ticketRepository;

        public MedicalRecordService(
            IRepository<OutpatientVisit> visitRepository,
            IRepository<LabOrder> labOrderRepository,
            IRepository<QueueTicket> ticketRepository)
        {
            _visitRepository = visitRepository;
            _labOrderRepository = labOrderRepository;
            _ticketRepository = ticketRepository;
        }

        public async Task SaveMedicalRecordAsync(MedicalRecordDtos dto, CancellationToken ct = default)
        {
            if (dto is null) throw new ArgumentNullException(nameof(dto));

            var visit = await _visitRepository.GetByIdAsync(dto.VisitId, ct);
            if (visit is null)
                throw new InvalidOperationException("Outpatient visit not found.");

            
            visit.ChiefComplaint = dto.ChiefComplaint;
            visit.Notes = dto.Notes;
            visit.DiagnosisCode = dto.DiagnosisCode;
            visit.DiagnosisDescription = dto.DiagnosisDescription;
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
                }
            }

            
            await _visitRepository.SaveChangesAsync(ct);
        }
    }
}
