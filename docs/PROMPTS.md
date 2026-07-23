# Prompt Log

## 1. Thông tin chung

| Thông tin | Nội dung |
|---|---|
| Môn học |  |
| Mã môn học |  |
| Lớp |  |
| Học kỳ |  |
| Tên bài tập / Project |  |
| Tên sinh viên / Nhóm |  |
| MSSV / Danh sách MSSV |  |
| Giảng viên hướng dẫn |  |
| Ngày bắt đầu |  |
| Ngày cập nhật gần nhất |  |

---

## 2. Mục đích của file Prompt Log

File này dùng để ghi lại các prompt quan trọng đã sử dụng trong quá trình thực hiện bài tập, lab, assignment hoặc project.

Sinh viên/nhóm cần ghi lại:

- Đã hỏi AI điều gì.
- Mục đích sử dụng prompt.
- Công cụ AI đã sử dụng.
- AI đã trả lời hoặc gợi ý gì.
- Kết quả đó có được áp dụng vào bài hay không.
- Sinh viên/nhóm đã kiểm tra, chỉnh sửa hoặc cải tiến gì sau khi nhận kết quả từ AI.

---

## 3. Công cụ AI đã sử dụng

Đánh dấu các công cụ AI đã sử dụng.

- [ ] ChatGPT
- [ ] Gemini
- [ ] Claude
- [ ] GitHub Copilot
- [ ] Cursor
- [ ] Antigravity
- [ ] Microsoft Copilot
- [ ] Perplexity
- [ ] Công cụ khác: ....................................

---

## 4. Bảng tổng hợp prompt đã sử dụng

| STT | Ngày | Công cụ AI | Mục đích | Prompt tóm tắt | Kết quả chính | Có sử dụng vào bài không? | Minh chứng |
|---:|---|---|---|---|---|---|---|
| 1 | 17/05/2026 | GitHub Copilot | Phân chia thành viên và tính năng; hướng dẫn cập nhật log | Chia 4 thành viên theo module HIS & Telemedicine; nhắc thứ tự cập nhật file audit; yêu cầu định hướng models | Xác nhận đã đọc file md và cần bổ sung thông tin để thiết kế models | Có | docs/PROMPTS.md, docs/AI_AUDIT_LOG.md |
| 2 | 17/05/2026 | GitHub Copilot | Thiết kế models code-first cho .NET API | Xác nhận stack .NET + SQL Server; yêu cầu hỗ trợ models cho HIS | Sẽ tạo models theo domain; cần xác định nơi đặt project và cấu trúc solution | Có | docs/PROMPTS.md, docs/AI_AUDIT_LOG.md |
| 3 | 17/05/2026 | GitHub Copilot | Tao project .NET Web API va them DbContext + Models | Tao project mediconnect, them EF Core, DbContext, Models cho HIS | Da scaffold du an va them models, DbContext, connection string | Có | src/mediconnect; docs/PROMPTS.md; docs/AI_AUDIT_LOG.md |
| 4 | 17/05/2026 | GitHub Copilot | Tao file solution cho du an .NET Web API | Yeu cau co file .sln cho project | Da tao mediconnect.sln va add project | Có | mediconnect.sln; docs/PROMPTS.md; docs/AI_AUDIT_LOG.md |
| 5 | 03/06/2026 | Claude (Claude Code) | Tham khảo cách tổ chức interface và service pattern cho smart queue | Hỏi cách tổ chức IQueueService trong Clean Architecture | AI gợi ý tên method và cách tổ chức layer; DTO và logic được điều chỉnh theo yêu cầu dự án | Có | src/Mediconnect.Application/Interfaces/IQueueService.cs |
| 6 | 05/06/2026 | Claude | Sinh code Feature 1: Bed Map & Inpatient Transfer | Them endpoints GET /api/beds/map, GET bed-assignments, POST transfer vao BedsController va InpatientAdmissionsController | Da sinh endpoints va DTOs dung clean architecture pattern | Có | src/mediconnect/Controllers/EntityControllers.cs; src/Mediconnect.Application/DTOs/EntityDtos.cs |
| 7 | 06/06/2026 | Antigravity | Viết backend modular riêng biệt cho smart clinic | viet backend o folder module rieng biet | Gợi ý cấu trúc module và sinh ClinicDashboard/ClinicManagement Controller | Có | src/mediconnect/Modules/SmartClinic |
| 8 | 06/06/2026 | Antigravity | Kiểm tra lỗi cơ sở dữ liệu | check for database error | Phân tích DLL lock, giải phóng tiến trình và kiểm tra EF database up-to-date | Có | dotnet ef database update |
| 9 | 06/06/2026 | Antigravity | Sửa lỗi mất session / đăng nhập lặp | toi khong vao duoc nhung man hinh vua tao, no cu bi mat session bat dang nhap | Phát hiện login redirect loop về /booking và sửa đổi LoginPage/AuthContext | Có | src/mediconnect-web/src/pages/LoginPage.tsx |
| 10 | 10/06/2026 | Claude (Claude Code) | Xây dựng frontend Feature 2: Hồ sơ sức khỏe điện tử | Làm chức năng PHR cho bệnh nhân: xem lịch sử khám, đơn thuốc, kết quả xét nghiệm, tải file | Tạo PHRPage.tsx với 3 tab + 7 API calls + enrichment dữ liệu client-side | Có | src/mediconnect-web/src/pages/PHRPage.tsx |
| 11 | 21/06/2026 | Claude (Claude Code) | Viết backend Feature 3: Quản lý viện phí & BHYT | Gom phí khám/xét nghiệm/thuốc thành phiếu thu tổng, nhập mã BHYT tự tính khấu trừ | Tạo BillingService với GenerateInvoiceAsync + CalculateInsuranceAsync, thêm endpoint POST /generate | Có | src/Mediconnect.Application/Services/BillingService.cs |
| 12 | 02/07/2026 | Claude (Claude Code) | Check lại Feature 1/2/3, viết backend Feature 4: Thanh toán VNPay/Momo & đánh giá dịch vụ | Tích hợp cổng thanh toán, cho phép bệnh nhân rating chất lượng khám | Tạo ServiceRating + IPaymentGatewayService, phát hiện và sửa bug DbUpdateConcurrencyException ở Feature 3 khi test thật | Có | src/Mediconnect.Infrastructure/Payments/; src/Mediconnect.Domain/Entities/ServiceRating.cs |
| 13 | 14/06/2026 | Claude | Sinh code Feature 2: Y lenh & cham soc hang ngay | Them endpoints GET vital-signs va GET care-orders theo ca nhap vien (loc theo ngay/loai/trang thai) vao InpatientAdmissionsController | Da sinh 2 nested-route endpoint tai su dung IRepository + SimpleMapper, build sach 0 error | Có | src/mediconnect/Controllers/EntityControllers.cs |
| 14 | 16/06/2026 | Claude | Sinh code Feature 3 & 4 (lam hai phan) | F3: queue chi dinh, nhap ket qua, upload file that; F4: discharge tong hop chi phi giuong/thuoc/thu thuat thanh invoice gui Thanh toan | Da sinh endpoints F3 (lab-orders/lab-results) va nang cap discharge F4, build sach 0 error | Có | src/mediconnect/Controllers/EntityControllers.cs; src/mediconnect/Program.cs; src/Mediconnect.Application/DTOs/EntityDtos.cs |
| 15 | 14/06/2026 | GitHub Copilot, Claude | Implement Outpatient Record UI and diagnose/create flow | Scaffold OutpatientRecordPage, handle diagnose->create->retry, add local/top search and header link | Implemented OutpatientRecordPage.tsx, header link, ClinicDashboard navigation and payload checks | Có | mediconnect-web/src/pages/OutpatientRecordPage.tsx |
| 16 | 14/06/2026 | GitHub Copilot | Debug duplicate PatientProfile creation | Avoid duplicate PatientProfile by checking existing profile before create (GET /api/patients/me) | Added getMe() check and fallback create in OutpatientRecordPage.tsx to prevent DB unique index error | Có | mediconnect-web/src/pages/OutpatientRecordPage.tsx |
| 17 | 28/06/2026 | Antigravity | Tích hợp NLM ICD-10 API thay thế `Icd10Catalog` chưa định nghĩa | `tim hieu ve du an... tiep tuc hoan thien sua doi tim kiem ICD-10 dua theo nlm api` + test E11/Hypertension | Sinh `SearchICD10Async()` inject HttpClient, URL NLM, parse `root[3]`, DTO `ICD10ResultDto`, đăng ký `AddHttpClient()` | Có | `src/Mediconnect.Application/Services/MedicalRecordService.cs`; `src/mediconnect/Modules/SmartClinic/OutpatientRecordController.cs`; `src/mediconnect/Program.cs` |
| 18 | 28/06/2026 | Antigravity | Sửa lỗi tên walk-in mất khi navigate sang OutpatientRecord | Cùng session với prompt 17; AI phân tích `QueueTicket` thiếu `PatientName` cột | Sinh `navigate('/outpatient-record', { state: { ticket, clinicId } })` và `useLocation` + `loc.state?.ticket` | Có | `src/mediconnect-web/src/pages/ClinicDashboardPage.tsx`; `src/mediconnect-web/src/pages/OutpatientRecordPage.tsx` |
| 19 | 29/06/2026 | Claude (claude.ai) | Implement E-Prescription feature: drug autocomplete (GET /api/drugs), allergy validation, pharmacy stock filter, send flow POST /api/prescriptions | Feature 3 E-Prescription: drug autocomplete debounced 250ms, allergy check [Penicillin/Peanuts/Sulfa Drugs], stock filter via GET /api/clinics/active, disabled add khi stock=0, send flow POST /api/prescriptions + /api/prescriptionitems | Sinh EPrescriptionPanel.tsx, EPrescriptionPage.tsx, update OutpatientRecordPage.tsx + services.ts + types/index.ts | Có | `src/mediconnect-web/src/pages/EPrescriptionPanel.tsx`; `src/mediconnect-web/src/pages/EPrescriptionPage.tsx`; `src/mediconnect-web/src/api/services.ts`; `src/mediconnect-web/src/types/index.ts` |
| 20 | 29/06/2026 | Claude (claude.ai) | Sidebar UI: nâng E-Prescription lên top-level section, visual parity với Outpatient Records, route /e-prescription | Promote E-Prescription: standalone top-level nav link "Đơn thuốc điện tử", order Queue → Outpatient Records → E-Prescription → Telemedicine, route /e-prescription với RoleProtectedRoute | Sinh Header.tsx nav link (desktop + mobile, isStaff block), App.tsx route với RoleProtectedRoute (Doctor, Nurse) | Có | `src/mediconnect-web/src/components/layout/Header.tsx`; `src/mediconnect-web/src/App.tsx` |
| 21 | 20/06/2026 | Claude (Claude Code) | Kiểm thử end-to-end chức năng Statistics Report bằng Playwright, thêm seed data và xác nhận sửa lỗi | bạn test lại xem đã chạy ổn chức năng report này chưa / thêm data vào database rồi test lại / tất cả đã oke hết chưa | Phát hiện và sửa 2 bug thật: lệch ngày do `toISOString()` lấy giờ UTC ở frontend, và endDate không bao trọn ngày cuối ở backend; seed thêm dữ liệu invoice/khoa phòng để dashboard có số liệu thực tế | Có | C:/tmp/pwtest/*.mjs; src/Mediconnect.Infrastructure/Repositories/ReportQuery.cs; src/mediconnect-web/src/utils/reportUtils.ts |
| 22 | 20/06/2026 | Claude (Claude Code) | Sinh code Screen 3.1 (Dashboard Doanh thu) và Screen 3.2 (Dashboard Vận hành) từ backend đến frontend theo đặc tả chính xác | Dashboard Thống kê & Báo cáo... Screen 3.1: Dashboard Doanh thu tài chính... Screen 3.2: Dashboard Báo cáo vận hành... hãy làm theo 2 màn hình như này từ backend đến frontend | Sinh DTO/Interface/Query/Controller cho Report module theo pattern CQRS-lite có sẵn; sinh 2 trang React riêng biệt dùng SVG chart tự viết (Bar/Line/Pie), filter theo kỳ và khoa phòng, export CSV | Có | src/Mediconnect.Application/DTOs/ReportDtos.cs; src/mediconnect-web/src/pages/RevenueDashboardPage.tsx; src/mediconnect-web/src/pages/OperationsReportPage.tsx |
| 23 | 20/06/2026 | Claude (Claude Code) | Đọc checkfile.md để đối chiếu các screen của Admin (Thành viên 4) đã có/chưa có trong project | hãy đọc file này và tổng hợp các screen nào là của admin mà cái nào đã có trong project và cái nào chưa có | Liệt kê 6 screen thuộc Thành viên 4, xác định 3 đã có backend nhưng chưa có UI (Quản lý nhân sự, Cảnh báo tương tác thuốc, Quản lý tài khoản) và 2 chưa làm (Banner cảnh báo quá liều, Cấu hình OTP) | Có | docs (đối chiếu nội bộ, không tạo file mới) |
| 24 | 20/06/2026 | Claude (Claude Code) | Hoàn thiện frontend cho 3 trang Admin còn thiếu UI: Quản lý nhân sự, Cảnh báo tương tác thuốc (CDSS), Quản lý tài khoản | hãy hoàn thiện các trang đang nửa vời | Sinh 3 trang React đầy đủ CRUD + kiểm thử bằng Playwright (gọi API thật qua fetch để xác nhận persist), phát hiện 1 bug trong chính script test (chọn nhầm nút do selector trùng text) chứ không phải bug ứng dụng | Có | src/mediconnect-web/src/pages/StaffManagementPage.tsx; src/mediconnect-web/src/pages/UserManagementPage.tsx; src/mediconnect-web/src/pages/DrugInteractionPage.tsx |
| 25 | 01/07/2026 | Claude (Claude Code) | Hoàn thiện 2 Screen còn thiếu của Thành viên 4: Banner cảnh báo quá liều (2.2) và Cấu hình/bảo mật OTP (4.2) | tìm hiểu dự án còn thiếu các screen nào trong các screen này rồi làm cho tôi [kèm đặc tả Thành viên 4] | Xác nhận đúng 2 screen còn thiếu; sinh backend (Drug dose threshold, CdssController.DoseCheck thật, OtpSetting/OtpCode/OtpController) và frontend (tab dose-check + trang OtpSecurityPage); tự tạo migration và test Playwright 15/15 pass | Có | src/mediconnect/Controllers/CdssController.cs; OtpController.cs; src/mediconnect-web/src/pages/OtpSecurityPage.tsx |
| 26 | 01/07/2026 | Claude (Claude Code) | Tích hợp gửi OTP thật qua Email (SMTP) dùng chung cho Gmail App Password và SendGrid | mình muốn dùng otp thật hãy làm cho mình tích hợp send grid với google app passwords | Thiết kế 1 abstraction IOtpSender + SmtpOtpSender (MailKit) dùng chung cho cả 2 provider vì cùng chuẩn SMTP; che mã khi gửi thật, fallback mô phỏng khi lỗi/chưa cấu hình; tự kiểm chứng bằng host giả để xác nhận code gửi thật có chạy | Có | src/Mediconnect.Infrastructure/Notifications/SmtpOtpSender.cs; src/mediconnect/appsettings.json |
| 27 | 12/07/2026 - 13/07/2026 | Claude Code (claude-sonnet-5) | Kiểm thử trực tiếp luồng khám vãng lai/kê đơn/CDSS trên browser, phát hiện và sửa 3 bug thật | hãy thử thêm 1 bệnh nhân vãng lai vào hàng đợi, tiếp nhận họ và ghi đơn thuốc, chẩn đoán... queue không phải tôi viết, chỉ viết thêm vào không thay thế | Phát hiện & fix: (1) walk-in không lưu tên + không lưu được bệnh án do thiếu PatientProfile; (2) lỗi 500 khi lưu chẩn đoán lần đầu cho bất kỳ bệnh nhân nào; (3) MedicalServices/Drugs seed rỗng; (4) dropdown nhà thuốc giả + bug autocomplete chọn thuốc; (5) 2 API CDSS có sẵn nhưng chưa nối vào luồng kê đơn; (6) lệch ngày UTC/local ở PHR | Có | Chi tiết đầy đủ: docs/AI_AUDIT_LOG.md, "Lần sử dụng AI số 18" |
| 28 | 13/07/2026 | Claude Code (claude-sonnet-5) | Viết lại 6 commit của phiên trên sang tiếng Anh theo quy chuẩn, chuẩn bị PR checklist | giờ tôi muốn bạn undo hết commit để sửa về tiếng anh cho đúng quy chuẩn, mỗi commit liệt kê nội dung, file nào bị sửa (nhấn mạnh nếu không phải của tôi), file nào được tạo / giúp tôi làm pull request | Soft-reset 6 commit về base rồi recommit từng nhóm với message tiếng Anh liệt kê rõ file sửa/tạo và đánh dấu file không phải do người dùng viết (dựa trên git blame); tạo branch mới cho bản viết lại; điền sẵn nội dung PR checklist (description, type of change, AI usage, verification, evidence) dựa trên commit thật và AI_AUDIT_LOG #18 | Có | 6 commit viết lại trên `feature/de190123-walkin-cdss-fixes`; nội dung PR checklist đã điền sẵn gửi qua chat (chưa tạo file trong repo) |
| 29 | 20/07/2026 – 23/07/2026 | Claude Code (claude-sonnet-5) | Xây Feature 4 – Telemedicine (video call) từ đầu: SignalR/WebRTC, fix crash camera, thông báo cuộc gọi cho bệnh nhân, đồng bộ kết thúc cuộc gọi 2 bên | hãy làm chức năng gọi video giữa bác sĩ và bệnh nhân cho lịch hẹn tele... camera bị từ chối quyền thì cả trang bị sập luôn chứ không phải chỉ mỗi video... bệnh nhân phải biết là có cuộc gọi đến chứ... 1 bên tắt máy bên kia vẫn đứng hình | Tạo `TelemedicineHub` (SignalR relay offer/answer/ICE) + `telemedicine.js` (WebRTC) + trang `/telemedicine/{RoomId}`; bọc try/catch quanh `startLocalVideo` để lỗi permission camera/mic không làm sập cả circuit Blazor; thêm polling 10s phía bệnh nhân để nhận thông báo cuộc gọi đến + tự complete visit khi kết thúc; thêm `NotifyCallEnded` để bên kia thoát ngay thay vì đứng hình | Có | `bb5706d` trên `feature/de190123-telemedicine` |
| 30 | 23/07/2026 | Claude Code (claude-sonnet-5) | Fix UI đơn thuốc điện tử bị chật khi nhúng cạnh khung video call | form kê đơn nhét vào cạnh video bị chật quá, chia cột kiểu cũ không hợp | Đổi `EPrescriptionPanel.razor` từ Bootstrap `col-*`/`row` (chia theo viewport) sang CSS container-query riêng (`EPrescriptionPanel.razor.css`) để form tự chia layout theo bề rộng khung chứa, không phải viewport | Có | `a7a1472` trên `feature/de190123-telemedicine` |
| 31 | 23/07/2026 | Claude Code (claude-sonnet-5) | Thêm ghi Triệu chứng & Chẩn đoán ICD-10 ngay trong lúc gọi video (tele trước đó không ghi gì nên bill ra 0đ) | khám qua tele mà không ghi triệu chứng/chẩn đoán gì thì sau này tính bill sao được | Thêm card "Triệu chứng & Chẩn đoán" vào panel bác sĩ trong trang tele: lý do khám, mô tả triệu chứng, tìm ICD-10 debounce, `SaveDiagnosis`; tách logic tạo visit ra `EnsureVisitCreatedAsync` dùng chung cho cả lưu chẩn đoán và mở đơn thuốc | Có | `7bd9072` trên `feature/de190123-telemedicine` |
| 32 | 23/07/2026 | Claude Code (claude-sonnet-5) | Fix bill thiếu phí khám (bug có sẵn của Billing, không riêng tele) + Appointment.Status không bao giờ đổi khỏi "Chờ xác nhận" | sao khám xong hoá đơn ra 0đ, đâu có tính phí khám... lịch hẹn khám xong rồi mà status vẫn còn chờ xác nhận | Thêm dropdown "Dịch vụ khám" lọc theo khoa trong `Billing.razor` để hoá đơn luôn kèm phí khám (`ExamServiceId`); thêm `UpdateAppointmentStatus`, cascade `Appointment.Status = Completed` từ cả luồng tele (`EndCall`) và luồng walk-in/hẹn trước (`MedicalRecordService.SaveMedicalRecordAsync`) | Có | `3f21e3f` trên `feature/de190123-telemedicine` |

---

## 5. Prompt chi tiết

> Sinh viên/nhóm có thể nhân bản mẫu “Prompt số...” nhiều lần tùy số lượng prompt thực tế đã sử dụng.

---

### Prompt số 1

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 17/05/2026 |
| Công cụ AI | GitHub Copilot |
| Mục đích | Phân chia thành viên và tính năng; nhắc quy trình cập nhật log; định hướng models |
| Phần việc liên quan | Requirement / Design |
| Mức độ sử dụng | Hỏi ý tưởng |

#### 5.1. Prompt nguyên văn

```text
 cách cập nhật file md mỗi khi làm rồi đọc hệ thống các chức năng để có thể làm Models cho hệ thống

```

#### 5.2. Bối cảnh khi viết prompt

Mô tả ngắn gọn vì sao sinh viên/nhóm cần dùng prompt này.

```text
Cần phân chia 4 thành viên theo module, nhắc quy trình cập nhật audit, và định hướng tạo models cho hệ thống HIS & Telemedicine.
```

#### 5.3. Kết quả AI trả về

Tóm tắt nội dung AI đã trả lời hoặc gợi ý.

```text
Tóm tắt phân chia module theo 4 thành viên, nhắc trình tự cập nhật các file audit, và cần làm rõ thông tin để thiết kế models.
```

#### 5.4. Kết quả đã áp dụng vào bài

Mô tả phần nào từ kết quả AI đã được sử dụng vào bài tập/project.

```text
Dự kiến áp dụng vào phần requirement/design; cần xác nhận thêm stack và đầu ra models để triển khai.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

Mô tả sinh viên/nhóm đã thay đổi, kiểm tra, sửa lỗi hoặc cải tiến gì so với kết quả AI trả về.

```text
Chưa có chỉnh sửa; cần bổ sung thông tin thành viên, stack, và đầu ra model mong muốn.
```

#### 5.6. Đánh giá chất lượng prompt

Đánh dấu các nhận xét phù hợp.

- [ ] Prompt rõ ràng
- [ ] Prompt có đủ bối cảnh
- [ ] Prompt còn thiếu thông tin
- [ ] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [ ] Cần tự kiểm tra và chỉnh sửa nhiều
- [ ] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit |  |
| File liên quan |  |
| Screenshot |  |
| Kết quả chạy/test |  |
| Link tài liệu/báo cáo |  |
| Ghi chú khác |  |

#### 5.8. Ghi chú thêm

```text
Viết tại đây...
```

---

### Prompt số 2

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 17/05/2026 |
| Công cụ AI | GitHub Copilot |
| Mục đích | Thiết kế models theo code-first cho .NET API | 
| Phần việc liên quan | Design / Database / Coding |
| Mức độ sử dụng | Hỏi sinh code |

#### 5.1. Prompt nguyên văn

```text
1. code first cho  database 
2. .NET SQL Server
```

#### 5.2. Bối cảnh khi viết prompt

```text
Can tao models code-first cho .NET API dung SQL Server va ghi nhan audit log truoc khi thuc hien.
```

#### 5.3. Kết quả AI trả về

```text
Xac nhan stack .NET + SQL Server, tiep theo se thiet ke models theo domain HIS & Telemedicine.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Ap dung vao thiet ke models va cau truc entity cho code-first.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
Chua co; can xac nhan vi tri project/solution de them models.
```

#### 5.6. Đánh giá chất lượng prompt

- [ ] Prompt rõ ràng
- [ ] Prompt có đủ bối cảnh
- [ ] Prompt còn thiếu thông tin
- [ ] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [ ] Cần tự kiểm tra và chỉnh sửa nhiều
- [ ] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit |  |
| File liên quan |  |
| Screenshot |  |
| Kết quả chạy/test |  |
| Link tài liệu/báo cáo |  |
| Ghi chú khác |  |

#### 5.8. Ghi chú thêm

```text
Viết tại đây...
```

---

### Prompt số 3

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 14/06/2026 |
| Công cụ AI | Claude |
| Mục đích | Sinh code Feature 2 – Quản lý Y lệnh và Chăm sóc hàng ngày |
| Phần việc liên quan | Backend / Coding |
| Mức độ sử dụng | Hỏi sinh code |

#### 5.1. Prompt nguyên văn

```text
Thành viên 3 – Vận hành Nội Trú & Điều phối Lâm sàng
Feature 2: Quản lý Y lệnh và Chăm sóc hàng ngày
- Y tá cập nhật chỉ số sinh tồn hàng ngày (mạch, nhiệt độ) của bệnh nhân tại giường.
- Bác sĩ cập nhật y lệnh hàng ngày (thuốc tiêm, truyền dịch, chỉ định suất ăn).
```

#### 5.2. Bối cảnh khi viết prompt

```text
Cac entity VitalSign, CareOrder va controller CRUD da co san. Can bo sung endpoint lay du lieu theo tung ca nhap vien (admission) de y ta/bac si xem tai giuong, thay vi tra ve toan bo benh nhan.
```

#### 5.3. Kết quả AI trả về

```text
AI phan tich codebase, xac dinh khoang trong la thieu endpoint scoped theo admission va sinh code:
- GET /api/inpatient-admissions/{id}/vital-signs: chi so sinh ton theo ca nhap vien, sap xep moi nhat truoc, loc tuy chon theo ?date.
- GET /api/inpatient-admissions/{id}/care-orders: y lenh theo ca nhap vien, loc tuy chon theo ?orderType (Medication/Infusion/Diet...) va ?pending.
Tai su dung IRepository.ListAsync + SimpleMapper theo dung pattern cua F1 (GetBedAssignments).
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Ap dung toan bo code sinh ra vao InpatientAdmissionsController trong EntityControllers.cs sau khi review dung pattern.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
Kiem tra build thanh cong (0 error, 0 warning). Xac nhan tao/ghi chi so va y lenh dung qua POST /api/vital-signs, POST /api/care-orders va PATCH /api/care-orders/{id}/complete co san.
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [x] Prompt có đủ bối cảnh
- [ ] Prompt còn thiếu thông tin
- [x] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [ ] Cần tự kiểm tra và chỉnh sửa nhiều
- [ ] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | feat(member3): F2 - admission-scoped vital signs & care orders endpoints |
| File liên quan | src/mediconnect/Controllers/EntityControllers.cs |
| Screenshot |  |
| Kết quả chạy/test | dotnet build: 0 Error(s) |
| Link tài liệu/báo cáo |  |
| Ghi chú khác |  |

#### 5.8. Ghi chú thêm

```text
Khong can EF migration vi khong thay doi schema; chi them endpoint doc du lieu.
```

---

### Prompt số 10

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 10/06/2026 |
| Công cụ AI | Claude (Claude Code) |
| Mục đích | Xây dựng giao diện frontend Feature 2: Hồ sơ sức khỏe điện tử |
| Phần việc liên quan | Frontend / Coding |
| Mức độ sử dụng | Sinh code chính |
### Prompt số 4

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 16/06/2026 |
| Công cụ AI | Claude |
| Mục đích | Sinh code Feature 3 (Cận lâm sàng) và Feature 4 (Xuất viện) cùng lúc |
| Phần việc liên quan | Backend / Coding |
| Mức độ sử dụng | Hỏi sinh code |

#### 5.1. Prompt nguyên văn

```text
Làm chức năng Feature 2: Quản lý Hồ sơ Sức khỏe Điện tử (PHR) cho bệnh nhân. Bệnh nhân có thể xem lịch sử khám, đơn thuốc, kết quả xét nghiệm và tải file kết quả.
làm hai phần
(F3: Quản lý Cận lâm sàng - tiếp nhận chỉ định, nhập kết quả, upload file ảnh/PDF, trả kết quả về bác sĩ;
 F4: Quản lý xuất viện - tổng hợp chi phí lưu giường, tiền thuốc, thủ thuật gửi sang Thanh toán)
```

#### 5.2. Bối cảnh khi viết prompt

```text
Thiếu frontend (PatientsController với GET /history;
EntityControllers với /lab-orders, /prescription-items, /drugs, /clinics).
Sau khi hoan thanh F1, F2, can lam not 2 feature con lai cua thanh vien 3. Entity Lab/Billing/Discharge da co san nhung phan upload file con la stub va discharge moi chi tao summary rong.
```

#### 5.3. Kết quả AI trả về

```text
AI tạo PHRPage.tsx với 3 tab:
- Tab 1 (Lịch sử khám): timeline numbered cards, tìm kiếm, sắp xếp, modal xem chẩn đoán + bác sĩ + phòng khám.
- Tab 2 (Đơn thuốc): danh sách accordion, mỗi đơn mở ra bảng chi tiết thuốc (tên, liều, tần suất, số ngày).
- Tab 3 (Kết quả xét nghiệm): filter theo trạng thái, modal xem kết quả text, nút tải file.
AI phát hiện /history trả DTO thiếu testName và drug items.
F3: them GET /api/lab-orders/filter (loc theo status/bac si), PATCH .../status, POST .../result (nhap ket qua + tu dong Completed), GET .../result; nang cap POST /api/lab-results/{id}/file luu file that (kiem tra .pdf/.jpg/.png, gioi han 10MB) va bat app.UseStaticFiles().
F4: nang cap POST .../discharge - tinh so ngay giuong tu BedAssignment x don gia, liet ke care order (thuoc/thu thuat) thanh BillingItem, tao BillingInvoice trang thai Pending gui sang Thanh toan, giai phong giuong sang Cleaning, luu TotalCost vao DischargeSummary; tra ve DischargeResultDto.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Áp dụng code vào dự án:
- PHRPage.tsx (route /health-records, Patient only)
- Cập nhật types/index.ts, services.ts, App.tsx, Header.tsx
Ap dung toan bo vao EntityControllers.cs, Program.cs (UseStaticFiles) va them DTO (LabResultEntryDto, DischargeRequestDto, DischargeResultDto) trong EntityDtos.cs.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
- Đọc EntityDtos.cs xác nhận DTO shape trước khi code
- Chạy npm run build xác nhận 0 TypeScript error
Build thanh cong 0 error/0 warning. Luu y: Bed khong co truong gia nen dung hang so don gia giuong (BedDailyRate); CareOrder la text tu do nen tien thuoc/thu thuat duoc liet ke thanh line item de bo phan Thanh toan dien gia.
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [x] Prompt có đủ bối cảnh
- [ ] Prompt còn thiếu thông tin
- [x] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [ ] Cần tự kiểm tra và chỉnh sửa nhiều
- [ ] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | chưa commit |
| File liên quan | src/mediconnect-web/src/pages/PHRPage.tsx |
| Screenshot |  |
| Kết quả chạy/test | npm run build: 0 error |
| Ghi chú khác | Backend endpoint đã có từ trước session này |

---

### Prompt số 11

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 21/06/2026 |
| Công cụ AI | Claude (Claude Code) |
| Mục đích | Viết backend Feature 3: Quản lý viện phí & tích hợp BHYT |
| Phần việc liên quan | Backend / Coding |
| Mức độ sử dụng | Sinh code chính |

#### 5.1. Prompt nguyên văn

```text
Làm chức năng : Quản lý Viện phí & Tích hợp Bảo hiểm Y tế. Hệ thống tự động gom chi phí
(khám, xét nghiệm, thuốc) thành phiếu thu tổng. Nhập mã thẻ BHYT, tự động tính mức khấu trừ.
Chỉ làm backend, không cần code frontend.
```

#### 5.2. Bối cảnh khi viết prompt

```text
Entity BillingInvoice, BillingItem, Payment đã có sẵn từ trước nhưng chưa có logic tính toán thật;
endpoint calculate-insurance cũ chỉ là stub luôn trả về khấu trừ = 0.
```

#### 5.3. Kết quả AI trả về

```text
AI đề xuất BillingService với 2 hàm: GenerateInvoiceAsync (gom phí khám + xét nghiệm + thuốc thành
BillingItem) và CalculateInsuranceAsync (tính khấu trừ BHYT 80%). Thêm endpoint POST /generate,
sửa lại /calculate-insurance dùng service mới.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Dùng cấu trúc service + endpoint AI đề xuất, áp dụng trực tiếp vào BillingInvoicesController.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
- Xóa hẳn đoạn code stub cũ thay vì giữ song song để tránh code chết.
- Tự quyết cách map giá xét nghiệm (LabOrder không lưu giá sẵn) bằng cách so khớp tên với MedicalService.
- Chạy dotnet build xác nhận 0 lỗi trước khi coi là xong.
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [x] Prompt có đủ bối cảnh
- [ ] Prompt còn thiếu thông tin
- [x] Prompt tạo ra kết quả tốt

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | 8181dd8 |
| File liên quan | src/Mediconnect.Application/Services/BillingService.cs; src/mediconnect/Controllers/EntityControllers.cs |
| Kết quả chạy/test | dotnet build: 0 Warning, 0 Error |
| Ghi chú khác | Không yêu cầu frontend cho feature này |

---

### Prompt số 12

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 02/07/2026 |
| Công cụ AI | Claude (Claude Code) |
| Mục đích | Kiểm tra lại Feature 1/2/3|
| Phần việc liên quan | Backend / Coding / Testing |
| Mức độ sử dụng | Sinh code chính |

#### 5.1. Prompt nguyên văn

```text
check lại feature 1,2,3
```


#### 5.2. Bối cảnh khi viết prompt

```text
frontend src/mediconnect-web xóa để làm lại.
```

#### 5.3. Kết quả AI trả về

```text
AI đề xuất ServiceRating entity + IPaymentGatewayService (VNPay ký HMACSHA512, Momo ký HMACSHA256
mô phỏng), endpoint tạo link thanh toán và callback xác thực chữ ký.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Áp dụng toàn bộ cấu trúc AI đề xuất, tạo migration và chạy thử API thật bằng curl để xác nhận đúng.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
- Test thật thay vì chỉ đọc code: gọi API sinh invoice và phát hiện bug DbUpdateConcurrencyException
  từ Feature 3 cũ (Update() gọi thừa sau AddAsync), tự sửa bằng cách bỏ dòng thừa.
  chữ ký hợp lệ và giả mạo đều xử lý đúng.
- Chạy dotnet ef database update để áp dụng migration vào DB thật, không chỉ dừng ở code.
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [ ] Prompt có đủ bối cảnh
- [x] Prompt còn thiếu thông tin
- [x] Prompt tạo ra kết quả tốt

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | chưa commit |
| File liên quan | src/Mediconnect.Domain/Entities/ServiceRating.cs; src/Mediconnect.Infrastructure/Payments/; src/mediconnect/Controllers/EntityControllers.cs |
| Kết quả chạy/test | Test curl end-to-end: rating, invoice, payment, VNPay/Momo url, callback hợp lệ/giả mạo đều đúng |
| Ghi chú khác | Prompt ban đầu không nói rõ frontend đã bị xóa; phải tự phát hiện qua git status trước khi hỏi lại người dùng |

---
| Link commit | feat(member3): F3 - lab orders queue, results & file upload; feat(member3): F4 - discharge cost aggregation & billing handoff |
| File liên quan | src/mediconnect/Controllers/EntityControllers.cs; src/mediconnect/Program.cs; src/Mediconnect.Application/DTOs/EntityDtos.cs |
| Screenshot |  |
| Kết quả chạy/test | dotnet build: 0 Error(s) |
| Link tài liệu/báo cáo |  |
| Ghi chú khác |  |

#### 5.8. Ghi chú thêm

```text
Han che mo hinh du lieu: Bed thieu don gia, CareOrder khong gan Drug/gia -> chi phi thuoc/thu thuat liet ke line item gia 0 cho Thanh toan dien.
```

---

### Prompt số 9

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 06/06/2026 |
| Công cụ AI | Antigravity |
| Mục đích | Sửa lỗi mất session và tự động đăng xuất |
| Phần việc liên quan | Frontend / Debugging / Authentication |
| Mức độ sử dụng | Hỏi xử lý lỗi |

#### 5.1. Prompt nguyên văn

```text
toi khong vao duoc nhung man hinh vua tao, no cu bi mat session bat dang nhap
```

#### 5.2. Bối cảnh khi viết prompt

```text
Khi đăng nhập với vai trò Bác sĩ/Admin, trang bị tải lại liên tục và quay về màn đăng nhập /login, không thể truy cập dashboard hàng đợi.
```

#### 5.3. Kết quả AI trả về

```text
AI phân tích thấy trang LoginPage mặc định điều hướng mọi người dùng đến /booking (được bảo vệ chỉ cho phép Patient). Điều này dẫn đến vòng lặp chuyển hướng thất bại sang trang chủ, trả về 401 khi call API do thiếu quyền và trigger interceptor xóa token.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Sửa đổi LoginPage.tsx chuyển hướng theo role, và AuthContext.tsx để trả về user đồng bộ.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
Kiểm tra biên dịch và test thực tế, xác nhận Bác sĩ vào thẳng /clinic-dashboard và Admin vào thẳng /manage-services không còn bị logout.
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [x] Prompt có đủ bối cảnh
- [x] Prompt tạo ra kết quả tốt

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | |
| File liên quan | src/mediconnect-web/src/pages/LoginPage.tsx; src/mediconnect-web/src/context/AuthContext.tsx |

---

### Prompt số 10

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 20/06/2026 |
| Công cụ AI | Claude (Claude Code) |
| Mục đích | Kiểm thử end-to-end chức năng Statistics Report, thêm seed data, xác nhận sửa lỗi |
| Phần việc liên quan | Testing / Backend / Frontend |
| Mức độ sử dụng | Hỏi xử lý lỗi + sinh code |

#### 5.1. Prompt nguyên văn

```text
bạn test lại xem đã chạy ổn chức năng report này chưa
thêm data vào database rồi test lại
tất cả đã oke hết chưa
```

#### 5.2. Bối cảnh khi viết prompt

```text
Trang báo cáo thống kê đã được code trước đó nhưng chưa được kiểm thử thực tế trên
trình duyệt, dữ liệu mẫu trong database còn ít nên dashboard khó đánh giá đúng/sai.
```

#### 5.3. Kết quả AI trả về

```text
AI dựng môi trường Playwright (headless Chromium) tại C:/tmp/pwtest để tránh lỗi do
đường dẫn project có khoảng trắng, đăng nhập bằng tài khoản admin đã seed, điều hướng
qua từng filter (kỳ, khoảng ngày tuỳ chọn, khoa phòng) và chụp ảnh/đọc DOM để so sánh
số liệu hiển thị với số liệu thực trong database. Phát hiện 2 lỗi thật:
1. Lệch ngày: toDateStr() dùng toISOString() trả về giờ UTC, ở UTC+7 ngày 1/6 local
   bị lùi thành 31/5.
2. endDate không bao trọn ngày cuối ở backend (ReportQuery), khiến khoảng ngày tuỳ
   chọn bị thiếu dữ liệu của ngày cuối cùng.
Sau khi sửa, AI seed thêm dữ liệu (departments, invoices, bed assignments) qua SQL
trực tiếp để dashboard có số liệu phong phú hơn rồi test lại để xác nhận khớp số.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Áp dụng cả 2 bản sửa lỗi (frontend reportUtils.ts và backend ReportQuery.cs) và giữ
lại dữ liệu seed thêm trong database để phục vụ demo/kiểm thử về sau.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
Tự kiểm tra lại bằng cách đối chiếu số liệu trả về từ API với SQL query thủ công
trước khi xác nhận đã sửa đúng; xoá các script test tạm sau khi xác nhận xong.
```

#### 5.6. Đánh giá chất lượng prompt

- [ ] Prompt rõ ràng
- [ ] Prompt có đủ bối cảnh
- [x] Prompt còn thiếu thông tin
- [x] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [ ] Cần tự kiểm tra và chỉnh sửa nhiều
- [x] Kết quả AI có lỗi hoặc chưa chính xác (lỗi nằm ở code cũ, được AI phát hiện qua test thật)

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit |  |
| File liên quan | src/Mediconnect.Infrastructure/Repositories/ReportQuery.cs; src/mediconnect-web/src/utils/reportUtils.ts |
| Screenshot | C:/tmp/pwtest/*.png |
| Kết quả chạy/test | C:/tmp/pwtest/*.mjs |
| Link tài liệu/báo cáo |  |
| Ghi chú khác |  |

#### 5.8. Ghi chú thêm

```text
Đây là ví dụ điển hình về việc AI tìm ra lỗi thật nhờ chạy thử ứng dụng (Playwright),
không chỉ đọc code suông — vì lỗi lệch ngày chỉ xuất hiện khi chạy ở giờ UTC+7.
```

---

### Prompt số 11

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 20/06/2026 |
| Công cụ AI | Claude (Claude Code) |
| Mục đích | Sinh code Screen 3.1 (Dashboard Doanh thu tài chính) và Screen 3.2 (Dashboard Báo cáo vận hành) từ backend đến frontend |
| Phần việc liên quan | Backend / Frontend / Design |
| Mức độ sử dụng | Hỏi sinh code |

#### 5.1. Prompt nguyên văn

```text
Dashboard Thống kê & Báo cáo
Screen 3.1: Dashboard Doanh thu tài chính - Các biểu đồ cột, biểu đồ đường thể hiện
doanh thu theo ngày, tháng và lọc theo từng khoa phòng.
Screen 3.2: Dashboard Báo cáo vận hành - Biểu đồ tròn và bảng số liệu phân tích công
suất giường bệnh nội trú, biểu đồ đường thể hiện số lượt khám ngoại trú.
hãy làm theo 2 màn hình như này từ backend đến frontend
```

#### 5.2. Bối cảnh khi viết prompt

```text
Trang report cũ là 1 trang gộp chung, chưa khớp đúng với đặc tả 2 màn hình riêng biệt
(3.1 doanh thu, 3.2 vận hành) mà đề bài yêu cầu, nên cần tách lại và bổ sung đúng loại
biểu đồ theo từng màn.
```

#### 5.3. Kết quả AI trả về

```text
AI thiết kế DTO/Interface/Query/Controller mới cho Report module (tái dùng pattern
CQRS-lite + flat projection đã có trong IStaffScheduleQuery), tách trang cũ thành 2
trang riêng: RevenueDashboardPage (biểu đồ cột + đường, filter kỳ/khoa phòng, export
CSV) và OperationsReportPage (biểu đồ tròn công suất giường + bảng theo khoa + biểu đồ
đường lượt khám ngoại trú). Tự viết SVG chart component (Bar/Line/Pie) thay vì dùng
thư viện ngoài để giữ bundle nhẹ.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Áp dụng toàn bộ: ReportDtos.cs, IReportQuery.cs, ReportQuery.cs, ReportsController.cs,
RevenueDashboardPage.tsx, OperationsReportPage.tsx, các component chart/report dùng
chung, và route /reports/revenue, /reports/operations trong App.tsx.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
Xoá trang StatisticsReportPage.tsx cũ (đã được thay thế hoàn toàn); kiểm thử lại bằng
Playwright sau khi tách trang để đảm bảo không phát sinh lỗi mới; bổ sung link điều
hướng "Doanh thu"/"Vận hành" vào Header (cả desktop và mobile menu).
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [x] Prompt có đủ bối cảnh
- [ ] Prompt còn thiếu thông tin
- [x] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [ ] Cần tự kiểm tra và chỉnh sửa nhiều
- [ ] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit |  |
| File liên quan | src/Mediconnect.Application/DTOs/ReportDtos.cs; src/Mediconnect.Infrastructure/Repositories/ReportQuery.cs; src/mediconnect/Controllers/ReportsController.cs; src/mediconnect-web/src/pages/RevenueDashboardPage.tsx; src/mediconnect-web/src/pages/OperationsReportPage.tsx |
| Screenshot |  |
| Kết quả chạy/test |  |
| Link tài liệu/báo cáo |  |
| Ghi chú khác |  |

#### 5.8. Ghi chú thêm

```text
Prompt dán nguyên văn đặc tả đề bài (copy từ checklist môn học) giúp AI bám sát đúng
yêu cầu loại biểu đồ cho từng màn hình, tránh làm lại 1 trang gộp như trước.
```

---

### Prompt số 12

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 20/06/2026 |
| Công cụ AI | Claude (Claude Code) |
| Mục đích | Đối chiếu checkfile.md để xác định các screen của Admin (Thành viên 4) đã có/chưa có trong project |
| Phần việc liên quan | Requirement / Design |
| Mức độ sử dụng | Hỏi phân tích |

#### 5.1. Prompt nguyên văn

```text
hãy đọc file này và tổng hợp các screen nào là của admin mà cái nào đã có trong
project và cái nào chưa có
```

#### 5.2. Bối cảnh khi viết prompt

```text
Cần rà soát lại toàn bộ đặc tả 4 thành viên (checkfile.md) để biết phần việc của
Thành viên 4 (Admin) còn thiếu màn hình nào trước khi tiếp tục code.
```

#### 5.3. Kết quả AI trả về

```text
AI liệt kê 6 screen thuộc Thành viên 4: Quản lý nhân sự (1.1), Cảnh báo tương tác
thuốc (2.1), Banner cảnh báo quá liều (2.2), Dashboard Doanh thu (3.1), Dashboard Vận
hành (3.2), Quản lý tài khoản (4.1), Cấu hình OTP (4.2). Đối chiếu với project hiện
tại: 3.1/3.2 đã có; 1.1/2.1/4.1 đã có backend đầy đủ nhưng chưa có trang frontend;
2.2/4.2 chưa có cả backend và frontend.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Dùng bảng tổng hợp này làm checklist để quyết định thứ tự ưu tiên hoàn thiện các
trang còn thiếu (1.1, 2.1, 4.1 trước vì đã có backend sẵn).
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
Tự kiểm tra lại bằng cách grep trực tiếp routes/controllers trong source code để xác
nhận đúng những gì AI báo là "đã có backend" thực sự tồn tại trước khi tin theo.
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [x] Prompt có đủ bối cảnh
- [ ] Prompt còn thiếu thông tin
- [x] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [ ] Cần tự kiểm tra và chỉnh sửa nhiều
- [ ] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit |  |
| File liên quan | checkfile.md |
| Screenshot |  |
| Kết quả chạy/test |  |
| Link tài liệu/báo cáo |  |
| Ghi chú khác |  |

#### 5.8. Ghi chú thêm

```text
Prompt phân tích kèm file đặc tả gốc giúp AI tổng hợp chính xác hơn việc tự đoán scope
dựa trên tên file/route trong code.
```

---

### Prompt số 13

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 20/06/2026 |
| Công cụ AI | Claude (Claude Code) |
| Mục đích | Hoàn thiện frontend cho 3 trang Admin còn thiếu UI: Quản lý nhân sự, Cảnh báo tương tác thuốc (CDSS), Quản lý tài khoản |
| Phần việc liên quan | Frontend / Coding / Testing |
| Mức độ sử dụng | Hỏi sinh code |

#### 5.1. Prompt nguyên văn

```text
hãy hoàn thiện các trang đang nửa vời
```

#### 5.2. Bối cảnh khi viết prompt

```text
Theo kết quả đối chiếu ở Prompt số 12, 3 màn hình (Quản lý nhân sự, Cảnh báo tương tác
thuốc, Quản lý tài khoản) đã có đầy đủ API backend nhưng chưa có giao diện, cần hoàn
thiện để đủ chức năng cho vai trò Admin.
```

#### 5.3. Kết quả AI trả về

```text
AI sinh 3 trang React đầy đủ CRUD: StaffManagementPage (giới hạn tạo mới chỉ với
UserAccount có role Doctor/Nurse chưa có StaffProfile), UserManagementPage (KPI tổng
quan, khoá/mở khoá, đổi role, có chặn admin tự khoá/tự xoá/tự đổi role của chính
mình), DrugInteractionPage (3 tab: kiểm tra tương tác thuốc với popup đỏ cảnh báo,
danh mục thuốc, danh mục cặp tương tác). Bổ sung dropdown "Quản trị" và route mới vào
Header/App.tsx. Sau đó tự viết script Playwright gọi thẳng API qua fetch() trong
page.evaluate() để xác nhận các thay đổi (khoá/mở khoá, đổi role, xoá) thực sự được
lưu ở backend, không chỉ đổi trên UI.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Áp dụng toàn bộ 3 trang mới, cập nhật services.ts (userApi, drugApi,
drugInteractionApi, cdssApi) và types/index.ts (Drug, DrugInteraction), cập nhật
Header.tsx với dropdown Quản trị.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
Phát hiện 1 lần test báo sai "Interaction warning shown: false" do chính script test
dùng selector mơ hồ (button:has-text("Kiểm tra") trùng cả nút tab và nút submit) —
xác nhận lại bằng selector cụ thể hơn để chứng minh đây là lỗi của script test, không
phải lỗi ứng dụng, trước khi kết luận. Sau khi xác minh xong, xoá dữ liệu test tạo ra
(3 thuốc, 1 cặp tương tác, 1 tài khoản test) để database sạch.
```

#### 5.6. Đánh giá chất lượng prompt

- [ ] Prompt rõ ràng
- [ ] Prompt có đủ bối cảnh
- [x] Prompt còn thiếu thông tin
- [x] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [ ] Cần tự kiểm tra và chỉnh sửa nhiều
- [ ] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit |  |
| File liên quan | src/mediconnect-web/src/pages/StaffManagementPage.tsx; src/mediconnect-web/src/pages/UserManagementPage.tsx; src/mediconnect-web/src/pages/DrugInteractionPage.tsx |
| Screenshot | C:/tmp/pwtest/admin_users.png; C:/tmp/pwtest/admin_staff.png; C:/tmp/pwtest/cdss_check_fixed.png |
| Kết quả chạy/test | C:/tmp/pwtest/test_admin_pages.mjs; C:/tmp/pwtest/test_user_actions.mjs; C:/tmp/pwtest/test_cdss_check.mjs |
| Link tài liệu/báo cáo |  |
| Ghi chú khác |  |

#### 5.8. Ghi chú thêm

```text
Prompt ngắn ("hoàn thiện các trang đang nửa vời") chỉ hiệu quả vì có Prompt số 12 làm
rõ scope trước đó — minh chứng cho việc nên tách bước phân tích yêu cầu ra trước khi
yêu cầu sinh code hàng loạt.
```

---

### Prompt số 14

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 01/07/2026 |
| Công cụ AI | Claude (Claude Code) |
| Mục đích | Hoàn thiện 2 Screen còn thiếu của Thành viên 4: Banner cảnh báo quá liều (2.2) và Cấu hình/bảo mật OTP (4.2) |
| Phần việc liên quan | Requirement / Backend / Frontend / Database / Testing |
| Mức độ sử dụng | Hỏi sinh code |

#### 5.1. Prompt nguyên văn

```text
tìm hiểu dự án còn thiếu các screen nào trong các screen này rồi làm cho tôi
[kèm toàn bộ đặc tả Thành viên 4: Feature 1-4, 8 Screen, User Flows]
```

#### 5.2. Bối cảnh khi viết prompt

```text
Sau khi đã hoàn thiện 6/8 screen của Thành viên 4 ở các phase trước, cần rà soát lại
toàn bộ đặc tả một lần nữa để xác nhận chính xác 2 screen còn thiếu trước khi code tiếp,
tránh làm trùng hoặc bỏ sót.
```

#### 5.3. Kết quả AI trả về

```text
AI tự đối chiếu lại 8 Screen với source code hiện tại, xác nhận đúng 2 Screen còn thiếu
hoàn toàn: Screen 2.2 (Banner cảnh báo quá liều) và Screen 4.2 (Cấu hình & bảo mật OTP).
Sau đó tự thiết kế và sinh toàn bộ:
- Backend Screen 2.2: cột MaxDailyDose/MaxDosePerKg trên Drug, logic DoseCheck thật (ưu
  tiên ngưỡng theo cân nặng bệnh nhân, fallback ngưỡng tuyệt đối), endpoint GET /api/patients.
- Backend Screen 4.2: entity OtpSetting/OtpCode, OtpController (settings, issue, verify,
  nhật ký), sinh mã bằng RandomNumberGenerator (crypto-random).
- Frontend: tab "Cảnh báo quá liều" trong DrugInteractionPage.tsx, trang OtpSecurityPage.tsx
  mới, thêm route + link điều hướng.
- Tự tạo và áp dụng EF migration, tự kiểm thử toàn bộ bằng Playwright (15/15 pass).
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Áp dụng toàn bộ backend (entity, DTO, controller, migration) và frontend (tab dose-check
+ trang OTP mới) vào project sau khi xác nhận build sạch và test Playwright pass.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
Yêu cầu AI kiểm chứng cả 2 công thức tính ngưỡng liều (theo cân nặng và tuyệt đối) bằng
2 kịch bản test riêng biệt, thay vì chỉ test 1 nhánh rồi coi như xong cả 2.
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [x] Prompt có đủ bối cảnh
- [ ] Prompt còn thiếu thông tin
- [x] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [ ] Cần tự kiểm tra và chỉnh sửa nhiều
- [ ] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | 2f9833b |
| File liên quan | src/mediconnect/Controllers/CdssController.cs; OtpController.cs; src/mediconnect-web/src/pages/OtpSecurityPage.tsx |
| Screenshot | C:/tmp/pwtest/new_dose_overdose.png; C:/tmp/pwtest/new_otp.png |
| Kết quả chạy/test | C:/tmp/pwtest/test_new_screens.mjs — 15/15 PASS |
| Link tài liệu/báo cáo |  |
| Ghi chú khác |  |

#### 5.8. Ghi chú thêm

```text
Phát hiện phụ: class CSS animate-pulse-slow được dùng ở banner cảnh báo tương tác thuốc
(Screen 2.1) từ trước nhưng chưa từng được định nghĩa trong index.css, nên banner đó
chưa từng thực sự nhấp nháy như đặc tả yêu cầu — đã sửa luôn cho cả 2 banner (2.1 và 2.2).
```

---

### Prompt số 15

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 01/07/2026 |
| Công cụ AI | Claude (Claude Code) |
| Mục đích | Tích hợp gửi OTP thật qua Email (SMTP) dùng chung cho Gmail App Password và SendGrid |
| Phần việc liên quan | Backend / Coding / Testing |
| Mức độ sử dụng | Hỏi sinh code |

#### 5.1. Prompt nguyên văn

```text
mình muốn dùng otp thật hãy làm cho mình tích hợp send grid với google app passwords
```

#### 5.2. Bối cảnh khi viết prompt

```text
Screen 4.2 (Cấu hình & bảo mật OTP) ở Prompt số 14 mới chỉ gửi OTP mô phỏng (hiện mã
trên UI để demo). Cần nâng cấp thành gửi email thật, hỗ trợ cả 2 lựa chọn phổ biến:
Gmail App Password (miễn phí, có sẵn tài khoản) và SendGrid (dịch vụ email chuyên dụng).
```

#### 5.3. Kết quả AI trả về

```text
AI nhận ra Gmail App Password và SendGrid đều dùng chung chuẩn SMTP, chỉ khác host/
credential, nên thiết kế 1 abstraction IOtpSender + 1 implementation SmtpOtpSender
(dùng MailKit) phục vụ cả 2, thay vì viết 2 sender riêng biệt. Cơ chế: khi gửi thật
thành công thì che mã khỏi API response/nhật ký (bảo mật); khi lỗi/chưa cấu hình thì
tự fallback về mô phỏng (không chặn luồng issue OTP). Credential đặt trong
appsettings.Development.json (đã gitignore), appsettings.json chỉ chứa placeholder
rỗng kèm hướng dẫn điền. Tự kiểm chứng đường thật bằng cách trỏ tạm SmtpHost sang host
không tồn tại, xác nhận MailKit thực sự cố gắng kết nối (lỗi DNS thật), fallback êm.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Áp dụng toàn bộ IOtpSender, SmtpOtpSender, OtpEmailOptions, migration cột Delivered,
cập nhật OtpController + OtpSecurityPage.tsx sau khi xác nhận cả đường mô phỏng
(15/15 pass) và đường SMTP thật (fallback đúng khi lỗi DNS) đều hoạt động.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
Yêu cầu AI xác nhận rõ credential không bị lộ lên git trước khi commit, và được AI chủ
động cảnh báo rằng appsettings.Development.json thực ra đã được git track từ trước
(dù có tên trong .gitignore) — đề xuất dùng git update-index --skip-worktree để tránh
commit nhầm credential thật sau này.
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [ ] Prompt có đủ bối cảnh
- [x] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [ ] Cần tự kiểm tra và chỉnh sửa nhiều
- [ ] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | 2f9833b |
| File liên quan | src/Mediconnect.Infrastructure/Notifications/SmtpOtpSender.cs; src/mediconnect/appsettings.json |
| Screenshot |  |
| Kết quả chạy/test | C:/tmp/pwtest/test_smtp_path.mjs — emailConfigured=true, delivered=false với lỗi DNS thật, verify vẫn thành công qua mã fallback |
| Link tài liệu/báo cáo |  |
| Ghi chú khác |  |

#### 5.8. Ghi chú thêm

```text
Prompt không nêu rõ "dùng chung 1 sender hay 2 sender riêng" nhưng AI tự suy luận được
điểm chung kỹ thuật (cùng SMTP) để chọn phương án gộp — giảm trùng lặp code mà vẫn đáp
ứng đủ yêu cầu, không cần hỏi lại.
```

---

### Prompt số 16

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 06/07/2026 |
| Công cụ AI | Claude Code (claude-sonnet-5 / claude-opus-4-8) |
| Mục đích | Migrate 18 trang React còn lại sang Blazor Server + sửa nav/Home theo đúng vai trò, tự chẩn đoán bug 500, hỗ trợ git branch/commit/push |
| Phần việc liên quan | Frontend (Blazor) / Backend enrichment / Git workflow |
| Mức độ sử dụng | Sinh code chính |

#### 5.1. Prompt nguyên văn

```text
tiep tuc cong viec
phần số 3 này trang nào cũng xuất hiện, hãy làm cho nó đùng flow
hiện trang chủ chưa đúng ở các trang đặt lại tên có các chức năng f1-f2-f3-f4 vân của dev3
admin phai chia chính xác làm những việc gì, chứ không phải quản lý hết tất cả các trang
để f1-f2-f3-f4 vậy luôn à, phải xóa đi chứ
thay vì để đăng xuất thì ấn vào tên bác sĩ rồi dropdown xuống để đỡ diện tích
trang chủ sẽ xuất hiện đầu tiên đi vào account, và xóa chữ trang chủ trên navbar, và vào chữ mediconnect thì ra trang chủ
danh gia loi 500
tạo nhánh mới cho việc sửa UI rồi push lên ko bỏ author by claude
```

#### 5.2. Bối cảnh khi viết prompt

```text
Phần migrate 18 trang React (Booking/Billing/PHR/ScheduleManagement/ClinicDashboard/
OutpatientRecord/Admin CRUD/Reports) sang Blazor đã được thực hiện ở phiên trước nhưng
CHƯA từng commit. Phiên này tiếp tục hoàn tất phần còn lại, sau đó người dùng phát hiện
nav bar F1-F4 hiện cho mọi role kể cả Patient, Home dashboard không phân quyền, Admin
đang thấy cả các trang vận hành lâm sàng thay vì chỉ quản trị/thống kê, và nhãn nội bộ
"F1-F4" bị lộ ra UI thật.
```

#### 5.3. Kết quả AI trả về

```text
- Role-gate lại từng link F1-F4 trong NavMenu khớp đúng [Authorize] của trang đích; thu
  hẹp Admin về đúng phạm vi quản trị/thống kê (xác nhận qua AskUserQuestion trước khi sửa
  vì đây là thay đổi quyền truy cập thật, không chỉ đổi menu).
- Viết lại Home.razor thành tile role-scoped bằng AuthorizeView lồng nhau thay vì 4 tile
  F1-F4 cứng cho mọi người.
- Bỏ toàn bộ nhãn "F1/F2/F3/F4" khỏi nav, PageTitle, Home tile.
- Gộp chip tên + nút đăng xuất trong MainLayout.razor thành dropdown; xóa link "Trang chủ"
  dư (logo + luồng login đã điều hướng về "/" sẵn).
- Tự curl trực tiếp endpoint để tìm nguyên nhân "Lỗi 500" thay vì đoán qua UI: phát hiện
  4 migration EF Core (AddStaffScheduleShiftType, AddDoseThresholdsAndOtp,
  AddOtpDeliveredFlag, AddServiceRating) đã có sẵn trong code nhưng chưa từng chạy
  `dotnet ef database update` trên DB dev — không liên quan gì tới trang Blazor mới.
- Tạo branch mới, tách đúng 2 commit trên cùng branch theo yêu cầu (1: toàn bộ phần migrate
  Blazor chưa từng commit, 2: riêng sửa UI của phiên này), không gắn "Co-Authored-By: Claude".
  Phát hiện máy không có credential helper git lẫn `gh` — cài `github-cli` qua pacman và
  hướng dẫn `gh auth login` (device code flow) để có quyền push.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Áp dụng toàn bộ 18 trang Blazor + IInpatientQuery + các sửa nav/Home/MainLayout sau khi
`dotnet build` sạch ở mỗi bước; áp 4 migration EF Core vào DB dev thật và xác nhận lại
bằng curl (endpoint chuyển từ 500 sang 200); push branch `feature/ui-fixes-role-nav` với
2 commit rõ ràng lên origin.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
- Chốt phạm vi quyền Admin qua AskUserQuestion trước khi sửa code, vì đây là thay đổi
  access-control thật (Admin mất quyền vào trang vận hành lâm sàng), không phải chỉ đổi UI.
- Tự kiểm tra .gitignore trước khi git add để tránh kéo build artifact (bin/obj) đã lỡ
  track từ trước vào 2 commit mới.
- Xác nhận `dotnet build` 0 lỗi ở cả 2 trạng thái (trước và sau khi tách commit) để đảm bảo
  không commit nhầm trạng thái code không build được.
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [ ] Prompt có đủ bối cảnh
- [x] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [x] Cần hỏi lại AI nhiều lần
- [ ] Cần tự kiểm tra và chỉnh sửa nhiều
- [ ] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | 7aba0b3, 5e09d6b (branch `feature/ui-fixes-role-nav`) |
| File liên quan | `Components/Pages/*.razor` (18 trang mới); `Components/Layout/NavMenu.razor`, `MainLayout.razor`, `Home.razor`; `Mediconnect.Application/Interfaces/IInpatientQuery.cs` |
| Screenshot |  |
| Kết quả chạy/test | `dotnet build`: 0 Warning/0 Error; `dotnet ef database update`: 4 migration áp thành công; curl `/api/serviceratings`: 500 → 200 |
| Link tài liệu/báo cáo |  |
| Ghi chú khác | Branch đã push lên origin, PR chưa tạo tại thời điểm ghi log |

#### 5.8. Ghi chú thêm

```text
Prompt "danh gia loi 500" ngắn và không nêu rõ nguyên nhân, nhưng việc curl trực tiếp
endpoint (thay vì chỉ đọc lại code Blazor vừa sửa) giúp tìm đúng gốc rễ (migration EF
Core chưa áp dụng) chỉ trong 1 lần thử, tránh sửa nhầm chỗ không liên quan.
```

---

### Prompt số 17

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 12/07/2026 - 13/07/2026 |
| Công cụ AI | Claude Code (claude-sonnet-5) |
| Mục đích | Kiểm thử trực tiếp luồng nghiệp vụ khám vãng lai/kê đơn/CDSS trên browser, sửa các lỗi phát hiện được qua test thực tế |
| Phần việc liên quan | Backend (QueueService, Controllers) / Frontend (Blazor) / Database (seed data, migration) |
| Mức độ sử dụng | Sinh code chính + tự phát hiện & fix bug qua test thực tế |

#### 5.1. Prompt nguyên văn

```text
hãy thử thêm 1 bệnh nhân vãng lai vào hàng đợi, tiếp nhận họ và ghi đơn thuốc, chẩn đoán
theo như nghiệp vụ thông thường sau đó kiểm tra xem có vấn đề gì với data
đề xuất luôn hướng fix cho 2 lỗi này
giờ giả sử tôi muốn làm theo kiểu mỗi lần thêm khách vãng lai là giống như bác sĩ sẽ tạo
thủ công patient
tôi muốn tránh việc phải chỉnh sửa vào module mà tôi không làm; hãy giải thích nếu điều đó
cần thiết
chốt lại kế hoạch với sửa service — lưu ý: queue không phải tôi viết tôi không kiểm tra
được, chỉ viết thêm vào không thay thế
cập nhật file sql mới đó vào db, xóa hết data cũ (vì bản của tôi outdated)
thêm những seed mà tôi cần trực tiếp vào file sql đó, sau đó chạy lại db
tôi bị lỗi 500 khi tạo hồ sơ
tôi không nhập được tên thuốc / không click/focus vào ô được
gửi đến nhà thuốc là gửi đi đâu
Bỏ dropdown đi
đơn thuốc sẽ được chuyển qua cho admin -> tính năng test cảnh báo tương tác thuốc
hãy tiến hành flow bệnh nhân đặt lịch hẹn -> bác sĩ hoàn thành chẩn đoán và đơn thuốc để
tôi xem dữ liệu nó có về hồ sơ sức khỏe điện tử khồng, sử dụng tài khoản demo cho sẵn
cập nhật doc và commit
```

#### 5.2. Bối cảnh khi viết prompt

```text
Module DE190123 (SmartClinic: hàng đợi, hồ sơ ngoại trú, đơn thuốc điện tử) vừa được merge
vào develop. Thay vì chỉ đọc code để audit, người dùng yêu cầu chạy thử đúng luồng nghiệp vụ
thật qua trình duyệt (browser pane) để tìm lỗi thật thay vì lỗi lý thuyết. QueueService.cs là
module không phải người dùng tự viết nên yêu cầu chỉ được thêm mới, không được sửa/ghi đè logic
có sẵn.
```

#### 5.3. Kết quả AI trả về

```text
1. Check-in vãng lai → tên hiển thị "Bệnh nhân vãng lai" xuyên suốt hàng đợi, và không lưu
   được bệnh án vì OutpatientVisit.PatientId là FK bắt buộc nhưng walk-in chưa có
   PatientProfile. Fix: thêm PatientId/PatientName snapshot vào QueueTicket (migration mới,
   nullable), WalkInCheckInAsync tạo thật UserAccount + PatientProfile, 4 hàm đọc dữ liệu đọc
   snapshot trước rồi fallback về logic cũ — không sửa nhánh appointment hiện có.
2. Lưu chẩn đoán lần đầu cho bất kỳ bệnh nhân nào bị 500 vì thiếu try/catch quanh
   SaveMedicalRecordAsync — fix bằng try/catch giống pattern ClinicDashboardController.
3. seed_hospital.sql xóa 26 bảng nhưng chỉ insert lại 6 — MedicalServices và Drugs luôn rỗng.
   Thêm 16 dịch vụ + 14 thuốc (có thuốc trùng tên dị ứng demo để test cảnh báo, 1 thuốc hết
   hàng, 2 thuốc có MaxDailyDose để test CDSS quá liều).
4. Bỏ dropdown "Nhà thuốc/Phòng khám" giả trong e-prescription (không lọc theo địa điểm thật),
   fix bug chọn thuốc gợi ý làm xóa trắng ô tên thuốc, và nối thẳng 2 API CDSS (tương tác
   thuốc + quá liều) đã viết sẵn nhưng chưa từng dùng ngoài trang Admin riêng vào luồng kê
   đơn thật.
5. Chạy full flow demo (đặt lịch → khám → kê đơn → xem PHR) phát hiện thêm bug lệch ngày
   UTC/local ở tab "Lịch sử khám" của PHR — fix 1 dòng thiếu .ToLocalTime().
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Áp dụng toàn bộ 6 fix trên sau khi dotnet build sạch (0 Warning/0 Error) và test trực tiếp
qua Browser pane ở mỗi bước; áp dụng migration EF Core mới và seed_hospital.sql đã sửa vào DB
dev thật.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
- Đặt ràng buộc "chỉ thêm code mới, không viết lại logic có sẵn" cho QueueService.cs trước khi
  cho AI sửa, vì đây không phải module tự viết nên không tự kiểm chứng đúng/sai được.
- Quyết định bỏ hẳn dropdown "Nhà thuốc" giả và tích hợp CDSS thẳng vào luồng kê đơn, thay vì
  giữ nguyên hướng route qua Admin duyệt riêng như thiết kế ban đầu.
- Từ chối yêu cầu AI tự seed thêm dữ liệu DrugInteractions mẫu.
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [x] Prompt có đủ bối cảnh
- [ ] Prompt còn thiếu thông tin
- [x] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [ ] Cần tự kiểm tra và chỉnh sửa nhiều
- [ ] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | 49a2141, 51ce622, e26abc2, e664d5d, b0627a5 (sau này viết lại tiếng Anh ở Prompt số 18) |
| File liên quan | `QueueTicket.cs`, `QueueService.cs`, `SmartQueueDtos.cs`, `ClinicDashboard.razor`, migration `AddQueueTicketPatientSnapshot`; `OutpatientRecordController.cs`; `docs/seed_hospital.sql`; `EPrescriptionPanel.razor`, `OutpatientRecord.razor`, `EPrescription.razor`, `ApiClient.cs`; `PHR.razor` |
| Screenshot | |
| Kết quả chạy/test | `dotnet build`: 0 Warning/0 Error sau mỗi bước; test sống qua Browser pane từng bug; full flow đặt lịch → khám → kê đơn → PHR khớp 100% dữ liệu |
| Link tài liệu/báo cáo | docs/AI_AUDIT_LOG.md, "Lần sử dụng AI số 18" |
| Ghi chú khác | |

#### 5.8. Ghi chú thêm

```text
Chi tiết đầy đủ hơn (bao gồm cả log lỗi encoding khi seed) đã ghi ở docs/AI_AUDIT_LOG.md,
"Lần sử dụng AI số 18", tránh lặp lại toàn văn ở đây.
```

---

### Prompt số 18

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 13/07/2026 |
| Công cụ AI | Claude Code (claude-sonnet-5) |
| Mục đích | Viết lại 6 commit của Prompt số 17 sang tiếng Anh theo quy chuẩn, và soạn sẵn nội dung PR checklist |
| Phần việc liên quan | Git workflow / Documentation |
| Mức độ sử dụng | Thao tác git + soạn nội dung |

#### 5.1. Prompt nguyên văn

```text
giờ tôi muốn bạn undo hết commit để sửa về tiếng anh cho đúng quy chuẩn, mỗi commit liệt kê
nội dung, file nào bị sửa (nhấn mạnh nếu không phải của tôi), file nào được tạo
rewrite in feature/de190123-walkin-cdss-fixes
switch feature/de190123-walkin-cdss-fixes to the new history
delete
now help me do the pull request [kèm mẫu PR checklist] fill in these info
```

#### 5.2. Bối cảnh khi viết prompt

```text
6 commit của Prompt số 17 (walk-in/prescribing/CDSS) đang viết message bằng tiếng Việt,
không đúng quy chuẩn commit message của môn học/nhóm. Người dùng muốn giữ nguyên nội dung
thay đổi nhưng viết lại message tiếng Anh, có liệt kê rõ file sửa/tạo và đánh dấu file không
phải do mình viết để tránh nhận vơ công của người khác. Sau đó cần chuẩn bị PR theo mẫu
checklist của môn học nhưng máy không cài `gh` CLI.
```

#### 5.3. Kết quả AI trả về

```text
- `git reset --soft` về commit trước phiên (giữ nguyên toàn bộ nội dung thay đổi), rồi
  recommit từng nhóm file đúng như cũ với message tiếng Anh; mỗi message liệt kê rõ "Files
  modified" / "Files created", và với file không phải người dùng tự viết (dựa theo
  `git log <base> -1 -- <file>` xem tác giả cuối cùng trước phiên) thì ghi rõ "NOT authored
  by me (last touched by teammate X)". Xác nhận `git diff` giữa cây thư mục cũ và mới rỗng
  tuyệt đối trước khi coi là xong.
- Tạo branch tạm `feature/de190123-walkin-cdss-fixes-en` trỏ vào chuỗi commit viết lại, không
  đụng vào branch gốc đang checkout ở worktree chia sẻ khác cho tới khi được xác nhận rõ ràng.
- Khi thao tác `git reset --hard` trên worktree khác bị bộ lọc an toàn chặn lần đầu (do ghi
  chú cũ trong bộ nhớ về xung đột appsettings.json chưa giải quyết) — kiểm tra lại trạng thái
  thật (working tree sạch) và hỏi lại người dùng bằng AskUserQuestion trước khi thử lại.
- Soạn sẵn nội dung PR checklist (Description, Type of change, Related issue, AI Usage
  Declaration, Main AI Prompt, Verification, Evidence) dựa trên 6 commit thật và
  docs/AI_AUDIT_LOG.md #18, vì máy không có `gh` CLI nên đưa link "compare" GitHub + nội dung
  để người dùng tự dán vào, không tự ý push hay tạo PR thay.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Áp dụng: 6 commit viết lại tiếng Anh trên branch `feature/de190123-walkin-cdss-fixes` (branch
gốc được chuyển sang trỏ vào lịch sử mới sau khi xác nhận nội dung cây thư mục giống hệt);
xóa branch tạm `-en` sau khi không còn cần; nội dung PR checklist gửi qua chat để người dùng
tự dán vào GitHub.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
- Chỉ định rõ base branch (develop) và từ chối để AI tự push — tự kiểm soát thời điểm đẩy code
  lên remote.
- Yêu cầu AI xác nhận cây thư mục (git diff) giống hệt trước khi tin là viết lại commit không
  làm mất/lệch nội dung.
- Tự quyết định xóa branch tạm `-en` sau khi xác nhận branch chính đã trỏ đúng lịch sử mới.
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [x] Prompt có đủ bối cảnh
- [ ] Prompt còn thiếu thông tin
- [x] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [x] Cần hỏi lại AI nhiều lần
- [ ] Cần tự kiểm tra và chỉnh sửa nhiều
- [ ] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | bbf2a74, 71fbc6d, d60fa4d, 7ac842b, 8f995a0, 00de2c4 trên `feature/de190123-walkin-cdss-fixes` |
| File liên quan | (không đổi nội dung file so với Prompt số 17, chỉ viết lại message commit) |
| Screenshot | |
| Kết quả chạy/test | `git diff <commit cũ> <commit mới> --stat` rỗng — xác nhận nội dung cây thư mục không đổi |
| Link tài liệu/báo cáo | |
| Ghi chú khác | Chưa tạo PR thật trên GitHub tại thời điểm ghi log — chỉ soạn sẵn nội dung, chờ người dùng tự mở link và dán |

#### 5.8. Ghi chú thêm

```text
Bộ lọc an toàn (safety classifier) của công cụ chặn 1 lần thao tác git reset --hard trên
worktree khác vì thấy ghi chú cũ (đã lỗi thời) về xung đột file chưa giải quyết — minh chứng
việc nên luôn kiểm tra lại trạng thái git thật (git status) ngay trước khi thao tác thay vì
chỉ tin vào ghi chú/bối cảnh cũ.
```

---

### Prompt số 19

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 20/07/2026 – 23/07/2026 |
| Công cụ AI | Claude Code (claude-sonnet-5) |
| Mục đích | Xây Feature 4 – Telemedicine (video call) từ đầu: SignalR/WebRTC, fix crash camera, thông báo cuộc gọi cho bệnh nhân, đồng bộ kết thúc cuộc gọi 2 bên |
| Phần việc liên quan | Backend (SignalR Hub) / Frontend (Blazor, JS interop WebRTC) |
| Mức độ sử dụng | Viết code toàn bộ + tự phát hiện & fix bug qua test thực tế trên trình duyệt |

#### 5.1. Prompt nguyên văn

```text
hãy làm chức năng gọi video giữa bác sĩ và bệnh nhân cho lịch hẹn tele, dùng SignalR có sẵn
được không
camera bị từ chối quyền thì cả trang bị sập luôn chứ không phải chỉ mỗi video, sửa lại đi
bệnh nhân phải biết là có cuộc gọi đến chứ, hiện không thấy gì cả
1 bên tắt máy thì bên kia vẫn đứng hình không biết cuộc gọi đã kết thúc
```

#### 5.2. Bối cảnh khi viết prompt

```text
Feature 4 (Telemedicine) chưa có gì ngoài `TelemedicineSession` entity + CRUD API cơ bản đã
có sẵn từ trước, chưa có video call thật. Cần build từ đầu cơ chế signaling + WebRTC peer
connection, rồi sửa các bug lộ ra khi tự test 2 tab trình duyệt (1 bác sĩ, 1 bệnh nhân).
```

#### 5.3. Kết quả AI trả về

```text
1. Tạo `TelemedicineHub` (SignalR) làm relay tín hiệu offer/answer/ICE giữa 2 circuit Blazor
   Server — không mang PHI, chỉ relay SDP/ICE, room id là GUID không đoán được nên không cần
   [Authorize] riêng.
2. Viết `telemedicine.js` (WebRTC interop: getUserMedia, RTCPeerConnection, tạo offer/answer,
   add ICE candidate) và trang mới `/telemedicine/{RoomId}` (video local/remote, nút mute/tắt
   cam/kết thúc, panel bác sĩ để ghi chú + mở đơn thuốc).
3. Bọc `startLocalVideo` trong try/catch riêng — lỗi permission camera/mic (JSException) không
   được để văng ra ngoài vì sẽ sập cả circuit Blazor (ngắt kết nối cả trang), không chỉ mỗi
   video. Tách `_mediaError` khỏi `_error` để phần ghi chú/đơn thuốc vẫn dùng được khi không có
   camera.
4. Thêm polling 10 giây ở trang Appointments của bệnh nhân để phát hiện cuộc gọi đang chờ
   (`GetPendingCallForPatient`) vì hệ thống chưa có hub đẩy thông báo — hiện modal cho bệnh
   nhân bấm vào tham gia, tự động complete visit khi kết thúc cuộc gọi.
5. Thêm `NotifyCallEnded` vào Hub, gửi cho bên kia trước khi rời phòng (`LeaveRoom` xoá khỏi
   group nên phải gửi trước) để bên còn lại tự thoát ngay thay vì đứng hình chờ vô thời hạn.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Áp dụng toàn bộ sau khi xác nhận `dotnet build` sạch (0 Warning/0 Error) và test sống 2 tab
trình duyệt (bác sĩ + bệnh nhân) qua từng bug: từ chối quyền camera không sập trang, bệnh nhân
nhận được thông báo cuộc gọi đến, kết thúc cuộc gọi ở 1 bên thì bên kia thoát ngay.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
- Tự phát hiện lỗi crash camera không phải qua đọc code mà qua test thật (từ chối quyền
  camera trên trình duyệt), yêu cầu AI sửa ngay khi thấy trang trắng thay vì chỉ báo lỗi UI.
- Yêu cầu polling thay vì thiết kế lại toàn bộ cơ chế push notification (không có sẵn hub cho
  việc này), chấp nhận độ trễ tối đa 10 giây để không mở rộng phạm vi quá công việc chính.
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [x] Prompt có đủ bối cảnh
- [ ] Prompt còn thiếu thông tin
- [x] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [x] Cần hỏi lại AI nhiều lần
- [ ] Cần tự kiểm tra và chỉnh sửa nhiều
- [ ] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | `bb5706d` trên `feature/de190123-telemedicine` |
| File liên quan | `src/Mediconnect.Web/Hubs/TelemedicineHub.cs`; `src/Mediconnect.Web/wwwroot/js/telemedicine.js`; `src/Mediconnect.Web/Components/Pages/Telemedicine.razor`; `src/Mediconnect.Web/Components/Pages/Appointments.razor` |
| Screenshot | |
| Kết quả chạy/test | `dotnet build`: 0 Warning/0 Error; test sống 2 tab trình duyệt (doctor@mediconnect.local / patient@mediconnect.local): gọi video thành công, từ chối camera không sập trang, thông báo cuộc gọi đến hiện đúng, kết thúc cuộc gọi đồng bộ 2 bên |
| Link video demo | |
| Ghi chú khác | |

---

### Prompt số 20

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 23/07/2026 |
| Công cụ AI | Claude Code (claude-sonnet-5) |
| Mục đích | Fix UI đơn thuốc điện tử bị chật khi nhúng cạnh khung video call |
| Phần việc liên quan | Frontend (Blazor, CSS) |
| Mức độ sử dụng | Viết code toàn bộ |

#### 5.1. Prompt nguyên văn

```text
form kê đơn nhét vào cạnh video bị chật quá, chia cột kiểu cũ không hợp, sửa lại UI cho đỡ
chật đi
```

#### 5.2. Bối cảnh khi viết prompt

```text
`EPrescriptionPanel.razor` vốn dùng Bootstrap `col-*`/`row` — chia layout theo bề rộng
viewport (breakpoint sm/md/lg toàn màn hình). Khi nhúng panel này vào cột hẹp cạnh video call
(khoảng 360px), Bootstrap vẫn tính theo viewport rộng nên layout bị sai, các trường bị chật.
```

#### 5.3. Kết quả AI trả về

```text
Thay toàn bộ class Bootstrap `col-*`/`row` trong `EPrescriptionPanel.razor` bằng class CSS
container-query riêng viết trong `EPrescriptionPanel.razor.css` mới — layout tự tính theo bề
rộng của khung chứa panel thay vì viewport toàn trang. Chỉ đổi layout, không đổi hành vi.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Áp dụng sau khi xác nhận `dotnet build` sạch và xem trực quan qua browser: panel hiển thị đúng
tỉ lệ khi nhúng cạnh video (360px) lẫn khi dùng độc lập ở trang Outpatient Record cũ.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
Yêu cầu xác nhận không đổi hành vi (chỉ layout) trước khi merge, vì đây là file dùng chung
cho cả trang Outpatient Record cũ lẫn trang Telemedicine mới.
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [ ] Prompt có đủ bối cảnh
- [x] Prompt còn thiếu thông tin
- [x] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [ ] Cần tự kiểm tra và chỉnh sửa nhiều
- [ ] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | `a7a1472` trên `feature/de190123-telemedicine` |
| File liên quan | `src/Mediconnect.Web/Components/Shared/EPrescriptionPanel.razor`; `src/Mediconnect.Web/Components/Shared/EPrescriptionPanel.razor.css` |
| Screenshot | |
| Kết quả chạy/test | `dotnet build`: 0 Warning/0 Error; kiểm trực quan qua browser ở cả 2 chỗ dùng panel |
| Link video demo | |
| Ghi chú khác | File `EPrescriptionPanel.razor` vốn do teammate `minhPJ2812` viết — thay đổi lần này đổi class layout có sẵn, không phải chỉ thêm mới |

---

### Prompt số 21

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 23/07/2026 |
| Công cụ AI | Claude Code (claude-sonnet-5) |
| Mục đích | Thêm ghi Triệu chứng & Chẩn đoán ICD-10 ngay trong lúc gọi video |
| Phần việc liên quan | Frontend (Blazor) |
| Mức độ sử dụng | Viết code toàn bộ |

#### 5.1. Prompt nguyên văn

```text
khám qua tele mà không ghi triệu chứng/chẩn đoán gì thì sau này tính bill sao được, thêm phần
đó vào trang gọi video luôn đi, giống như bên khám vãng lai đã có
```

#### 5.2. Bối cảnh khi viết prompt

```text
Trang Telemedicine ban đầu (Prompt số 19) chỉ có ghi chú tự do + nút mở đơn thuốc, không có
chỗ ghi triệu chứng/mã ICD-10 như luồng khám vãng lai đã có ở `OutpatientRecord`. Vì Billing
tính phí dựa trên dữ liệu khám (xem Prompt số 22), thiếu bước này thì khám qua tele không có
cơ sở để tính bill.
```

#### 5.3. Kết quả AI trả về

```text
Thêm card "Triệu chứng & Chẩn đoán" vào panel bác sĩ trong trang Telemedicine: ô lý do khám
chính, ô mô tả triệu chứng, ô tìm mã ICD-10 có debounce + dropdown gợi ý (tái dùng
`SearchIcd10` đã có), nút "Lưu triệu chứng & chẩn đoán" gọi lại API `Diagnose` đã có sẵn.
Tách phần logic tạo `OutpatientVisit` (trước đây nằm riêng trong `OpenPrescription`) ra hàm
dùng chung `EnsureVisitCreatedAsync`, vì giờ có 2 nơi cần visit tồn tại trước khi ghi dữ liệu
(lưu chẩn đoán và mở đơn thuốc).
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Áp dụng sau khi xác nhận `dotnet build` sạch và test sống: nhập triệu chứng + chọn mã ICD-10
(vd E11) trong lúc đang gọi video, lưu thành công, xác nhận dữ liệu xuất hiện đúng ở Billing
và PHR sau đó.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
Yêu cầu tái dùng đúng API `Diagnose`/`SearchIcd10` đã có sẵn từ luồng khám vãng lai thay vì
viết endpoint riêng cho tele, giữ nhất quán dữ liệu chẩn đoán giữa 2 luồng.
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [x] Prompt có đủ bối cảnh
- [ ] Prompt còn thiếu thông tin
- [x] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [ ] Cần tự kiểm tra và chỉnh sửa nhiều
- [ ] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | `7bd9072` trên `feature/de190123-telemedicine` |
| File liên quan | `src/Mediconnect.Web/Components/Pages/Telemedicine.razor` |
| Screenshot | |
| Kết quả chạy/test | `dotnet build`: 0 Warning/0 Error; test sống: lưu triệu chứng + ICD-10 trong lúc gọi video thành công |
| Link video demo | |
| Ghi chú khác | |

---

### Prompt số 22

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 23/07/2026 |
| Công cụ AI | Claude Code (claude-sonnet-5) |
| Mục đích | Fix bill thiếu phí khám (bug có sẵn của Billing, không riêng tele) + Appointment.Status không bao giờ đổi khỏi "Chờ xác nhận" |
| Phần việc liên quan | Backend (Application service) / Frontend (Blazor) |
| Mức độ sử dụng | Viết code toàn bộ + tự phát hiện bug qua test thực tế |

#### 5.1. Prompt nguyên văn

```text
sao khám xong hoá đơn ra 0đ, đâu có tính phí khám vào
lịch hẹn khám xong rồi mà status vẫn còn chờ xác nhận, phải đổi qua hoàn thành chứ
```

#### 5.2. Bối cảnh khi viết prompt

```text
Test full flow đặt lịch → gọi video → chẩn đoán → tạo hoá đơn thì phát hiện 2 vấn đề: hoá đơn
tạo ra không có phí khám (chỉ có phí xét nghiệm/thuốc nếu có), và `Appointment.Status` đứng
yên ở "Chờ xác nhận" dù đã khám xong — cả 2 đều là bug có sẵn từ trước (Billing từ DE180526,
Appointment.Status chưa từng được cascade ở bất kỳ luồng nào), lộ ra rõ nhất khi test qua tele.
```

#### 5.3. Kết quả AI trả về

```text
1. Rà `Billing.razor.SubmitCreate`: không hề gửi `ExamServiceId` lên API tạo hoá đơn dù DTO có
   trường này. Thêm dropdown "Dịch vụ khám" lọc theo khoa của visit (`VisitOption` gán thêm
   `ClinicId`, `LoadData` dựng danh sách `ExamOptions` khớp khoa), chọn xong mới gửi kèm
   `ExamServiceId` khi tạo hoá đơn.
2. Rà toàn bộ luồng nghiệp vụ: không nơi nào từng gọi update `Appointment.Status`. Thêm
   `UpdateAppointmentStatus` vào `ApiClient`, gọi trong `EndCall()` của trang tele; đồng thời
   cascade `Appointment.Status = Completed` ngay trong `MedicalRecordService.SaveMedicalRecordAsync`
   (thêm `IRepository<Appointment>` vào constructor) để luồng walk-in/hẹn trước (không qua
   tele) cũng được cập nhật đúng, không chỉ riêng tele.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Áp dụng sau khi xác nhận `dotnet build` sạch (0 Warning/0 Error) và test sống: tạo hoá đơn sau
khám tele ra đúng phí khám + phí khác; hoàn tất khám (cả qua tele và walk-in/hẹn trước) đổi
đúng Appointment.Status sang Completed.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
Yêu cầu AI xác nhận đây là bug có sẵn của Billing (không phải lỗi mới do tele) trước khi sửa,
để tránh nhầm phạm vi fix chỉ áp dụng riêng cho tele trong khi bug ảnh hưởng toàn bộ luồng
billing sẵn có.
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [ ] Prompt có đủ bối cảnh
- [x] Prompt còn thiếu thông tin
- [x] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [x] Cần hỏi lại AI nhiều lần
- [ ] Cần tự kiểm tra và chỉnh sửa nhiều
- [ ] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | `3f21e3f` trên `feature/de190123-telemedicine` |
| File liên quan | `src/Mediconnect.Web/Components/Pages/Billing.razor`; `src/Mediconnect.Web/Services/ApiClient.cs`; `src/Mediconnect.Web/Components/Pages/Telemedicine.razor`; `src/Mediconnect.Application/Services/MedicalRecordService.cs` |
| Screenshot | |
| Kết quả chạy/test | `dotnet build` cả 2 project: 0 Warning/0 Error; test sống: hoá đơn sau khám tele có đúng phí khám; Appointment.Status chuyển Completed đúng ở cả 2 luồng |
| Link video demo | |
| Ghi chú khác | `Billing.razor` do teammate `minhPJ2812` viết ban đầu — thay đổi lần này sửa logic `LoadData`/`SubmitCreate` có sẵn, không phải chỉ thêm mới. `MedicalRecordService.cs` — thay đổi thêm dependency vào constructor có sẵn, không phải chỉ thêm mới. |

---

## 6. Prompt quan trọng nhất

Chọn một prompt có ảnh hưởng lớn nhất đến bài tập/project.

### 6.1. Prompt được chọn

```text
Làm chức năng Feature 2: Quản lý Hồ sơ Sức khỏe Điện tử (PHR) cho bệnh nhân. Bệnh nhân có thể xem lịch sử khám, đơn thuốc, kết quả xét nghiệm và tải file kết quả.
```

### 6.2. Vì sao prompt này quan trọng?

```text
Đây là prompt sinh ra nhiều code nhất trong cả dự án (~560 dòng TypeScript).
AI còn tự phân tích DTO mismatch và đề xuất giải pháp enrichment client-side mà không cần sửa backend.
```

### 6.3. Kết quả prompt này mang lại

```text
PHRPage.tsx hoàn chỉnh với 3 tab, 7 API calls song song, enrichment dữ liệu client-side,
modal xem chi tiết, tải file kết quả — đủ yêu cầu Feature 2.
```

### 6.4. Sinh viên/nhóm đã kiểm tra kết quả như thế nào?

```text
Chạy npm run build (0 TypeScript error), test thủ công route /health-records theo role,
kiểm tra console log [PHR] trong DevTools, đọc EntityDtos.cs xác nhận DTO shape.
```

### 6.5. Sinh viên/nhóm đã cải tiến gì từ kết quả AI?

```text

```

---

## 7. Prompt chưa hiệu quả

Ghi lại ít nhất một prompt chưa tạo ra kết quả tốt hoặc chưa phù hợp.

### 7.1. Prompt chưa hiệu quả

```text
Dán prompt chưa hiệu quả tại đây.
```

### 7.2. Vì sao prompt này chưa hiệu quả?

```text
Viết tại đây...
```

Gợi ý nguyên nhân:

- Prompt quá ngắn.
- Thiếu bối cảnh bài toán.
- Không nêu rõ yêu cầu đầu ra.
- Không cung cấp ngôn ngữ lập trình/công nghệ đang dùng.
- Không đưa lỗi cụ thể.
- Không đưa ví dụ input/output.
- Không yêu cầu AI giải thích.
- Hỏi AI làm toàn bộ thay vì hỏi từng phần.

### 7.3. Cách cải thiện prompt

```text
Viết tại đây...
```

### 7.4. Prompt sau khi cải tiến

```text
Dán prompt đã được cải tiến tại đây.
```

### 7.5. Kết quả sau khi cải tiến prompt

```text
Viết tại đây...
```

---

## 8. Bài học về cách viết prompt

### 8.1. Khi viết prompt, em/nhóm cần cung cấp thông tin gì để AI trả lời tốt hơn?

```text
Viết tại đây...
```

Gợi ý:

- Mục tiêu cần đạt.
- Bối cảnh bài toán.
- Công nghệ/ngôn ngữ lập trình đang dùng.
- Input/output mong muốn.
- Ràng buộc của đề bài.
- Lỗi đang gặp.
- Format kết quả mong muốn.
- Yêu cầu AI giải thích từng bước.

### 8.2. Em/nhóm đã học được gì về cách đặt câu hỏi cho AI?

```text
Viết tại đây...
```

### 8.3. Lần sau em/nhóm sẽ cải thiện prompt như thế nào?

```text
Viết tại đây...
```

---

## 9. Phân loại prompt đã sử dụng

Đánh dấu số lượng prompt theo từng nhóm.

| Loại prompt | Số lượng | Ví dụ prompt tiêu biểu |
|---|---:|---|
| Prompt phân tích yêu cầu | 3 | Prompt số 1, Prompt số 12, Prompt số 14 |
| Prompt giải thích kiến thức |  |  |
| Prompt thiết kế giải pháp | 1 | Prompt số 5 |
| Prompt thiết kế database | 1 | Prompt số 2 |
| Prompt sinh code mẫu | 6 | Prompt số 6, 7, 11, 13, 14, 15 |
| Prompt debug lỗi | 3 | Prompt số 8, 9, 10 |
| Prompt viết test case |  |  |
| Prompt review code |  |  |
| Prompt tối ưu code |  |  |
| Prompt viết báo cáo |  |  |
| Prompt chuẩn bị thuyết trình |  |  |
| Prompt khác |  |  |

---

## 10. Checklist chất lượng prompt

Sinh viên/nhóm tự kiểm tra chất lượng prompt đã dùng.

| Tiêu chí | Đã đạt? | Ghi chú |
|---|:---:|---|
| Prompt có mục tiêu rõ ràng |  |  |
| Prompt có đủ bối cảnh |  |  |
| Prompt có nêu công nghệ/ngôn ngữ sử dụng |  |  |
| Prompt có nêu yêu cầu đầu ra |  |  |
| Prompt không yêu cầu AI làm toàn bộ bài một cách máy móc |  |  |
| Prompt có yêu cầu AI giải thích hoặc phân tích |  |  |
| Kết quả AI được kiểm tra lại |  |  |
| Kết quả AI được chỉnh sửa trước khi sử dụng |  |  |
| Prompt quan trọng được ghi lại đầy đủ |  |  |
| Prompt sai/chưa hiệu quả được rút kinh nghiệm |  |  |

---

## 11. Cam kết sử dụng prompt minh bạch

Sinh viên/nhóm cam kết rằng:

- Các prompt quan trọng đã được ghi lại trung thực.
- Không che giấu việc sử dụng AI trong các phần quan trọng của bài.
- Không nộp nguyên văn kết quả AI nếu chưa kiểm tra và chỉnh sửa.
- Có khả năng giải thích các phần đã sử dụng từ AI.
- Chịu trách nhiệm với sản phẩm cuối cùng.

| Đại diện sinh viên/nhóm | Ngày xác nhận |
|---|---|
|  |  |
