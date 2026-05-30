namespace Mediconnect.Application.DTOs;

public class PatientHistoryDto
{
    public IReadOnlyList<OutpatientVisitReadDto> Visits { get; set; } = Array.Empty<OutpatientVisitReadDto>();
    public IReadOnlyList<LabResultReadDto> LabResults { get; set; } = Array.Empty<LabResultReadDto>();
    public IReadOnlyList<PrescriptionReadDto> Prescriptions { get; set; } = Array.Empty<PrescriptionReadDto>();
}
