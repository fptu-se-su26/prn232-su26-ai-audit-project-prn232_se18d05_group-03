using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Mediconnect.Application.DTOs;
using Mediconnect.Domain.Entities;

namespace Mediconnect.Web.Services;

// Thin typed wrapper over the Mediconnect API. Attaches the JWT from TokenState on every call
// and reuses the Application-layer DTOs so request/response shapes always match the server.
public class ApiClient
{
    // Matches the API's JsonStringEnumConverter so enums round-trip as strings ("Nurse" ↔ UserRole.Nurse).
    private static readonly JsonSerializerOptions _json = new()
    {
        Converters = { new JsonStringEnumConverter() },
        PropertyNameCaseInsensitive = true
    };

    private readonly HttpClient _http;
    private readonly TokenState _state;
    private readonly ApiAuthStateProvider _auth;

    public ApiClient(HttpClient http, TokenState state, ApiAuthStateProvider auth)
    {
        _http = http;
        _state = state;
        _auth = auth;
    }

    public class ApiException : Exception
    {
        public int Status { get; }
        public ApiException(int status, string message) : base(message) => Status = status;
    }

    // ---- auth ----
    public async Task LoginAsync(string email, string password)
    {
        var res = await _http.PostAsJsonAsync("api/auth/login", new LoginRequestDto { Email = email, Password = password }, _json);
        if (res.StatusCode == HttpStatusCode.Unauthorized)
            throw new ApiException(401, "Email hoặc mật khẩu không đúng.");
        if (!res.IsSuccessStatusCode)
            throw new ApiException((int)res.StatusCode, $"Đăng nhập thất bại ({(int)res.StatusCode}).");

        var auth = await res.Content.ReadFromJsonAsync<AuthResponseDto>(_json)
            ?? throw new ApiException(500, "Phản hồi đăng nhập rỗng.");
        _state.Set(auth);
        _auth.NotifyChanged();
    }

    public void Logout()
    {
        _state.Clear();
        _auth.NotifyChanged();
    }

    // ---- core request helpers ----
    private HttpRequestMessage Build(HttpMethod method, string path, object? body = null)
    {
        var req = new HttpRequestMessage(method, path);
        if (_state.Token is not null)
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _state.Token);
        if (body is not null)
            req.Content = JsonContent.Create(body, options: _json);
        return req;
    }

    private async Task<T?> SendAsync<T>(HttpMethod method, string path, object? body = null)
    {
        var res = await _http.SendAsync(Build(method, path, body));
        await EnsureOk(res);
        if (res.StatusCode == HttpStatusCode.NoContent) return default;
        return await res.Content.ReadFromJsonAsync<T>(_json);
    }

    private async Task SendAsync(HttpMethod method, string path, object? body = null)
    {
        var res = await _http.SendAsync(Build(method, path, body));
        await EnsureOk(res);
    }

    private async Task EnsureOk(HttpResponseMessage res)
    {
        if (res.IsSuccessStatusCode) return;
        var msg = res.StatusCode switch
        {
            HttpStatusCode.Unauthorized => "Phiên đăng nhập đã hết hạn.",
            HttpStatusCode.Forbidden => "Bạn không có quyền thực hiện thao tác này.",
            _ => $"Lỗi {(int)res.StatusCode}."
        };
        try
        {
            var err = await res.Content.ReadFromJsonAsync<ApiError>(_json);
            if (!string.IsNullOrWhiteSpace(err?.Message)) msg = err!.Message!;
        }
        catch { /* keep default message */ }
        throw new ApiException((int)res.StatusCode, msg);
    }

    private sealed class ApiError { public string? Message { get; set; } }

    private static string Q(params (string, object?)[] kv)
    {
        var parts = kv.Where(p => p.Item2 is not null && p.Item2!.ToString() != "")
                      .Select(p => $"{p.Item1}={Uri.EscapeDataString(p.Item2!.ToString()!)}");
        return parts.Any() ? "?" + string.Join("&", parts) : "";
    }

    // ---- shared ----
    public Task<List<DepartmentReadDto>?> GetDepartments() => SendAsync<List<DepartmentReadDto>>(HttpMethod.Get, "api/departments");
    public Task<List<StaffProfileReadDto>?> GetStaff() => SendAsync<List<StaffProfileReadDto>>(HttpMethod.Get, "api/staff");
    public Task<List<UserAccountReadDto>?> GetUserAccounts() => SendAsync<List<UserAccountReadDto>>(HttpMethod.Get, "api/users");

    // ---- F1: beds & admissions ----
    public Task<List<BedReadDto>?> GetBeds() => SendAsync<List<BedReadDto>>(HttpMethod.Get, "api/beds");
    public Task<List<BedMapGroupDto>?> GetBedMap(Guid? departmentId = null) =>
        SendAsync<List<BedMapGroupDto>>(HttpMethod.Get, "api/beds/map" + Q(("departmentId", departmentId)));
    public Task<BedReadDto?> CreateBed(BedWriteDto dto) => SendAsync<BedReadDto>(HttpMethod.Post, "api/beds", dto);
    public Task DeleteBed(Guid id) => SendAsync(HttpMethod.Delete, $"api/beds/{id}");
    public Task SetBedStatus(Guid id, BedStatus status) => SendAsync(HttpMethod.Patch, $"api/beds/{id}/status", new { status });
    public Task UpdateBedPosition(Guid id, int floor, double x, double y) =>
        SendAsync(HttpMethod.Patch, $"api/beds/{id}/position", new BedPositionDto { Floor = floor, PositionX = x, PositionY = y });
    public Task<List<InpatientAdmissionReadDto>?> GetAdmissions() => SendAsync<List<InpatientAdmissionReadDto>>(HttpMethod.Get, "api/inpatientadmissions");
    public Task<InpatientAdmissionReadDto?> Admit(AdmitRequestDto dto) => SendAsync<InpatientAdmissionReadDto>(HttpMethod.Post, "api/inpatientadmissions/admit", dto);
    public Task<InpatientAdmissionReadDto?> Transfer(Guid admissionId, TransferAdmissionDto dto) =>
        SendAsync<InpatientAdmissionReadDto>(HttpMethod.Post, $"api/inpatientadmissions/{admissionId}/transfer", dto);

    // ---- F2: vitals & care orders ----
    public Task<List<VitalSignReadDto>?> GetVitalSigns(Guid admissionId) => SendAsync<List<VitalSignReadDto>>(HttpMethod.Get, $"api/inpatientadmissions/{admissionId}/vital-signs");
    public Task<VitalSignReadDto?> CreateVitalSign(VitalSignWriteDto dto) => SendAsync<VitalSignReadDto>(HttpMethod.Post, "api/vitalsigns", dto);
    public Task<List<CareOrderReadDto>?> GetCareOrders(Guid admissionId, bool? pending = null) =>
        SendAsync<List<CareOrderReadDto>>(HttpMethod.Get, $"api/inpatientadmissions/{admissionId}/care-orders" + Q(("pending", pending)));
    public Task<CareOrderReadDto?> CreateCareOrder(CareOrderWriteDto dto) => SendAsync<CareOrderReadDto>(HttpMethod.Post, "api/careorders", dto);
    public Task CompleteCareOrder(Guid id) => SendAsync(HttpMethod.Patch, $"api/careorders/{id}/complete");

    // ---- F3: lab orders & results ----
    public Task<List<LabOrderReadDto>?> FilterLabOrders(LabOrderStatus? status = null) =>
        SendAsync<List<LabOrderReadDto>>(HttpMethod.Get, "api/laborders/filter" + Q(("status", status)));
    public Task UpdateLabOrderStatus(Guid id, LabOrderStatus status) => SendAsync(HttpMethod.Patch, $"api/laborders/{id}/status", new { status });
    public Task<LabResultReadDto?> EnterLabResult(Guid id, string resultText) =>
        SendAsync<LabResultReadDto>(HttpMethod.Post, $"api/laborders/{id}/result", new LabResultEntryDto { ResultText = resultText });
    public Task<List<LabResultReadDto>?> GetLabResults(Guid id) => SendAsync<List<LabResultReadDto>>(HttpMethod.Get, $"api/laborders/{id}/result");

    public async Task<LabResultReadDto?> UploadLabFile(Guid resultId, Stream content, string fileName)
    {
        using var form = new MultipartFormDataContent();
        form.Add(new StreamContent(content), "file", fileName);
        var req = new HttpRequestMessage(HttpMethod.Post, $"api/labresults/{resultId}/file") { Content = form };
        if (_state.Token is not null)
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _state.Token);
        var res = await _http.SendAsync(req);
        await EnsureOk(res);
        return await res.Content.ReadFromJsonAsync<LabResultReadDto>(_json);
    }

    public Task<LabResultReadDto?> CreateLabResult(LabResultWriteDto dto) => SendAsync<LabResultReadDto>(HttpMethod.Post, "api/labresults", dto);

    // ---- F4: discharge ----
    public Task<DischargeResultDto?> Discharge(Guid admissionId, DischargeRequestDto dto) =>
        SendAsync<DischargeResultDto>(HttpMethod.Post, $"api/inpatientadmissions/{admissionId}/discharge", dto);
}
