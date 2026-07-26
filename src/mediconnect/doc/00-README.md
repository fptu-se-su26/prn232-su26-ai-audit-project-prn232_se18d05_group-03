# Tài liệu giải thích code — Smart Hospital HIS & Telemedicine

Bộ tài liệu này giải thích code theo **4 thành viên**, mỗi thành viên 4 feature.
Mỗi thành viên có **2 file**:

- `memberN-code.md` — giải thích **logic backend** (Service / Controller / Query) từng dòng của các hàm chính.
- `memberN-ui.md` — giải thích **giao diện Blazor** (trang `.razor`, component, JS interop) tương ứng.

| Thành viên | Chủ đề | File code | File UI |
|---|---|---|---|
| **1** | Khám Ngoại trú & Telemedicine | [member1-code.md](member1-code.md) | [member1-ui.md](member1-ui.md) |
| **2** | Bệnh nhân, PHR & Thanh toán | [member2-code.md](member2-code.md) | [member2-ui.md](member2-ui.md) |
| **3** | Nội trú & Điều phối lâm sàng | [member3-code.md](member3-code.md) | [member3-ui.md](member3-ui.md) |
| **4** | Quản trị, Nhân sự & CDSS | [member4-code.md](member4-code.md) | [member4-ui.md](member4-ui.md) |

---

## Kiến trúc tổng thể (đọc trước)

Dự án theo **Clean Architecture**, 5 project trong `mediconnect.sln` (`net8.0`):

```
Trình duyệt ──► Mediconnect.Web (Blazor Server, cổng 5104)
                    │  ApiClient (HttpClient + JWT)   ← không chạm DB trực tiếp
                    ▼
             src/mediconnect  (Web API, cổng 5079)   ← Controllers + Swagger
                    │  Service (Application)
                    ▼
             AppDbContext (EF Core) ──► SQL Server (NewMediconnect)
```

| Project | Vai trò |
|---|---|
| `Mediconnect.Domain` | Entity thuần + Enum (không phụ thuộc gì). |
| `Mediconnect.Application` | DTO, Interface, **Service (business logic)**, Mapping, Helpers. |
| `Mediconnect.Infrastructure` | `AppDbContext`, Repository (EF), Query đọc phức tạp, JWT, thanh toán, OTP. |
| `src/mediconnect` | **Web API**: Controllers, Swagger, JWT Bearer, seed DB lúc khởi động. |
| `Mediconnect.Web` | **Frontend Blazor Server**: trang `.razor`, gọi API qua `ApiClient`. |

### 3 mẫu code lặp lại xuyên suốt (nắm để đọc nhanh)

1. **Repository pattern** — mọi Service nhận `IRepository<TEntity>` (định nghĩa ở
   `Mediconnect.Application/Interfaces/IRepository.cs`, cài đặt `EfRepository<>` bằng EF Core).
   Các hàm hay gặp: `GetByIdAsync`, `ListAsync(predicate)`, `AddAsync`, `Update`, `Remove`,
   `SaveChangesAsync`. **Chỉ khi gọi `SaveChangesAsync` dữ liệu mới ghi xuống DB.**

2. **CRUD tổng quát** — entity đơn giản (Clinic, Drug, MedicalService, VitalSign, LabOrder…)
   không có Service riêng mà dùng chung `CrudService<TEntity,TRead,TWrite>` +
   `CrudController`. Chỉ những feature có nghiệp vụ phức tạp mới có Service riêng
   (Queue, MedicalRecord, Billing, StaffSchedule, Auth).

3. **DTO dùng chung** — request/response của API và frontend đều dùng chung class DTO trong
   `Mediconnect.Application/DTOs/`, nên frontend không bao giờ lệch schema với server.
   `SimpleMapper.Map<TSource,TDest>` map thủ công Entity ↔ DTO.

### Xác thực & phân quyền (liên quan mọi feature)

- API phát **JWT** khi login/register (`JwtTokenService`), claim chứa `Role`.
- Frontend giữ JWT trong `TokenState` (theo mỗi SignalR circuit) và đính vào mọi request qua `ApiClient`.
- Trang Blazor giới hạn quyền bằng `@attribute [Authorize(Roles = "...")]`; menu lọc theo role ở `NavMenu.razor`.
- 4 role: **Patient, Doctor, Nurse, Admin** (+ Lab cho trang xét nghiệm). Xem `Enums.cs` → `UserRole`.

> Ghi chú: các đoạn tích hợp ngoài (VNPay/Momo, ICD-10, gửi email OTP) được **đơn giản hóa cho
> phạm vi đồ án** — tài liệu sẽ nêu rõ ở từng chỗ.
