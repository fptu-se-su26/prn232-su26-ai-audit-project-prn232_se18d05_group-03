using System.Security.Cryptography;
using Mediconnect.Application.DTOs;
using Mediconnect.Application.Interfaces;
using Mediconnect.Application.Mapping;
using Mediconnect.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Mediconnect.Api.Controllers;

/// <summary>
/// Screen 4.2 — OTP configuration & security. Manages the system OTP policy and
/// the issue/verify workflow used to activate accounts.
///
/// NOTE: no live Email/SMS provider is wired up in this project, so delivery is
/// simulated — the generated code is returned to (and shown in) the admin console
/// for demonstration and verification.
/// </summary>
[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/otp")]
public class OtpController : ControllerBase
{
    private readonly IRepository<OtpSetting> _settingRepository;
    private readonly IRepository<OtpCode> _codeRepository;
    private readonly IRepository<UserAccount> _userRepository;
    private readonly IOtpSender _otpSender;

    public OtpController(
        IRepository<OtpSetting> settingRepository,
        IRepository<OtpCode> codeRepository,
        IRepository<UserAccount> userRepository,
        IOtpSender otpSender)
    {
        _settingRepository = settingRepository;
        _codeRepository = codeRepository;
        _userRepository = userRepository;
        _otpSender = otpSender;
    }

    // ── Configuration ────────────────────────────────────────────────────────

    [HttpGet("settings")]
    public async Task<ActionResult<OtpSettingDto>> GetSettings(CancellationToken cancellationToken)
    {
        var setting = await GetOrCreateSettingAsync(cancellationToken);
        var dto = SimpleMapper.Map<OtpSetting, OtpSettingDto>(setting);
        dto.EmailConfigured = _otpSender.IsConfigured;
        return Ok(dto);
    }

    [HttpPut("settings")]
    public async Task<ActionResult<OtpSettingDto>> UpdateSettings(
        OtpSettingWriteDto dto, CancellationToken cancellationToken)
    {
        if (dto.CodeLength is < 4 or > 10)
        {
            return BadRequest(new { message = "CodeLength must be between 4 and 10." });
        }
        if (dto.ExpiryMinutes is < 1 or > 60)
        {
            return BadRequest(new { message = "ExpiryMinutes must be between 1 and 60." });
        }
        if (dto.MaxAttempts is < 1 or > 20)
        {
            return BadRequest(new { message = "MaxAttempts must be between 1 and 20." });
        }

        var setting = await GetOrCreateSettingAsync(cancellationToken);
        setting.IsEnabled = dto.IsEnabled;
        setting.Channel = dto.Channel;
        setting.CodeLength = dto.CodeLength;
        setting.ExpiryMinutes = dto.ExpiryMinutes;
        setting.MaxAttempts = dto.MaxAttempts;
        setting.UpdatedAt = DateTime.UtcNow;

        _settingRepository.Update(setting);
        await _settingRepository.SaveChangesAsync(cancellationToken);

        return Ok(SimpleMapper.Map<OtpSetting, OtpSettingDto>(setting));
    }

    // ── Issue / Verify ───────────────────────────────────────────────────────

    [HttpPost("issue")]
    public async Task<ActionResult<OtpCodeDto>> Issue(
        OtpIssueRequestDto request, CancellationToken cancellationToken)
    {
        var setting = await GetOrCreateSettingAsync(cancellationToken);
        if (!setting.IsEnabled)
        {
            return BadRequest(new { message = "OTP đang bị tắt trong cấu hình hệ thống." });
        }

        var user = await _userRepository.GetByIdAsync(request.UserAccountId, cancellationToken);
        if (user is null)
        {
            return NotFound(new { message = "Không tìm thấy tài khoản." });
        }

        var code = GenerateNumericCode(setting.CodeLength);

        // Attempt real delivery; on any failure fall back to simulated (code shown in UI).
        var sendResult = await _otpSender.SendAsync(
            setting.Channel, user.Email, user.FullName, code, setting.ExpiryMinutes, cancellationToken);

        var otp = new OtpCode
        {
            UserAccountId = user.Id,
            Code = code,
            Channel = setting.Channel,
            Purpose = string.IsNullOrWhiteSpace(request.Purpose) ? "AccountActivation" : request.Purpose,
            Status = OtpStatus.Pending,
            Delivered = sendResult.Delivered,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddMinutes(setting.ExpiryMinutes),
        };

        await _codeRepository.AddAsync(otp, cancellationToken);
        await _codeRepository.SaveChangesAsync(cancellationToken);

        return Ok(ToDto(otp, user, sendResult.Detail));
    }

    [HttpPost("verify")]
    public async Task<ActionResult<OtpVerifyResponseDto>> Verify(
        OtpVerifyRequestDto request, CancellationToken cancellationToken)
    {
        var setting = await GetOrCreateSettingAsync(cancellationToken);

        var pending = await _codeRepository.ListAsync(
            c => c.UserAccountId == request.UserAccountId && c.Status == OtpStatus.Pending,
            cancellationToken);

        // Newest pending code wins.
        var otp = pending.OrderByDescending(c => c.CreatedAt).FirstOrDefault();
        if (otp is null)
        {
            return Ok(new OtpVerifyResponseDto { Success = false, Message = "Không có mã OTP đang chờ xác thực." });
        }

        if (DateTime.UtcNow > otp.ExpiresAt)
        {
            otp.Status = OtpStatus.Expired;
            _codeRepository.Update(otp);
            await _codeRepository.SaveChangesAsync(cancellationToken);
            return Ok(new OtpVerifyResponseDto { Success = false, Message = "Mã OTP đã hết hạn. Vui lòng gửi lại mã mới." });
        }

        otp.AttemptCount++;

        if (otp.Code != request.Code.Trim())
        {
            if (otp.AttemptCount >= setting.MaxAttempts)
            {
                otp.Status = OtpStatus.Failed;
            }
            _codeRepository.Update(otp);
            await _codeRepository.SaveChangesAsync(cancellationToken);

            var remaining = Math.Max(0, setting.MaxAttempts - otp.AttemptCount);
            return Ok(new OtpVerifyResponseDto
            {
                Success = false,
                Message = otp.Status == OtpStatus.Failed
                    ? "Sai mã OTP. Đã vượt quá số lần thử cho phép, mã bị vô hiệu hóa."
                    : $"Sai mã OTP. Còn lại {remaining} lần thử.",
            });
        }

        // Success — consume the code and mark the account verified.
        otp.Status = OtpStatus.Verified;
        otp.ConsumedAt = DateTime.UtcNow;
        _codeRepository.Update(otp);

        var user = await _userRepository.GetByIdAsync(request.UserAccountId, cancellationToken);
        if (user is not null)
        {
            user.VerifiedAt = DateTime.UtcNow;
            user.IsActive = true;
            _userRepository.Update(user);
        }

        await _codeRepository.SaveChangesAsync(cancellationToken);

        return Ok(new OtpVerifyResponseDto { Success = true, Message = "Xác thực OTP thành công. Tài khoản đã được kích hoạt." });
    }

    // ── Monitor / demo log ───────────────────────────────────────────────────

    [HttpGet("codes")]
    public async Task<ActionResult<IReadOnlyList<OtpCodeDto>>> GetCodes(
        [FromQuery] Guid? userAccountId, CancellationToken cancellationToken)
    {
        var codes = userAccountId is { } uid
            ? await _codeRepository.ListAsync(c => c.UserAccountId == uid, cancellationToken)
            : await _codeRepository.GetAllAsync(cancellationToken);

        var users = await _userRepository.GetAllAsync(cancellationToken);
        var userLookup = users.ToDictionary(u => u.Id);

        var result = codes
            .OrderByDescending(c => c.CreatedAt)
            .Take(50)
            .Select(c => ToDto(c, userLookup.GetValueOrDefault(c.UserAccountId)))
            .ToList();

        return Ok(result);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private async Task<OtpSetting> GetOrCreateSettingAsync(CancellationToken cancellationToken)
    {
        var existing = await _settingRepository.GetAllAsync(cancellationToken);
        var setting = existing.FirstOrDefault();
        if (setting is not null)
        {
            return setting;
        }

        setting = new OtpSetting();
        await _settingRepository.AddAsync(setting, cancellationToken);
        await _settingRepository.SaveChangesAsync(cancellationToken);
        return setting;
    }

    private static string GenerateNumericCode(int length)
    {
        // Cryptographically-random numeric string of the requested length.
        var digits = new char[length];
        for (var i = 0; i < length; i++)
        {
            digits[i] = (char)('0' + RandomNumberGenerator.GetInt32(0, 10));
        }
        return new string(digits);
    }

    private static OtpCodeDto ToDto(OtpCode c, UserAccount? user, string deliveryDetail = "") => new()
    {
        Id = c.Id,
        UserAccountId = c.UserAccountId,
        UserFullName = user?.FullName ?? "—",
        UserEmail = user?.Email ?? "—",
        // Codes delivered over a real channel are masked — only simulated codes are exposed.
        Code = c.Delivered ? new string('•', c.Code.Length) : c.Code,
        Channel = c.Channel,
        Purpose = c.Purpose,
        Status = c.Status,
        AttemptCount = c.AttemptCount,
        Delivered = c.Delivered,
        DeliveryDetail = deliveryDetail,
        CreatedAt = c.CreatedAt,
        ExpiresAt = c.ExpiresAt,
        ConsumedAt = c.ConsumedAt,
    };
}
