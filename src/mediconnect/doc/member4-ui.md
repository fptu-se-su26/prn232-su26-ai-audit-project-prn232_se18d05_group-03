# Thành viên 4 — Giao diện (Blazor): Quản trị, Nhân sự & CDSS

| Trang | Route | Quyền |
|---|---|---|
| `Login.razor` | `/login` | (ẩn danh) |
| `StaffManagement.razor` | `/admin/staff` | Admin |
| `ScheduleManagement.razor` | `/schedules` | (mọi role đăng nhập) |
| `DrugInteraction.razor` | `/admin/drug-interactions` | Admin |
| `OperationsReport.razor` | `/reports/operations` | Admin |
| `RevenueDashboard.razor` | `/reports/revenue` | Admin |
| `OtpSecurity.razor` | `/admin/otp-security` | Admin |
| `UserManagement.razor` | `/admin/users` | Admin |

---

## `Login.razor` (F4 — đăng nhập) — ẩn danh
Form email + mật khẩu → `Api.LoginAsync(email, password)` (dòng 66) gọi `POST api/auth/login`.
Thành công lưu JWT vào `TokenState` và điều hướng theo role; sai → thông báo lỗi.

## `StaffManagement.razor` (F1 — nhân sự) — Admin
- Nạp: `Api.GetStaffDirectory` (219), `Api.GetUserAccounts` (220), `Api.GetDepartments` (221).
- CRUD hồ sơ nhân viên: `Api.CreateStaffProfile` (281), `Api.UpdateStaffProfile` (276),
  `Api.DeleteStaffProfile` (297) → `StaffController` (`api/staff`). Nhập chuyên khoa, năm kinh nghiệm, học vị.

## `ScheduleManagement.razor` (F1 — lịch trực) — mọi role đăng nhập
- Nạp danh mục: `Api.GetDepartments` (473), `Api.GetStaffDirectory` (474).
- **Bảng lịch tuần**: `Api.FilterSchedules` (489, 502) gọi `GET api/schedules` (dùng `CurrentWeek` → backend
  tự tính T2–CN, xem `member4-code.md` F1).
- Tạo/sửa/xóa ca: `Api.CreateSchedule` (564), `Api.UpdateSchedule` (559), `Api.DeleteSchedule` (581).
  Nếu vi phạm luật (trùng ca / vượt số ca/ngày) → API trả 400, UI hiện lỗi.

## `DrugInteraction.razor` (F2 — CDSS + danh mục thuốc) — Admin
- Quản lý danh mục: `Api.GetDrugs` (391), `Api.CreateDrug` (473), `Api.UpdateDrug` (472) — nhập cả **ngưỡng liều**
  (`MaxDailyDose`, `MaxDosePerKg`) dùng cho cảnh báo quá liều; `Api.GetDrugInteractions` (392) quản lý cặp kỵ nhau.
- **Thử nghiệm cảnh báo**: `Api.GetAllPatients` (393)/`Api.GetUserAccounts` (394) chọn bệnh nhân, rồi
  `Api.CheckDrugInteractions` (418) và `Api.CheckDose` (434) — chính là 2 endpoint CDSS mà màn kê đơn (TV1) gọi.

## `OperationsReport.razor` (F3 — báo cáo vận hành) — Admin
- Bộ lọc khoa: `Api.GetDepartments` (193).
- Biểu đồ công suất giường: `Api.GetBedOccupancy` (220); lượt khám ngoại trú: `Api.GetOutpatientVisitReport` (221).
- Render bằng component chart tái dùng (`BarChart`, `PieChart`, `KpiCard` trong `Components/Shared`).

## `RevenueDashboard.razor` (F3 — doanh thu) — Admin
- `Api.GetDepartments` (182) cho bộ lọc; `Api.GetRevenue` (211–212) gọi `GET api/reports/revenue`
  (theo ngày/tháng, theo khoa). Hiển thị `LineChart`/`BarChart` + `KpiCard`.

## `OtpSecurity.razor` (F4 — cấu hình & giám sát OTP) — Admin
- Cấu hình chính sách: `Api.GetOtpSettings` (249) / `Api.UpdateOtpSettings` (275) — bật/tắt, độ dài mã,
  thời hạn, số lần thử tối đa (validate 4..10 / 1..60 / 1..20 ở backend).
- Demo cấp/xác thực: chọn user (`Api.GetUserAccounts` 250), `Api.IssueOtp` (296) cấp mã, `Api.VerifyOtp` (312) xác thực.
- Nhật ký mã: `Api.GetOtpCodes` (251, 259) — mã gửi thật bị che, mã mô phỏng hiện số (xem `member4-code.md` F4).

## `UserManagement.razor` (F4 — tài khoản & phân quyền) — Admin
- `Api.GetUserAccounts` (251) liệt kê; `Api.CreateUser` (312), `Api.UpdateUser` (307), `Api.DeleteUser` (351).
- **Khóa/mở khóa**: `Api.UpdateUserStatus` (327) gọi `PATCH users/{id}/status`.
- **Đổi vai trò**: `Api.UpdateUserRole` (339) gọi `PATCH users/{id}/role` (RBAC: Patient/Doctor/Nurse/Admin).
