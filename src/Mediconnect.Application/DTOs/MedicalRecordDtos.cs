using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mediconnect.Application.DTOs
{
    public class MedicalRecordDtos
    {
        public Guid VisitId { get; set; }
        public Guid DoctorId { get; set; }
        public string? ChiefComplaint { get; set; }
        public string? Symptoms { get; set; }
        public string? DiagnosisCode { get; set; }
        public string? DiagnosisDescription { get; set; }
        public List<string> OrderedTests { get; set; } = new();
        public string? Notes { get; set; }
    }

    public class ICD10ResultDto
    {
        public Guid VisitId { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class PatientDiagnosisHistoryDto
    {
        public string? DiagnosisCode { get; set; }
        public string? DiagnosisDescription { get; set; }
        public DateTime VisitDate { get; set; }
    }
}
