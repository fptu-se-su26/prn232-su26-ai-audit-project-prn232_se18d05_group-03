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
| 5 | 05/06/2026 | Claude | Sinh code Feature 1: Bed Map & Inpatient Transfer | Them endpoints GET /api/beds/map, GET bed-assignments, POST transfer vao BedsController va InpatientAdmissionsController | Da sinh endpoints va DTOs dung clean architecture pattern | Có | src/mediconnect/Controllers/EntityControllers.cs; src/Mediconnect.Application/DTOs/EntityDtos.cs |
| 6 | 14/06/2026 | Claude | Sinh code Feature 2: Y lenh & cham soc hang ngay | Them endpoints GET vital-signs va GET care-orders theo ca nhap vien (loc theo ngay/loai/trang thai) vao InpatientAdmissionsController | Da sinh 2 nested-route endpoint tai su dung IRepository + SimpleMapper, build sach 0 error | Có | src/mediconnect/Controllers/EntityControllers.cs |
| 7 | 16/06/2026 | Claude | Sinh code Feature 3 & 4 (lam hai phan) | F3: queue chi dinh, nhap ket qua, upload file that; F4: discharge tong hop chi phi giuong/thuoc/thu thuat thanh invoice gui Thanh toan | Da sinh endpoints F3 (lab-orders/lab-results) va nang cap discharge F4, build sach 0 error | Có | src/mediconnect/Controllers/EntityControllers.cs; src/mediconnect/Program.cs; src/Mediconnect.Application/DTOs/EntityDtos.cs |
| 9 |  |  |  |  |  | Có / Không |  |
| 10 |  |  |  |  |  | Có / Không |  |
| 10 | 14/06/2026 | GitHub Copilot, Claude | Implement Outpatient Record UI and diagnose/create flow | Scaffold OutpatientRecordPage, handle diagnose->create->retry, add local/top search and header link | Implemented OutpatientRecordPage.tsx, header link, ClinicDashboard navigation and payload checks | Có | mediconnect-web/src/pages/OutpatientRecordPage.tsx |
| 11 | 14/06/2026 | GitHub Copilot | Debug duplicate PatientProfile creation | Avoid duplicate PatientProfile by checking existing profile before create (GET /api/patients/me) | Added getMe() check and fallback create in OutpatientRecordPage.tsx to prevent DB unique index error | Có | mediconnect-web/src/pages/OutpatientRecordPage.tsx |
| 12 | 28/06/2026 | Antigravity | Tích hợp NLM ICD-10 API thay thế `Icd10Catalog` chưa định nghĩa | `tim hieu ve du an... tiep tuc hoan thien sua doi tim kiem ICD-10 dua theo nlm api` + test E11/Hypertension | Sinh `SearchICD10Async()` inject HttpClient, URL NLM, parse `root[3]`, DTO `ICD10ResultDto`, đăng ký `AddHttpClient()` | Có | `src/Mediconnect.Application/Services/MedicalRecordService.cs`; `src/mediconnect/Modules/SmartClinic/OutpatientRecordController.cs`; `src/mediconnect/Program.cs` |
| 13 | 28/06/2026 | Antigravity | Sửa lỗi tên walk-in mất khi navigate sang OutpatientRecord | Cùng session với prompt 12; AI phân tích `QueueTicket` thiếu `PatientName` cột | Sinh `navigate('/outpatient-record', { state: { ticket, clinicId } })` và `useLocation` + `loc.state?.ticket` | Có | `src/mediconnect-web/src/pages/ClinicDashboardPage.tsx`; `src/mediconnect-web/src/pages/OutpatientRecordPage.tsx` |
| 14 | 29/06/2026 | Claude (claude.ai) | Implement E-Prescription feature: drug autocomplete (GET /api/drugs), allergy validation, pharmacy stock filter, send flow POST /api/prescriptions | Feature 3 E-Prescription: drug autocomplete debounced 250ms, allergy check [Penicillin/Peanuts/Sulfa Drugs], stock filter via GET /api/clinics/active, disabled add khi stock=0, send flow POST /api/prescriptions + /api/prescriptionitems | Sinh EPrescriptionPanel.tsx, EPrescriptionPage.tsx, update OutpatientRecordPage.tsx + services.ts + types/index.ts | Có | `src/mediconnect-web/src/pages/EPrescriptionPanel.tsx`; `src/mediconnect-web/src/pages/EPrescriptionPage.tsx`; `src/mediconnect-web/src/api/services.ts`; `src/mediconnect-web/src/types/index.ts` |
| 15 | 29/06/2026 | Claude (claude.ai) | Sidebar UI: nâng E-Prescription lên top-level section, visual parity với Outpatient Records, route /e-prescription | Promote E-Prescription: standalone top-level nav link "Đơn thuốc điện tử", order Queue → Outpatient Records → E-Prescription → Telemedicine, route /e-prescription với RoleProtectedRoute | Sinh Header.tsx nav link (desktop + mobile, isStaff block), App.tsx route với RoleProtectedRoute (Doctor, Nurse) | Có | `src/mediconnect-web/src/components/layout/Header.tsx`; `src/mediconnect-web/src/App.tsx` |

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

### Prompt số 9

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 14/06/2026 |
| Công cụ AI | GitHub Copilot, Claude |
| Mục đích | Implement Outpatient Record page and client-side diagnose/create flow |
| Phần việc liên quan | Frontend UI, API integration, routing |
| Mức độ sử dụng | Sinh code và gợi ý giải pháp |

#### 5.1. Prompt nguyên văn

```text
Create an Outpatient Record page for doctors using React+TypeScript: left waiting list, middle patient overview, right consultation form. Implement POST /api/medical-records/diagnose call. If server returns visit-not-found, call POST /api/OutpatientVisits to create visit and retry diagnose. Resolve doctorId mapping to StaffProfile.Id and create/reuse PatientProfile when missing. Add local search for waiting list and top-level search that scans clinic queues.
```

#### 5.2. Bối cảnh khi viết prompt

```text
Need a complete doctor-facing UI to record outpatient consultations and robust client behavior when backend requires an existing OutpatientVisit.
```

#### 5.3. Kết quả AI trả về

```text
Generated component scaffold, sample API calls, and suggested control flow: diagnose -> if visit missing -> create visit -> retry. Recommended resolving staff profile id via /api/staff/directory and checking/creating patient profile via /api/patients endpoints.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Implemented mediconnect-web/src/pages/OutpatientRecordPage.tsx, added header link and ClinicDashboard navigation, added payload checks and retries, and applied theme styles.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
Adapted payload shapes to match backend DTOs, added defensive checks (patient get/create, staffProfile resolution), improved error handling and messages, and prevented duplicate patient creation.
```

#### 5.6. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | branch: feature/de190123-outpatientRecords |
| File liên quan | mediconnect-web/src/pages/OutpatientRecordPage.tsx; mediconnect-web/src/components/layout/Header.tsx; mediconnect-web/src/pages/ClinicDashboardPage.tsx |

---

### Prompt số 10

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 14/06/2026 |
| Công cụ AI | GitHub Copilot |
| Mục đích | Debug duplicate PatientProfile creation (DB unique index violation) |
| Phần việc liên quan | Frontend error handling, API usage |
| Mức độ sử dụng | Gợi ý sửa lỗi và kiểm tra |

#### 5.1. Prompt nguyên văn

```text
Database throws unique index error when creating PatientProfile: IX_PatientProfiles_UserAccountId duplicate key. How to avoid duplicate creation in client-side flow that auto-creates patient profile?
```

#### 5.2. Bối cảnh khi viết prompt

```text
Client code attempted to auto-create PatientProfile before creating OutpatientVisit, causing SQL unique index violation when profile already exists (race or prior create).
```

#### 5.3. Kết quả AI trả về

```text
Recommend to call GET /api/patients/me (or endpoint to fetch patient profile by userAccountId) before creating; only call create when not found. Handle 404/409; surface clear message to user. Add logging and retry logic if needed.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Implemented patientApi.getMe() check in OutpatientRecordPage.tsx and fallback to patientApi.create() only when profile is absent. Added error handling to avoid duplicate insert and surfaced errors.
```

#### 5.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | branch: feature/de190123-outpatientRecords |
| File liên quan | mediconnect-web/src/pages/OutpatientRecordPage.tsx |

---

### Prompt số 11

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 28/06/2026 |
| Công cụ AI | Antigravity |
| Mục đích | Tích hợp NLM ClinicalTables API để tìm kiếm ICD-10, thay thế `Icd10Catalog.Search()` chưa định nghĩa |
| Phần việc liên quan | Backend / API integration / Debug |
| Mức độ sử dụng | Sinh code chính |

#### 5.1. Prompt nguyên văn

```text
tim hieu ve du an, chuc nang cua thanh vien "DE190123", tiep tuc hoan thien sua doi tim kiem "ICD-10" dua theo nlm api
Test kịch bản 1 (Tìm theo mã): Gõ thử chữ E11 xem dropdown có hiển thị các bệnh liên quan đến tiểu đường kèm mô tả tiếng Anh không.
Test kịch bản 2 (Tìm theo tên): Gõ thử chữ Hypertension xem hệ thống có hiển thị mã code I10 tương ứng không.
Test lưu trữ: Chọn 1 kết quả, tiến hành Save form và kiểm tra trực tiếp trong cơ sở dữ liệu.
```

#### 5.2. Bối cảnh khi viết prompt

```text
Build lỗi vì `Icd10Catalog.Search()` được gọi trong MedicalRecordService.cs nhưng class không tồn tại trong project.
Cần thay thế bằng giải pháp thực tế không cần tự duy trì bộ dữ liệu ICD-10 cục bộ.
```

#### 5.3. Kết quả AI trả về

```text
- Xác định root cause: class `Icd10Catalog` chưa được định nghĩa ở bất kỳ đâu.
- Đề xuất thay thế bằng NLM ClinicalTables API (miễn phí, không cần API key).
- URL: https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?terms={encodedQuery}&sf=code,name&df=code,name
- Sinh `SearchICD10Async()`: inject `HttpClient`, gọi `GetAsync`, parse JSON response 4-element array [count, codes[], fields[], displayStrings[][]].
  Đọc `root[3]` (displayStrings), mỗi phần tử là `[code, description]`.
- Sinh `ICD10ResultDto { Code, Description }` trong `MedicalRecordDtos.cs`.
- Sinh endpoint `GET icd10/search` trong `OutpatientRecordController.cs`.
- Hướng dẫn đăng ký `builder.Services.AddHttpClient()` (generic) trong `Program.cs`.
- Frontend: `searchIcd10(query)` gọi `GET /medical-records/icd10/search?query=`, type `Icd10Result` trong `types/index.ts`.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Áp dụng toàn bộ: SearchICD10Async(), ICD10ResultDto, endpoint GET icd10/search, AddHttpClient(),
searchIcd10() API call và Icd10Result type. Build thành công 0 Error, 0 Warning.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
- Xác nhận đăng ký generic `AddHttpClient()` (không typed) vì MedicalRecordService nhận HttpClient trực tiếp qua constructor.
- Test tay 2 kịch bản: "E11" → Diabetes mellitus; "Hypertension" → I10.
- Xác nhận endpoint trả về JSON đúng format Icd10Result[].
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [x] Prompt có đủ bối cảnh
- [x] Prompt tạo ra kết quả tốt
- [ ] Cần hỏi lại AI nhiều lần

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | `472681e feat(outpatient): add ICD-10 diagnosis lookup via NLM API` |
| File liên quan | `src/Mediconnect.Application/Services/MedicalRecordService.cs`; `src/Mediconnect.Application/DTOs/MedicalRecordDtos.cs`; `src/mediconnect/Modules/SmartClinic/OutpatientRecordController.cs`; `src/mediconnect/Program.cs`; `src/mediconnect-web/src/api/services.ts`; `src/mediconnect-web/src/types/index.ts` |
| Kết quả chạy/test | `dotnet build`: 0 Error(s), 0 Warning(s). Dropdown ICD-10 hoạt động trên giao diện bác sĩ. |

---

### Prompt số 12

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 28/06/2026 |
| Công cụ AI | Antigravity |
| Mục đích | Sửa lỗi tên bệnh nhân vãng lai bị mất khi điều hướng từ ClinicDashboard sang OutpatientRecord |
| Phần việc liên quan | Frontend / Routing / Data persistence |
| Mức độ sử dụng | Sinh code chính |

#### 5.1. Prompt nguyên văn

```text
(Cùng session với Prompt 11 — phát hiện trong quá trình test lưu trữ)
Tên bệnh nhân vãng lai không hiển thị trên trang OutpatientRecord sau khi nhấn "Ghi khám" từ ClinicDashboard.
```

#### 5.2. Bối cảnh khi viết prompt

```text
Entity `QueueTicket` trong DB không có cột `PatientName` (chỉ lưu ClinicId, AppointmentId, Number, IssuedAt, Status).
Khi doctor navigate sang /outpatient-record, tên walk-in bị mất vì API không thể resolve lại từ DB.
```

#### 5.3. Kết quả AI trả về

```text
- Xác định root cause: QueueTicket entity thiếu PatientName column → không thể resolve tên walk-in từ DB sau navigate.
- Đề xuất: truyền toàn bộ QueueTicketDetail object (đã có patientName từ WalkInCheckInAsync response) 
  qua React Router navigate state thay vì chỉ truyền ID.
- Code ClinicDashboardPage.tsx: navigate('/outpatient-record', { state: { ticket: currentPatient, clinicId: selectedClinicId } })
- Code OutpatientRecordPage.tsx: useLocation() → loc.state?.ticket → setSelectedTicket(state.ticket)
- Hiển thị: patient?.fullName || selectedTicket?.patientName || 'Bệnh nhân'
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Áp dụng navigate với router state trong ClinicDashboardPage.tsx (line 384).
Đọc lại trong OutpatientRecordPage.tsx bằng useLocation + loc.state (lines 66–73).
Hiển thị tên ưu tiên fullName > patientName (line 414).
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
- Xác nhận không cần DB migration vì giải pháp hoàn toàn client-side.
- Kiểm tra searchQuery flow (loc.state?.searchQuery) vẫn hoạt động song song.
- Test: check-in walk-in → gọi khám → Ghi khám → tên hiển thị đúng trên OutpatientRecord.
- Ghi nhận giới hạn: tên mất nếu user reload trang — known limitation do schema DB.
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [x] Prompt có đủ bối cảnh
- [x] Prompt tạo ra kết quả tốt
- [ ] Cần hỏi lại AI nhiều lần

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | `472681e feat(outpatient): fix walk-in patient data persistence` |
| File liên quan | `src/mediconnect-web/src/pages/ClinicDashboardPage.tsx`; `src/mediconnect-web/src/pages/OutpatientRecordPage.tsx`; `src/mediconnect-web/src/types/index.ts` (`QueueTicketDetail.patientName`) |
| Kết quả chạy/test | Tên walk-in hiển thị đúng trên OutpatientRecord. Không cần DB migration. |
| Ghi chú khác | Workaround dùng React Router state (ephemeral trong SPA session). Known limitation: tên mất nếu reload. |

---

### Prompt số 13

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 29/06/2026 |
| Công cụ AI | Claude (claude.ai) |
| Mục đích | Implement Feature 3 – E-Prescription: drug autocomplete, allergy conflict validation, pharmacy stock filter |
| Phần việc liên quan | Frontend / Feature / Coding |
| Mức độ sử dụng | Sinh code chính |

#### 5.1. Prompt nguyên văn

```text
## Objective
Feature 3 – Quản lý đơn thuốc ngoại trú (E-Prescription)

Target state (sau khi bác sĩ save OutpatientRecord):
1. Drug autocomplete từ live pharmacy inventory (GET /api/drugs, filter client-side)
2. Allergy conflict warning: kiểm tra thuốc chọn với known allergies [Penicillin, Peanuts, Sulfa Drugs]
3. Pharmacy stock filter: chỉ hiển thị thuốc có stockQuantity > 0 khi chọn pharmacy
4. Nút "Add to Prescription" disabled khi stock = 0
5. Active prescription list hiển thị thuốc đã thêm
6. Send to pharmacy: POST /api/prescriptions → POST /api/prescriptionitems per item

Constraints: không thêm DB migration, không thêm endpoint mới nếu có thể dùng endpoint hiện có.
```

#### 5.2. Bối cảnh khi viết prompt

```text
Cần implement tính năng kê đơn thuốc ngoại trú cho bác sĩ trong trang OutpatientRecord.
Yêu cầu: drug name autocomplete kết nối pharmacy inventory API, kiểm tra dị ứng phía client,
lọc thuốc theo kho của pharmacy được chọn, và disable nút thêm khi hết hàng.
```

#### 5.3. Kết quả AI trả về

```text
- Sinh E-Prescription component với drug autocomplete input gọi live pharmacy inventory API.
- Sinh allergy validation: so sánh drug được chọn với known allergy list [Penicillin, Peanuts, Sulfa Drugs];
  hiển thị cảnh báo conflict nếu trùng.
- Sinh pharmacy stock filter: dropdown chọn pharmacy → autocomplete drug scoped to pharmacy's stock.
- Logic disable: nút "Add to Prescription" disabled khi stock quantity = 0.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Áp dụng toàn bộ:
- EPrescriptionPanel.tsx (mới): drug autocomplete debounced 250ms, allergy check, stock filter, disabled state khi stock=0, send flow POST /api/prescriptions + /api/prescriptionitems
- EPrescriptionPage.tsx (mới): standalone page, Visit ID input, staffProfileId resolution via staffApi.getDirectory()
- OutpatientRecordPage.tsx: thêm import EPrescriptionPanel, savedVisitId state, render EPrescriptionPanel sau save thành công
- api/services.ts: thêm drugApi.getAll(), prescriptionApi.create(), prescriptionApi.addItem()
- types/index.ts: thêm DrugResult, ActivePrescriptionItem interfaces
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
- Không có Pharmacy entity trong DB → dùng GET /api/clinics/active (Clinic[]) làm pharmacy selector; stock filter global (stockQuantity > 0), không per-pharmacy
- PatientProfile không có AllergyInfo field → DEMO_ALLERGIES = ["Penicillin", "Peanuts", "Sulfa"] hardcoded constant
- Dùng GET /api/drugs (fetch all, filter client-side) thay vì thêm endpoint /drugs/search mới
- PrescriptionWriteDto.IssuedAt bắt buộc → truyền new Date().toISOString()
- UI redesign đồng bộ ClinicDashboard: rounded-2xl, material-symbols-outlined, emerald/rose color scheme
- Kiểm tra: npx tsc --noEmit → 0 errors (3 lần)
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [x] Prompt có đủ bối cảnh
- [x] Prompt tạo ra kết quả tốt
- [ ] Cần hỏi lại AI nhiều lần
- [x] Cần tự kiểm tra và chỉnh sửa nhiều (adapt vì không có Pharmacy entity / AllergyInfo field trong schema)

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | Chưa commit tại thời điểm ghi log (files untracked/modified trên nhánh main) |
| File liên quan | `src/mediconnect-web/src/pages/EPrescriptionPanel.tsx`; `src/mediconnect-web/src/pages/EPrescriptionPage.tsx`; `src/mediconnect-web/src/pages/OutpatientRecordPage.tsx`; `src/mediconnect-web/src/api/services.ts`; `src/mediconnect-web/src/types/index.ts` |
| Kết quả chạy/test | `npx tsc --noEmit`: 0 errors. Drug autocomplete hoạt động. Allergy warning hiển thị đúng. Stock=0 → nút Add disabled. Send flow → POST /api/prescriptions thành công. |
| Ghi chú khác | Allergy list cứng phía client (Penicillin, Peanuts, Sulfa Drugs) — không query DB. Pharmacy selector dùng Clinic entity thay thế. |

---

### Prompt số 14

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 29/06/2026 |
| Công cụ AI | Claude (claude.ai) |
| Mục đích | Sidebar UI: nâng E-Prescription từ sub-nav item lên standalone top-level section, visual parity với Outpatient Records |
| Phần việc liên quan | Frontend / UI / Routing |
| Mức độ sử dụng | Sinh code chính |

#### 5.1. Prompt nguyên văn

```text
## Objective
Promote E-Prescription from a child nav item into a standalone top-level section.

Requirements:
- Visual parity với Outpatient Records (same icon size, label size, active/hover state, padding)
- Thứ tự nav: Queue → Outpatient Records → E-Prescription → Telemedicine
- Trang standalone /e-prescription với EPrescriptionPage component
- Route /e-prescription trong App.tsx với RoleProtectedRoute (Doctor, Nurse)
- Nav link "Đơn thuốc điện tử" trong cả desktop và mobile nav (inside isStaff block)
```

#### 5.2. Bối cảnh khi viết prompt

```text
E-Prescription được promote lên feature đầy đủ ngang hàng Outpatient Records.
Cần cập nhật sidebar để phản ánh đúng: E-Prescription là top-level nav item,
không còn là sub-item ẩn dưới nhóm khác. Thứ tự mong muốn: Queue → Outpatient Records → E-Prescription → Telemedicine.
```

#### 5.3. Kết quả AI trả về

```text
- Sinh sidebar/nav component update: E-Prescription entry ở top level với cùng icon size, label size,
  active/hover state, padding như Outpatient Records.
- Cập nhật thứ tự: Queue → Outpatient Records → E-Prescription → Telemedicine.
- Sinh route /e-prescription trong App.tsx với RoleProtectedRoute allowedRoles={[UserRole.Doctor, UserRole.Nurse]} wrapping EPrescriptionPage.
- Nav link dùng text-on-surface-variant hover:text-primary transition-colors font-medium (match Outpatient Records style).
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Áp dụng toàn bộ:
- Header.tsx: thêm <Link to="/e-prescription" className="text-on-surface-variant hover:text-primary transition-colors font-medium">Đơn thuốc điện tử</Link>
  trong cả desktop nav và mobile nav (bên trong isStaff conditional block)
- App.tsx: thêm import EPrescriptionPage, thêm route /e-prescription với RoleProtectedRoute allowedRoles={[UserRole.Doctor, UserRole.Nurse]}
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
- Dùng text-on-surface-variant + hover:text-primary cho nav link style (match Outpatient Records link — kiểm tra trong Header.tsx hiện có)
- Icon "medication" (material-symbols-outlined) được chọn làm page icon trong EPrescriptionPage header — nhất quán với tên feature
- RoleProtectedRoute scoped Doctor + Nurse (không bao gồm Admin)
- npx tsc --noEmit → 0 errors sau khi thêm route và import
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [x] Prompt có đủ bối cảnh
- [x] Prompt tạo ra kết quả tốt
- [ ] Cần hỏi lại AI nhiều lần
- [ ] Cần tự kiểm tra và chỉnh sửa nhiều

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | Chưa commit tại thời điểm ghi log (files modified trên nhánh main) |
| File liên quan | `src/mediconnect-web/src/components/layout/Header.tsx`; `src/mediconnect-web/src/App.tsx` |
| Kết quả chạy/test | `npx tsc --noEmit`: 0 errors. Nav link "Đơn thuốc điện tử" hiển thị đúng trong desktop và mobile nav. Route /e-prescription hoạt động với RoleProtectedRoute. |

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
| Prompt phân tích yêu cầu |  |  |
| Prompt giải thích kiến thức |  |  |
| Prompt thiết kế giải pháp |  |  |
| Prompt thiết kế database |  |  |
| Prompt sinh code mẫu |  |  |
| Prompt debug lỗi |  |  |
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
