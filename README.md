# SE AI Audit Project Template

## 1. Project Information

| Item       | Description |
| ---------- | ----------- |
| Course     | PRN232      |
| Class      | SE18D05     |
| Semester   | SU26        |
| Group      | 3           |
| Topic      | MEDIC0NNECT |
| Repository |             |

---

## 2. Team Members

|  No | Student ID | Full Name          | GitHub Username | Role   | Main Responsibility |
| --: | ---------- | ------------------ | --------------- | ------ | ------------------- |
|   1 | DE180522   | Dinh Gia Huy       | zawy2004        | Leader |                     |
|   2 | DE180526   | Nguyen Duy Luong   | gwould          | Member |                     |
|   3 | DE190580   | Park Jea Minh      | PJMinh2812      | Member |                     |
|   4 | DE190123   | Vo Nguyen Bao Chau | MouGlanzuddli   | Member |                     |
|   5 |            |                    |                 | Member |                     |

---

## 3. Project Structure

```text
src/
docs/
.github/
README.md
```

---

## 4. Required AI Audit Documents

Each group must maintain the following documents:

```text
docs/AI_AUDIT_LOG.md
docs/PROMPTS.md
docs/REFLECTION.md
docs/CHANGELOG.md
```

---

## 5. Workflow

Students must follow this workflow:

```text
Issue → Branch → Commit → Pull Request → Review → Merge
```

Direct push to the `main` branch should be avoided.

---

## 6. Branch Naming Convention

```text
feature/studentid-task-name
bugfix/studentid-error-name
docs/studentid-update-audit-log
test/studentid-test-case-name
```

Example:

```text
feature/se123456-login-page
bugfix/se123456-login-validation
docs/se123456-update-ai-audit-log
```

---

## 7. Commit Message Convention

```text
[StudentID] type: short description
```

Examples:

```text
[SE123456] feat: add login page
[SE123456] fix: fix login validation
[SE123456] docs: update AI audit log
[SE123456] test: add login test cases
```

Common types:

```text
feat, fix, docs, test, refactor, style, chore
```

---

## 8. How to Run

```text
Students write project running instructions here.
```

---

## 9. AI Usage Rule

Students are allowed to use AI tools such as ChatGPT, Gemini, Claude, GitHub Copilot, Cursor, Antigravity, or similar tools.

However, all important AI usage must be recorded in:

```text
docs/AI_AUDIT_LOG.md
docs/PROMPTS.md
docs/CHANGELOG.md
docs/REFLECTION.md
```

Students must be able to explain, verify, and defend all submitted work.

=======

# SE AI Audit Project Template

## 1. Project Information

| Item       | Description                                                                          |
| ---------- | ------------------------------------------------------------------------------------ |
| Course     | PRN232                                                                               |
| Class      | SE18D05                                                                              |
| Semester   | SU26                                                                                 |
| Group      | 3                                                                                    |
| Topic      | MEDIC0NNECT                                                                          |
| Repository | https://github.com/fptu-se-su26/prn232-su26-ai-audit-project-prn232_se18d05_group-03 |

---

## 2. Team Members

|  No | Student ID | Full Name          | GitHub Username | Role   | Main Responsibility |
| --: | ---------- | ------------------ | --------------- | ------ | ------------------- |
|   1 | DE180522   | Dinh Gia Huy       | zawy2004        | Leader |                     |
|   2 | DE180526   | Nguyen Duy Luong   | gwould          | Member |                     |
|   3 | DE190580   | Park Jea Minh      | PJMinh2812      | Member |                     |
|   4 | DE190123   | Vo Nguyen Bao Chau | MouGlanzuddli   | Member |                     |
|   5 |            |                    |                 | Member |                     |

---

## 3. Project Structure

```text
src/
├── mediconnect/                         # .NET 8 Web API (startup project)
│   ├── Controllers/
│   │   ├── AuthController.cs           # POST /api/auth/login, register
│   │   ├── StaffController.cs          # CRUD + GET /api/staff/directory
│   │   ├── ScheduleController.cs       # 5 endpoints: GET all, GET filter, POST, PUT, DELETE
│   │   ├── SmartQueueController.cs
│   │   ├── EntityControllers.cs        # Bed map, inpatient transfer
│   │   └── ...
│   ├── appsettings.json
│   └── Program.cs
├── Mediconnect.Application/             # Business logic layer
│   ├── DTOs/
│   │   ├── EntityDtos.cs
│   │   ├── ScheduleDtos.cs             # ScheduleFlatReadDto, ScheduleWriteDto, StaffDirectoryDto, PagedResult
│   │   └── SmartQueueDtos.cs
│   ├── Interfaces/
│   │   ├── IStaffScheduleService.cs
│   │   └── IStaffScheduleQuery.cs      # GetStaffDirectoryAsync, FilterFlatAsync
│   └── Services/
│       └── StaffScheduleService.cs     # Business rules: duplicate check, max 2 shifts/day, auto time
├── Mediconnect.Domain/
│   └── Entities/
│       ├── StaffSchedule.cs            # ShiftDate, ShiftType, StartTime, EndTime, WorkRoom
│       ├── StaffProfile.cs
│       └── Enums.cs                    # ShiftType (Morning/Afternoon/Evening), StaffType
├── Mediconnect.Infrastructure/
│   ├── Persistence/
│   │   ├── AppDbContext.cs
│   │   └── DbInitializer.cs            # Seed: departments, staff, default users
│   ├── Migrations/
│   │   ├── 20260530032158_InitialCreate.cs
│   │   └── 20260606053017_AddStaffScheduleShiftType.cs
│   └── Repositories/
│       └── StaffScheduleQuery.cs       # Flat LINQ projection (no .Include, uses .Select)
└── mediconnect-web/                    # React 19 + TypeScript + TailwindCSS v4
    └── src/
        ├── pages/
        │   ├── ScheduleManagementPage.tsx  # KPI bar + Staff Grid + Day/Week Gantt
        │   ├── BookingPage.tsx
        │   ├── AppointmentsPage.tsx
        │   └── ...
        ├── api/
        │   ├── client.ts               # Axios instance với JWT interceptor
        │   └── services.ts             # staffApi, scheduleApi, departmentApi, ...
        └── types/index.ts              # StaffDirectory, ScheduleFlat, ShiftType, StaffType, ...
docs/
.github/
README.md
```

---

## 4. Required AI Audit Documents

Each group must maintain the following documents:

```text
docs/AI_AUDIT_LOG.md
docs/PROMPTS.md
docs/REFLECTION.md
docs/CHANGELOG.md
```

---

## 5. Workflow

Students must follow this workflow:

```text
Issue → Branch → Commit → Pull Request → Review → Merge
```

Direct push to the `main` branch should be avoided.

---

## 6. Branch Naming Convention

```text
feature/studentid-task-name
bugfix/studentid-error-name
docs/studentid-update-audit-log
test/studentid-test-case-name
```

Example:

```text
feature/se123456-login-page
bugfix/se123456-login-validation
docs/se123456-update-ai-audit-log
```

---

## 7. Commit Message Convention

```text
[StudentID] type: short description
```

Examples:

```text
[SE123456] feat: add login page
[SE123456] fix: fix login validation
[SE123456] docs: update AI audit log
[SE123456] test: add login test cases
```

Common types:

```text
feat, fix, docs, test, refactor, style, chore
```

---

## 8. How to Run

### Yêu cầu môi trường

- .NET 8 SDK
- SQL Server (instance mặc định, user `sa`, password `1234`)
- Node.js 18+

### 1. Backend (.NET 8 Web API)

```bash
# Apply migration lên database
dotnet ef database update --project src/Mediconnect.Infrastructure --startup-project src/mediconnect

# Chạy API server
dotnet run --project src/mediconnect
```

API chạy tại: **http://localhost:5079**  
Swagger UI: **http://localhost:5079/swagger**

> Nếu dùng SQL Server khác, cập nhật connection string trong `src/mediconnect/appsettings.json`:
>
> ```
> "Server=.;uid=sa;pwd=<password>;Database=NewMediconnect;TrustServerCertificate=True"
> ```

### 2. Frontend (React + TypeScript)

```bash
cd src/mediconnect-web
npm install
npm run dev
```

Frontend chạy tại: **http://localhost:5173**

### 3. Tài khoản mặc định (seed data)

| Email                     | Password    | Role    |
| ------------------------- | ----------- | ------- |
| admin@mediconnect.local   | Admin@123   | Admin   |
| doctor@mediconnect.local  | Doctor@123  | Doctor  |
| nurse@mediconnect.local   | Nurse@123   | Nurse   |
| patient@mediconnect.local | Patient@123 | Patient |

### 4. Các trang chính

| URL             | Tính năng                                                 |
| --------------- | --------------------------------------------------------- |
| `/`             | Trang chủ                                                 |
| `/login`        | Đăng nhập                                                 |
| `/register`     | Đăng ký                                                   |
| `/booking`      | Đặt lịch khám (chọn chuyên khoa → bác sĩ → ngày giờ)      |
| `/appointments` | Quản lý Lịch hẹn                                          |
| `/schedules`    | Nhân sự & Lịch trực: KPI bar, Staff Grid, Gantt ngày/tuần |

### 5. Schedule API Endpoints

| Method   | URL                    | Mô tả                                    |
| -------- | ---------------------- | ---------------------------------------- |
| `GET`    | `/api/schedules`       | Lọc theo tuần/ngày/khoa (có phân trang)  |
| `GET`    | `/api/schedules/all`   | Tất cả ca trực (không phân trang)        |
| `POST`   | `/api/schedules`       | Tạo ca trực mới                          |
| `PUT`    | `/api/schedules/{id}`  | Cập nhật ca trực                         |
| `DELETE` | `/api/schedules/{id}`  | Xóa ca trực                              |
| `GET`    | `/api/staff/directory` | Danh sách nhân viên với tên, email, khoa |

**Business rules:**

- Không tạo 2 ca cùng loại trong ngày cho 1 nhân viên (400 + message)
- Mỗi nhân viên tối đa 2 ca/ngày
- Giờ tự động: Ca Sáng 06:00–12:00, Chiều 12:00–18:00, Tối 18:00–23:59

---

## 9. AI Usage Rule

Students are allowed to use AI tools such as ChatGPT, Gemini, Claude, GitHub Copilot, Cursor, Antigravity, or similar tools.

However, all important AI usage must be recorded in:

```text
docs/AI_AUDIT_LOG.md
docs/PROMPTS.md
docs/CHANGELOG.md
docs/REFLECTION.md
```

Students must be able to explain, verify, and defend all submitted work.
