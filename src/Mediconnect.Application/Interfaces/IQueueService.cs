using Mediconnect.Application.DTOs;

namespace Mediconnect.Application.Interfaces;

public interface IQueueService
{
    Task<QueueTicketDetailDto> CheckInAsync(CheckInRequestDto dto, CancellationToken cancellationToken = default);
    Task<ClinicQueueDto> GetClinicQueueAsync(Guid clinicId, CancellationToken cancellationToken = default);
    Task<QueueTicketDetailDto?> CallNextAsync(Guid clinicId, CancellationToken cancellationToken = default);
}
