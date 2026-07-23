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

| Thông tin             | Nội dung                                                                             |
| --------------------- | ------------------------------------------------------------------------------------ |
| Môn học               | Building Cross-Platform Back-End Application with .NET                               |
| Mã môn học            | PRN232                                                                               |
| Lớp                   | SE18D05                                                                              |
| Học kỳ                | SU26                                                                                 |
| Tên bài tập / Project | MEDICONNECT – Hệ thống Quản lý Bệnh viện Thông minh                                  |
| Tên sinh viên / Nhóm  | Nhóm 3                                                                               |
| MSSV / Danh sách MSSV | DE180522, DE180526, DE190580, DE190123                                               |
| Giảng viên hướng dẫn  |                                                                                      |
| Repository URL        | https://github.com/fptu-se-su26/prn232-su26-ai-audit-project-prn232_se18d05_group-03 |
| Ngày bắt đầu          | 17/05/2026                                                                           |
| Ngày hoàn thành       | Đang thực hiện                                                                       |

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

| STT | Nội dung thay đổi                                                                   | Người thực hiện | File/Module liên quan                                    | Minh chứng |
| --: | ----------------------------------------------------------------------------------- | --------------- | -------------------------------------------------------- | ---------- |
|   1 | Ghi nhận prompt ve phan chia thanh vien, nhac quy trinh audit, va dinh huong models |                 | docs/PROMPTS.md; docs/AI_AUDIT_LOG.md; docs/CHANGELOG.md |            |
|   2 | Ghi nhan yeu cau thiet ke models code-first cho .NET SQL Server                     |                 | docs/PROMPTS.md; docs/AI_AUDIT_LOG.md; docs/CHANGELOG.md |            |
|   3 | Tao project .NET Web API mediconnect va them cau hinh code-first co ban             |                 | src/mediconnect                                          |            |
|   4 | Tao file solution cho du an mediconnect                                             |                 | mediconnect.sln                                          |            |

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
| --: | ----------------- | --------------- | --------------------- | ---------- |
|   1 |                   |                 |                       |            |
|   2 |                   |                 |                       |            |
|   3 |                   |                 |                       |            |

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

| STT | Nội dung thay đổi                                                                                                                        | Người thực hiện | File/Module liên quan                          | Minh chứng     |
| --: | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------------------------------------------- | -------------- |
|   1 | Thiết kế entity StaffSchedule với các field: StaffId, ShiftDate, ShiftType, StartTime, EndTime, WorkRoom                                 | DE180522        | `Mediconnect.Domain/Entities/StaffSchedule.cs` | commit 912b0cf |
|   2 | Thiết kế enum ShiftType (Morning/Afternoon/Evening), StaffType (Doctor/Nurse/Admin/Caregiver)                                            | DE180522        | `Mediconnect.Domain/Entities/Enums.cs`         | commit 912b0cf |
|   3 | Thiết kế interface IStaffScheduleService (create/update/delete với validation), IStaffScheduleQuery (flat read, paged filter, directory) | DE180522        | `Mediconnect.Application/Interfaces/`          | commit 912b0cf |
|   4 | Thiết kế DTO phẳng ScheduleFlatReadDto (join StaffProfile + UserAccount + Department)                                                    | DE180522        | `Mediconnect.Application/DTOs/ScheduleDtos.cs` | commit 912b0cf |
|   5 | Thiết kế giao diện Gantt chart (staff rows × date columns) theo base-html                                                                | DE180522        | `base-html/hr_shift_scheduling_matrix.html`    | —              |

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
| 8 | Tạo modular controllers: ClinicDashboardController & ClinicManagementController | DE190123 | src/mediconnect/Modules/SmartClinic | Build 0 errors |
| 9 | Thiết kế giao diện ClinicDashboardPage & ManageServicesPage | DE190123 | src/mediconnect-web/src/pages | npm run build success |
| 10 | Sửa đổi logic LoginPage, AuthContext, App.tsx, Header.tsx để phân quyền chuyển hướng | DE190123 | src/mediconnect-web/src | Đăng nhập điều hướng theo role |
| 11 | Thêm types PHR vào types/index.ts: enum VisitStatus, LabOrderStatus, Gender + 7 interface mới | DE180526 | src/mediconnect-web/src/types/index.ts | chưa commit |
| 12 | Thêm patientApi.getHistory và phrApi (4 methods) vào services.ts | DE180526 | src/mediconnect-web/src/api/services.ts | chưa commit |
| 13 | Tạo PHRPage.tsx — giao diện Hồ sơ sức khỏe 3 tab, 7 API calls song song, enrichment client-side | DE180526 | src/mediconnect-web/src/pages/PHRPage.tsx | chưa commit |
| 14 | Thêm route /health-records (Patient only) vào App.tsx | DE180526 | src/mediconnect-web/src/App.tsx | chưa commit |
| 15 | Thêm BillingService, IBillingService, BillingDtos - gom phí khám/xét nghiệm/thuốc thành phiếu thu, tính khấu trừ BHYT | DE180526 | src/Mediconnect.Application/Services/BillingService.cs; Interfaces/IBillingService.cs; DTOs/BillingDtos.cs | 8181dd8 |
| 16 | Thêm endpoint POST /api/billing-invoices/generate, sửa lại /calculate-insurance dùng BillingService | DE180526 | src/mediconnect/Controllers/EntityControllers.cs; Program.cs | 8181dd8 |
| 17 | Fix bug BillingService: bỏ Update() thừa sau AddAsync (EF Core hiểu nhầm Added thành Modified, gây DbUpdateConcurrencyException khi generate invoice) | DE180526 | src/Mediconnect.Application/Services/BillingService.cs | Phát hiện khi test API thật qua curl |
| 18 | Thêm entity ServiceRating + migration AddServiceRating - Feature 4 đánh giá dịch vụ | DE180526 | src/Mediconnect.Domain/Entities/ServiceRating.cs; src/Mediconnect.Infrastructure/Migrations/20260702005148_AddServiceRating.cs | dotnet ef database update thành công |
| 19 | Thêm ServiceRatingsController (CRUD + GET doctor rating summary) | DE180526 | src/mediconnect/Controllers/EntityControllers.cs | Test qua curl: tạo rating 201, điểm sai 400, summary đúng |
| 20 | Thêm IPaymentGatewayService, VnPaySettings, MomoSettings - sinh link thanh toán VNPay/Momo và xác thực callback | DE180526 | src/Mediconnect.Infrastructure/Payments/ | Test qua curl: sinh link, giả lập callback hợp lệ/không hợp lệ |
| 21 | Thêm endpoint POST /api/payments/{id}/vnpay-url, /momo-url, GET /vnpay-return vào PaymentsController | DE180526 | src/mediconnect/Controllers/EntityControllers.cs; appsettings.json | Payment chuyển Paid sau callback hợp lệ, bị từ chối nếu chữ ký sai |

| STT | Nội dung thay đổi                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Người thực hiện | File/Module liên quan                                                                                                                                                                                  | Minh chứng                                                                            |
| --: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
|   1 | Tao DbContext va bo Models cho HIS & Telemedicine                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |                 | src/mediconnect/Models; src/mediconnect/Data                                                                                                                                                           |                                                                                       |
|   2 | Them EF Core packages va connection string SQL Server                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |                 | src/mediconnect/mediconnect.csproj; src/mediconnect/appsettings.json; src/mediconnect/Program.cs                                                                                                       |                                                                                       |
|   3 | Cap nhat README huong dan chay project                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |                 | README.md                                                                                                                                                                                              |                                                                                       |
|   4 | Them endpoints GET /api/beds/map, GET /api/inpatient-admissions/{id}/bed-assignments, POST /api/inpatient-admissions/{id}/transfer                                                                                                                                                                                                                                                                                                                                                                                                                                 | Park Jea Minh   | src/mediconnect/Controllers/EntityControllers.cs                                                                                                                                                       | feat(member3): F1 - bed map & transfer                                                |
|   5 | Them DTOs BedMapGroupDto, TransferAdmissionDto                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Park Jea Minh   | src/Mediconnect.Application/DTOs/EntityDtos.cs                                                                                                                                                         | feat(member3): F1 - bed map & transfer                                                |
|   6 | Them endpoints GET /api/inpatient-admissions/{id}/vital-signs (loc theo ?date), GET /api/inpatient-admissions/{id}/care-orders (loc theo ?orderType, ?pending) cho Y lenh & cham soc hang ngay                                                                                                                                                                                                                                                                                                                                                                     | Park Jea Minh   | src/mediconnect/Controllers/EntityControllers.cs                                                                                                                                                       | feat(member3): F2 - admission-scoped vital signs & care orders endpoints              |
|   7 | F3 Can lam sang: them GET /api/lab-orders/filter (theo status/bac si), PATCH /api/lab-orders/{id}/status, POST/GET /api/lab-orders/{id}/result, va luu file that (PDF/JPG/PNG) o POST /api/lab-results/{id}/file + bat UseStaticFiles                                                                                                                                                                                                                                                                                                                              | Park Jea Minh   | src/mediconnect/Controllers/EntityControllers.cs; src/mediconnect/Program.cs                                                                                                                           | feat(member3): F3 - lab orders queue, results & file upload                           |
|   8 | F4 Xuat vien: nang cap POST /api/inpatient-admissions/{id}/discharge - tong hop tien giuong + thuoc + thu thuat thanh BillingInvoice (Pending) gui sang Thanh toan, tra ra DischargeResultDto                                                                                                                                                                                                                                                                                                                                                                      | Park Jea Minh   | src/mediconnect/Controllers/EntityControllers.cs; src/Mediconnect.Application/DTOs/EntityDtos.cs                                                                                                       | feat(member3): F4 - discharge cost aggregation & billing handoff                      |
|   9 | F1 Dong bo trang thai giuong: gan giuong (POST /api/bedassignments) kiem tra giuong Available roi chuyen Occupied; nha giuong (PATCH /api/bedassignments/{id}/release) chuyen giuong sang Cleaning                                                                                                                                                                                                                                                                                                                                                                 | Park Jea Minh   | src/mediconnect/Controllers/EntityControllers.cs                                                                                                                                                       | feat(member3): F1 - bed status lifecycle on assign/release                            |
|  10 | F1 Chuyen khoa hoan chinh: POST /api/inpatient-admissions/{id}/transfer nha giuong cu (Cleaning), doi khoa va gan giuong moi (Occupied) neu co BedId; them POST /api/inpatient-admissions/admit tao ca nhap vien + gan giuong nguyen tu                                                                                                                                                                                                                                                                                                                            | Park Jea Minh   | src/mediconnect/Controllers/EntityControllers.cs; src/Mediconnect.Application/DTOs/EntityDtos.cs                                                                                                       | feat(member3): F1 - complete ward transfer & atomic admit                             |
|  11 | Phan quyen theo vai tro: Y ta ghi sinh ton, Bac si ra y lenh/chi dinh, Bo phan xet nghiem nhap ket qua/upload file; them vai tro Lab va tai khoan lab mau                                                                                                                                                                                                                                                                                                                                                                                                          | Park Jea Minh   | src/mediconnect/Controllers/EntityControllers.cs; src/mediconnect/Controllers/CrudController.cs; src/Mediconnect.Domain/Entities/Enums.cs; src/Mediconnect.Infrastructure/Persistence/DbInitializer.cs | feat(member3): role-based authorization for inpatient/lab actions                     |
|  12 | Giao dien 4 trang F1-F4 (bed map, vitals/care orders, lab results, discharge) dua vao wwwroot, phuc vu same-origin; them trang dang nhap that + trang chu; API client api.js (JWT + goi endpoint F1-F4)                                                                                                                                                                                                                                                                                                                                                            | Park Jea Minh   | src/mediconnect/wwwroot/\*\*; src/mediconnect/wwwroot/assets/js/api.js                                                                                                                                 | feat(member3): wire inpatient/clinical UI pages to real API                           |
|  13 | Bat JsonStringEnumConverter (enum tra ve dang chuoi cho UI) va UseDefaultFiles phuc vu index.html                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Park Jea Minh   | src/mediconnect/Program.cs                                                                                                                                                                             | feat(member3): serialize enums as strings & serve static UI                           |
|  14 | Thay the UI tinh HTML bang Blazor Server project rieng (src/Mediconnect.Web): TokenState + ApiAuthStateProvider + ApiClient typed HTTP; trang Login, Home, F1 BedMap, F2 Vitals, F3 Lab, F4 Discharge; AuthorizeView an/hien UI theo role                                                                                                                                                                                                                                                                                                                          | Park Jea Minh   | src/Mediconnect.Web/\*\*                                                                                                                                                                               | feat(member3): Blazor Server UI for F1-F4                                             |
|  15 | Them Floor, PositionX, PositionY vao Bed entity + DTO + EF migration AddBedSpatialFields; PATCH /api/beds/{id}/position (Admin); JsonStringEnumConverter tren API; Seed 36 giuong voi toa do cho 2 khoa                                                                                                                                                                                                                                                                                                                                                            | Park Jea Minh   | Bed.cs, EntityDtos.cs, EntityControllers.cs, DbInitializer.cs, Program.cs (API)                                                                                                                        | feat(member3): spatial bed data model + seed                                          |
|  16 | Redesign toan bo UI Blazor: design system CSS (Inter font, brand blue, CSS vars, card/btn/table override); sidebar toi navy voi Material Symbols; F1 ban do san 2D/3D isometric toggle, keo tha via floorplan.js, room outline, drawer chi tiet + doi trang thai + them/xoa giuong (Admin); Home/Login/F2/F3/F4 lam dep hien dai                                                                                                                                                                                                                                   | Park Jea Minh   | app.css, MainLayout, NavMenu, BedMap, Home, Login, Vitals, Lab, Discharge                                                                                                                              | feat(member3): modern UI overhaul – 2D/3D floor plan & full redesign                  |
|  17 | F1 zoom/pan + 2D kieu CAD: nut phong to/thu nho/reset overlay, keo tay di chuyen (floorplan.js initPan + SetPan); phong tuong doi net + to mau theo khu (WardColor palette), hanh lang hatch, title block, legend chip mau khu, nen luoi graph-paper                                                                                                                                                                                                                                                                                                               | Park Jea Minh   | BedMap.razor, BedMap.razor.css, wwwroot/js/floorplan.js                                                                                                                                                | feat(member3): F1 zoom/pan + CAD-style 2D floor plan                                  |
|  18 | F1 ban do 3D that bang Three.js: vendor three@0.160.1 + OrbitControls + import map (khong build step); floorplan3d.js dung scene khoi phong/giuong dun noi + anh sang do bong + orbit/zoom/pan; nap qua Blazor JS isolation, click giuong -> SelectBedFromJs mo drawer, doi trang thai -> updateBed recolor live, DisposeAsync don WebGL                                                                                                                                                                                                                           | Park Jea Minh   | BedMap.razor, App.razor, wwwroot/js/floorplan3d.js, wwwroot/lib/three/\*\*                                                                                                                             | feat(member3): F1 real 3D floor plan with Three.js                                    |
|  19 | F1 floor thuc + drill-down Tang->Phong->Giuong: seed da tang (moi khoa 3 tang, PositionX/Y=NULL) o DbInitializer + seed_hospital.sql; layout engine C# ComputeFloorLayout() tu sinh so do (hanh lang giua, phong 2 ben, tram y ta, thang may) dung chung 2D+3D; 2D overview hien phong (badge so giuong) -> bam phong -> grid giuong -> bam giuong; 3D focusRoom/exitRoom bay camera vao phong; bo editor keo-tha toa do (giu zoom/pan, them/xoa, status, admit, transfer)                                                                                         | Park Jea Minh   | DbInitializer.cs, docs/seed_hospital.sql, BedMap.razor(.css), wwwroot/js/floorplan3d.js, wwwroot/js/floorplan.js                                                                                       | feat(member3): real per-floor layout + room→bed drill-down (2D & 3D)                  |
|  20 | Nang cap 3D realistic: vendor them addon three (RoomEnvironment, RoundedBoxGeometry, CSS2DRenderer, EffectComposer + SSAO/UnrealBloom/OutlinePass/OutputPass + shaders); floorplan3d.js viet lai — ACESFilmic tone mapping + IBL (PMREM/RoomEnvironment), phong khoi bo goc, tuong kinh mo (thay giuong ben trong), giuong chi tiet (khung/nem/chan theo trang thai/goi/dau giuong), nhan HTML CSS2D, SSAO+bloom+outline hover/chon, tu xoay o overview, camera bay vao phong; guard fallback ve render thuong                                                     | Park Jea Minh   | wwwroot/lib/three/addons/\*\*, wwwroot/js/floorplan3d.js                                                                                                                                               | feat(member3): realistic 3D floor plan (IBL + SSAO/bloom + glass rooms)               |
|  21 | Noi that phong 3D thuc te: giuong xep sat tuong ngoai (dau ap tuong, gan nhau, xoay theo huong tuong); rem ngan rieng tu moi giuong (ray + tam vai ban trong suot); thiet bi y te canh giuong (monitor phat sang + gia truyen dich IV + tu dau giuong); buong ve sinh trong goc phong (vach ngan + rem cua + bon cau/lavabo + nhan WC); them chip WC o room-detail 2D                                                                                                                                                                                              | Park Jea Minh   | wwwroot/js/floorplan3d.js, BedMap.razor(.css)                                                                                                                                                          | feat(member3): realistic 3D room interiors (wall-lined beds, curtains, equipment, WC) |
|  22 | Loai phong theo suc chua: seed moi khu 4 phong [6,3,2,1] giuong (DbInitializer + seed_hospital.sql ~864 giuong); RoomTypeName() dat ten theo so giuong (Phong don VIP/doi/3 giuong/thuong); layout 2D chieu rong phong ti le suc chua; hien ten loai o card 2D + room-detail + tag 3D; 3D giuong xep doc HAI tuong trai/phai dau ap tuong chan vao loi di giua, phong lon 3+3; trang tri phong: cua+bang ten, cua so tuong ngoai, den tran + bang ten dau giuong, tham san + cay canh                                                                              | Park Jea Minh   | DbInitializer.cs, docs/seed_hospital.sql, BedMap.razor(.css), wwwroot/js/floorplan3d.js                                                                                                                | feat(member3): room types by capacity + named rooms + ward-style 3D interiors         |
|  23 | Toi uu ti le phong: chieu sau phong theo so giuong moi tuong (14 + 8.5×perWall, neo vao hanh lang — phong don nong, phong 6 giuong sau); giuong 3D phong to (bd cap 6.5, bw cap 5.5) can voi phong; cache-busting ?v cho floorplan3d.js/floorplan.js                                                                                                                                                                                                                                                                                                               | Park Jea Minh   | BedMap.razor, wwwroot/js/floorplan3d.js, App.razor                                                                                                                                                     | fix(member3): proportional room sizing + bigger beds + JS cache busting               |
|  24 | Sua bug Nhap vien 500: InpatientAdmission.PatientId FK toi PatientProfiles nhung UI gui UserAccount.Id (seed SQL tao profile bang NEWID nen 2 Id khong trung -> FK violation). Fix trong endpoint admit (member3): resolve PatientId theo PatientProfile.Id HOAC UserAccountId truoc khi tao admission; profile khong ton tai -> 404 ro rang. Khong doi DTO/route/schema — khong anh huong thanh vien khac. Verify: admit 200 + giuong Occupied, transfer doi khoa (giuong cu Cleaning/moi Occupied), discharge tao invoice + giuong Cleaning, admit tu UI het loi | Park Jea Minh   | src/mediconnect/Controllers/EntityControllers.cs                                                                                                                                                       | fix(member3): resolve patient profile in admit (accept UserAccount.Id)                |
|  25 | Migrate 18 trang React con lai sang Blazor Server: Booking (wizard 4 buoc), Billing (invoice + BHYT + VNPay/Momo), PHR (3 tab), Reviews, Appointments, ClinicDashboard (hang doi live), OutpatientRecord (ICD-10 + ke don), ScheduleManagement (Gantt tuan/ngay), UserManagement/StaffManagement/ManageServices/DrugInteraction/OtpSecurity (Admin CRUD), RevenueDashboard/OperationsReport (chart SVG thuan), EPrescription; them IInpatientQuery (Application+Infrastructure) enrich DTO inpatient (ten BN/giuong thay GUID) | Park Jea Minh | src/Mediconnect.Web/Components/Pages/\*.razor; src/Mediconnect.Web/Components/Shared/\*.razor; Mediconnect.Application/Interfaces/IInpatientQuery.cs; Mediconnect.Infrastructure/Repositories/InpatientQuery.cs | feat(frontend): migrate React SPA pages into Blazor Server (7aba0b3) |
|  26 | Role-gate lai nav + Home dashboard theo dung vai tro (Admin chi con quan tri/thong ke, khong con vao trang van hanh lam sang); bo nhan noi bo F1-F4 khoi UI that; gop chip ten + nut dang xuat thanh dropdown; bo link Trang chu du; fix bug Loi 500 o trang Danh gia bang cach ap 4 migration EF Core (AddStaffScheduleShiftType, AddDoseThresholdsAndOtp, AddOtpDeliveredFlag, AddServiceRating) da co san trong code nhung chua tung chay tren DB dev | Park Jea Minh | src/Mediconnect.Web/Components/Layout/NavMenu.razor, MainLayout.razor; Components/Pages/Home.razor, BedMap.razor, Vitals.razor, Lab.razor, Discharge.razor, Login.razor; Mediconnect.Infrastructure/Migrations/\* | fix(frontend): role-scope nav/home tiles, drop internal F1-F4 labels (5e09d6b) |
| 4 | Tạo SmartQueueDtos, IQueueService, QueueService - Feature 1 smart queue | DE180526  | src/Mediconnect.Application/DTOs/SmartQueueDtos.cs; src/Mediconnect.Application/Interfaces/IQueueService.cs; src/Mediconnect.Application/Services/QueueService.cs |  |
| 5 | Tạo SmartQueueController, enhance ClinicsController & MedicalServicesController | DE180526   | src/mediconnect/Controllers/SmartQueueController.cs; src/mediconnect/Controllers/EntityControllers.cs; src/mediconnect/Program.cs |  |
| 6 | Them endpoints GET /api/beds/map, GET /api/inpatient-admissions/{id}/bed-assignments, POST /api/inpatient-admissions/{id}/transfer | Park Jea Minh | src/mediconnect/Controllers/EntityControllers.cs | feat(member3): F1 - bed map & transfer |
| 7 | Them DTOs BedMapGroupDto, TransferAdmissionDto | Park Jea Minh | src/Mediconnect.Application/DTOs/EntityDtos.cs | feat(member3): F1 - bed map & transfer |
| 8 | Thiết kế backend modular; frontend Clinic Dashboard & Manage Services; sửa lỗi port và session redirect | DE190123 | src/mediconnect/Modules/SmartClinic/*; src/mediconnect-web/src/pages/ClinicDashboardPage.tsx; src/mediconnect-web/src/pages/ManageServicesPage.tsx; src/mediconnect-web/src/context/AuthContext.tsx | feat: Smart Clinic Dashboard & Service Management - MouGlanzuddli |
| 9 | Implement Outpatient Record (doctor) feature and robust diagnose/save flow | DE190123 | mediconnect-web/src/pages/OutpatientRecordPage.tsx; mediconnect-web/src/components/layout/Header.tsx; Mediconnect.Application/Services/MedicalRecordService.cs; mediconnect/Modules/SmartClinic/OutpatientRecordController.cs | feat(outpatient): UI + save flow; added fallback create visit and lab order creation |
| 10 | Tích hợp NLM ClinicalTables API cho tìm kiếm ICD-10 (thay thế `Icd10Catalog` chưa định nghĩa gây build lỗi) | DE190123 | `src/Mediconnect.Application/Services/MedicalRecordService.cs` (`SearchICD10Async`); `src/Mediconnect.Application/Interfaces/IMedicalRecordService.cs`; `src/Mediconnect.Application/DTOs/MedicalRecordDtos.cs` (`ICD10ResultDto`); `src/mediconnect/Modules/SmartClinic/OutpatientRecordController.cs` (`GET icd10/search`); `src/mediconnect/Program.cs` (`AddHttpClient()`); `src/mediconnect-web/src/api/services.ts` (`searchIcd10`); `src/mediconnect-web/src/types/index.ts` (`Icd10Result`) | `472681e feat(outpatient): add ICD-10 diagnosis lookup via NLM API` — URL: `https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?terms={query}&sf=code,name&df=code,name`; parse `root[3]` (displayStrings array) |
| 11 | Sửa lỗi tên bệnh nhân vãng lai bị mất khi điều hướng sang OutpatientRecord (walk-in patient name persistence) | DE190123 | `src/mediconnect-web/src/pages/ClinicDashboardPage.tsx` (navigate với `state: { ticket, clinicId }`); `src/mediconnect-web/src/pages/OutpatientRecordPage.tsx` (`useLocation` + `loc.state?.ticket`); `src/mediconnect-web/src/types/index.ts` (`QueueTicketDetail.patientName`) | `472681e feat(outpatient): fix walk-in patient data persistence` — Root cause: `QueueTicket` entity không có cột `PatientName`; workaround: truyền qua React Router state |
| 12 | Implement Feature 3 – E-Prescription: drug name autocomplete (live pharmacy inventory API via GET /api/drugs, client-side filter), client-side allergy conflict validation (Penicillin / Peanuts / Sulfa Drugs, DEMO_ALLERGIES constant), pharmacy stock filter (GET /api/clinics/active dùng thay Pharmacy entity), "Add to Prescription" disabled khi stock = 0, send flow POST /api/prescriptions + /api/prescriptionitems | DE190123 | `src/mediconnect-web/src/pages/EPrescriptionPanel.tsx`; `src/mediconnect-web/src/pages/EPrescriptionPage.tsx`; `src/mediconnect-web/src/pages/OutpatientRecordPage.tsx`; `src/mediconnect-web/src/api/services.ts` (drugApi, prescriptionApi); `src/mediconnect-web/src/types/index.ts` (DrugResult, ActivePrescriptionItem) | Chưa commit tại thời điểm ghi log — files untracked/modified trên nhánh main |
| 13 | Sidebar UI: nâng cấp E-Prescription từ sub-nav item lên standalone top-level section; visual parity với Outpatient Records (text-on-surface-variant, hover:text-primary, font-medium); thứ tự: Queue → Outpatient Records → E-Prescription → Telemedicine; route /e-prescription với RoleProtectedRoute (Doctor, Nurse) | DE190123 | `src/mediconnect-web/src/components/layout/Header.tsx`; `src/mediconnect-web/src/App.tsx` | Chưa commit tại thời điểm ghi log |

## AI có hỗ trợ không?

- [x] Có
- [ ] Không

Nếu có, mô tả AI đã hỗ trợ phần nào:

```text
AI hỗ trợ scaffold dự án, bo models, DbContext va cấu hình EF Core.
AI sinh code endpoints GET /api/beds/map, GET bed-assignments, POST transfer và các DTO tương ứng.
AI sinh toàn bộ giao diện PHRPage.tsx (Feature 2) với 3 tab + logic enrichment dữ liệu client-side.
Backend API cho Feature 2 đã hoàn thiện từ trước (PatientsController + EntityControllers); session PHR chỉ làm frontend.
AI gợi ý cấu trúc BillingService cho Feature 3 (gom phí + tính BHYT); tự quyết cách map giá xét nghiệm
vì LabOrder không lưu giá sẵn, và bỏ code stub cũ thay vì giữ song song.
AI gợi ý cấu trúc ServiceRating + IPaymentGatewayService cho Feature 4 (đánh giá dịch vụ, thanh toán
VNPay/Momo); test API thật và phát hiện + sửa bug DbUpdateConcurrencyException ở BillingService.
AI ho tro scaffold du an, bo models, DbContext va cau hinh EF Core.
AI ho tro sinh code endpoints GET /api/beds/map (nhom giuong theo trang thai), GET bed-assignments (lich su phan bo giuong), POST transfer (chuyen khoa) va cac DTO tuong ung.
AI ho tro sinh code endpoints F2: GET vital-signs (chi so sinh ton theo ca nhap vien, loc theo ngay) va GET care-orders (y lenh theo loai va trang thai hoan thanh) theo dung pattern nested route.
AI ho tro sinh code F3 (Can lam sang): endpoint tiep nhan chi dinh theo status, nhap ket qua va tu dong hoan thanh order de tra ve bac si, luu file ket qua that (PDF/JPG/PNG) co kiem tra dinh dang va dung luong.
AI ho tro sinh code F4 (Xuat vien): logic tong hop chi phi luu giuong (theo so ngay) + thuoc + thu thuat thanh BillingInvoice trang thai Pending de gui sang phan he Thanh toan, dong thoi giai phong giuong va chuyen trang thai sang Cleaning.
AI ho tro dong bo vong doi trang thai giuong (assign -> Occupied, release/transfer/discharge -> Cleaning) de ban do giuong F1 luon dung, hoan thien luong chuyen khoa co gan giuong dich va endpoint admit nguyen tu, kem validation giuong Available.
AI ho tro them phan quyen theo vai tro (Nurse/Doctor/Lab/Admin) tren cac endpoint nghiep vu F2/F3/F4 va bo sung vai tro Lab + tai khoan mau de kiem thu.
AI ho tro tao toan bo project Blazor Server (src/Mediconnect.Web): cau hinh DI, authentication state provider voi JWT in-memory, HttpClient typed client goi API, va 6 trang Razor (Login, Home, F1-F4) co phan quyen theo role va noi API that.
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
- Claude (claude.ai, 29/06/2026): sinh toàn bộ E-Prescription feature (drug autocomplete, allergy validation,
  stock filter, disabled state) và sidebar promotion lên top-level section (DE190123)
- Claude Code (06/07/2026): migrate 18 trang React còn lại sang Blazor Server (Patient/Clinical/Admin/Report);
  role-gate lại nav + Home dashboard theo đúng vai trò (Admin chỉ còn quản trị/thống kê); tự phát hiện và
  fix bug "Lỗi 500" do 4 migration EF Core chưa từng áp lên DB dev; hỗ trợ git branch/commit split/push
```

## Commit/Screenshot minh chứng

```text
Branch: feature/de180522-HumanResourcesandSchedulingManagement
Commit DE180522: 912b0cf [DE180522] feat: add HR & Staff Schedule Management (Gantt chart)
Commit DE180526: 8c5e747 [DE180526] feat: add React TypeScript frontend and fix backend API integration
Commit DE180526: e74ba55 [DE180526] feat: add smart queue service and clinic/service management endpoints
Commit Park Jea Minh: 9c8929b feat(member3): F1 - bed map, bed-assignments & transfer endpoints
Commit DE190123: 00ea032 feat: Smart Clinic Dashboard & Service Management
Commit DE190123: feat(eprescription): E-Prescription feature + sidebar promotion — chưa commit tại thời điểm ghi log (xem git status: EPrescriptionPanel.tsx, EPrescriptionPage.tsx untracked; Header.tsx, App.tsx, services.ts, types/index.ts, OutpatientRecordPage.tsx modified)
```

## Ghi chú

```text
Frontend (src/mediconnect-web) đã được xóa chủ đích để làm lại — các feature từ Phase 04 trở đi
chỉ còn backend, chưa có giao diện cho Feature 3 và Feature 4.
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

| STT | Lỗi phát hiện | Nguyên nhân | Cách xử lý | Trạng thái             |
| --: | ------------- | ----------- | ---------- | ---------------------- |
|   1 |               |             |            | Open / Fixed / Pending |
|   2 |               |             |            | Open / Fixed / Pending |
|   3 |               |             |            | Open / Fixed / Pending |
|   4 |               |             |            | Open / Fixed / Pending |
|   5 |               |             |            | Open / Fixed / Pending |

## Thay đổi chi tiết

| STT | Nội dung thay đổi | Người thực hiện | File/Module liên quan | Minh chứng |
| --: | ----------------- | --------------- | --------------------- | ---------- |
|   1 |                   |                 |                       |            |
|   2 |                   |                 |                       |            |
|   3 |                   |                 |                       |            |

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
| --: | ----------------- | --------------- | --------------------- | ---------- |
|   1 |                   |                 |                       |            |
|   2 |                   |                 |                       |            |
|   3 |                   |                 |                       |            |

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
| 11 | SmartClinic: backend modularization + Clinic Dashboard & Manage Services (frontend) + port/session fixes | Completed | `Modules/SmartClinic/*`, `ClinicDashboardPage.tsx`, `ManageServicesPage.tsx`, `AuthContext.tsx` | DE190123 |
| 12 | Outpatient Record: doctor UI, diagnose/save flow, auto-create visit/patient, lab orders | Completed | `mediconnect-web/src/pages/OutpatientRecordPage.tsx`, `mediconnect-web/src/components/layout/Header.tsx`, `Mediconnect.Application/Services/MedicalRecordService.cs` | DE190123 |
| 13 | ICD-10 diagnosis lookup via NLM ClinicalTables API (`GET /api/medical-records/icd10/search?query=`): dropdown tìm theo mã (E11) và tên (Hypertension), parse `root[3]` của response 4-element array | Completed | `Mediconnect.Application/Services/MedicalRecordService.cs` (`SearchICD10Async`); `OutpatientRecordController.cs` (`SearchICD10`); `mediconnect-web/src/api/services.ts` (`searchIcd10`); `Program.cs` (`AddHttpClient()`) | DE190123 |
| 14 | Walk-in patient name persistence qua React Router state: `ClinicDashboardPage` navigate với `{ ticket, clinicId }`, `OutpatientRecordPage` đọc từ `useLocation().state.ticket.patientName` | Completed | `mediconnect-web/src/pages/ClinicDashboardPage.tsx` (line 384); `mediconnect-web/src/pages/OutpatientRecordPage.tsx` (lines 66–73, 414) | DE190123 |
| 15 | E-Prescription (Feature 3): drug autocomplete (GET /api/drugs, debounced 250ms, client-side filter), allergy conflict validation (DEMO_ALLERGIES = [Penicillin, Peanuts, Sulfa], client-side), pharmacy stock filter (GET /api/clinics/active), disabled add button khi stock = 0, send flow POST /api/prescriptions + /api/prescriptionitems | Completed | `src/mediconnect-web/src/pages/EPrescriptionPanel.tsx`; `src/mediconnect-web/src/pages/EPrescriptionPage.tsx`; `src/mediconnect-web/src/pages/OutpatientRecordPage.tsx`; `src/mediconnect-web/src/api/services.ts`; `src/mediconnect-web/src/types/index.ts` | DE190123 |
| 16 | Sidebar UI promotion: E-Prescription lên top-level nav section (Link to="/e-prescription"); visual parity với Outpatient Records (text-on-surface-variant, hover:text-primary, font-medium); thứ tự Queue → Outpatient Records → E-Prescription → Telemedicine; route /e-prescription với RoleProtectedRoute (Doctor, Nurse) | Completed | `src/mediconnect-web/src/components/layout/Header.tsx`; `src/mediconnect-web/src/App.tsx` | DE190123 |
| 17 | Report API: summary, revenue (theo ngày/tháng + lọc khoa), bed-occupancy, outpatient-visits | Completed | `ReportsController.cs`, `ReportQuery.cs` | DE180522 |
| 18 | Screen 3.1 – Dashboard Doanh thu tài chính (bar + line chart, lọc khoa, export CSV) | Completed | `RevenueDashboardPage.tsx` | DE180522 |
| 19 | Screen 3.2 – Dashboard Báo cáo vận hành (pie chart, data table, line chart outpatient) | Completed | `OperationsReportPage.tsx` | DE180522 |
| 20 | Screen 1.1 (TV4) – Quản lý Hồ sơ Nhân sự (CRUD chuyên khoa/kinh nghiệm/học vị) | Completed | `StaffManagementPage.tsx` | DE180522 |
| 21 | Screen 2.1 (TV4) – Cảnh báo Tương tác Thuốc CDSS (check + CRUD Drug/DrugInteraction) | Completed | `DrugInteractionPage.tsx` | DE180522 |
| 22 | Screen 4.1 (TV4) – User Management Console (đổi role, khóa/mở khóa, CRUD tài khoản) | Completed | `UserManagementPage.tsx` | DE180522 |
| 23 | Screen 2.2 (TV4-F2) – Banner cảnh báo quá liều (dose-check theo cân nặng, banner đỏ nhấp nháy) | Completed | `CdssController.DoseCheck`, `DrugInteractionPage.tsx` (tab "Cảnh báo quá liều") | DE180522 |
| 24 | Screen 4.2 (TV4-F4) – Cấu hình & bảo mật OTP (chính sách OTP + issue/verify kích hoạt tài khoản) | Completed | `OtpController.cs`, `OtpSecurityPage.tsx` | DE180522 – gửi Email/SMS mô phỏng |
| 25 | Walk-in check-in tạo tài khoản Patient thật (Email/SĐT thật do lễ tân nhập) thay vì chỉ ghi note tên; `QueueTicket` lưu snapshot `PatientId`/`PatientName` để hiển thị đúng tên xuyên suốt hàng đợi (trước đó hiện "Bệnh nhân vãng lai" ở mọi nơi sau khi check-in) | Completed | `QueueTicket.cs`, `QueueService.cs`, `SmartQueueDtos.cs`, `ClinicDashboard.razor`, migration `AddQueueTicketPatientSnapshot` | DE190123 |
| 26 | Fix lỗi 500 khi bác sĩ lưu chẩn đoán lần đầu cho bất kỳ bệnh nhân nào (thiếu try/catch bọc `InvalidOperationException`, chặn cơ chế tự tạo hồ sơ khám đã viết sẵn ở phía frontend) | Completed | `OutpatientRecordController.cs` | DE190123 |
| 27 | Bổ sung seed `MedicalServices` (16 dịch vụ) và `Drugs` (14 thuốc) — 2 bảng bị `DELETE` trong `seed_hospital.sql` nhưng chưa từng được `INSERT` lại, khiến ManageServices/E-Prescription trống dữ liệu | Completed | `docs/seed_hospital.sql` | DE190123 |
| 28 | E-Prescription: bỏ dropdown "Nhà thuốc" không lọc thật theo địa điểm; fix bug chọn thuốc gợi ý không điền tên vào ô tìm kiếm; tích hợp CDSS cảnh báo tương tác thuốc + quá liều ngay lúc kê đơn (2 API đã có sẵn nhưng trước đó chỉ dùng ở trang Admin riêng biệt) | Completed | `EPrescriptionPanel.razor`, `OutpatientRecord.razor`, `EPrescription.razor`, `ApiClient.cs` | DE190123 |
| 29 | Fix lệch ngày hiển thị (UTC vs local) ở Hồ sơ Sức khỏe Điện tử — tab "Lịch sử khám" thiếu `.ToLocalTime()` nên lùi 1 ngày với mọi lượt khám sau 17:00 giờ VN | Completed | `PHR.razor` | DE190123 |
| 30 | Feature 4 – Telemedicine: video call SignalR/WebRTC giữa bác sĩ và bệnh nhân (`TelemedicineHub`, `telemedicine.js`, trang `/telemedicine/{RoomId}`), fix crash camera/mic bị từ chối quyền, thông báo cuộc gọi đến cho bệnh nhân (polling), đồng bộ kết thúc cuộc gọi 2 bên | Completed | `TelemedicineHub.cs`, `telemedicine.js`, `Telemedicine.razor`, `Appointments.razor` | DE190123 |
| 31 | Fix UI đơn thuốc điện tử bị chật khi nhúng cạnh khung video call — đổi từ Bootstrap `col-*`/`row` sang CSS container-query | Completed | `EPrescriptionPanel.razor`, `EPrescriptionPanel.razor.css` | DE190123 |
| 32 | Thêm ghi Triệu chứng & Chẩn đoán ICD-10 ngay trong lúc gọi video tele (trước đó tele không ghi gì nên không có cơ sở tính bill) | Completed | `Telemedicine.razor` | DE190123 |
| 33 | Fix bill thiếu phí khám (bug có sẵn của Billing, không riêng tele) bằng dropdown "Dịch vụ khám" lọc theo khoa; fix Appointment.Status không bao giờ đổi khỏi "Chờ xác nhận" — cascade sang Completed từ cả luồng tele và walk-in/hẹn trước | Completed | `Billing.razor`, `ApiClient.cs`, `Telemedicine.razor`, `MedicalRecordService.cs` | DE190123 |

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
| Testing | Có | Nhiều | Smoke test PowerShell (10 scenarios, DE190123) + Playwright headless thực (login thật, click, screenshot) cho toàn bộ Report dashboard và 3 trang Admin; tự phát hiện 2 bug timezone qua test thực tế (DE180522) |
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
| ----------------------- | ------------- |
|                         |               |
