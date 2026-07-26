# Thành viên 2 — Giao diện (Blazor): Bệnh nhân, PHR & Thanh toán

| Trang | Route | Quyền |
|---|---|---|
| `Register.razor` | `/register` | (ẩn danh) |
| `Booking.razor` | `/booking` | Patient |
| `PHR.razor` | `/health-records` | Patient |
| `Billing.razor` | `/billing` | Patient |
| `Reviews.razor` | `/my-reviews` | Patient |

Toàn bộ trang dành cho **Patient** đều bắt đầu bằng `Api.GetMyPatient()` để lấy `PatientProfile` của người
đăng nhập, rồi mới tải dữ liệu liên quan → mỗi bệnh nhân chỉ thấy dữ liệu của chính mình.

---

## `Register.razor` (F1 — đăng ký tài khoản) — ẩn danh
Form đăng ký (họ tên, email, SĐT, mật khẩu, role) → `Api.RegisterAsync(...)` (dòng 79) gọi `POST api/auth/register`.
Thành công nhận JWT và tự đăng nhập. Nếu bật OTP (TV4) sẽ yêu cầu xác thực mã trước khi kích hoạt.

## `Booking.razor` (F1 — đặt lịch khám) — Patient
Luồng đặt lịch (các call ở dòng 302–362):
1. Nạp danh mục: `Api.GetDepartments`, `Api.GetActiveClinics`, `Api.GetStaffDirectory` (302–304)
   → bệnh nhân chọn khoa → phòng khám → bác sĩ.
2. `Api.GetMyPatient` (350): nếu chưa có hồ sơ, `Api.CreatePatient` (356) tạo `PatientProfile` lần đầu.
3. Chọn giờ hẹn → `Api.CreateAppointment` (362) tạo `Appointment` (`POST api/appointments`).

## `PHR.razor` (F2 — Hồ sơ sức khỏe điện tử) — Patient
Trang **chỉ đọc**, tổng hợp toàn bộ hồ sơ. Các call (539–556):
- `Api.GetMyPatient` → `Api.GetPatientHistory(profileId)`: lịch sử khám + chẩn đoán.
- `Api.GetAllLabOrders`, `Api.GetPrescriptionItems`, `Api.GetDrugs`: kết quả xét nghiệm & đơn thuốc đã kê
  (join `PrescriptionItem` với `Drug` để hiện tên thuốc).
- `Api.GetStaffDirectory`, `Api.GetAllClinics`: đổi GUID bác sĩ/phòng thành tên hiển thị.
- Kết quả XN/X-quang (`LabResult`) có link file để tải/xem chi tiết.

## `Billing.razor` (F3 — viện phí & BHYT / F4 — thanh toán) — Patient
Trang trung tâm của TV2. Các trạng thái tải: `_loading`, `_noProfile` (chưa có hồ sơ → mời đặt lịch, dòng 14–24),
`_error` (nút "Thử lại"). Các hàm `@code`:

- **`LoadData` (326–...)**: `GetMyPatient` (334) → nếu chưa có, `_noProfile = true`. Có rồi thì nạp song song
  `GetBillingInvoices`, `GetPayments`, `GetPatientHistory`, `GetUserAccounts`, `GetAllClinics`,
  `GetMedicalServices` (347–352) và dựng danh sách phiếu thu (`InvoiceVm`). Thẻ KPI đầu trang đếm tổng phiếu &
  số đã thanh toán (`Status == Paid`, dòng 54, 60).
- **`ToggleExpand` (393–...)**: mở phiếu → `Api.GetBillingItems(inv.Id)` (399) tải chi tiết dòng chi phí.
- **`RecalcInsurance` (405–...)**: nhập mã BHYT vào `inv.InsuranceInput` → `Api.CalculateInsurance(id, num)` (410)
  gọi `POST billinginvoices/{id}/calculate-insurance` → cập nhật khấu trừ 80% + tổng phải trả.
- **`Pay` (425–...)**: tạo `Payment` (`Api.CreatePayment`, 430) rồi tùy `method`:
  `Api.CreateVnPayUrl(id)` hoặc `Api.CreateMomoUrl(id)` (440–441) → nhận link → `Js` mở sang cổng thanh toán.
  Sau khi thanh toán, VNPay redirect về `GET api/payments/vnpay-return` (backend cập nhật `Paid`/`Failed`).
- **`SubmitCreate` (458–...)**: nút "Tạo phiếu thu" → `Api.GenerateInvoice(GenerateInvoiceRequestDto)` (469)
  gọi `POST billinginvoices/generate` (`BillingService.GenerateInvoiceAsync`) — tự gom phí khám + XN + thuốc.
- `ShowToast`/`ClearToastAfterDelay` (494–500): thông báo nổi tự ẩn.

## `Reviews.razor` (F4 — đánh giá dịch vụ) — Patient
- `GetMyPatient` → `GetPatientHistory` (148, 159): lấy các lượt khám đã hoàn tất để biết bác sĩ nào đã khám.
- `GetServiceRatings` (160): các đánh giá đã gửi; `GetStaffDirectory`/`GetAllClinics` để hiển thị tên.
- Gửi đánh giá (số sao + nhận xét) → `Api.CreateServiceRating(...)` (199) tạo `ServiceRating`
  (`POST api/serviceratings`).
