# Thành viên 3 — Giao diện (Blazor): Nội trú & Điều phối lâm sàng

| Trang | Route | Quyền |
|---|---|---|
| `BedMap.razor` | `/beds` | Doctor, Nurse |
| `Vitals.razor` | `/vitals` | Nurse, Doctor |
| `Lab.razor` | `/lab` | Lab, Doctor, Nurse |
| `Discharge.razor` | `/discharge` | Doctor, Nurse |

---

## `BedMap.razor` (F1 — sơ đồ & phân giường) — Doctor/Nurse
Bản đồ giường trực quan (Trống / Đang có người / Đang dọn — theo `BedStatus`). Các call (623–840):
- Nạp nền: `Api.GetDepartments` (623), `Api.GetUserAccounts` (624, cho dropdown chọn bệnh nhân),
  `Api.GetBedMap` (709, dữ liệu giường + trạng thái), `Api.GetAdmissions` (710, ca nội trú đang hoạt động).
- **Đổi trạng thái giường**: `Api.SetBedStatus` (773) → cập nhật màu ô giường.
- **Xóa giường**: `Api.DeleteBed` (795); **thêm giường**: `Api.CreateBed` (840).
- **Nhập viện**: `Api.Admit` (809) gọi `POST admit` (tạo admission + gán giường + set Occupied), rồi reload
  `Api.GetBedMap` (819).
- **Chuyển giường/khoa**: `Api.Transfer` (830) gọi `POST {id}/transfer`.

Đây là mặt UI của `InpatientQuery.GetAllAsync` + `Admit`/`Transfer` (xem `member3-code.md` F1).

## `Vitals.razor` (F2 — sinh tồn & y lệnh) — Nurse/Doctor
- Chọn ca nội trú: `Api.GetAdmissions` (256).
- Xem theo bệnh nhân: `Api.GetVitalSigns` (269, gọi `GET admissions/{id}/vital-signs`),
  `Api.GetCareOrders` (270).
- **Y tá nhập sinh tồn**: `Api.CreateVitalSign` (282) tạo `VitalSign` tại giường.
- **Bác sĩ ra y lệnh**: `Api.CreateCareOrder` (299) tạo `CareOrder` (thuốc tiêm/truyền dịch/suất ăn/thủ thuật).
- **Hoàn tất y lệnh**: `Api.CompleteCareOrder` (312) đổi trạng thái order.

## `Lab.razor` (F3 — cận lâm sàng) — Lab/Doctor/Nurse
- **Bộ phận XN tiếp nhận chỉ định**: `Api.FilterLabOrders` (207) lọc `LabOrder` theo trạng thái/ngày.
- **Nhập kết quả**: `Api.EnterLabResult` (237) tạo `LabResult`; **tải file ảnh/PDF**: `Api.UploadLabFile` (258).
- **Cập nhật trạng thái chỉ định**: `Api.UpdateLabOrderStatus` (227) (Ordered → InProgress → Completed).
- Xem kết quả đã có: `Api.GetLabResults` (218). Kết quả tự hiển thị lại cho bác sĩ ra chỉ định và ở PHR (TV2).
- Trang cho cả Lab/Doctor/Nurse cùng vào, nhưng 3 nút thao tác ("Bắt đầu xử lý", "Lưu kết quả",
  "Upload file") chỉ **Lab/Admin** thấy (`<AuthorizeView Roles="Lab,Admin">`) — trước đó các nút này
  hiện cho cả Doctor/Nurse dù backend chỉ cho role Lab thực hiện (`LabOrdersController`/
  `LabResultsController` đều `[Authorize(Roles = "Lab,Admin")]`), khiến Doctor/Nurse bấm vào bị 403.
  Doctor/Nurse vẫn xem được kết quả/file đã lưu, chỉ không sửa/upload thêm được.

## `Discharge.razor` (F4 — xuất viện) — Doctor/Nurse
- `Api.GetAdmissions` (188): danh sách ca đủ điều kiện xuất viện.
- **Xuất viện**: `Api.Discharge` (205) gọi `POST admissions/{id}/discharge` — backend giải phóng giường,
  gom tiền giường + thuốc + thủ thuật thành `BillingInvoice` (Pending) và tạo `DischargeSummary`.
  UI hiển thị `DischargeResultDto` (tóm tắt + phiếu thu + các dòng chi phí) để bàn giao sang phân hệ Thanh toán (TV2).
