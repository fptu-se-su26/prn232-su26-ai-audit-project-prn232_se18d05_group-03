# Thành viên 1 — Giao diện (Blazor): Khám Ngoại trú & Telemedicine

| Trang / Component | Route | Quyền |
|---|---|---|
| `ManageServices.razor` | `/manage-services` | Admin |
| `ClinicDashboard.razor` | `/clinic-dashboard` | Doctor, Nurse |
| `OutpatientRecord.razor` | `/outpatient-record` | Doctor, Nurse |
| `EPrescription.razor` + `Shared/EPrescriptionPanel.razor` | `/e-prescription` | Doctor, Nurse |
| `Telemedicine.razor` (+ `wwwroot/js/telemedicine.js`) | `/telemedicine/{RoomId}` | Doctor, Patient |

Mọi trang gọi API qua `ApiClient` (đã đính JWT). Blazor Server: `@code` chạy trên **server**, tương tác đẩy
qua SignalR circuit; JS chạy trên **trình duyệt** qua `IJSRuntime`.

---

## `ManageServices.razor` (F1 — danh mục & giá khám) — Admin
CRUD danh mục `Clinic` (phòng khám: tên, số phòng, `IsActive`) và `MedicalService` (dịch vụ: tên, giá `Price`).
Dùng các endpoint CRUD tổng quát qua `ApiClient`. Đây là dữ liệu nền cho phát số (Clinic) và tính viện phí (giá dịch vụ).

## `ClinicDashboard.razor` (F1 — phân luồng & gọi số) — Doctor/Nurse
Màn hình quầy tiếp nhận / phòng khám:
- Gọi `GET api/queue/clinics/{clinicId}` (`ApiClient`) để hiển thị hàng đợi: số đang gọi (`CurrentNumber`),
  số đang chờ (`WaitingCount`), danh sách vé.
- Nút **tiếp nhận** → `POST api/queue/check-in` (hoặc walk-in), nút **gọi tiếp** → `POST .../call-next`.
- Đây là mặt UI của `QueueService` (xem `member1-code.md` F1).

---

## `OutpatientRecord.razor` (F2 — bệnh án ngoại trú) — Doctor/Nurse

Bố cục **master–detail** (đọc `OutpatientRecord.razor`):
- **Cột trái** (dòng 34–...): "Danh sách đang chờ". Ô lọc `_localQuery` (bind `oninput`, dòng 48) lọc tại chỗ;
  `FilteredWaiting` render từng vé dạng thẻ với số `#@t.Number` và tên (`t.PatientName ?? "Bệnh nhân vãng lai"`).
  Click thẻ → `SelectTicket(t)` đánh dấu `_selectedTicket` (viền primary khi chọn, dòng 63–64).
- **Ô tìm nhanh trên đầu** (dòng 16–18): `_topQuery`, Enter hoặc nút "Tìm" → `RunTopSearch`.
- **Panel đơn thuốc** (dòng 29–32): khi `_savedVisitId` và `_staffProfileId` đã có, nhúng
  `<EPrescriptionPanel .../>` truyền `VisitId`, `DoctorId`, `PatientId`, `PatientName`.
- Thông báo lỗi/thành công qua `_message` + `_messageIsError` (alert đỏ/xanh, dòng 21–27).
- Bác sĩ nhập triệu chứng/chẩn đoán ICD-10/chỉ định XN rồi lưu → `POST api/medical-records/diagnose`
  (`SaveMedicalRecordAsync`, xem code M1 F2).

## `EPrescription.razor` + `Shared/EPrescriptionPanel.razor` (F3 — đơn thuốc điện tử)

`EPrescription.razor` là trang bọc; **logic thật nằm ở component tái dùng `EPrescriptionPanel.razor`**
(cũng được nhúng trong OutpatientRecord và Telemedicine). Giải thích `@code` (dòng 221–406):

**Tham số vào** (222–227): `VisitId`, `DoctorId`, `PatientId`, `PatientName`, `KnownAllergies`, `OnClose`.

**Nạp kho thuốc** — `OnInitializedAsync` (268–275): `Api.GetDrugs()` lấy thuốc còn `IsActive` vào `_allDrugs`.

**Tìm & chọn thuốc**:
- `SearchResults` (251–262): lọc `_allDrugs` theo tên/`Code` (không phân biệt hoa thường), lấy tối đa 10.
  UI hiện dropdown (dòng 41–57) kèm badge tồn kho: `StockQuantity == 0` → "Hết hàng" (đỏ), ngược lại "Kho: N".
- `SelectDrug` (283–289): gán `_selectedDrug`, reset các ô liều/tần suất.

**3 lớp cảnh báo an toàn** (điểm nối sang CDSS — Thành viên 4):
1. **Dị ứng** — `AllergyWarning` (264–266): so tên thuốc với danh sách dị ứng đã biết; khớp → alert vàng (60–69).
   (Danh sách mặc định `Penicillin/Peanuts/Sulfa` nếu không truyền, dòng 249.)
2. **Quá liều** — `CheckDoseIfPossible` (327–336): khi gõ "Liều lượng (số)" (`@bind:after`, dòng 101),
   gọi `Api.CheckDose(PatientId, DrugId, doseAmount)` → nếu `IsOverDose` hiện alert đỏ (74–83).
3. **Tương tác thuốc** — `CheckInteractionsIfPossible` (315–325): mỗi lần thêm/xóa thuốc, nếu đơn có ≥2 thuốc,
   gọi `Api.CheckDrugInteractions([drugIds])`; kết quả `_interactionWarnings` render cặp thuốc kỵ nhau (135–154).
   Cả 3 cảnh báo đều **nuốt lỗi API** (chỉ khuyến nghị, không chặn kê đơn) — comment 324, 335.

**Thêm vào đơn** — `AddItem` (291–307): chặn nếu chưa chọn thuốc hoặc hết kho (293); thêm `ActiveItem` vào `_items`;
gọi lại kiểm tra tương tác. Bảng "đã kê" render `_items` (166–194), nút xóa gọi `RemoveItem`.

**Gửi nhà thuốc** — `SendToPharmacy` (341–381): validate `VisitId`; tạo `Prescription`
(`Api.CreatePrescription`), rồi lặp tạo từng `PrescriptionItem` với `Dose = "{liều} — {đường dùng}"` (367);
xong xóa danh sách + toast thành công. Đây là mặt UI của F3 (code M1 F3).

---

## `Telemedicine.razor` (F4 — khám từ xa WebRTC) — Doctor/Patient

Trang phức tạp nhất, kết hợp **SignalR** (báo hiệu) + **JS interop** (`telemedicine.js`) + tái dùng F2/F3.
`@implements IAsyncDisposable` để dọn tài nguyên khi rời trang.

### Khởi tạo — `OnInitializedAsync` (148–204)
1. Parse `RoomId` thành GUID; sai → `_error` (150–155).
2. Xác định vai trò: `_isDoctor = User.IsInRole("Doctor")` (157–158).
3. `Api.GetTelemedicineSession(roomGuid)` lấy phiên; nạp `_notes` cũ; nếu là bác sĩ, tra `_activeDoctorId`
   qua `Api.GetStaffDirectory()` khớp `Token.User.Id` (162–175).
4. **Kết nối SignalR** (184–193): build `HubConnection` tới `/hubs/telemedicine`, đăng ký handler
   `ReceiveSignal` → `HandleSignal`, `ReceiveIceCandidate` → `telemedicineInterop.addIceCandidate`,
   `CallEnded` → dừng call + điều hướng về.
5. **`JoinRoom`** (194–195): trả về số người có trước; `_isInitiator = (countBefore == 0)` — người vào đầu là bên tạo offer.

### Bắt camera & bắt tay WebRTC — `OnAfterRenderAsync` (206–233)
- `telemedicineInterop.init(dotnetRef)` truyền tham chiếu .NET để JS gọi ngược `[JSInvokable] OnIceCandidateReady`.
- `startLocalVideo("localVideo")` xin quyền camera/mic. **Bắt `JSException`** (217–226): nếu bị từ chối quyền,
  chỉ hiện banner `_mediaError` — **không** ném ra (nếu ném sẽ **giết cả circuit Blazor Server**, mất trang);
  phía bác sĩ vẫn ghi bệnh án/đơn thuốc được.
- Nếu là initiator: `createOffer` → gửi qua hub `SendSignal` (kèm `type=offer`).

### Trao đổi tín hiệu — `HandleSignal` (235–250) & `OnIceCandidateReady` (252–256)
- Nhận `offer` → `handleOffer` tạo answer → gửi lại (`type=answer`).
- Nhận `answer` → `handleAnswer` set remote description.
- ICE candidate hai chiều: JS bắn lên `OnIceCandidateReady` → hub `SendIceCandidate` → bên kia `addIceCandidate`.

### Bác sĩ làm việc trong lúc gọi (panel bên phải — chỉ role Doctor, `<AuthorizeView Roles="Doctor">` dòng 40)
- **Triệu chứng & chẩn đoán ICD-10**: ô tìm ICD-10 có **debounce 300ms** (`OnIcdQueryChanged`, 315–333) gọi
  `Api.SearchIcd10`; chọn kết quả → `SelectIcd`; lưu → `SaveDiagnosis` (348–368) gọi `Api.Diagnose(...)`.
- **Tạo lượt khám khi cần** — `EnsureVisitCreatedAsync` (281–304): lần đầu lưu/mở đơn, tự tạo `OutpatientVisit`
  từ lịch hẹn của phiên (idempotent nhờ kiểm tra `_activeVisitId`).
- **Ghi chú** `SaveNotes` (258–279) cập nhật `TelemedicineSession.Notes`.
- **Đơn thuốc**: nhúng `<EPrescriptionPanel>` (104–107) sau khi có visit.

### Điều khiển & kết thúc
- `ToggleMute`/`ToggleCamera` (370–380) bật/tắt track qua JS.
- **`EndCall`** (382–413): thứ tự quan trọng — `NotifyCallEnded` **trước** rồi mới `LeaveRoom` (vì
  `OthersInGroup` chỉ tới người còn trong group, comment 386–387); dừng call JS; gọi API
  `EndTelemedicineSession`, `CompleteOutpatientVisit`, `UpdateAppointmentStatus = Completed`
  (tất cả best-effort, nuốt lỗi); điều hướng về dashboard/lịch hẹn.
- `DisposeAsync` (415–420): dừng call + hủy hub + giải phóng `DotNetObjectReference`.

### `wwwroot/js/telemedicine.js` (WebRTC phía trình duyệt)
Đối tượng `window.telemedicineInterop`:
- `startLocalVideo` (10–13): `getUserMedia({video,audio})` gắn vào `<video id=localVideo>`.
- `createPeerConnection` (15–26): tạo `RTCPeerConnection` với STUN Google; add track local; `onicecandidate`
  gọi ngược .NET; `ontrack` gắn luồng đối phương vào `<video id=remoteVideo>`.
- `createOffer`/`handleOffer`/`handleAnswer`/`addIceCandidate` (28–50): các bước SDP chuẩn của WebRTC.
- `toggleAudio`/`toggleVideo`/`stopCall` (52–65): bật tắt track & dọn dẹp.
- Giới hạn đã biết (dòng 16): chỉ STUN nên gọi khác mạng cần TURN — ngoài phạm vi đồ án.
