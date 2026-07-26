# Thành viên 1 — Code backend: Khám Ngoại trú & Telemedicine

Phạm vi: phân luồng hàng đợi, bệnh án ngoại trú (ICD-10), đơn thuốc điện tử, khám từ xa (WebRTC).

| Feature | File chính |
|---|---|
| F1 — Dịch vụ & phân luồng số thứ tự | `Application/Services/QueueService.cs`, `Controllers/SmartQueueController.cs` |
| F2 — Bệnh án ngoại trú (ICD-10) | `Application/Services/MedicalRecordService.cs`, `Modules/SmartClinic/OutpatientRecordController.cs` |
| F3 — Đơn thuốc điện tử | tạo qua `ApiClient.CreatePrescription/CreatePrescriptionItem` (CRUD `Prescription`/`PrescriptionItem`) |
| F4 — Telemedicine | `Mediconnect.Web/Hubs/TelemedicineHub.cs` (+ `wwwroot/js/telemedicine.js`, xem file UI) |

---

## F1 — Phân luồng & phát số thứ tự (`QueueService.cs`)

`QueueService` quản lý vé hàng đợi (`QueueTicket`) theo từng phòng khám (`Clinic`) trong **một ngày**.
Constructor (dòng 16–30) tiêm 5 repository (ticket, clinic, appointment, patientProfile, userAccount)
và `IPasswordHasher` (để tạo tài khoản cho khách vãng lai).

### `CheckInAsync` — tiếp nhận bệnh nhân có lịch hẹn (dòng 32–44)
```csharp
var clinic = await _clinicRepository.GetByIdAsync(dto.ClinicId, ...)   // 34: tìm phòng khám
    ?? throw new InvalidOperationException("Clinic not found.");        // 35: không có → lỗi nghiệp vụ
if (!clinic.IsActive)                                                   // 37: phòng đang đóng
    throw new InvalidOperationException("Clinic is not currently active.");
var ticket = await CreateTicketAsync(clinic, dto.AppointmentId, ...);   // 40: tạo vé + cấp số
var patientName = await ResolvePatientNameAsync(dto.AppointmentId, ...);// 41: tra tên bệnh nhân
return MapToDetail(ticket, clinic, null, patientName);                  // 43: trả DTO chi tiết
```
- **Cấp số tự động** nằm ở `CreateTicketAsync` (dòng 228–250): lấy toàn bộ vé của phòng **trong hôm nay**
  (`GetTodayRange` dòng 427–431 trả về `[00:00 hôm nay, 00:00 ngày mai)` theo UTC), rồi
  `nextNumber = todayTickets.Count > 0 ? Max(Number) + 1 : 1` (dòng 235). Vé mới có `Status = Waiting`.
- `AddAsync` + `SaveChangesAsync` (247–248) mới thực sự ghi DB.

### `WalkInCheckInAsync` — khách vãng lai (dòng 46–79)
Giống check-in thường nhưng xử lý người **không có lịch hẹn**:
- Nếu có `AppointmentId` → resolve tên/id như thường; nếu không → dùng `dto.PatientName` do lễ tân nhập (dòng 57–63).
- **Điểm mấu chốt** (dòng 67–76): nếu khách vãng lai có **tên + email**, gọi
  `GetOrCreateWalkInPatientProfileAsync` để **tạo (hoặc tái dùng) một tài khoản Patient thật**, rồi
  snapshot `PatientId` + `PatientName` thẳng lên vé. Nhờ vậy toàn bộ luồng khám/kê đơn phía sau
  vẫn có `PatientId` hợp lệ dù bệnh nhân chưa từng đăng ký.

#### `GetOrCreateWalkInPatientProfileAsync` (dòng 256–296)
- Dòng 259: tìm `UserAccount` theo email. Có rồi thì tái dùng (262–265).
- Chưa có (266–280): tạo `UserAccount` role `Patient`, `IsActive = true`, mật khẩu **ngẫu nhiên**
  (`_passwordHasher.Hash(Guid.NewGuid())` — khách chưa cần đăng nhập).
- Dòng 282–295: đảm bảo có `PatientProfile` gắn với account (tạo nếu chưa có) và trả về.

### `GetClinicQueueAsync` — xem hàng đợi hiện tại (dòng 81–115)
- Lọc vé của phòng **hôm nay** với `Status ∈ {Waiting, InProgress}` (88–92), sắp theo `Number` (94).
- `inProgress` = vé đang khám (95). `WaitingCount` đếm số đang chờ (106).
- **Chống N+1 query**: `BuildPatientNameMapAsync` / `BuildPatientIdMapAsync` (330–425) gom tất cả
  `AppointmentId` → `PatientId` → `UserAccountId` rồi truy vấn **theo lô** (`Contains(...)`), dựng
  `Dictionary` tra cứu 1 lần thay vì query từng vé. Có fallback đọc `PatientName` snapshot cho vé vãng lai.

### `CallNextAsync` — gọi bệnh nhân tiếp theo (dòng 117–158)
Đây là logic "next" của quầy:
```
1. Lấy các vé đang InProgress hôm nay → chuyển hết sang Completed (130–134)  // đóng lượt đang khám
2. Lấy các vé Waiting → chọn vé số nhỏ nhất (136–142)
3. Không còn ai → SaveChanges, trả null (144–148)
4. Có → đặt vé đó InProgress, lưu (150–152), trả DTO kèm tên/id (154–157)
```

### `TransferTicketAsync` — chuyển phòng/chuyển khoa (dòng 196–224)
Đổi `ClinicId` của vé sang phòng đích, **cấp lại số** theo dãy của phòng đích
(`Max(Number)+1`, dòng 212), đặt lại `Status = Waiting` (216). Kiểm tra phòng đích `IsActive` (204).

### Controller `SmartQueueController.cs`
`[Authorize]`, route `api/queue`. Bọc mỏng quanh service, bắt `InvalidOperationException`:
- `POST check-in` → `CheckInAsync`; lỗi nghiệp vụ trả **400** (dòng 33–36).
- `GET clinics/{clinicId}` → `GetClinicQueueAsync`; không thấy phòng trả **404**.
- `POST clinics/{clinicId}/call-next` → `CallNextAsync`; hết bệnh nhân trả `Ok` kèm `ticket = null` (69–70).

---

## F2 — Bệnh án ngoại trú & ICD-10 (`MedicalRecordService.cs`)

### `SearchICD10Async` — tra mã ICD-10 (dòng 32–83)
- Rỗng → trả mảng rỗng (34–37).
- Gọi **API công khai của thư viện Y khoa Mỹ NLM** (dòng 42):
  `clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?terms=...&sf=code,name&df=code,name`.
- Response NLM là **mảng 4 phần tử**; phần tử index `[3]` là danh sách hiển thị `[code, name]`
  (dòng 54–73). Parse bằng `JsonDocument`, map sang `ICD10ResultDto { Code, Description }`.
- Mọi lỗi mạng/parse đều **nuốt** và trả mảng rỗng (77–82) — tra ICD-10 chỉ hỗ trợ gõ, không chặn khám.

### `SaveMedicalRecordAsync` — lưu bệnh án + chỉ định XN (dòng 103–174)
Hàm nghiệp vụ trung tâm của bác sĩ:
```csharp
var visit = await _visitRepository.GetByIdAsync(dto.VisitId, ...)       // 107: tìm lượt khám
    ?? throw ...("Outpatient visit not found.");                        // 108–109
visit.ChiefComplaint     = dto.ChiefComplaint;                         // 111: lý do khám
visit.DiagnosisCode        = ...Trim() hoặc null;                       // 112: mã ICD-10
visit.DiagnosisDescription = ...Trim() hoặc null;                       // 113–115: tên chẩn đoán
// 117–126: gộp "Triệu chứng" vào Notes (nếu có), xuống dòng trước Notes cũ
visit.Status = VisitStatus.Completed;                                   // 128: đánh dấu khám xong
_visitRepository.Update(visit);                                         // 129
```
- **Chỉ định xét nghiệm** (131–147): với mỗi tên test không rỗng trong `dto.OrderedTests`, tạo một
  `LabOrder { OutpatientVisitId, OrderedById = DoctorId, TestName, Status = Ordered, OrderedAt }`.
  Đây là điểm nối sang **Thành viên 3** (bộ phận xét nghiệm nhập kết quả).
- **Cascade trạng thái** (149–171): nếu lượt khám gắn `QueueTicketId` → set vé `Completed`; nếu vé đó
  đến từ một lịch hẹn (`AppointmentId`) và lịch chưa Completed/Cancelled → đẩy `Appointment.Status = Completed`.
  Vé vãng lai không có `AppointmentId` nên được bỏ qua (comment dòng 157–158). Đây là điểm nối sang
  **Thành viên 2** (lịch hẹn của bệnh nhân).
- `SaveChangesAsync` (173) commit tất cả trong **một** lần lưu.

### `GetPatientDiagnosisHistoryAsync` (dòng 85–101)
Lấy các `OutpatientVisit` của bệnh nhân có chẩn đoán, sắp giảm dần theo `VisitDate`, map sang
`PatientDiagnosisHistoryDto`. Dùng để hiển thị tiền sử chẩn đoán khi khám lại.

### Controller `OutpatientRecordController.cs` (route `api/medical-records`)
- `POST diagnose` → `SaveMedicalRecordAsync`, thành công trả message tiếng Việt (dòng 26).
- `GET icd10/search?query=` → `SearchICD10Async`.
- `GET patients/{patientId}/diagnosis-history` → tiền sử chẩn đoán.

---

## F3 — Đơn thuốc điện tử (kê đơn → gửi nhà thuốc)

Không có Service riêng — luồng do component UI `EPrescriptionPanel` điều phối, gọi 2 endpoint CRUD:
1. `ApiClient.CreatePrescription(PrescriptionWriteDto)` → tạo `Prescription` gắn `OutpatientVisitId` + `DoctorId`.
2. Với mỗi thuốc: `ApiClient.CreatePrescriptionItem(PrescriptionItemWriteDto)` → tạo `PrescriptionItem`
   (`DrugId`, `Dose`, `Frequency`, `DurationDays`, `Quantity`).

Danh sách thuốc lấy từ kho qua `ApiClient.GetDrugs()` (chỉ thuốc `IsActive`, có `StockQuantity`).
Hai loại cảnh báo (tương tác thuốc, quá liều) gọi sang CDSS của **Thành viên 4** — chi tiết ở `member1-ui.md`
và `member4-code.md`. Logic tính viện phí từ đơn thuốc thuộc **Thành viên 2** (`BillingService`).

---

## F4 — Telemedicine: SignalR signaling (`TelemedicineHub.cs`)

Cuộc gọi video dùng **WebRTC** (peer-to-peer giữa 2 trình duyệt). Server chỉ làm **trung chuyển tín hiệu**
(signaling) để 2 bên trao đổi SDP offer/answer và ICE candidate — **không** truyền hình ảnh/âm thanh qua server.

`TelemedicineHub : Hub` — **không** `[Authorize]` (comment dòng 6–9): `roomId` chính là
`TelemedicineSession.Id` (GUID không đoán được) và hub chỉ chuyển SDP/ICE (không chứa dữ liệu bệnh nhân).

- **`_rooms`** (dòng 12): `ConcurrentDictionary<roomId, {connectionId}>` — theo dõi ai đang ở phòng nào (thread-safe).
- **`JoinRoom(roomId)`** (14–21): thêm connection vào phòng + group SignalR, **trả về số người đã có trước đó**
  (để client biết mình là người thứ nhất → tạo offer, hay thứ hai → chờ offer).
- **`SendSignal` / `SendIceCandidate`** (32–36): relay offer/answer và ICE tới `Clients.OthersInGroup(roomId)`
  — tức chỉ gửi cho **người kia** trong phòng.
- **`NotifyCallEnded`** (38–39): báo bên kia cúp máy.
- **`LeaveRoom`** (23–30) và **`OnDisconnectedAsync`** (41–48): dọn connection khỏi phòng khi rời/mất kết nối.

Ghi chú thực tế (dòng 16 trong `telemedicine.js`): chỉ cấu hình **STUN** (Google) nên gọi xuyên NAT/khác mạng
cần thêm **TURN server** — nằm ngoài phạm vi đồ án. Việc bác sĩ ghi bệnh án + gửi đơn thuốc **trong lúc gọi**
tái dùng đúng F2/F3 ở trên (nhúng `EPrescriptionPanel` vào trang gọi).
