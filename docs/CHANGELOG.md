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

| Phiên bản/Giai đoạn | Thời gian               | Nội dung chính             | Trạng thái  |
| ------------------- | ----------------------- | -------------------------- | ----------- |
| Phase 01            | 17/05/2026              | Khởi tạo project           | Completed   |
| Phase 02            | 17/05/2026              | Phân tích yêu cầu          | Completed   |
| Phase 03            | 05/06/2026              | Thiết kế hệ thống          | Completed   |
| Phase 04            | 06/06/2026 – 10/06/2026 | Implementation             | Completed   |
| Phase 05            | 10/06/2026              | Testing & Debug            | Completed   |
| Phase 06            |                         | Hoàn thiện báo cáo và demo | In Progress |

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

| STT | Chức năng                                                                    | Trạng thái | Minh chứng                                                                  | Ghi chú                |
| --: | ---------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------- | ---------------------- |
|   1 | Authentication (JWT): đăng ký, đăng nhập                                     | Completed  | `AuthController.cs`, `LoginPage.tsx`                                        | Token lưu localStorage |
|   2 | Booking flow: chọn chuyên khoa → bác sĩ → ngày giờ → xác nhận                | Completed  | `BookingPage.tsx`, `AppointmentsPage.tsx`                                   | DE180526               |
|   3 | Smart Queue: check-in, xếp hàng theo phòng khám                              | Completed  | `SmartQueueController.cs`, `QueueService.cs`                                | DE180526               |
|   4 | Bed Management: bản đồ giường, lịch sử phân bổ, chuyển khoa                  | Completed  | `EntityControllers.cs`                                                      | Park Jea Minh          |
|   5 | HR & Staff Schedule Management: CRUD lịch trực, business rules               | Completed  | `ScheduleController.cs`, `StaffScheduleService.cs`                          | DE180522               |
|   6 | Staff Directory API: danh sách nhân viên với tên, email, khoa                | Completed  | `StaffController.GetDirectory`, `StaffScheduleQuery.GetStaffDirectoryAsync` | DE180522               |
|   7 | Gantt chart tuần (staff × date, clickable shift blocks)                      | Completed  | `ScheduleManagementPage.tsx` – Week view                                    | DE180522               |
|   8 | Gantt chart ngày (24h timeline, shift bars định vị theo giờ thực)            | Completed  | `ScheduleManagementPage.tsx` – Day view                                     | DE180522               |
|   9 | KPI stats bar (tổng nhân viên, đang trực, ca tuần, tỷ lệ phủ)                | Completed  | `ScheduleManagementPage.tsx` – KPI section                                  | DE180522               |
|  10 | Staff Profiles Grid (card trạng thái Đang trực/Nghỉ, liên kết Xem lịch trực) | Completed  | `ScheduleManagementPage.tsx` – Staff section                                | DE180522               |

---

## 4.2. Các chức năng chưa hoàn thành

| STT | Chức năng | Lý do chưa hoàn thành | Hướng cải thiện |
| --: | --------- | --------------------- | --------------- |
|   1 |           |                       |                 |
|   2 |           |                       |                 |
|   3 |           |                       |                 |

---

## 4.3. Tổng hợp AI hỗ trợ trong project

| Hạng mục     | AI có hỗ trợ không? | Mức độ hỗ trợ | Ghi chú                                                                              |
| ------------ | ------------------- | ------------- | ------------------------------------------------------------------------------------ |
| Requirement  | Có                  | Ít            | Hỗ trợ phân tích yêu cầu từ base-html design                                         |
| Design       | Có                  | Trung bình    | Đề xuất flat projection pattern, CQRS lite interface                                 |
| Database     | Có                  | Nhiều         | Scaffold entities, migrations, DbContext, seed data                                  |
| Coding       | Có                  | Nhiều         | StaffScheduleService, StaffScheduleQuery, ScheduleController, toàn bộ frontend Gantt |
| Debug        | Có                  | Nhiều         | Phát hiện và fix 5 bugs (React.FormEvent, connection string, DTO rename, ...)        |
| Testing      | Có                  | Trung bình    | Viết smoke test script PowerShell 10 scenarios                                       |
| Report       | Có                  | Trung bình    | Hỗ trợ điền CHANGELOG, README                                                        |
| Presentation | Không               | —             | —                                                                                    |

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
