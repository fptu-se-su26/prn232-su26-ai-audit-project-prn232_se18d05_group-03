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
| 4 | Tạo SmartQueueDtos, IQueueService, QueueService - Feature 1 smart queue | DE180526  | src/Mediconnect.Application/DTOs/SmartQueueDtos.cs; src/Mediconnect.Application/Interfaces/IQueueService.cs; src/Mediconnect.Application/Services/QueueService.cs |  |
| 5 | Tạo SmartQueueController, enhance ClinicsController & MedicalServicesController | DE180526   | src/mediconnect/Controllers/SmartQueueController.cs; src/mediconnect/Controllers/EntityControllers.cs; src/mediconnect/Program.cs |  |
| 6 | Them endpoints GET /api/beds/map, GET /api/inpatient-admissions/{id}/bed-assignments, POST /api/inpatient-admissions/{id}/transfer | Park Jea Minh | src/mediconnect/Controllers/EntityControllers.cs | feat(member3): F1 - bed map & transfer |
| 7 | Them DTOs BedMapGroupDto, TransferAdmissionDto | Park Jea Minh | src/Mediconnect.Application/DTOs/EntityDtos.cs | feat(member3): F1 - bed map & transfer |
| 8 | Thiết kế backend modular; frontend Clinic Dashboard & Manage Services; sửa lỗi port và session redirect | DE190123 | src/mediconnect/Modules/SmartClinic/*; src/mediconnect-web/src/pages/ClinicDashboardPage.tsx; src/mediconnect-web/src/pages/ManageServicesPage.tsx; src/mediconnect-web/src/context/AuthContext.tsx | feat: Smart Clinic Dashboard & Service Management - MouGlanzuddli |
| 9 | Implement Outpatient Record (doctor) feature and robust diagnose/save flow | DE190123 | mediconnect-web/src/pages/OutpatientRecordPage.tsx; mediconnect-web/src/components/layout/Header.tsx; Mediconnect.Application/Services/MedicalRecordService.cs; mediconnect/Modules/SmartClinic/OutpatientRecordController.cs | feat(outpatient): UI + save flow; added fallback create visit and lab order creation |
| 10 | Tích hợp NLM ClinicalTables API cho tìm kiếm ICD-10 (thay thế `Icd10Catalog` chưa định nghĩa gây build lỗi) | DE190123 | `src/Mediconnect.Application/Services/MedicalRecordService.cs` (`SearchICD10Async`); `src/Mediconnect.Application/Interfaces/IMedicalRecordService.cs`; `src/Mediconnect.Application/DTOs/MedicalRecordDtos.cs` (`ICD10ResultDto`); `src/mediconnect/Modules/SmartClinic/OutpatientRecordController.cs` (`GET icd10/search`); `src/mediconnect/Program.cs` (`AddHttpClient()`); `src/mediconnect-web/src/api/services.ts` (`searchIcd10`); `src/mediconnect-web/src/types/index.ts` (`Icd10Result`) | `472681e feat(outpatient): add ICD-10 diagnosis lookup via NLM API` — URL: `https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?terms={query}&sf=code,name&df=code,name`; parse `root[3]` (displayStrings array) |
| 11 | Sửa lỗi tên bệnh nhân vãng lai bị mất khi điều hướng sang OutpatientRecord (walk-in patient name persistence) | DE190123 | `src/mediconnect-web/src/pages/ClinicDashboardPage.tsx` (navigate với `state: { ticket, clinicId }`); `src/mediconnect-web/src/pages/OutpatientRecordPage.tsx` (`useLocation` + `loc.state?.ticket`); `src/mediconnect-web/src/types/index.ts` (`QueueTicketDetail.patientName`) | `472681e feat(outpatient): fix walk-in patient data persistence` — Root cause: `QueueTicket` entity không có cột `PatientName`; workaround: truyền qua React Router state |

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
Commit DE190123: 00ea032 feat: Smart Clinic Dashboard & Service Management
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
| 11 | SmartClinic: backend modularization + Clinic Dashboard & Manage Services (frontend) + port/session fixes | Completed | `Modules/SmartClinic/*`, `ClinicDashboardPage.tsx`, `ManageServicesPage.tsx`, `AuthContext.tsx` | DE190123 |
| 12 | Outpatient Record: doctor UI, diagnose/save flow, auto-create visit/patient, lab orders | Completed | `mediconnect-web/src/pages/OutpatientRecordPage.tsx`, `mediconnect-web/src/components/layout/Header.tsx`, `Mediconnect.Application/Services/MedicalRecordService.cs` | DE190123 |
| 13 | ICD-10 diagnosis lookup via NLM ClinicalTables API (`GET /api/medical-records/icd10/search?query=`): dropdown tìm theo mã (E11) và tên (Hypertension), parse `root[3]` của response 4-element array | Completed | `Mediconnect.Application/Services/MedicalRecordService.cs` (`SearchICD10Async`); `OutpatientRecordController.cs` (`SearchICD10`); `mediconnect-web/src/api/services.ts` (`searchIcd10`); `Program.cs` (`AddHttpClient()`) | DE190123 |
| 14 | Walk-in patient name persistence qua React Router state: `ClinicDashboardPage` navigate với `{ ticket, clinicId }`, `OutpatientRecordPage` đọc từ `useLocation().state.ticket.patientName` | Completed | `mediconnect-web/src/pages/ClinicDashboardPage.tsx` (line 384); `mediconnect-web/src/pages/OutpatientRecordPage.tsx` (lines 66–73, 414) | DE190123 |

---

## 4.2. Các chức năng chưa hoàn thành

| STT | Chức năng | Lý do chưa hoàn thành | Hướng cải thiện |
|---:|---|---|---|
| 1 |  |  |  |
| 2 |  |  |  |
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
| Testing | Có | Trung bình | Viết smoke test script PowerShell 10 scenarios |
| Report | Có | Trung bình | Hỗ trợ điền CHANGELOG, README |
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
