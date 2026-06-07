using Mediconnect.Application.DTOs;
using Mediconnect.Application.Interfaces;
using Mediconnect.Application.Mapping;
using Mediconnect.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Mediconnect.Api.Modules.SmartClinic;

/// <summary>
/// Clinic Management — Quản lý danh mục phòng khám, khoa, dịch vụ và thiết lập giá khám.
/// Route: /api/clinic-management
/// Chỉ dành cho Admin.
/// </summary>
[ApiController]
[Authorize]
[Route("api/clinic-management")]
[Tags("Smart Clinic — Management")]
public class ClinicManagementController : ControllerBase
{
    private readonly IRepository<Department> _departmentRepository;
    private readonly IRepository<Clinic> _clinicRepository;
    private readonly IRepository<MedicalService> _serviceRepository;

    public ClinicManagementController(
        IRepository<Department> departmentRepository,
        IRepository<Clinic> clinicRepository,
        IRepository<MedicalService> serviceRepository)
    {
        _departmentRepository = departmentRepository;
        _clinicRepository = clinicRepository;
        _serviceRepository = serviceRepository;
    }

    // ─────────────────────────────────────────────────────────
    // DEPARTMENTS (Danh mục khoa)
    // ─────────────────────────────────────────────────────────

    /// <summary>Lấy danh sách tất cả khoa.</summary>
    [HttpGet("departments")]
    public async Task<ActionResult<IReadOnlyList<DepartmentReadDto>>> GetDepartments(CancellationToken cancellationToken)
    {
        var items = await _departmentRepository.GetAllAsync(cancellationToken);
        return Ok(items.Select(SimpleMapper.Map<Department, DepartmentReadDto>).ToList());
    }

    /// <summary>Lấy chi tiết một khoa.</summary>
    [HttpGet("departments/{id:guid}")]
    public async Task<ActionResult<DepartmentReadDto>> GetDepartment(Guid id, CancellationToken cancellationToken)
    {
        var item = await _departmentRepository.GetByIdAsync(id, cancellationToken);
        return item is null ? NotFound() : Ok(SimpleMapper.Map<Department, DepartmentReadDto>(item));
    }

    /// <summary>Tạo khoa mới.</summary>
    [HttpPost("departments")]
    public async Task<ActionResult<DepartmentReadDto>> CreateDepartment(
        [FromBody] DepartmentWriteDto dto,
        CancellationToken cancellationToken)
    {
        var entity = SimpleMapper.Map<DepartmentWriteDto, Department>(dto);
        entity.Id = Guid.NewGuid();
        await _departmentRepository.AddAsync(entity, cancellationToken);
        await _departmentRepository.SaveChangesAsync(cancellationToken);
        var result = SimpleMapper.Map<Department, DepartmentReadDto>(entity);
        return CreatedAtAction(nameof(GetDepartment), new { id = entity.Id }, result);
    }

    /// <summary>Cập nhật thông tin khoa.</summary>
    [HttpPut("departments/{id:guid}")]
    public async Task<IActionResult> UpdateDepartment(Guid id, [FromBody] DepartmentWriteDto dto, CancellationToken cancellationToken)
    {
        var entity = await _departmentRepository.GetByIdAsync(id, cancellationToken);
        if (entity is null) return NotFound();

        SimpleMapper.MapTo(dto, entity, "Id");
        _departmentRepository.Update(entity);
        await _departmentRepository.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    /// <summary>Xoá khoa (chỉ được xoá khi không còn phòng khám liên kết).</summary>
    [HttpDelete("departments/{id:guid}")]
    public async Task<IActionResult> DeleteDepartment(Guid id, CancellationToken cancellationToken)
    {
        var entity = await _departmentRepository.GetByIdAsync(id, cancellationToken);
        if (entity is null) return NotFound();

        var linkedClinics = await _clinicRepository.ListAsync(c => c.DepartmentId == id, cancellationToken);
        if (linkedClinics.Count > 0)
            return BadRequest(new { message = "Không thể xoá khoa khi còn phòng khám liên kết." });

        _departmentRepository.Remove(entity);
        await _departmentRepository.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    // ─────────────────────────────────────────────────────────
    // CLINICS (Phòng khám)
    // ─────────────────────────────────────────────────────────

    /// <summary>Lấy danh sách tất cả phòng khám (kèm dịch vụ của khoa).</summary>
    [HttpGet("clinics")]
    public async Task<ActionResult<IReadOnlyList<ClinicWithServicesDto>>> GetClinics(CancellationToken cancellationToken)
    {
        var clinics = await _clinicRepository.GetAllAsync(cancellationToken);
        var result = new List<ClinicWithServicesDto>();

        foreach (var clinic in clinics.OrderBy(c => c.Name))
        {
            var services = await _serviceRepository.ListAsync(
                s => s.DepartmentId == clinic.DepartmentId, cancellationToken);

            result.Add(new ClinicWithServicesDto
            {
                Id = clinic.Id,
                DepartmentId = clinic.DepartmentId,
                Name = clinic.Name,
                RoomNumber = clinic.RoomNumber,
                IsActive = clinic.IsActive,
                Services = services.Select(SimpleMapper.Map<MedicalService, MedicalServiceReadDto>).ToList()
            });
        }

        return Ok(result);
    }

    /// <summary>Lấy chi tiết một phòng khám.</summary>
    [HttpGet("clinics/{id:guid}")]
    public async Task<ActionResult<ClinicWithServicesDto>> GetClinic(Guid id, CancellationToken cancellationToken)
    {
        var clinic = await _clinicRepository.GetByIdAsync(id, cancellationToken);
        if (clinic is null) return NotFound();

        var services = await _serviceRepository.ListAsync(
            s => s.DepartmentId == clinic.DepartmentId && s.IsActive, cancellationToken);

        return Ok(new ClinicWithServicesDto
        {
            Id = clinic.Id,
            DepartmentId = clinic.DepartmentId,
            Name = clinic.Name,
            RoomNumber = clinic.RoomNumber,
            IsActive = clinic.IsActive,
            Services = services.Select(SimpleMapper.Map<MedicalService, MedicalServiceReadDto>).ToList()
        });
    }

    /// <summary>Tạo phòng khám mới.</summary>
    [HttpPost("clinics")]
    public async Task<ActionResult<ClinicReadDto>> CreateClinic(
        [FromBody] ClinicWriteDto dto,
        CancellationToken cancellationToken)
    {
        var dept = await _departmentRepository.GetByIdAsync(dto.DepartmentId, cancellationToken);
        if (dept is null) return BadRequest(new { message = "Khoa không tồn tại." });

        var entity = SimpleMapper.Map<ClinicWriteDto, Clinic>(dto);
        entity.Id = Guid.NewGuid();
        await _clinicRepository.AddAsync(entity, cancellationToken);
        await _clinicRepository.SaveChangesAsync(cancellationToken);
        return CreatedAtAction(nameof(GetClinic), new { id = entity.Id }, SimpleMapper.Map<Clinic, ClinicReadDto>(entity));
    }

    /// <summary>Cập nhật thông tin phòng khám.</summary>
    [HttpPut("clinics/{id:guid}")]
    public async Task<IActionResult> UpdateClinic(Guid id, [FromBody] ClinicWriteDto dto, CancellationToken cancellationToken)
    {
        var entity = await _clinicRepository.GetByIdAsync(id, cancellationToken);
        if (entity is null) return NotFound();

        SimpleMapper.MapTo(dto, entity, "Id");
        _clinicRepository.Update(entity);
        await _clinicRepository.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    /// <summary>Bật/tắt trạng thái hoạt động của phòng khám.</summary>
    [HttpPatch("clinics/{id:guid}/toggle-active")]
    public async Task<IActionResult> ToggleClinicActive(Guid id, CancellationToken cancellationToken)
    {
        var entity = await _clinicRepository.GetByIdAsync(id, cancellationToken);
        if (entity is null) return NotFound();

        entity.IsActive = !entity.IsActive;
        _clinicRepository.Update(entity);
        await _clinicRepository.SaveChangesAsync(cancellationToken);
        return Ok(new { id = entity.Id, isActive = entity.IsActive });
    }

    /// <summary>Xoá phòng khám.</summary>
    [HttpDelete("clinics/{id:guid}")]
    public async Task<IActionResult> DeleteClinic(Guid id, CancellationToken cancellationToken)
    {
        var entity = await _clinicRepository.GetByIdAsync(id, cancellationToken);
        if (entity is null) return NotFound();

        _clinicRepository.Remove(entity);
        await _clinicRepository.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    // ─────────────────────────────────────────────────────────
    // MEDICAL SERVICES (Dịch vụ y tế + giá khám)
    // ─────────────────────────────────────────────────────────

    /// <summary>Lấy toàn bộ danh sách dịch vụ y tế.</summary>
    [HttpGet("services")]
    public async Task<ActionResult<IReadOnlyList<MedicalServiceReadDto>>> GetServices(
        [FromQuery] Guid? departmentId,
        [FromQuery] bool? activeOnly,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<MedicalService> services;

        if (departmentId.HasValue && activeOnly == true)
            services = await _serviceRepository.ListAsync(s => s.DepartmentId == departmentId.Value && s.IsActive, cancellationToken);
        else if (departmentId.HasValue)
            services = await _serviceRepository.ListAsync(s => s.DepartmentId == departmentId.Value, cancellationToken);
        else if (activeOnly == true)
            services = await _serviceRepository.ListAsync(s => s.IsActive, cancellationToken);
        else
            services = await _serviceRepository.GetAllAsync(cancellationToken);

        return Ok(services.OrderBy(s => s.Name).Select(SimpleMapper.Map<MedicalService, MedicalServiceReadDto>).ToList());
    }

    /// <summary>Lấy chi tiết một dịch vụ y tế.</summary>
    [HttpGet("services/{id:guid}")]
    public async Task<ActionResult<MedicalServiceReadDto>> GetService(Guid id, CancellationToken cancellationToken)
    {
        var item = await _serviceRepository.GetByIdAsync(id, cancellationToken);
        return item is null ? NotFound() : Ok(SimpleMapper.Map<MedicalService, MedicalServiceReadDto>(item));
    }

    /// <summary>Tạo dịch vụ y tế mới.</summary>
    [HttpPost("services")]
    public async Task<ActionResult<MedicalServiceReadDto>> CreateService(
        [FromBody] MedicalServiceWriteDto dto,
        CancellationToken cancellationToken)
    {
        var dept = await _departmentRepository.GetByIdAsync(dto.DepartmentId, cancellationToken);
        if (dept is null) return BadRequest(new { message = "Khoa không tồn tại." });

        var entity = SimpleMapper.Map<MedicalServiceWriteDto, MedicalService>(dto);
        entity.Id = Guid.NewGuid();
        await _serviceRepository.AddAsync(entity, cancellationToken);
        await _serviceRepository.SaveChangesAsync(cancellationToken);
        return CreatedAtAction(nameof(GetService), new { id = entity.Id }, SimpleMapper.Map<MedicalService, MedicalServiceReadDto>(entity));
    }

    /// <summary>Cập nhật thông tin dịch vụ y tế.</summary>
    [HttpPut("services/{id:guid}")]
    public async Task<IActionResult> UpdateService(Guid id, [FromBody] MedicalServiceWriteDto dto, CancellationToken cancellationToken)
    {
        var entity = await _serviceRepository.GetByIdAsync(id, cancellationToken);
        if (entity is null) return NotFound();

        SimpleMapper.MapTo(dto, entity, "Id");
        _serviceRepository.Update(entity);
        await _serviceRepository.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    /// <summary>Cập nhật giá khám của một dịch vụ.</summary>
    [HttpPatch("services/{id:guid}/price")]
    public async Task<IActionResult> UpdateServicePrice(
        Guid id,
        [FromBody] PriceUpdateDto dto,
        CancellationToken cancellationToken)
    {
        var entity = await _serviceRepository.GetByIdAsync(id, cancellationToken);
        if (entity is null) return NotFound();

        entity.Price = dto.Price;
        _serviceRepository.Update(entity);
        await _serviceRepository.SaveChangesAsync(cancellationToken);
        return Ok(new { id = entity.Id, price = entity.Price });
    }

    /// <summary>Bật/tắt trạng thái hoạt động của dịch vụ.</summary>
    [HttpPatch("services/{id:guid}/toggle-active")]
    public async Task<IActionResult> ToggleServiceActive(Guid id, CancellationToken cancellationToken)
    {
        var entity = await _serviceRepository.GetByIdAsync(id, cancellationToken);
        if (entity is null) return NotFound();

        entity.IsActive = !entity.IsActive;
        _serviceRepository.Update(entity);
        await _serviceRepository.SaveChangesAsync(cancellationToken);
        return Ok(new { id = entity.Id, isActive = entity.IsActive });
    }

    /// <summary>Xoá dịch vụ y tế.</summary>
    [HttpDelete("services/{id:guid}")]
    public async Task<IActionResult> DeleteService(Guid id, CancellationToken cancellationToken)
    {
        var entity = await _serviceRepository.GetByIdAsync(id, cancellationToken);
        if (entity is null) return NotFound();

        _serviceRepository.Remove(entity);
        await _serviceRepository.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}
