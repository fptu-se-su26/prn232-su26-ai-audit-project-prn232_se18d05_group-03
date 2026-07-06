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
        await _auth.PersistAsync(auth);
    }

    public async Task Logout() => await _auth.ClearAsync();

    public Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto dto) =>
        SendAsync<AuthResponseDto>(HttpMethod.Post, "api/auth/register", dto);

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
    public Task<List<StaffDirectoryDto>?> GetStaffDirectory() => SendAsync<List<StaffDirectoryDto>>(HttpMethod.Get, "api/staff/directory");
    public Task<List<ClinicReadDto>?> GetAllClinics() => SendAsync<List<ClinicReadDto>>(HttpMethod.Get, "api/clinics");
    public Task<List<ClinicReadDto>?> GetActiveClinics() => SendAsync<List<ClinicReadDto>>(HttpMethod.Get, "api/clinics/active");
    public Task<List<DrugReadDto>?> GetDrugs() => SendAsync<List<DrugReadDto>>(HttpMethod.Get, "api/drugs");

    // ---- patients (self-service) ----
    public Task<PatientProfileReadDto?> GetMyPatient() => SendAsync<PatientProfileReadDto>(HttpMethod.Get, "api/patients/me");
    public Task<PatientHistoryDto?> GetPatientHistory(Guid patientId) => SendAsync<PatientHistoryDto>(HttpMethod.Get, $"api/patients/{patientId}/history");

    // ---- appointments (patient) ----
    public Task<List<AppointmentReadDto>?> GetAppointments() => SendAsync<List<AppointmentReadDto>>(HttpMethod.Get, "api/appointments");
    public Task<AppointmentReadDto?> CreateAppointment(AppointmentWriteDto dto) => SendAsync<AppointmentReadDto>(HttpMethod.Post, "api/appointments", dto);

    // ---- service ratings (patient) ----
    public Task<List<ServiceRatingReadDto>?> GetServiceRatings() => SendAsync<List<ServiceRatingReadDto>>(HttpMethod.Get, "api/serviceratings");
    public Task<ServiceRatingReadDto?> CreateServiceRating(ServiceRatingWriteDto dto) => SendAsync<ServiceRatingReadDto>(HttpMethod.Post, "api/serviceratings", dto);

    // ---- e-prescription (doctor/nurse) ----
    public Task<PrescriptionReadDto?> CreatePrescription(PrescriptionWriteDto dto) => SendAsync<PrescriptionReadDto>(HttpMethod.Post, "api/prescriptions", dto);
    public Task<PrescriptionItemReadDto?> CreatePrescriptionItem(PrescriptionItemWriteDto dto) => SendAsync<PrescriptionItemReadDto>(HttpMethod.Post, "api/prescriptionitems", dto);
    public Task<List<PrescriptionItemReadDto>?> GetPrescriptionItems() => SendAsync<List<PrescriptionItemReadDto>>(HttpMethod.Get, "api/prescriptionitems");
    public Task<List<LabOrderReadDto>?> GetAllLabOrders() => SendAsync<List<LabOrderReadDto>>(HttpMethod.Get, "api/laborders");

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

    // ---- Users (admin) ----
    public Task<UserAccountReadDto?> CreateUser(UserAccountWriteDto dto) => SendAsync<UserAccountReadDto>(HttpMethod.Post, "api/users", dto);
    public Task UpdateUser(Guid id, UserAccountWriteDto dto) => SendAsync(HttpMethod.Put, $"api/users/{id}", dto);
    public Task DeleteUser(Guid id) => SendAsync(HttpMethod.Delete, $"api/users/{id}");
    public Task UpdateUserStatus(Guid id, bool isActive) => SendAsync(HttpMethod.Patch, $"api/users/{id}/status", new UserStatusUpdateDto { IsActive = isActive });
    public Task UpdateUserRole(Guid id, UserRole role) => SendAsync(HttpMethod.Patch, $"api/users/{id}/role", new RoleUpdateDto { Role = role });

    // ---- Staff (admin) ----
    public Task<StaffProfileReadDto?> CreateStaffProfile(StaffProfileWriteDto dto) => SendAsync<StaffProfileReadDto>(HttpMethod.Post, "api/staff", dto);
    public Task UpdateStaffProfile(Guid id, StaffProfileWriteDto dto) => SendAsync(HttpMethod.Put, $"api/staff/{id}", dto);
    public Task DeleteStaffProfile(Guid id) => SendAsync(HttpMethod.Delete, $"api/staff/{id}");

    // ---- Clinic/service management (admin) ----
    public Task<DepartmentReadDto?> CreateDepartment(DepartmentWriteDto dto) => SendAsync<DepartmentReadDto>(HttpMethod.Post, "api/departments", dto);
    public Task UpdateDepartment(Guid id, DepartmentWriteDto dto) => SendAsync(HttpMethod.Put, $"api/departments/{id}", dto);
    public Task DeleteDepartment(Guid id) => SendAsync(HttpMethod.Delete, $"api/departments/{id}");
    public Task<ClinicReadDto?> CreateClinic(ClinicWriteDto dto) => SendAsync<ClinicReadDto>(HttpMethod.Post, "api/clinics", dto);
    public Task UpdateClinic(Guid id, ClinicWriteDto dto) => SendAsync(HttpMethod.Put, $"api/clinics/{id}", dto);
    public Task DeleteClinic(Guid id) => SendAsync(HttpMethod.Delete, $"api/clinics/{id}");
    public Task<List<MedicalServiceReadDto>?> GetMedicalServices() => SendAsync<List<MedicalServiceReadDto>>(HttpMethod.Get, "api/medicalservices");
    public Task<MedicalServiceReadDto?> CreateMedicalService(MedicalServiceWriteDto dto) => SendAsync<MedicalServiceReadDto>(HttpMethod.Post, "api/medicalservices", dto);
    public Task UpdateMedicalService(Guid id, MedicalServiceWriteDto dto) => SendAsync(HttpMethod.Put, $"api/medicalservices/{id}", dto);
    public Task DeleteMedicalService(Guid id) => SendAsync(HttpMethod.Delete, $"api/medicalservices/{id}");
    public Task UpdateMedicalServicePrice(Guid id, decimal price) => SendAsync(HttpMethod.Patch, $"api/medicalservices/{id}/price", new PriceUpdateDto { Price = price });

    // ---- Drugs & interactions / CDSS (admin) ----
    public Task<DrugReadDto?> CreateDrug(DrugWriteDto dto) => SendAsync<DrugReadDto>(HttpMethod.Post, "api/drugs", dto);
    public Task UpdateDrug(Guid id, DrugWriteDto dto) => SendAsync(HttpMethod.Put, $"api/drugs/{id}", dto);
    public Task DeleteDrug(Guid id) => SendAsync(HttpMethod.Delete, $"api/drugs/{id}");
    public Task<List<DrugInteractionReadDto>?> GetDrugInteractions() => SendAsync<List<DrugInteractionReadDto>>(HttpMethod.Get, "api/druginteractions");
    public Task<DrugInteractionReadDto?> CreateDrugInteraction(DrugInteractionWriteDto dto) => SendAsync<DrugInteractionReadDto>(HttpMethod.Post, "api/druginteractions", dto);
    public Task DeleteDrugInteraction(Guid id) => SendAsync(HttpMethod.Delete, $"api/druginteractions/{id}");
    public Task<DrugInteractionCheckResponseDto?> CheckDrugInteractions(IReadOnlyList<Guid> drugIds) =>
        SendAsync<DrugInteractionCheckResponseDto>(HttpMethod.Post, "api/cdss/drug-interactions/check", new DrugInteractionCheckRequestDto { DrugIds = drugIds });
    public Task<DoseCheckResponseDto?> CheckDose(Guid patientId, Guid drugId, decimal? doseAmount) =>
        SendAsync<DoseCheckResponseDto>(HttpMethod.Post, "api/cdss/dose-check", new DoseCheckRequestDto { PatientId = patientId, DrugId = drugId, DoseAmount = doseAmount });

    // ---- Patients (admin) ----
    public Task<List<PatientProfileReadDto>?> GetAllPatients() => SendAsync<List<PatientProfileReadDto>>(HttpMethod.Get, "api/patients");

    // ---- OTP (admin) ----
    public Task<OtpSettingDto?> GetOtpSettings() => SendAsync<OtpSettingDto>(HttpMethod.Get, "api/otp/settings");
    public Task<OtpSettingDto?> UpdateOtpSettings(OtpSettingWriteDto dto) => SendAsync<OtpSettingDto>(HttpMethod.Put, "api/otp/settings", dto);
    public Task<OtpCodeDto?> IssueOtp(Guid userAccountId) => SendAsync<OtpCodeDto>(HttpMethod.Post, "api/otp/issue", new OtpIssueRequestDto { UserAccountId = userAccountId });
    public Task<OtpVerifyResponseDto?> VerifyOtp(Guid userAccountId, string code) => SendAsync<OtpVerifyResponseDto>(HttpMethod.Post, "api/otp/verify", new OtpVerifyRequestDto { UserAccountId = userAccountId, Code = code });
    public Task<List<OtpCodeDto>?> GetOtpCodes() => SendAsync<List<OtpCodeDto>>(HttpMethod.Get, "api/otp/codes");

    // ---- Reports (admin) ----
    public Task<SummaryReportDto?> GetReportSummary(string period) =>
        SendAsync<SummaryReportDto>(HttpMethod.Get, "api/reports/summary" + Q(("period", period)));
    public Task<List<RevenueItemDto>?> GetRevenue(DateTime startDate, DateTime endDate, string groupBy, string? department) =>
        SendAsync<List<RevenueItemDto>>(HttpMethod.Get, "api/reports/revenue" + Q(
            ("startDate", startDate.ToString("yyyy-MM-dd")),
            ("endDate", endDate.ToString("yyyy-MM-dd")),
            ("groupBy", groupBy),
            ("department", department)));
    public Task<BedOccupancyReportDto?> GetBedOccupancy(string? department) =>
        SendAsync<BedOccupancyReportDto>(HttpMethod.Get, "api/reports/bed-occupancy" + Q(("department", department)));
    public Task<List<OutpatientVisitItemDto>?> GetOutpatientVisitReport(DateTime startDate, DateTime endDate, string groupBy) =>
        SendAsync<List<OutpatientVisitItemDto>>(HttpMethod.Get, "api/reports/outpatient-visits" + Q(
            ("startDate", startDate.ToString("yyyy-MM-dd")),
            ("endDate", endDate.ToString("yyyy-MM-dd")),
            ("groupBy", groupBy)));

    // ---- Clinic dashboard (queue) ----
    public Task<List<ClinicQueueSummaryDto>?> GetClinicQueueOverview() =>
        SendAsync<List<ClinicQueueSummaryDto>>(HttpMethod.Get, "api/clinic-dashboard/overview");
    public Task<ClinicQueueDto?> GetClinicQueue(Guid clinicId) =>
        SendAsync<ClinicQueueDto>(HttpMethod.Get, $"api/clinic-dashboard/clinics/{clinicId}/queue");
    public Task<QueueTicketDetailDto?> CheckIn(Guid clinicId, Guid? appointmentId, string? patientName) =>
        SendAsync<QueueTicketDetailDto>(HttpMethod.Post, "api/clinic-dashboard/check-in",
            new WalkInCheckInRequestDto { ClinicId = clinicId, AppointmentId = appointmentId, PatientName = patientName });
    // The call-next endpoint returns either the raw ticket (patient found) or { message, ticket: null } (queue empty) —
    // this merged shape lets us tell the two apart without guessing at JSON structure.
    public Task<CallNextResultDto?> CallNext(Guid clinicId) =>
        SendAsync<CallNextResultDto>(HttpMethod.Post, $"api/clinic-dashboard/clinics/{clinicId}/call-next");
    public Task<QueueTicketDetailDto?> TransferTicket(Guid ticketId, Guid targetClinicId) =>
        SendAsync<QueueTicketDetailDto>(HttpMethod.Patch, $"api/clinic-dashboard/tickets/{ticketId}/transfer",
            new TransferTicketDto { TargetClinicId = targetClinicId });

    // ---- Patients (clinical self-service) ----
    public Task<PatientProfileReadDto?> GetPatientById(Guid id) => SendAsync<PatientProfileReadDto>(HttpMethod.Get, $"api/patients/{id}");
    public Task<PatientProfileReadDto?> CreatePatient(PatientProfileWriteDto dto) => SendAsync<PatientProfileReadDto>(HttpMethod.Post, "api/patients", dto);

    // ---- Outpatient visits & medical records ----
    public Task<OutpatientVisitReadDto?> CreateOutpatientVisit(OutpatientVisitWriteDto dto) => SendAsync<OutpatientVisitReadDto>(HttpMethod.Post, "api/outpatientvisits", dto);
    public Task Diagnose(MedicalRecordDtos dto) => SendAsync(HttpMethod.Post, "api/medical-records/diagnose", dto);
    public Task<List<ICD10ResultDto>?> SearchIcd10(string query) => SendAsync<List<ICD10ResultDto>>(HttpMethod.Get, "api/medical-records/icd10/search" + Q(("query", query)));
    public Task<List<PatientDiagnosisHistoryDto>?> GetDiagnosisHistory(Guid patientId) => SendAsync<List<PatientDiagnosisHistoryDto>>(HttpMethod.Get, $"api/medical-records/patients/{patientId}/diagnosis-history");

    // ---- Staff schedules ----
    public Task<PagedResult<ScheduleFlatReadDto>?> FilterSchedules(DateOnly startDate, DateOnly endDate, Guid? departmentId, int page = 1, int pageSize = 200) =>
        SendAsync<PagedResult<ScheduleFlatReadDto>>(HttpMethod.Get, "api/schedules" + Q(
            ("startDate", startDate.ToString("yyyy-MM-dd")),
            ("endDate", endDate.ToString("yyyy-MM-dd")),
            ("departmentId", departmentId?.ToString()),
            ("page", page.ToString()),
            ("pageSize", pageSize.ToString())));
    public Task<ScheduleFlatReadDto?> CreateSchedule(ScheduleWriteDto dto) => SendAsync<ScheduleFlatReadDto>(HttpMethod.Post, "api/schedules", dto);
    public Task<ScheduleFlatReadDto?> UpdateSchedule(Guid id, ScheduleWriteDto dto) => SendAsync<ScheduleFlatReadDto>(HttpMethod.Put, $"api/schedules/{id}", dto);
    public Task DeleteSchedule(Guid id) => SendAsync(HttpMethod.Delete, $"api/schedules/{id}");

    // ---- Billing & payments ----
    public Task<List<BillingInvoiceReadDto>?> GetBillingInvoices() => SendAsync<List<BillingInvoiceReadDto>>(HttpMethod.Get, "api/billinginvoices");
    public Task<List<BillingItemReadDto>?> GetBillingItems(Guid invoiceId) => SendAsync<List<BillingItemReadDto>>(HttpMethod.Get, $"api/billinginvoices/{invoiceId}/items");
    public Task<BillingInvoiceDetailDto?> GenerateInvoice(GenerateInvoiceRequestDto dto) => SendAsync<BillingInvoiceDetailDto>(HttpMethod.Post, "api/billinginvoices/generate", dto);
    public Task<BillingInvoiceDetailDto?> CalculateInsurance(Guid invoiceId, string? insuranceNumber) =>
        SendAsync<BillingInvoiceDetailDto>(HttpMethod.Post, $"api/billinginvoices/{invoiceId}/calculate-insurance", new InsuranceCalculationRequestDto { InsuranceNumber = insuranceNumber });

    public Task<List<PaymentReadDto>?> GetPayments() => SendAsync<List<PaymentReadDto>>(HttpMethod.Get, "api/payments");
    public Task<PaymentReadDto?> CreatePayment(PaymentWriteDto dto) => SendAsync<PaymentReadDto>(HttpMethod.Post, "api/payments", dto);
    public Task<PaymentUrlResultDto?> CreateVnPayUrl(Guid paymentId) => SendAsync<PaymentUrlResultDto>(HttpMethod.Post, $"api/payments/{paymentId}/vnpay-url");
    public Task<PaymentUrlResultDto?> CreateMomoUrl(Guid paymentId) => SendAsync<PaymentUrlResultDto>(HttpMethod.Post, $"api/payments/{paymentId}/momo-url");
}

public class CallNextResultDto
{
    public string? Message { get; set; }
    public Guid Id { get; set; }
    public Guid ClinicId { get; set; }
    public string ClinicName { get; set; } = string.Empty;
    public string? ClinicRoomNumber { get; set; }
    public Guid? AppointmentId { get; set; }
    public Guid? PatientId { get; set; }
    public string? PatientName { get; set; }
    public int Number { get; set; }
    public DateTime IssuedAt { get; set; }
    public QueueStatus Status { get; set; }
}
