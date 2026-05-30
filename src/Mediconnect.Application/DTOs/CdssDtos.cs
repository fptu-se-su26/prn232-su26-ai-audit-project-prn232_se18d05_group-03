namespace Mediconnect.Application.DTOs;

public class DrugInteractionCheckRequestDto
{
    public IReadOnlyList<Guid> DrugIds { get; set; } = Array.Empty<Guid>();
}

public class DrugInteractionCheckResponseDto
{
    public IReadOnlyList<DrugInteractionReadDto> Interactions { get; set; } = Array.Empty<DrugInteractionReadDto>();
}

public class DoseCheckRequestDto
{
    public Guid PatientId { get; set; }
    public Guid DrugId { get; set; }
    public decimal? DoseAmount { get; set; }
}

public class DoseCheckResponseDto
{
    public bool IsOverDose { get; set; }
    public string Message { get; set; } = string.Empty;
}
