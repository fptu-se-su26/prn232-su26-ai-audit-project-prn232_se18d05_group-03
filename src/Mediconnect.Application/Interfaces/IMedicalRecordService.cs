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
        //Task<IEnumerable<ICD10ResultDto>> SearchICD10Async(string query)
    }
}
