# Thành viên 2 — Code backend: Bệnh nhân, PHR & Thanh toán

| Feature | File chính |
|---|---|
| F1 — Đăng ký/hồ sơ cá nhân & đặt lịch | `Application/Services/AuthService.cs`, `Controllers/AuthController.cs`, `Controllers/PatientsController.cs`, CRUD `Appointment` |
| F2 — Hồ sơ sức khỏe điện tử (PHR) | tái dùng `MedicalRecordService` + đọc `OutpatientVisit`/`Prescription`/`LabResult` |
| F3 — Viện phí & BHYT | `Application/Services/BillingService.cs`, `EntityControllers.cs` → `BillingInvoicesController` |
| F4 — Thanh toán online & đánh giá | `Infrastructure/Payments/PaymentGatewayService.cs`, `PaymentsController`, `ServiceRatingsController` |

---

## F1 — Đăng ký, hồ sơ cá nhân & đặt lịch (`AuthService.cs`)

### `RegisterAsync` (dòng 24–54)
```csharp
var existingUser = await _userRepository.FirstOrDefaultAsync(u => u.Email == request.Email, ...); // 26
if (existingUser is not null) throw ...("Email is already registered.");                          // 27–29: email trùng
var user = new UserAccount { FullName, Email, PhoneNumber, Role,                                   // 32–40
    IsActive = true, PasswordHash = _passwordHasher.Hash(request.Password) };                      // 39: BĂM mật khẩu
await _userRepository.AddAsync(user, ...); await ...SaveChangesAsync(...);                          // 42–43: lưu DB
var (token, expiresAt) = _tokenService.CreateToken(user);                                          // 45: phát JWT ngay
return new AuthResponseDto { AccessToken = token, ExpiresAt = expiresAt, User = userDto };          // 48–53
```
Đăng ký xong trả **JWT luôn** → frontend tự đăng nhập. Mật khẩu **không bao giờ** lưu thô, chỉ lưu hash
(`IPasswordHasher`, cài đặt `PasswordHasherService`). Kích hoạt OTP (nếu bật) thuộc **Thành viên 4**.

### `LoginAsync` (dòng 56–78)
- Tìm user theo email **và** `IsActive` (58); không thấy → trả `null` (→ controller trả **401**).
- `_passwordHasher.Verify(hash, password)` (64) sai → `null`. Đúng → phát JWT + trả `AuthResponseDto`.

`AuthController` (`api/auth`, `[AllowAnonymous]`): `POST register` (bắt email trùng → 400),
`POST login` (`null → Unauthorized()`).

### Hồ sơ cá nhân & nhân trắc học
`PatientProfile` chứa `WeightKg`, `HeightCm`, `InsuranceNumber`… (nhân trắc học `WeightKg` còn dùng cho
**cảnh báo quá liều** — Thành viên 4). Cập nhật qua `PatientsController` / CRUD `PatientProfile`.

### Đặt lịch khám
`Appointment` (bệnh nhân chọn bác sĩ + giờ) tạo qua `AppointmentsController : CrudController<Appointment,...>`
(`EntityControllers.cs:10`). Trạng thái lịch (`AppointmentStatus`) được các luồng khám của TV1 đẩy về `Completed`.

---

## F2 — Hồ sơ sức khỏe điện tử (PHR)

Không có service mới — trang PHR **tổng hợp read-only** dữ liệu bệnh nhân bằng cách gọi nhiều endpoint qua `ApiClient`:
- Lịch sử khám: `OutpatientVisit` của bệnh nhân + tiền sử chẩn đoán
  (`GET api/medical-records/patients/{id}/diagnosis-history`, tức `MedicalRecordService.GetPatientDiagnosisHistoryAsync`).
- Đơn thuốc đã kê: `Prescription` + `PrescriptionItem`.
- Kết quả xét nghiệm/hình ảnh: `LabResult` (có link file ảnh/PDF do TV3 nhập).

Toàn bộ lọc theo `PatientId` của người đăng nhập → bệnh nhân chỉ xem hồ sơ của chính mình.

---

## F3 — Viện phí & Bảo hiểm y tế (`BillingService.cs`)

Hai hằng số nghiệp vụ (đơn giản hóa cho đồ án):
- `InsuranceCoverageRate = 0.8` (dòng 11) — BHYT đúng tuyến chi trả **80%**.
- `DefaultLabFee = 100_000` (dòng 14) — giá xét nghiệm mặc định khi không khớp `MedicalService`.

### `GenerateInvoiceAsync` — gom chi phí thành phiếu thu (dòng 48–115)
Đây là hàm "tự động gom chi phí" của đề bài:
```
1. Tìm OutpatientVisit + PatientProfile (50–54)
2. Tạo BillingInvoice trạng thái Draft (56–63)
3. Phí khám: nếu có ExamServiceId → thêm item theo MedicalService.Price (67–74)
4. Xét nghiệm: mỗi LabOrder của visit → khớp tên với MedicalService để lấy giá,
   không khớp thì dùng DefaultLabFee (76–88)
5. Thuốc: mọi Prescription → PrescriptionItem → Drug.UnitPrice × Quantity (90–103)
6. Lưu tất cả item; Subtotal = tổng Amount (105–111)
7. Gọi CalculateInsuranceAsync để áp BHYT & chốt tổng (113–114)
```
`BuildItem` (136–145) là factory tạo `BillingItem` với `Amount = Quantity × UnitPrice`.
Khớp tên xét nghiệm dùng `Contains` hai chiều (82–84) — linh hoạt nhưng không chính xác tuyệt đối (đơn giản hóa).

### `CalculateInsuranceAsync` — tính khấu trừ BHYT (dòng 117–134)
```csharp
var isValidBhyt = !string.IsNullOrWhiteSpace(num) && num.Trim().Length >= 10;   // 123: BHYT hợp lệ khi ≥10 ký tự
invoice.InsuranceDeduction = isValidBhyt                                        // 126
    ? Math.Round(invoice.Subtotal * InsuranceCoverageRate, 0) : 0m;             //     = 80% (làm tròn) hoặc 0
invoice.TotalAmount = invoice.Subtotal - invoice.InsuranceDeduction;           // 127: số bệnh nhân phải trả
invoice.Status = InvoiceStatus.Pending;                                         // 128: chờ thanh toán
```
Kiểm tra thẻ BHYT ở đây chỉ theo **độ dài ≥10** (đơn giản hóa, không gọi cổng BHXH thật).

`BillingInvoicesController` (`EntityControllers.cs:184`):
- `POST billinginvoices/generate` → `GenerateInvoiceAsync` (202–216).
- `GET {id}/items`, `POST {id}/items` → xem/thêm dòng chi phí thủ công.
- `POST {id}/calculate-insurance` → nhập mã BHYT, tính lại khấu trừ (245–260).

---

## F4 — Thanh toán online (`PaymentGatewayService.cs`) & Đánh giá

### VNPay — `CreateVnPayUrl` (dòng 26–47)
Dựng link theo **chuẩn sandbox VNPay**:
- `SortedDictionary(StringComparer.Ordinal)` (28) — tham số phải **sắp thứ tự** trước khi ký.
- `vnp_Amount = Amount × 100` (33) — VNPay tính theo đơn vị nhỏ nhất.
- `vnp_TxnRef = payment.Id` (35) — để đối soát khi VNPay redirect về.
- `vnp_CreateDate` giờ VN (`UtcNow + 7h`, 41).
- `BuildSignedQuery` (113–114) nối `key=urlencode(value)` theo thứ tự; ký `HMACSHA512` với `HashSecret`
  (`ComputeHmacSha512`, 116–121); gắn `&vnp_SecureHash=...` (46).

### VNPay return — `ValidateVnPayReturn` (dòng 77–111)
Khi VNPay redirect về (không có Bearer token):
- Lấy `vnp_SecureHash` nhận được (79–82).
- Ký lại toàn bộ tham số **trừ** `vnp_SecureHash`/`vnp_SecureHashType` (84–95), so sánh hash (97).
- `isSuccess = chữ ký hợp lệ && vnp_ResponseCode == "00"` (98). Trả `TxnRef`/`TransactionNo` để cập nhật Payment.

### Momo — `CreateMomoUrl` (dòng 49–75)
**Mô phỏng**: dựng `rawData` đúng thứ tự trường Momo yêu cầu, ký `HMACSHA256` (69), rồi ghép URL redirect.
Comment 71–72 nêu rõ: thực tế phải POST `rawData` lên Momo và lấy `payUrl` từ JSON response —
**đơn giản hóa cho phạm vi đồ án**.

### `PaymentsController` (`EntityControllers.cs:1111`)
- `POST {id}/confirm` (1126–1140): đánh dấu `Paid` thủ công (demo).
- `POST {id}/vnpay-url` / `{id}/momo-url` (1143–1169): tạo link thanh toán từ IP client.
- `GET vnpay-return` `[AllowAnonymous]` (1175–1208): xác thực chữ ký → cập nhật `Payment.Status`
  (`Paid`/`Failed`), lưu `TransactionRef`, set `PaidAt`.

### Đánh giá dịch vụ — `ServiceRatingsController` (`EntityControllers.cs:1258`)
CRUD `ServiceRating` (bệnh nhân chấm điểm `Rating` + `Comment` cho bác sĩ/dịch vụ). Có thêm endpoint
(dòng 1270+) tính **điểm trung bình + tổng lượt đánh giá** của một bác sĩ để hiển thị.
