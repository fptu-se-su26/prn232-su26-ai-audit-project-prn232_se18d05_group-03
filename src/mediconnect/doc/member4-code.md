# Thành viên 4 — Code backend: Quản trị, Nhân sự & CDSS

| Feature | File chính |
|---|---|
| F1 — Nhân sự & lịch trực | `Application/Services/StaffScheduleService.cs`, `Controllers/ScheduleController.cs`, `Controllers/StaffController.cs` |
| F2 — CDSS (cảnh báo y khoa) | `Controllers/CdssController.cs` |
| F3 — Dashboard & báo cáo | `Infrastructure/Repositories/ReportQuery.cs`, `Controllers/ReportsController.cs` |
| F4 — Tài khoản, phân quyền & OTP | `Application/Services/AuthService.cs`, `Controllers/UsersController.cs`, `Controllers/OtpController.cs`, `Infrastructure/Notifications/SmtpOtpSender.cs` |

---

## F1 — Nhân sự & Lịch trực (`StaffScheduleService.cs`)

`StaffProfile` (chuyên khoa, năm kinh nghiệm, học vị) quản lý qua `StaffController` (`api/staff`):
CRUD + `GET directory` (danh bạ nhân viên) + `GET/POST {id}/schedules` (lịch của một người).

Lịch trực (`StaffSchedule`) có **quy tắc nghiệp vụ**, xử lý ở service:

### `CreateAsync` (dòng 29–52)
```
1. ValidateWriteDto: StaffId hợp lệ + ShiftType thuộc {Morning, Afternoon, Evening} (98–105)
2. EnsureStaffExistsAsync: nhân viên tồn tại (107–112)
3. ValidateBusinessRulesAsync: 2 luật dưới (114–140)
4. ShiftTimeHelper.GetTimes(shiftType) → giờ bắt đầu/kết thúc tự động theo ca (35)
5. Tạo StaffSchedule, lưu, trả bản "phẳng" qua _scheduleQuery.GetFlatByIdAsync (47–51)
```

### `ValidateBusinessRulesAsync` — 2 luật xếp ca (dòng 114–140)
```csharp
var existing = ...ListAsync(s => s.StaffId == staffId && s.ShiftDate == shiftDate); // 121–123: ca cùng người, cùng ngày
// (khi Update thì loại chính bản ghi đang sửa ra, 125–127)
if (relevant.Any(s => s.ShiftType == shiftType))                                    // 129: TRÙNG ca
    throw new ScheduleValidationException("... already has a {ca} shift on {ngày}");// 131–133
if (relevant.Count >= _settings.MaxShiftsPerDay)                                    // 135: VƯỢT số ca/ngày
    throw new ScheduleValidationException("... cannot exceed {N} shift(s) per day");// 137–138
```
Chặn (1) trùng ca trong ngày và (2) vượt số ca tối đa/ngày (`ScheduleSettings.MaxShiftsPerDay`, cấu hình).
Ngoại lệ `ScheduleValidationException` → controller trả **400** với thông điệp rõ ràng.

### `NormalizeFilter` — lọc theo tuần (dòng 142–175)
Nếu `CurrentWeek = true`, tự tính **thứ Hai → Chủ Nhật** của tuần hiện tại (147–164) để hiển thị bảng lịch tuần;
chuẩn hóa phân trang (`Page ≥ 1`, `PageSize` 1..100).

`ScheduleController` (`api/schedules`): `POST` tạo, `PUT {id}` sửa, `DELETE {id}` xóa, `GET all` lấy tất cả,
`GET` lọc phân trang. `UpdateAsync` trả `null` khi không tìm thấy → controller **404**.

---

## F2 — CDSS: Cảnh báo y khoa (`CdssController.cs`, `api/cdss`)

### `CheckInteractions` — cảnh báo thuốc kỵ nhau (dòng 29–49)
```csharp
if (request.DrugIds.Count == 0) return Ok(new ...());                          // 34–37: rỗng → không cảnh báo
var interactions = await _interactionRepository.ListAsync(                      // 39–41
    di => request.DrugIds.Contains(di.DrugId)                                   //   cả 2 đầu của cặp tương tác
       && request.DrugIds.Contains(di.InteractingDrugId), ...);                 //   đều nằm trong danh sách đang kê
```
Chỉ trả về những cặp tương tác mà **cả hai thuốc** đều có trong đơn → đúng các cặp thực sự kỵ nhau trong đơn hiện tại.
UI kê đơn (TV1) gọi endpoint này mỗi khi thêm/bớt thuốc.

### `DoseCheck` — cảnh báo quá liều theo cân nặng (dòng 56–129)
```
1. Tìm Drug + PatientProfile (61–71)
2. Chưa nhập liều → chỉ trả thông tin (81–85)
3. Chọn ngưỡng (87–99):
   - Ưu tiên theo cân nặng: recommendedMax = drug.MaxDosePerKg × patient.WeightKg  ("per-kg")
   - Nếu không có → drug.MaxDailyDose ("absolute")
4. Không có ngưỡng nào → nhắc nhập cấu hình liều cho thuốc (103–109)
5. So sánh (111–126):
   - Vượt ngưỡng → IsOverDose = true + thông điệp "CẢNH BÁO QUÁ LIỀU..." kèm cách tính
   - Trong ngưỡng → thông điệp an toàn
```
Đây là chỗ **nhân trắc học `WeightKg` (TV2)** kết hợp với ngưỡng liều của thuốc (`MaxDosePerKg`/`MaxDailyDose`,
thêm bởi migration `AddDoseThresholdsAndOtp`). Danh mục thuốc + cặp tương tác quản lý qua CRUD `Drug`/`DrugInteraction`.

---

## F3 — Dashboard Thống kê & Báo cáo (`ReportQuery.cs`, `api/reports`)

4 truy vấn đọc (`AsNoTracking`), tối ưu để đẩy tính toán xuống SQL khi có thể:

### `GetSummaryAsync` — KPI tổng (dòng 17–50)
Tổng doanh thu (chỉ hóa đơn `Paid` trong kỳ, 21–25), tỷ lệ kín giường (occupied/total, 27–33),
số lượt khám ngoại trú (35–37), số bệnh nhân nội trú đang nằm (39–41). `ResolvePeriod` (226–236)
hỗ trợ `today` và `this-month`.

### `GetRevenueAsync` — doanh thu theo ngày/tháng & khoa (dòng 54–136)
- Chỉ tính hóa đơn `Paid`; lọc theo khoảng ngày, `endDate` được coi là **hết ngày** (68–71).
- Lọc theo khoa (nếu có): giới hạn bệnh nhân từng nhập khoa đó (75–84).
- Kéo cột tối thiểu về bộ nhớ, resolve khoa của mỗi bệnh nhân qua **lần nhập viện gần nhất** (94–107),
  rồi `GroupBy` theo `{Period, Department}` — `groupBy=month` gộp theo tháng, ngược lại theo ngày (109–133).

### `GetBedOccupancyAsync` — công suất giường theo khoa (dòng 140–185)
`GroupBy` **chạy tại SQL** (`SUM(CASE WHEN ...)`, comment 148): mỗi khoa đếm tổng giường & giường Occupied,
tính `Percentage`; tổng hợp toàn viện (159–184).

### `GetOutpatientVisitsAsync` — lượt khám theo thời gian (dòng 189–222)
Chỉ kéo cột `VisitDate` (200–205), `GroupBy` theo ngày/tháng, đếm số lượt.

`ReportsController` map 1-1: `GET summary | revenue | bed-occupancy | outpatient-visits`.

---

## F4 — Tài khoản, Phân quyền & OTP

### Phân quyền (RBAC)
- `UserRole` (Patient/Doctor/Nurse/Admin, `Enums.cs`) nằm trong **JWT claim** (`JwtTokenService`).
- API bảo vệ bằng `[Authorize(Roles="...")]`; trang Blazor bằng `@attribute [Authorize(Roles="...")]`.
- `UsersController` (`api/users`): CRUD + `GET me` (thông tin tài khoản hiện tại) +
  `PATCH {id}/status` (khóa/mở khóa `IsActive`) + `PATCH {id}/role` (đổi vai trò).

### OTP xác thực (`OtpController.cs`, `api/otp`)
`OtpSetting` là **cấu hình đơn** toàn hệ thống (`GetOrCreateSettingAsync` 213–226 tạo mặc định nếu chưa có).

- **`Issue`** (85–123): kiểm tra OTP đang bật; sinh mã số **ngẫu nhiên mật mã** (`RandomNumberGenerator`,
  `GenerateNumericCode` 228–237); gọi `_otpSender.SendAsync(...)` gửi thật (email); lưu `OtpCode` với
  `ExpiresAt = now + ExpiryMinutes`. Nếu gửi thật thất bại → **mô phỏng** (mã hiện trên console admin).
- **`Verify`** (125–187): lấy mã Pending mới nhất; hết hạn → `Expired` (142–148); tăng `AttemptCount`;
  sai và vượt `MaxAttempts` → `Failed` (150–169); đúng → `Verified` + **kích hoạt tài khoản**
  (`user.VerifiedAt`, `IsActive = true`, 171–186).
- **`GetCodes`** (191–209): nhật ký 50 mã gần nhất cho màn hình demo; mã đã gửi thật thì **che** (`••••`),
  chỉ mã mô phỏng mới lộ số (`ToDto` 239–256).

### Gửi OTP thật — `SmtpOtpSender.cs`
Cài đặt `IOtpSender`: gửi email qua **SMTP** (cấu hình `OtpEmailOptions`). `IsConfigured` cho biết đã cấu hình
SMTP chưa; chưa cấu hình/gửi lỗi → trả `Delivered = false` để controller rơi về chế độ mô phỏng.
