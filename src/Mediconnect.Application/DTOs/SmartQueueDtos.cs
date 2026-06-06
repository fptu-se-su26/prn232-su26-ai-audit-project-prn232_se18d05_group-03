using Mediconnect.Domain.Entities;

namespace Mediconnect.Application.DTOs;

public class CheckInRequestDto
{
    public Guid ClinicId { get; set; }
    public Guid? AppointmentId { get; set; }
}

public class QueueTicketDetailDto
{
    public Guid Id { get; set; }
    public Guid ClinicId { get; set; }
    public string ClinicName { get; set; } = string.Empty;
    public string? ClinicRoomNumber { get; set; }
    public Guid? AppointmentId { get; set; }
    public int Number { get; set; }
    public DateTime IssuedAt { get; set; }
    public QueueStatus Status { get; set; }
}

public class ClinicQueueDto
{
    public Guid ClinicId { get; set; }
    public string ClinicName { get; set; } = string.Empty;
    public string? RoomNumber { get; set; }
    public int WaitingCount { get; set; }
    public int? CurrentNumber { get; set; }
    public List<QueueTicketDetailDto> Tickets { get; set; } = new();
}

public class ClinicWithServicesDto
{
    public Guid Id { get; set; }
    public Guid DepartmentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? RoomNumber { get; set; }
    public bool IsActive { get; set; }
    public List<MedicalServiceReadDto> Services { get; set; } = new();
}

public class PriceUpdateDto
{
    public decimal Price { get; set; }
}
