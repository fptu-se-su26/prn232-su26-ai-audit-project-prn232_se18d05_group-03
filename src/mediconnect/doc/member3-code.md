# Thành viên 3 — Code backend: Nội trú & Điều phối lâm sàng

| Feature | File chính |
|---|---|
| F1 — Sơ đồ & phân giường | `Infrastructure/Repositories/InpatientQuery.cs`, `EntityControllers.cs` → `InpatientAdmissionsController.Admit/Transfer`, `BedsController` |
| F2 — Y lệnh & chăm sóc hằng ngày | CRUD `VitalSign`/`CareOrder` + `InpatientAdmissionsController.GetVitalSigns` |
| F3 — Cận lâm sàng (XN/CĐHA) | `LabOrdersController`, `LabResultsController` (CRUD + action tùy chỉnh) |
| F4 — Xuất viện | `InpatientAdmissionsController.Discharge` (bàn giao chi phí sang Billing) |

Phần lớn entity nội trú (`VitalSign`, `CareOrder`, `LabOrder`, `LabResult`, `DischargeSummary`) dùng
**CRUD tổng quát** (`CrudController`); các thao tác nghiệp vụ liên phòng ban nằm trong `InpatientAdmissionsController`.

---

## F1 — Sơ đồ giường & phân bổ

### `InpatientQuery.GetAllAsync` — dữ liệu bản đồ giường (dòng 17–68)
Join thủ công để hiển thị **tên thật** thay vì GUID (comment 9–10):
```
InpatientAdmission ⨝ PatientProfile ⨝ UserAccount ⨝ Department   (20–35)
  → lấy PatientName (u.FullName), DepartmentName (d.Name)
```
- `AsNoTracking()` (đọc thuần, không theo dõi thay đổi → nhanh hơn).
- Truy vấn giường **đang chiếm** theo lô (39–44): `BedAssignment ⨝ Bed` với `ReleasedAt == null`,
  lọc theo `admissionIds` → dựng `Dictionary` bed-theo-admission (46).
- Map ra `InpatientAdmissionReadDto` kèm `BedLabel` (Ward · Room · Bed) từ `FormatBedLabel` (70–75).

### `Admit` — nhập viện + gán giường một bước (dòng 470–525)
```
1. Kiểm tra giường tồn tại & Status == Available (476–485)
2. Resolve PatientId: có thể là PatientProfile.Id HOẶC UserAccount.Id (dropdown UI liệt kê account) → tìm profile (489–494)
3. Tạo InpatientAdmission (Status = Active) (498–507)
4. Tạo BedAssignment gắn admission ↔ bed (509–516)
5. Đổi bed.Status = Occupied → giữ bản đồ giường F1 luôn đúng (518–519)
6. SaveChanges (521)
```
`[Authorize(Roles = "Nurse,Doctor,Admin")]`. Đây là điểm nối **ngoại trú → nội trú** (nhận
`FromOutpatientVisitId` từ TV1).

### `Transfer` — chuyển giường/chuyển khoa (dòng 740–813)
- Validate giường đích **trước** (Available) để không "chuyển nửa vời" (755–769).
- Giải phóng assignment đang mở: `ReleasedAt = now`, giường cũ → `Cleaning` (771–787).
- Đổi `admission.DepartmentId`, giữ `Active` (789–791); tạo assignment mới, giường đích → `Occupied` (794–807).

### Trạng thái giường
`BedsController : CrudController<Bed,...>` + endpoint đổi trạng thái (Available/Occupied/Cleaning — enum `BedStatus`)
mà UI gọi qua `Api.SetBedStatus`. `BedAssignmentsController` có `PATCH {id}/release` (dòng 158) để trả giường.

---

## F2 — Y lệnh & chăm sóc hằng ngày

- **Chỉ số sinh tồn**: `VitalSign` (mạch, nhiệt độ, huyết áp…) tạo qua `VitalSignsController` (CRUD).
  Đọc theo bệnh nhân: `InpatientAdmissionsController.GetVitalSigns` (dòng 677–703) — lọc theo `AdmissionId`,
  có thể lọc thêm theo **ngày** (`?date=`), sắp giảm dần theo `RecordedAt`.
- **Y lệnh**: `CareOrder` (`OrderType` = Medication/Infusion/Procedure/Diet — enum `CareOrderType`) tạo qua
  `CareOrdersController`. "Hoàn tất y lệnh" cập nhật trạng thái order (UI gọi `Api.CompleteCareOrder`).
- `CareOrder` chính là nguồn để tính **thuốc/thủ thuật** khi xuất viện (xem F4).

---

## F3 — Cận lâm sàng (Xét nghiệm / Chẩn đoán hình ảnh)

- `LabOrder` (chỉ định) do bác sĩ tạo — có thể sinh tự động từ `MedicalRecordService.SaveMedicalRecordAsync` (TV1)
  hoặc tạo trực tiếp. `LabOrdersController` (CRUD) + action lọc (`Api.FilterLabOrders`) và
  đổi trạng thái (`Api.UpdateLabOrderStatus` → `LabOrderStatus`: Ordered → InProgress → Completed).
- `LabResult` (kết quả): bộ phận XN nhập kết quả + **tải file ảnh/PDF** (`Api.EnterLabResult`, `Api.UploadLabFile`).
  `LabResultsController` (CRUD) quản lý; file lưu link để bác sĩ/bệnh nhân xem lại.
- Kết quả tự "trả về" bác sĩ ra chỉ định vì `LabResult` gắn `LabOrderId` → hiển thị lại ở màn hình khám và PHR (TV2).

---

## F4 — Xuất viện & bàn giao chi phí (`Discharge`, dòng 529–657)

Hàm nghiệp vụ nặng nhất của TV3 — vừa cập nhật trạng thái, vừa **gom chi phí gửi sang phân hệ Thanh toán (TV2)**:
```
1. Kiểm tra admission tồn tại & chưa Discharged (536–545)
2. Tạo BillingInvoice trạng thái Pending, gắn PatientId, áp InsuranceDeduction nếu có (549–556)
3. TIỀN GIƯỜNG (560–596):
   - Duyệt mọi BedAssignment của admission; số ngày = ceil(end - assigned), tối thiểu 1 (565–567)
   - Assignment còn mở → ReleasedAt = now, giường → Cleaning (nối lại bản đồ giường F1) (570–581)
   - Thêm BillingItem loại Bed = totalBedDays × BedDailyRate (584–596)
4. THUỐC & THỦ THUẬT (598–624):
   - Mỗi CareOrder → map OrderType sang BillingItemType (Medication/Infusion → Drug, Procedure → Procedure) (602–607)
   - Thêm thành line item để Billing định giá (UnitPrice tạm = 0, đơn giản hóa) (614–623)
5. Subtotal = tổng item; TotalAmount = Subtotal − InsuranceDeduction (626–627)
6. Lưu invoice + items; admission.Status = Discharged (629–636)
7. Tạo DischargeSummary (ngày, tóm tắt, TotalCost) (638–646)
8. SaveChanges; trả DischargeResultDto { Summary, Invoice, Items } (648–656)
```
`[Authorize(Roles = "Nurse,Doctor,Admin")]`. Phiếu thu tạo ra ở trạng thái **Pending** để bệnh nhân
thanh toán qua màn hình Viện phí của TV2.
