using Mediconnect.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mediconnect.Application.Interfaces
{
    public interface IMedicalRecordService
    {
        Task SaveMedicalRecordAsync(MedicalRecordDtos dto, CancellationToken ct = default);
        Task<IReadOnlyList<ICD10ResultDto>> SearchICD10Async(string query, CancellationToken ct = default);
        Task<IReadOnlyList<PatientDiagnosisHistoryDto>> GetPatientDiagnosisHistoryAsync(Guid patientId, CancellationToken ct = default);
    }
}
