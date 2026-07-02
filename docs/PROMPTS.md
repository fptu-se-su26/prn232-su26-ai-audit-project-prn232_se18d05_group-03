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
- [x] Gemini
- [x] Claude
- [ ] GitHub Copilot
- [ ] Cursor
- [x] Antigravity
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
| Ngày sử dụng | 03/06/2026 |
| Công cụ AI | Claude (Claude Code) |
| Mục đích | Tham khảo cách tổ chức interface và service pattern cho tính năng smart queue |
| Phần việc liên quan | Design / Backend |
| Mức độ sử dụng | Hỏi ý tưởng |

#### 5.1. Prompt nguyên văn

```text
Tôi cần thiết kế interface và service pattern cho tính năng quản lý hàng đợi phòng khám
trong .NET Clean Architecture. Có thể gợi ý cách tổ chức không?
```

#### 5.2. Bối cảnh khi viết prompt

```text
Đã có sẵn entity Clinic, MedicalService, QueueTicket và basic CRUD.
Cần tham khảo thêm về cách đặt tên interface và tổ chức service layer cho hàng đợi thông minh.
```

#### 5.3. Kết quả AI trả về

```text
AI gợi ý tổ chức interface IQueueService ở Application layer với khoảng 3 method chính
(CheckIn, GetQueue, CallNext), sử dụng lại repository pattern đã có.
Không cung cấp implementation cụ thể.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Tham khảo tên 3 method: CheckInAsync, GetClinicQueueAsync, CallNextAsync
và cách tổ chức interface theo layer.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
- Thiết kế DTO phù hợp với domain HIS: CheckInRequestDto, QueueTicketDetailDto,
  ClinicQueueDto, ClinicWithServicesDto, PriceUpdateDto
- Điều chỉnh logic phát số: max(số trong ngày) + 1, bắt đầu từ 1 nếu chưa có vé
- Dùng date-range (todayStart/todayEnd) thay vì .Date để EF Core dịch đúng sang SQL Server
- Thiết kế luồng CallNext: hoàn tất InProgress trước, lấy Waiting có số nhỏ nhất
- Thêm kiểm tra clinic.IsActive trước khi phát số
- Bổ sung endpoint GET /active, GET /{id}/services cho ClinicsController
- Bổ sung endpoint PATCH /{id}/price cho MedicalServicesController
- Sửa duplicate using trong Program.cs
- Xác nhận route {id:guid} không conflict với /active
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [ ] Prompt có đủ bối cảnh
- [x] Prompt còn thiếu thông tin
- [ ] Prompt tạo ra kết quả tốt
- [x] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [x] Cần tự kiểm tra và chỉnh sửa nhiều
- [ ] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit |  |
| File liên quan | src/Mediconnect.Application/Interfaces/IQueueService.cs |
| Screenshot |  |
| Kết quả chạy/test |  |
| Link tài liệu/báo cáo |  |
| Ghi chú khác |  |

#### 5.8. Ghi chú thêm

```text
AI gợi ý tên method ở mức cao. DTO, logic nghiệp vụ và tích hợp vào project
được điều chỉnh theo yêu cầu cụ thể của dự án.
```

---

### Prompt số 7

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 06/06/2026 |
| Công cụ AI | Antigravity |
| Mục đích | Viết backend modular riêng biệt cho smart clinic |
| Phần việc liên quan | Backend / Coding / Design |
| Mức độ sử dụng | Hỏi sinh code |

#### 5.1. Prompt nguyên văn

```text
viet backend o folder module rieng biet
```

#### 5.2. Bối cảnh khi viết prompt

```text
Cần triển khai backend cho các tính năng của Feature 1 tách biệt hẳn so với các controller Entity CRUD cũ để đảm bảo tính modular.
```

#### 5.3. Kết quả AI trả về

```text
AI đề xuất tạo thư mục Modules/SmartClinic/ trong API project và sinh ra hai controller riêng biệt:
1. ClinicDashboardController.cs: Quản lý hàng đợi thời gian thực.
2. ClinicManagementController.cs: Cung cấp CRUD nâng cao cho khoa, phòng và dịch vụ.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Áp dụng hai controller mới vào dự án, đồng thời cập nhật DTO và Service tương ứng.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
Kiểm tra DI container tự động đăng ký, không cần sửa đổi file Program.cs.
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [ ] Prompt có đủ bối cảnh
- [ ] Prompt còn thiếu thông tin
- [x] Prompt tạo ra kết quả tốt

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit | |
| File liên quan | src/mediconnect/Modules/SmartClinic/ClinicDashboardController.cs |

---

### Prompt số 8

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 06/06/2026 |
| Công cụ AI | Antigravity |
| Mục đích | Kiểm tra lỗi kết nối cơ sở dữ liệu |
| Phần việc liên quan | Database / Testing |
| Mức độ sử dụng | Hỏi xử lý lỗi |

#### 5.1. Prompt nguyên văn

```text
check for database error
```

#### 5.2. Bối cảnh khi viết prompt

```text
Cần đảm bảo cơ sở dữ liệu SQL Server cục bộ hoạt động đúng trước khi tích hợp chạy frontend.
```

#### 5.3. Kết quả AI trả về

```text
AI đề xuất chạy `dotnet ef database update`. Phát hiện lỗi tệp tin DLL bị khóa bởi tiến trình IIS/dotnet đang chạy ngầm và đưa ra lệnh kill tiến trình thích hợp.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Tắt tiến trình bị treo, giải phóng DLL, và thực hiện thành công việc kiểm tra trạng thái database up-to-date.
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
Kiểm tra trực tiếp cổng 5079 bằng lệnh Get-NetTCPConnection để đảm bảo cổng được giải phóng trước khi restart.
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [ ] Prompt có đủ bối cảnh
- [x] Prompt tạo ra kết quả tốt

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| Link commit |  |
| File liên quan | dotnet ef database update log |

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
| Ngày sử dụng | 10/06/2026 |
| Công cụ AI | Claude (Claude Code) |
| Mục đích | Xây dựng giao diện frontend Feature 2: Hồ sơ sức khỏe điện tử |
| Phần việc liên quan | Frontend / Coding |
| Mức độ sử dụng | Sinh code chính |

#### 5.1. Prompt nguyên văn

```text
Làm chức năng Feature 2: Quản lý Hồ sơ Sức khỏe Điện tử (PHR) cho bệnh nhân. Bệnh nhân có thể xem lịch sử khám, đơn thuốc, kết quả xét nghiệm và tải file kết quả.
```

#### 5.2. Bối cảnh khi viết prompt

```text
Thiếu frontend (PatientsController với GET /history;
EntityControllers với /lab-orders, /prescription-items, /drugs, /clinics).
```

#### 5.3. Kết quả AI trả về

```text
AI tạo PHRPage.tsx với 3 tab:
- Tab 1 (Lịch sử khám): timeline numbered cards, tìm kiếm, sắp xếp, modal xem chẩn đoán + bác sĩ + phòng khám.
- Tab 2 (Đơn thuốc): danh sách accordion, mỗi đơn mở ra bảng chi tiết thuốc (tên, liều, tần suất, số ngày).
- Tab 3 (Kết quả xét nghiệm): filter theo trạng thái, modal xem kết quả text, nút tải file.
AI phát hiện /history trả DTO thiếu testName và drug items.
```

#### 5.4. Kết quả đã áp dụng vào bài

```text
Áp dụng code vào dự án:
- PHRPage.tsx (route /health-records, Patient only)
- Cập nhật types/index.ts, services.ts, App.tsx, Header.tsx
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
- Đọc EntityDtos.cs xác nhận DTO shape trước khi code
- Chạy npm run build xác nhận 0 TypeScript error
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [x] Prompt có đủ bối cảnh
- [ ] Prompt còn thiếu thông tin
- [x] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [ ] Cần tự kiểm tra và chỉnh sửa nhiều

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
