namespace Mediconnect.Application.Interfaces;

using Mediconnect.Application.DTOs;

public interface IInpatientQuery
{
    Task<IReadOnlyList<InpatientAdmissionReadDto>> GetAllAsync(CancellationToken ct = default);
}
