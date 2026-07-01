# Changelog

## 1. Quy định ghi Changelog

File này dùng để ghi lại các thay đổi quan trọng trong quá trình thực hiện bài tập, lab, assignment hoặc project.

Nguyên tắc ghi changelog:

- Chỉ ghi những gì đã hoàn thành thật sự.
- Không ghi kế hoạch nếu chưa thực hiện.
- Mỗi thay đổi nên có ngày, nội dung, người thực hiện và minh chứng.
- Nếu có AI hỗ trợ, cần ghi rõ AI đã hỗ trợ phần nào.
- Nếu có commit GitHub, cần ghi link commit.
- Nếu có lỗi đã sửa, cần ghi rõ lỗi, nguyên nhân và cách xử lý.

---

## 2. Thông tin project

| Thông tin | Nội dung |
|---|---|
| Môn học | Building Cross-Platform Back-End Application with .NET |
| Mã môn học | PRN232 |
| Lớp | SE18D05 |
| Học kỳ | SU26 |
| Tên bài tập / Project | MEDICONNECT – Hệ thống Quản lý Bệnh viện Thông minh |
| Tên sinh viên / Nhóm | Nhóm 3 |
| MSSV / Danh sách MSSV | DE180522, DE180526, DE190580, DE190123 |
| Giảng viên hướng dẫn |  |
| Repository URL | https://github.com/fptu-se-su26/prn232-su26-ai-audit-project-prn232_se18d05_group-03 |
| Ngày bắt đầu | 17/05/2026 |
| Ngày hoàn thành | Đang thực hiện |

---

## 3. Tổng quan các phiên bản/giai đoạn

| Phiên bản/Giai đoạn | Thời gian | Nội dung chính | Trạng thái |
|---|---|---|---|
| Phase 01 | 17/05/2026 | Khởi tạo project | Completed |
| Phase 02 | 17/05/2026 | Phân tích yêu cầu | Completed |
| Phase 03 | 05/06/2026 | Thiết kế hệ thống | Completed |
| Phase 04 | 06/06/2026 – 10/06/2026 | Implementation | Completed |
| Phase 05 | 10/06/2026 | Testing & Debug | Completed |
| Phase 07 | 11/06/2026 – 20/06/2026 | Thành viên 4: Dashboard Thống kê & Quản trị Hệ thống | Completed |
| Phase 06 |  | Hoàn thiện báo cáo và demo | In Progress |

---

# [Phase 01] Khởi tạo project

## Ngày thực hiện

```text
17/05/2026
```

## Đã hoàn thành

- [ ] Tạo repository
- [x] Tạo cấu trúc thư mục project
- [ ] Tạo file README.md
- [ ] Tạo thư mục `docs/`
- [ ] Tạo file `AI_AUDIT_LOG.md`
- [ ] Tạo file `PROMPTS.md`
- [ ] Tạo file `REFLECTION.md`
- [ ] Tạo file `CHANGELOG.md`
- [x] Khởi tạo source code ban đầu
- [x] Cài đặt thư viện/công cụ cần thiết
- [x] Cấu hình môi trường chạy project

## Thay đổi chi tiết

| STT | Nội dung thay đổi | Người thực hiện | File/Module liên quan | Minh chứng |
|---:|---|---|---|---|
| 1 | Ghi nhận prompt ve phan chia thanh vien, nhac quy trinh audit, va dinh huong models |  | docs/PROMPTS.md; docs/AI_AUDIT_LOG.md; docs/CHANGELOG.md |  |
| 2 | Ghi nhan yeu cau thiet ke models code-first cho .NET SQL Server |  | docs/PROMPTS.md; docs/AI_AUDIT_LOG.md; docs/CHANGELOG.md |  |
| 3 | Tao project .NET Web API mediconnect va them cau hinh code-first co ban |  | src/mediconnect |  |
| 4 | Tao file solution cho du an mediconnect |  | mediconnect.sln |  |

## AI có hỗ trợ không?

- [x] Có
- [ ] Không

Nếu có, mô tả AI đã hỗ trợ phần nào:

```text
AI ho tro tom tat prompt, dinh huong log va ghi nhan thay doi tai lieu.
```

## Commit/Screenshot minh chứng

```text
Cap nhat tai lieu: docs/PROMPTS.md, docs/AI_AUDIT_LOG.md, docs/CHANGELOG.md
```

## Ghi chú

```text
Viết tại đây...
```

---

# [Phase 02] Phân tích yêu cầu

## Ngày thực hiện

```text
17/05/2026
```

## Đã hoàn thành

- [ ] Xác định problem statement
- [ ] Xác định user roles
- [ ] Viết user stories
- [ ] Viết use cases
- [ ] Xác định functional requirements
- [ ] Xác định non-functional requirements
- [ ] Xác định business rules
- [ ] Xác định acceptance criteria
- [ ] Review yêu cầu với giảng viên/nhóm
- [ ] Chỉnh sửa yêu cầu sau feedback

## Thay đổi chi tiết

| STT | Nội dung thay đổi | Người thực hiện | File/Module liên quan | Minh chứng |
|---:|---|---|---|---|
| 1 |  |  |  |  |
| 2 |  |  |  |  |
| 3 |  |  |  |  |

## AI có hỗ trợ không?

- [ ] Có
- [ ] Không

Nếu có, mô tả AI đã hỗ trợ phần nào:

```text
Viết tại đây...
```

## Commit/Screenshot minh chứng

```text
Dán link commit, screenshot hoặc mô tả minh chứng tại đây...
```

## Ghi chú

```text
Viết tại đây...
```

---

# [Phase 03] Thiết kế hệ thống

## Ngày thực hiện

```text
05/06/2026
```

## Đã hoàn thành

- [x] Thiết kế kiến trúc tổng quan (Clean Architecture: Domain / Application / Infrastructure / API)
- [x] Thiết kế database/ERD (StaffSchedule, StaffProfile, UserAccount, Department)
- [x] Thiết kế API (5 Schedule endpoints + 1 Staff directory endpoint)
- [x] Thiết kế giao diện/wireframe (dựa theo base-html: hr_shift_scheduling_matrix.html)
- [x] Thiết kế flow xử lý (validate → save → flat projection → response)
- [ ] Thiết kế class diagram
- [ ] Thiết kế sequence diagram
- [x] Thiết kế security/authorization flow (JWT Bearer, [Authorize] trên tất cả controller)
- [x] Review thiết kế

## Thay đổi chi tiết

| STT | Nội dung thay đổi | Người thực hiện | File/Module liên quan | Minh chứng |
|---:|---|---|---|---|
| 1 | Thiết kế entity StaffSchedule với các field: StaffId, ShiftDate, ShiftType, StartTime, EndTime, WorkRoom | DE180522 | `Mediconnect.Domain/Entities/StaffSchedule.cs` | commit 912b0cf |
| 2 | Thiết kế enum ShiftType (Morning/Afternoon/Evening), StaffType (Doctor/Nurse/Admin/Caregiver) | DE180522 | `Mediconnect.Domain/Entities/Enums.cs` | commit 912b0cf |
| 3 | Thiết kế interface IStaffScheduleService (create/update/delete với validation), IStaffScheduleQuery (flat read, paged filter, directory) | DE180522 | `Mediconnect.Application/Interfaces/` | commit 912b0cf |
| 4 | Thiết kế DTO phẳng ScheduleFlatReadDto (join StaffProfile + UserAccount + Department) | DE180522 | `Mediconnect.Application/DTOs/ScheduleDtos.cs` | commit 912b0cf |
| 5 | Thiết kế giao diện Gantt chart (staff rows × date columns) theo base-html | DE180522 | `base-html/hr_shift_scheduling_matrix.html` | — |

## AI có hỗ trợ không?

- [x] Có
- [ ] Không

Nếu có, mô tả AI đã hỗ trợ phần nào:

```text
AI hỗ trợ thiết kế cấu trúc DTO phẳng (flat projection) để tránh N+1 query khi join
StaffSchedule → StaffProfile → UserAccount → Department. AI cũng đề xuất pattern
IStaffScheduleQuery tách biệt read-side khỏi write-side (CQRS lite).
```

## Commit/Screenshot minh chứng

```text
Branch: feature/de180522-HumanResourcesandSchedulingManagement
Commit: 912b0cf [DE180522] feat: add HR & Staff Schedule Management (Gantt chart)
```

## Ghi chú

```text
Kiến trúc chọn flat projection (.Select) thay vì .Include() để EF Core sinh SQL tối ưu hơn,
tránh circular reference khi serialize JSON.
```

---

# [Phase 04] Implementation

## Ngày thực hiện

```text
06/06/2026 – 10/06/2026
```

## Đã hoàn thành

- [x] Tạo project structure
- [x] Cài đặt database connection
- [ ] Xây dựng backend
- [ ] Xây dựng frontend
- [ ] Xây dựng authentication/authorization
- [ ] Xử lý CRUD
- [ ] Xử lý validation
- [ ] Tích hợp API
- [ ] Xử lý upload/download file
- [x] Xử lý lỗi
- [x] Tối ưu giao diện
- [x] Cập nhật README hướng dẫn chạy

## Thay đổi chi tiết

| STT | Nội dung thay đổi | Người thực hiện | File/Module liên quan | Minh chứng |
|---:|---|---|---|---|
| 1 | Tao DbContext va bo Models cho HIS & Telemedicine |  | src/mediconnect/Models; src/mediconnect/Data |  |
| 2 | Them EF Core packages va connection string SQL Server |  | src/mediconnect/mediconnect.csproj; src/mediconnect/appsettings.json; src/mediconnect/Program.cs |  |
| 3 | Cap nhat README huong dan chay project |  | README.md |  |
| 4 |  Tạo SmartQueueDtos, IQueueService, QueueService - Feature 1 smart queue | DE180526  | src/Mediconnect.Application/DTOs/SmartQueueDtos.cs; src/Mediconnect.Application/Interfaces/IQueueService.cs; src/Mediconnect.Application/Services/QueueService.cs |  |
| 5 |  Tạo SmartQueueController, enhance ClinicsController & MedicalServicesController | DE180526   | src/mediconnect/Controllers/SmartQueueController.cs; src/mediconnect/Controllers/EntityControllers.cs; src/mediconnect/Program.cs |  |
| 6 | Them endpoints GET /api/beds/map, GET /api/inpatient-admissions/{id}/bed-assignments, POST /api/inpatient-admissions/{id}/transfer | Park Jea Minh | src/mediconnect/Controllers/EntityControllers.cs | feat(member3): F1 - bed map & transfer |
| 7 | Them DTOs BedMapGroupDto, TransferAdmissionDto | Park Jea Minh | src/Mediconnect.Application/DTOs/EntityDtos.cs | feat(member3): F1 - bed map & transfer |

## AI có hỗ trợ không?

- [x] Có
- [ ] Không

Nếu có, mô tả AI đã hỗ trợ phần nào:

```text
AI (Claude Code) hỗ trợ:
- Scaffold dự án, DbContext, EF Core models và cấu hình ban đầu.
- Sinh code endpoints GET /api/beds/map, bed-assignments, transfer và DTOs tương ứng.
- Thiết kế và implement toàn bộ module HR & Scheduling (DE180522):
  • StaffScheduleService với validation rules (duplicate, max 2 ca/ngày, thời gian tự động)
  • StaffScheduleQuery với flat LINQ projection (không dùng .Include, tránh N+1)
  • ScheduleController (5 endpoints) và StaffController.GetDirectory
  • ScheduleManagementPage.tsx: KPI stats bar, Staff Profiles Directory Grid,
    Week Gantt (staff × date), Day Gantt (24h timeline với shift bars định vị theo giờ thực)
- Fix lỗi React 19 deprecation: React.FormEvent → inline e.preventDefault()
- Fix connection string: bỏ Trusted_Connection=True xung đột với SQL auth
```

## Commit/Screenshot minh chứng

```text
Branch: feature/de180522-HumanResourcesandSchedulingManagement
Commit DE180522: 912b0cf [DE180522] feat: add HR & Staff Schedule Management (Gantt chart)
Commit DE180526: 8c5e747 [DE180526] feat: add React TypeScript frontend and fix backend API integration
Commit DE180526: e74ba55 [DE180526] feat: add smart queue service and clinic/service management endpoints
Commit Park Jea Minh: 9c8929b feat(member3): F1 - bed map, bed-assignments & transfer endpoints
```

## Ghi chú

```text
- ScheduleManagementPage sử dụng Vite proxy (port 5173 → 5079) để tránh CORS.
- JWT token lưu trong localStorage, Axios interceptor tự đính vào header Authorization.
- EF Core dùng .Select() thay .Include() để EF sinh SQL tối ưu, không circular reference.
```

---

# [Phase 05] Testing & Debug

## Ngày thực hiện

```text
10/06/2026
```

## Đã hoàn thành

- [ ] Viết test case
- [ ] Chạy test chức năng chính
- [ ] Kiểm tra output
- [ ] Kiểm tra validation
- [ ] Kiểm tra lỗi giao diện
- [ ] Kiểm tra lỗi database
- [ ] Kiểm tra phân quyền
- [ ] Kiểm tra bảo mật cơ bản
- [x] Fix bug
- [x] Chạy lại sau khi fix bug
- [x] Ghi nhận kết quả test

## Danh sách lỗi đã xử lý

| STT | Lỗi phát hiện | Nguyên nhân | Cách xử lý | Trạng thái |
|---:|---|---|---|---|
| 1 |  |  |  | Open / Fixed / Pending |
| 2 |  |  |  | Open / Fixed / Pending |
| 3 |  |  |  | Open / Fixed / Pending |
| 4 |  |  |  | Open / Fixed / Pending |
| 5 |  |  |  | Open / Fixed / Pending |

## Thay đổi chi tiết

| STT | Nội dung thay đổi | Người thực hiện | File/Module liên quan | Minh chứng |
|---:|---|---|---|---|
| 1 |  |  |  |  |
| 2 |  |  |  |  |
| 3 |  |  |  |  |

## AI có hỗ trợ không?

- [x] Có
- [ ] Không

Nếu có, mô tả AI đã hỗ trợ phần nào:

```text
Viết tại đây...
```

## Commit/Screenshot minh chứng

```text
Smoke test chạy trực tiếp qua PowerShell, tất cả 10/10 test PASS.
Vite proxy (5173 → 5079) hoạt động sau khi backend khởi động.
tsc --noEmit → 0 errors.
```

## Ghi chú

```text
Test thực hiện manual (smoke test) qua PowerShell Invoke-RestMethod, không có automated test suite.
Các test case cover: CRUD đầy đủ, business rule duplicate, proxy Vite.
```

---

# [Phase 07] Thành viên 4: Dashboard Thống kê & Quản trị Hệ thống

## Ngày thực hiện

```text
11/06/2026 – 20/06/2026
```

## Đã hoàn thành

- [x] Thiết kế & xây dựng backend Report API (4 endpoints: summary, revenue, bed-occupancy, outpatient-visits)
- [x] Xây dựng Screen 3.1 – Dashboard Doanh thu tài chính (bar chart theo ngày + line chart 12 tháng, lọc theo khoa)
- [x] Xây dựng Screen 3.2 – Dashboard Báo cáo vận hành (pie chart công suất giường + data table + line chart lượt khám ngoại trú)
- [x] Phát hiện và sửa lỗi timezone ở frontend (`toDateStr` dùng `toISOString()` UTC thay vì local date)
- [x] Phát hiện và sửa lỗi backend: `endDate` không inclusive cả ngày cuối trong `ReportQuery.GetRevenueAsync` / `GetOutpatientVisitsAsync`
- [x] Refactor: tách `StatisticsReportPage.tsx` (gộp) thành 2 trang riêng + shared components (`BarChart`, `LineChart`, `PieChart`, `KpiCard`, `ReportFilterBar`, `reportUtils.ts`)
- [x] Đối chiếu `checkfile.md` (đặc tả 4 thành viên) với code hiện có để xác định các Screen Admin còn thiếu
- [x] Hoàn thiện Screen 1.1 (TV4-F1) – Quản lý Hồ sơ Nhân sự (`StaffManagementPage.tsx`)
- [x] Hoàn thiện Screen 2.1 (TV4-F2) – Cảnh báo Tương tác Thuốc / CDSS (`DrugInteractionPage.tsx`)
- [x] Hoàn thiện Screen 4.1 (TV4-F4) – User Management Console (`UserManagementPage.tsx`)
- [x] Mở rộng `userApi`, thêm `drugApi`/`drugInteractionApi`/`cdssApi` trong `services.ts`
- [x] Tái cấu trúc Header: gom các trang Admin vào dropdown "Quản trị"
- [x] Kiểm thử end-to-end bằng Playwright (đăng nhập thật, chụp screenshot, kiểm tra console error = 0)
- [x] Seed dữ liệu test (4 khoa, 6 bệnh nhân, 24 giường, 15 invoice, 58 lượt khám) rồi dọn dẹp sau khi verify

## Thay đổi chi tiết

| STT | Nội dung thay đổi | Người thực hiện | File/Module liên quan | Minh chứng |
|---:|---|---|---|---|
| 1 | Thêm `ReportDtos.cs`, `IReportQuery`, `ReportQuery` (LINQ projection, AsNoTracking, GroupBy server-side cho bed-occupancy) | DE180522 | `Mediconnect.Application/DTOs/ReportDtos.cs`; `Mediconnect.Application/Interfaces/IReportQuery.cs`; `Mediconnect.Infrastructure/Repositories/ReportQuery.cs` | dotnet build: 0 error |
| 2 | Thêm `ReportsController` (4 endpoint, validate period/groupBy, trả 400 khi sai) | DE180522 | `src/mediconnect/Controllers/ReportsController.cs` | API test PowerShell: 4/4 HTTP 200 |
| 3 | Đăng ký `IReportQuery` trong DI container | DE180522 | `Mediconnect.Infrastructure/DependencyInjection.cs` | — |
| 4 | Tạo `RevenueDashboardPage.tsx` (Screen 3.1): bar chart theo ngày, line chart trend 12 tháng, panel "By Department", filter Today/This Month/Last 30/YTD/Custom + Department, export CSV | DE180522 | `src/mediconnect-web/src/pages/RevenueDashboardPage.tsx` | Playwright screenshot `screen31_revenue.png` |
| 5 | Tạo `OperationsReportPage.tsx` (Screen 3.2): pie chart Occupied/Available, data table breakdown theo khoa, line chart outpatient visits | DE180522 | `src/mediconnect-web/src/pages/OperationsReportPage.tsx` | Playwright screenshot `screen32_operations.png` |
| 6 | Tạo shared chart components SVG (không dùng lib ngoài) | DE180522 | `src/mediconnect-web/src/components/charts/{BarChart,LineChart,PieChart}.tsx` | — |
| 7 | Tạo shared UI components + utils (period/date-range/CSV export) | DE180522 | `src/mediconnect-web/src/components/reports/{KpiCard,Skeleton,ReportFilterBar}.tsx`; `src/mediconnect-web/src/utils/reportUtils.ts` | — |
| 8 | Fix bug timezone: `toDateStr` dùng `getFullYear/getMonth/getDate()` thay `toISOString()` | DE180522 | `reportUtils.ts` | Trước fix: `startDate=2026-05-31` (sai 1 ngày ở UTC+7); sau fix: `2026-06-01` (đúng) |
| 9 | Fix bug backend: `endDate` inclusive cả ngày (`.Date.AddDays(1).AddTicks(-1)`) trong `GetRevenueAsync` và `GetOutpatientVisitsAsync` | DE180522 | `Mediconnect.Infrastructure/Repositories/ReportQuery.cs` | Custom range Jun5-9: trước fix thiếu data Jun 9 ($120M/4 bars), sau fix đủ ($183M/5 bars) |
| 10 | Xóa `StatisticsReportPage.tsx` (gộp) sau khi tách thành 2 trang riêng | DE180522 | route `/reports` redirect sang `/reports/revenue` | — |
| 11 | Thêm types `Drug`, `DrugInteraction`; mở rộng `userApi` (create/update/delete/updateStatus/updateRole); thêm `drugApi`, `drugInteractionApi`, `cdssApi` | DE180522 | `src/mediconnect-web/src/types/index.ts`; `src/mediconnect-web/src/api/services.ts` | tsc --noEmit: 0 errors |
| 12 | Tạo `StaffManagementPage.tsx` (Screen 1.1 TV4): CRUD hồ sơ nhân sự, chỉ cho gán user role Doctor/Nurse chưa có hồ sơ | DE180522 | `src/mediconnect-web/src/pages/StaffManagementPage.tsx` | Playwright screenshot `admin_staff.png` |
| 13 | Tạo `DrugInteractionPage.tsx` (Screen 2.1 TV4): tab Kiểm tra tương tác (popup đỏ khi phát hiện), Danh mục thuốc, Cặp tương tác | DE180522 | `src/mediconnect-web/src/pages/DrugInteractionPage.tsx` | Playwright screenshot `cdss_check_fixed.png` – phát hiện đúng 1 cặp Warfarin↔Aspirin |
| 14 | Tạo `UserManagementPage.tsx` (Screen 4.1 TV4): KPI, search/filter, đổi role inline, khóa/mở khóa, CRUD tài khoản | DE180522 | `src/mediconnect-web/src/pages/UserManagementPage.tsx` | Playwright: tạo/khóa/đổi role/xóa đều verify qua API backend persist đúng |
| 15 | Cập nhật `Header.tsx`: dropdown "Quản trị" gom 4 link admin, bổ sung mobile menu thiếu Doanh thu/Vận hành | DE180522 | `src/mediconnect-web/src/components/layout/Header.tsx` | — |
| 16 | Cập nhật `App.tsx`: thêm route `/reports/revenue`, `/reports/operations`, `/admin/staff`, `/admin/users`, `/admin/drug-interactions` (RoleProtectedRoute Admin) | DE180522 | `src/mediconnect-web/src/App.tsx` | — |
| 17 | Bổ sung color token thiếu trong Tailwind v4 theme (`error-container`, `tertiary-container`, `surface-container-lowest`,...) | DE180522 | `src/mediconnect-web/src/index.css` | — |

## AI có hỗ trợ không?

- [x] Có
- [ ] Không

Nếu có, mô tả AI đã hỗ trợ phần nào:

```text
AI (Claude Code) hỗ trợ:
- Đọc base-html (hospital_analytics_reports.html) để xác định layout cần dựng cho Screen 3.1/3.2.
- Thiết kế và sinh toàn bộ backend Report module (DTO, IReportQuery, ReportQuery với LINQ projection
  tối ưu, ReportsController với validation 400).
- Sinh code 2 trang dashboard (Revenue/Operations) + 3 component chart SVG tự viết (Bar/Line/Pie,
  không phụ thuộc thư viện ngoài) + shared utils/components để tránh trùng code.
- Tự phát hiện 2 bug qua kiểm thử Playwright thực tế (không phải đọc code suy luận):
  (1) bug timezone frontend khi tính date-range cho "This Month" ở UTC+7,
  (2) bug backend bỏ sót dữ liệu ngày cuối cùng trong custom date range.
- Đọc checkfile.md (đặc tả đầy đủ 4 thành viên), đối chiếu với codebase hiện có (Controllers,
  Pages, routes) để liệt kê chính xác Screen nào đã có / nửa vời / chưa có cho vai trò Admin.
- Sinh toàn bộ 3 trang Admin còn thiếu (Staff Management, Drug Interaction CDSS, User Management
  Console) dựa trên các API/DTO backend đã có sẵn (không cần sửa backend).
- Tự seed dữ liệu test qua API (không sửa trực tiếp DB) để kiểm thử CDSS warning thực tế, sau đó
  tự dọn dẹp dữ liệu test sau khi verify xong.
- Toàn bộ kiểm thử qua Playwright thật (đăng nhập, click, screenshot, kiểm tra console error),
  không chỉ đọc code suy luận.
```

## Commit/Screenshot minh chứng

```text
Branch: feature/de180522-statisticalreport (chưa commit tại thời điểm ghi log)
Files mới: ReportDtos.cs, IReportQuery.cs, ReportQuery.cs, ReportsController.cs,
  RevenueDashboardPage.tsx, OperationsReportPage.tsx, StaffManagementPage.tsx,
  UserManagementPage.tsx, DrugInteractionPage.tsx, components/charts/*, components/reports/*,
  utils/reportUtils.ts
tsc --noEmit: 0 errors (toàn bộ frontend)
dotnet build: 0 Error(s), 0 Warning(s)
Playwright headless test: report_loaded.png, report_today.png, report_dept.png, report_v2.png,
  screen31_revenue.png, screen32_operations.png, admin_users.png, admin_staff.png,
  cdss_check_fixed.png — console errors: NONE trên tất cả trang
```

## Ghi chú

```text
- Backend cho 3 trang Admin (StaffController, UsersController, DrugsController,
  DrugInteractionsController, CdssController) đã tồn tại từ trước — chỉ cần xây frontend.
- 2 Screen còn thiếu tại thời điểm phase này: Banner cảnh báo quá liều (2.2 TV4-F2) và
  Cấu hình/bảo mật OTP (4.2 TV4-F4) — đã được hoàn thiện ở [Phase 08].
- Service endpoint `/api/druginteractions`, `/api/drugs` dùng chung `CrudController<T>` generic,
  route tự sinh từ tên class (`[Route("api/[controller]")]`), ASP.NET routing case-insensitive
  nên gọi `/api/druginteractions` (chữ thường) từ frontend vẫn khớp.
```

---

# [Phase 09] Thành viên 4: Gửi OTP thật qua Email (SMTP)

## Ngày thực hiện

```text
01/07/2026
```

## Đã hoàn thành

- [x] Tích hợp gửi OTP qua email thật bằng SMTP (dùng chung Gmail App Password & SendGrid)
- [x] Che mã OTP khi đã gửi thật; tự fallback về mô phỏng khi lỗi/chưa cấu hình
- [x] Migration cho cột `OtpCode.Delivered`
- [x] Kiểm chứng đường SMTP thật (thử host giả → fallback êm) + fallback mô phỏng (15/15 pass)

## Thay đổi chi tiết

| STT | Nội dung thay đổi | File/Module liên quan | Minh chứng |
|---:|---|---|---|
| 1 | Thêm package MailKit 4.17 vào Infrastructure | `Mediconnect.Infrastructure.csproj` | restore OK |
| 2 | `IOtpSender` + `OtpSendResult` (không throw khi lỗi transport) | `IOtpSender.cs` | — |
| 3 | `SmtpOtpSender` gửi email qua SMTP (587 STARTTLS / 465 SSL), bắt lỗi → fallback | `SmtpOtpSender.cs`, `OtpEmailOptions.cs` | test: "No such host is known" → delivered=false |
| 4 | Bind `OtpEmail` config + đăng ký `IOtpSender` trong DI | `DependencyInjection.cs`, `appsettings.json` | — |
| 5 | Cột `OtpCode.Delivered` (true = gửi thật) | `OtpCode.cs`, migration 20260701090510 | — |
| 6 | `OtpController.Issue` gọi gửi thật; che mã (`••••`) khi delivered; `GetSettings` trả `EmailConfigured` | `OtpController.cs`, `OtpDtos.cs` | test: emailConfigured=true |
| 7 | Frontend: banner theo `emailConfigured`, ẩn mã khi gửi thật, log che mã | `OtpSecurityPage.tsx`, `types/index.ts`, `services.ts` | — |

## AI có hỗ trợ không?

- [x] Có

Nếu có, mô tả AI đã hỗ trợ phần nào:

```text
Claude (Claude Code) thiết kế abstraction IOtpSender + SmtpOtpSender dùng chung cho Gmail
App Password và SendGrid (cùng chuẩn SMTP), tích hợp vào luồng issue với cơ chế che mã khi
gửi thật và fallback mô phỏng khi lỗi; tự chạy migration và kiểm chứng cả 2 đường (thật/mô
phỏng) bằng Playwright trước khi báo hoàn thành.
```

## Commit/Screenshot minh chứng

```text
- Test đường SMTP thật: C:/tmp/pwtest/test_smtp_path.mjs — emailConfigured=true, MailKit thử
  kết nối thật (lỗi DNS "No such host is known"), fallback delivered=false, verify vẫn OK.
- Test tổng: C:/tmp/pwtest/test_new_screens.mjs — 15/15 PASS.
- Migration: src/Mediconnect.Infrastructure/Migrations/20260701090510_AddOtpDeliveredFlag.cs
```

## Ghi chú

```text
- Credential SMTP đặt trong appsettings.Development.json (đã gitignore) — KHÔNG commit lên git.
- Gmail: smtp.gmail.com:587, Username=<gmail>, Password=<App Password 16 ký tự>.
  SendGrid: smtp.sendgrid.net:587, Username=apikey, Password=<API key>.
- Mã OTP sinh bằng RandomNumberGenerator (crypto-random). Khi gửi thật, mã được che khỏi
  giao diện và nhật ký (chỉ mô phỏng mới lộ mã để demo).
- SMS chưa hỗ trợ (chưa có gateway) → tự về mô phỏng.
```

---

# [Phase 08] Thành viên 4: Hoàn thiện 2 Screen CDSS & OTP còn thiếu

## Ngày thực hiện

```text
01/07/2026
```

## Đã hoàn thành

- [x] Screen 2.2 (TV4-F2) – Banner cảnh báo quá liều
- [x] Screen 4.2 (TV4-F4) – Cấu hình & bảo mật OTP
- [x] EF migration cho cột liều thuốc + bảng OTP
- [x] Kiểm thử end-to-end bằng Playwright (15/15 pass)

## Thay đổi chi tiết

| STT | Nội dung thay đổi | File/Module liên quan | Minh chứng |
|---:|---|---|---|
| 1 | Thêm cột `MaxDailyDose`, `MaxDosePerKg` (decimal? 18,3) vào Drug | `Drug.cs`, `AppDbContext.cs`, `EntityDtos.cs` | migration 20260701082055 |
| 2 | Implement thật `CdssController.DoseCheck`: so liều nhập với ngưỡng theo cân nặng (ưu tiên) hoặc ngưỡng tuyệt đối; trả về thông điệp + số liệu | `CdssController.cs`, `CdssDtos.cs` | test PASS: liều 5000 > 4000 → overdose |
| 3 | Thêm `GET /api/patients` để đổ danh sách bệnh nhân cho bộ chọn dose-check | `PatientsController.cs` | test PASS: count 6 |
| 4 | Tab "Cảnh báo quá liều" trong trang CDSS: chọn BN + thuốc + liều → banner đỏ nhấp nháy khi quá liều | `DrugInteractionPage.tsx`, `index.css` (keyframe pulse-slow) | `new_dose_overdose.png` |
| 5 | 2 field ngưỡng liều trong modal thêm/sửa thuốc | `DrugInteractionPage.tsx` | — |
| 6 | Entity `OtpSetting` (chính sách) + `OtpCode` (mã đã phát), enum `OtpChannel`/`OtpStatus` | `OtpSetting.cs`, `OtpCode.cs`, `Enums.cs`, `AppDbContext.cs` | migration 20260701082055 |
| 7 | `OtpController`: GET/PUT settings, POST issue (sinh mã ngẫu nhiên bảo mật), POST verify (đếm số lần thử, hết hạn, kích hoạt `VerifiedAt`), GET codes (nhật ký) | `OtpController.cs`, `OtpDtos.cs` | test PASS: issue/verify + set VerifiedAt |
| 8 | Trang "Cấu hình & Bảo mật OTP": panel cấu hình + workflow issue/verify + bảng nhật ký OTP | `OtpSecurityPage.tsx`, `App.tsx`, `Header.tsx` | `new_otp.png` |

## AI có hỗ trợ không?

- [x] Có

Nếu có, mô tả AI đã hỗ trợ phần nào:

```text
Claude (Claude Code) đọc checkfile.md, đối chiếu source để xác định đúng 2 screen còn
thiếu của Thành viên 4 (2.2, 4.2), sau đó sinh toàn bộ backend (entity, DTO, controller,
migration) và frontend (tab dose-check, trang OTP), tự chạy EF migration lên SQL Server
và kiểm thử end-to-end bằng Playwright (15/15 pass) trước khi báo hoàn thành.
```

## Commit/Screenshot minh chứng

```text
- Screenshot: C:/tmp/pwtest/new_dose_overdose.png (banner quá liều đỏ),
  C:/tmp/pwtest/new_otp.png (cấu hình + issue/verify + nhật ký OTP)
- Test: C:/tmp/pwtest/test_new_screens.mjs — 15/15 PASS, console errors: NONE
- Migration: src/Mediconnect.Infrastructure/Migrations/20260701082055_AddDoseThresholdsAndOtp.cs
```

## Ghi chú

```text
- Gửi OTP ban đầu MÔ PHỎNG (mã hiển thị trong console để demo) — đã nâng cấp thành gửi
  email thật qua SMTP ở [Phase 09] (fallback mô phỏng khi chưa cấu hình).
- Migration chỉ mang tính bổ sung (2 cột nullable + 2 bảng mới), không đụng dữ liệu cũ.
- Mã OTP sinh bằng RandomNumberGenerator (crypto-random), không dùng Random thường.
```

---

# [Phase 06] Hoàn thiện báo cáo và demo

## Ngày thực hiện

```text
DD/MM/YYYY
```

## Đã hoàn thành

- [ ] Hoàn thiện source code
- [ ] Hoàn thiện README.md
- [ ] Hoàn thiện report
- [ ] Hoàn thiện slide
- [ ] Hoàn thiện video demo
- [ ] Kiểm tra lại `AI_AUDIT_LOG.md`
- [ ] Kiểm tra lại `PROMPTS.md`
- [ ] Hoàn thiện `REFLECTION.md`
- [ ] Kiểm tra lại `CHANGELOG.md`
- [ ] Đóng gói bài nộp

## Thay đổi chi tiết

| STT | Nội dung thay đổi | Người thực hiện | File/Module liên quan | Minh chứng |
|---:|---|---|---|---|
| 1 |  |  |  |  |
| 2 |  |  |  |  |
| 3 |  |  |  |  |

## AI có hỗ trợ không?

- [ ] Có
- [ ] Không

Nếu có, mô tả AI đã hỗ trợ phần nào:

```text
Viết tại đây...
```

## Commit/Screenshot minh chứng

```text
Dán link commit, screenshot hoặc mô tả minh chứng tại đây...
```

## Ghi chú

```text
Viết tại đây...
```

---

# 4. Tổng kết thay đổi cuối project

## 4.1. Các chức năng đã hoàn thành

| STT | Chức năng | Trạng thái | Minh chứng | Ghi chú |
|---:|---|---|---|---|
| 1 | Authentication (JWT): đăng ký, đăng nhập | Completed | `AuthController.cs`, `LoginPage.tsx` | Token lưu localStorage |
| 2 | Booking flow: chọn chuyên khoa → bác sĩ → ngày giờ → xác nhận | Completed | `BookingPage.tsx`, `AppointmentsPage.tsx` | DE180526 |
| 3 | Smart Queue: check-in, xếp hàng theo phòng khám | Completed | `SmartQueueController.cs`, `QueueService.cs` | DE180526 |
| 4 | Bed Management: bản đồ giường, lịch sử phân bổ, chuyển khoa | Completed | `EntityControllers.cs` | Park Jea Minh |
| 5 | HR & Staff Schedule Management: CRUD lịch trực, business rules | Completed | `ScheduleController.cs`, `StaffScheduleService.cs` | DE180522 |
| 6 | Staff Directory API: danh sách nhân viên với tên, email, khoa | Completed | `StaffController.GetDirectory`, `StaffScheduleQuery.GetStaffDirectoryAsync` | DE180522 |
| 7 | Gantt chart tuần (staff × date, clickable shift blocks) | Completed | `ScheduleManagementPage.tsx` – Week view | DE180522 |
| 8 | Gantt chart ngày (24h timeline, shift bars định vị theo giờ thực) | Completed | `ScheduleManagementPage.tsx` – Day view | DE180522 |
| 9 | KPI stats bar (tổng nhân viên, đang trực, ca tuần, tỷ lệ phủ) | Completed | `ScheduleManagementPage.tsx` – KPI section | DE180522 |
| 10 | Staff Profiles Grid (card trạng thái Đang trực/Nghỉ, liên kết Xem lịch trực) | Completed | `ScheduleManagementPage.tsx` – Staff section | DE180522 |
| 11 | Report API: summary, revenue (theo ngày/tháng + lọc khoa), bed-occupancy, outpatient-visits | Completed | `ReportsController.cs`, `ReportQuery.cs` | DE180522 |
| 12 | Screen 3.1 – Dashboard Doanh thu tài chính (bar + line chart, lọc khoa, export CSV) | Completed | `RevenueDashboardPage.tsx` | DE180522 |
| 13 | Screen 3.2 – Dashboard Báo cáo vận hành (pie chart, data table, line chart outpatient) | Completed | `OperationsReportPage.tsx` | DE180522 |
| 14 | Screen 1.1 (TV4) – Quản lý Hồ sơ Nhân sự (CRUD chuyên khoa/kinh nghiệm/học vị) | Completed | `StaffManagementPage.tsx` | DE180522 |
| 15 | Screen 2.1 (TV4) – Cảnh báo Tương tác Thuốc CDSS (check + CRUD Drug/DrugInteraction) | Completed | `DrugInteractionPage.tsx` | DE180522 |
| 16 | Screen 4.1 (TV4) – User Management Console (đổi role, khóa/mở khóa, CRUD tài khoản) | Completed | `UserManagementPage.tsx` | DE180522 |
| 17 | Screen 2.2 (TV4-F2) – Banner cảnh báo quá liều (dose-check theo cân nặng, banner đỏ nhấp nháy) | Completed | `CdssController.DoseCheck`, `DrugInteractionPage.tsx` (tab "Cảnh báo quá liều") | DE180522 |
| 18 | Screen 4.2 (TV4-F4) – Cấu hình & bảo mật OTP (chính sách OTP + issue/verify kích hoạt tài khoản) | Completed | `OtpController.cs`, `OtpSecurityPage.tsx` | DE180522 – gửi Email/SMS mô phỏng |

---

## 4.2. Các chức năng chưa hoàn thành

| STT | Chức năng | Lý do chưa hoàn thành | Hướng cải thiện |
|---:|---|---|---|
| 1 | Gửi OTP qua SMS thật (Screen 4.2) | Đã tích hợp gửi OTP qua **Email thật** (SMTP: Gmail App Password / SendGrid) ở [Phase 09]; riêng kênh SMS chưa có gateway nên tự về mô phỏng | Tích hợp SMS gateway (vd: Twilio) cho `SmtpOtpSender` hoặc thêm `SmsOtpSender` |
| 2 | Ngưỡng liều mặc định theo dược điển (Screen 2.2) | Ngưỡng `MaxDailyDose`/`MaxDosePerKg` hiện do admin nhập thủ công cho từng thuốc | Nạp sẵn ngưỡng liều chuẩn theo dược điển/khuyến cáo lâm sàng |
| 3 |  |  |  |

---

## 4.3. Tổng hợp AI hỗ trợ trong project

| Hạng mục | AI có hỗ trợ không? | Mức độ hỗ trợ | Ghi chú |
|---|---|---|---|
| Requirement | Có | Ít | Hỗ trợ phân tích yêu cầu từ base-html design |
| Design | Có | Trung bình | Đề xuất flat projection pattern, CQRS lite interface |
| Database | Có | Nhiều | Scaffold entities, migrations, DbContext, seed data |
| Coding | Có | Nhiều | StaffScheduleService, StaffScheduleQuery, ScheduleController, toàn bộ frontend Gantt |
| Debug | Có | Nhiều | Phát hiện và fix 5 bugs (React.FormEvent, connection string, DTO rename, ...) |
| Testing | Có | Nhiều | Smoke test PowerShell + Playwright headless thực (login thật, click, screenshot) cho toàn bộ Report dashboard và 3 trang Admin; tự phát hiện 2 bug timezone qua test thực tế |
| Report | Có | Trung bình | Hỗ trợ điền CHANGELOG, README, AI_AUDIT_LOG, PROMPTS |
| Presentation | Không | — | — |

---

## 4.4. Bài học rút ra

```text
Viết tại đây...
```

---

## 4.5. Hướng cải thiện tiếp theo

```text
Viết tại đây...
```

---

# 5. Cam kết cập nhật Changelog

Sinh viên/nhóm cam kết rằng nội dung changelog phản ánh đúng các thay đổi đã thực hiện trong quá trình làm bài tập/project.

| Đại diện sinh viên/nhóm | Ngày xác nhận |
|---|---|
|  |  |
