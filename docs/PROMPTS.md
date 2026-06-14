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
| 5 | 05/06/2026 | Claude | Sinh code Feature 1: Bed Map & Inpatient Transfer | Them endpoints GET /api/beds/map, GET bed-assignments, POST transfer vao BedsController va InpatientAdmissionsController | Da sinh endpoints va DTOs dung clean architecture pattern | Có | src/mediconnect/Controllers/EntityControllers.cs; src/Mediconnect.Application/DTOs/EntityDtos.cs |
| 6 | 14/06/2026 | Claude | Sinh code Feature 2: Y lenh & cham soc hang ngay | Them endpoints GET vital-signs va GET care-orders theo ca nhap vien (loc theo ngay/loai/trang thai) vao InpatientAdmissionsController | Da sinh 2 nested-route endpoint tai su dung IRepository + SimpleMapper, build sach 0 error | Có | src/mediconnect/Controllers/EntityControllers.cs |
| 7 |  |  |  |  |  | Có / Không |  |
| 8 |  |  |  |  |  | Có / Không |  |
| 9 |  |  |  |  |  | Có / Không |  |
| 10 |  |  |  |  |  | Có / Không |  |

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


## 6. Prompt quan trọng nhất

Chọn một prompt có ảnh hưởng lớn nhất đến bài tập/project.

### 6.1. Prompt được chọn

```text
Dán prompt quan trọng nhất tại đây.
```

### 6.2. Vì sao prompt này quan trọng?

```text
Viết tại đây...
```

### 6.3. Kết quả prompt này mang lại

```text
Viết tại đây...
```

### 6.4. Sinh viên/nhóm đã kiểm tra kết quả như thế nào?

```text
Viết tại đây...
```

### 6.5. Sinh viên/nhóm đã cải tiến gì từ kết quả AI?

```text
Viết tại đây...
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
