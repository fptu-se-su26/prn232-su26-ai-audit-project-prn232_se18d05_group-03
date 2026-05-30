using Mediconnect.Domain.Entities;

namespace Mediconnect.Application.DTOs;

public class StatusUpdateDto<TStatus>
{
    public TStatus Status { get; set; } = default!;
}

public class UserStatusUpdateDto
{
    public bool IsActive { get; set; }
}

public class RoleUpdateDto
{
    public UserRole Role { get; set; }
}
