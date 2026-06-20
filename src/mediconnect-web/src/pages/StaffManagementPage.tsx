import { useEffect, useMemo, useState } from "react";
import { staffApi, userApi, departmentApi } from "../api/services";
import type { StaffDirectory, UserAccount, Department } from "../types";
import { StaffType, UserRole } from "../types";

const STAFF_TYPE_LABELS: Record<number, string> = {
  [StaffType.Doctor]: "Bác sĩ",
  [StaffType.Nurse]: "Y tá",
  [StaffType.Admin]: "Quản trị",
  [StaffType.Caregiver]: "Hộ lý",
};

interface StaffFormState {
  userAccountId: string;
  staffType: StaffType;
  departmentId: string;
  specialty: string;
  yearsExperience: number;
  degree: string;
}

const EMPTY_FORM: StaffFormState = {
  userAccountId: "",
  staffType: StaffType.Doctor,
  departmentId: "",
  specialty: "",
  yearsExperience: 0,
  degree: "",
};

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<StaffDirectory[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<StaffFormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const loadAll = () => {
    setLoading(true);
    setError(null);
    Promise.all([staffApi.getDirectory(), userApi.getAll(), departmentApi.getAll()])
      .then(([s, u, d]) => {
        setStaff(s.data);
        setUsers(u.data);
        setDepartments(d.data);
      })
      .catch(() => setError("Không thể tải dữ liệu nhân sự."))
      .finally(() => setLoading(false));
  };

  useEffect(loadAll, []);

  const departmentMap = useMemo(() => new Map(departments.map(d => [d.id, d.name])), [departments]);

  // Accounts eligible to become staff: Doctor/Nurse role, not already linked to a staff profile
  const eligibleUsers = useMemo(() => {
    const staffUserIds = new Set(staff.map(s => s.userId));
    return users.filter(
      u => (u.role === UserRole.Doctor || u.role === UserRole.Nurse) && !staffUserIds.has(u.id),
    );
  }, [users, staff]);

  const filteredStaff = useMemo(() => {
    return staff.filter(s => {
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        (s.specialty ?? "").toLowerCase().includes(search.toLowerCase());
      const matchDept = !filterDept || s.departmentId === filterDept;
      return matchSearch && matchDept;
    });
  }, [staff, search, filterDept]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEditModal = (s: StaffDirectory) => {
    setEditingId(s.id);
    setForm({
      userAccountId: s.userId,
      staffType: s.staffType,
      departmentId: s.departmentId,
      specialty: s.specialty ?? "",
      yearsExperience: s.yearsExperience,
      degree: s.degree ?? "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.userAccountId || !form.departmentId) {
      setError("Vui lòng chọn tài khoản và khoa.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        userAccountId: form.userAccountId,
        staffType: form.staffType,
        departmentId: form.departmentId,
        specialty: form.specialty || undefined,
        yearsExperience: form.yearsExperience,
        degree: form.degree || undefined,
      };
      if (editingId) {
        await staffApi.update(editingId, payload);
        setSuccessMsg("Đã cập nhật hồ sơ nhân sự.");
      } else {
        await staffApi.create(payload);
        setSuccessMsg("Đã thêm hồ sơ nhân sự mới.");
      }
      setIsModalOpen(false);
      loadAll();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Không thể lưu hồ sơ nhân sự.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (s: StaffDirectory) => {
    if (!window.confirm(`Xóa hồ sơ nhân sự của "${s.name}"?`)) return;
    try {
      await staffApi.delete(s.id);
      setSuccessMsg("Đã xóa hồ sơ nhân sự.");
      loadAll();
    } catch {
      setError("Không thể xóa hồ sơ nhân sự.");
    }
  };

  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(null), 3000);
    return () => clearTimeout(t);
  }, [successMsg]);

  return (
    <div className="min-h-screen bg-background p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface">Quản lý Hồ sơ Nhân sự</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Thông tin chuyên môn của Bác sĩ, Y tá: chuyên khoa, kinh nghiệm, học vị.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-primary text-on-primary rounded px-4 py-2 flex items-center gap-2 text-sm font-medium hover:opacity-90 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Thêm hồ sơ nhân sự
        </button>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-lg">error</span>
          {error}
        </div>
      )}
      {successMsg && (
        <div className="bg-tertiary-container text-on-tertiary-container px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          {successMsg}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 flex items-center gap-2 flex-1 max-w-sm">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email, chuyên khoa..."
            className="bg-transparent border-none text-sm outline-none w-full"
          />
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">filter_list</span>
          <select
            value={filterDept}
            onChange={e => setFilterDept(e.target.value)}
            className="bg-transparent border-none text-sm outline-none cursor-pointer"
          >
            <option value="">Tất cả khoa</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-surface-container-low animate-pulse rounded" />
            ))}
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-on-surface-variant gap-2">
            <span className="material-symbols-outlined text-4xl">badge</span>
            <p className="text-sm">Không có hồ sơ nhân sự nào</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-xs text-on-surface-variant">
              <tr>
                <th className="px-6 py-3 font-semibold">Họ tên</th>
                <th className="px-6 py-3 font-semibold">Loại</th>
                <th className="px-6 py-3 font-semibold">Khoa</th>
                <th className="px-6 py-3 font-semibold">Chuyên khoa</th>
                <th className="px-6 py-3 font-semibold text-right">Kinh nghiệm</th>
                <th className="px-6 py-3 font-semibold">Học vị</th>
                <th className="px-6 py-3 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-sm">
              {filteredStaff.map(s => (
                <tr key={s.id} className="hover:bg-surface transition-colors">
                  <td className="px-6 py-3">
                    <p className="font-medium text-on-surface">{s.name}</p>
                    <p className="text-xs text-on-surface-variant">{s.email}</p>
                  </td>
                  <td className="px-6 py-3 text-on-surface-variant">{STAFF_TYPE_LABELS[s.staffType] ?? "—"}</td>
                  <td className="px-6 py-3 text-on-surface-variant">{s.department}</td>
                  <td className="px-6 py-3 text-on-surface-variant">{s.specialty ?? "—"}</td>
                  <td className="px-6 py-3 text-right text-on-surface-variant">{s.yearsExperience} năm</td>
                  <td className="px-6 py-3 text-on-surface-variant">{s.degree ?? "—"}</td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => openEditModal(s)}
                      className="p-1.5 text-on-surface-variant hover:text-primary transition-colors"
                      title="Sửa"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(s)}
                      className="p-1.5 text-on-surface-variant hover:text-error transition-colors"
                      title="Xóa"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-xl font-semibold text-on-surface">
              {editingId ? "Sửa hồ sơ nhân sự" : "Thêm hồ sơ nhân sự"}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-on-surface-variant">Tài khoản nhân viên</label>
                <select
                  value={form.userAccountId}
                  disabled={!!editingId}
                  onChange={e => setForm(f => ({ ...f, userAccountId: e.target.value }))}
                  className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface disabled:bg-surface-container-low disabled:text-on-surface-variant"
                >
                  <option value="">— Chọn tài khoản (Doctor/Nurse) —</option>
                  {editingId && (
                    <option value={form.userAccountId}>
                      {users.find(u => u.id === form.userAccountId)?.fullName ?? form.userAccountId}
                    </option>
                  )}
                  {eligibleUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} ({u.email})
                    </option>
                  ))}
                </select>
                {!editingId && eligibleUsers.length === 0 && (
                  <p className="text-xs text-error mt-1">
                    Không có tài khoản Doctor/Nurse nào chưa gán hồ sơ. Tạo tài khoản mới ở Quản lý tài khoản.
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-on-surface-variant">Loại nhân sự</label>
                <select
                  value={form.staffType}
                  onChange={e => setForm(f => ({ ...f, staffType: Number(e.target.value) as StaffType }))}
                  className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface"
                >
                  {Object.entries(STAFF_TYPE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-on-surface-variant">Khoa</label>
                <select
                  value={form.departmentId}
                  onChange={e => setForm(f => ({ ...f, departmentId: e.target.value }))}
                  className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface"
                >
                  <option value="">— Chọn khoa —</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-on-surface-variant">Chuyên khoa</label>
                <input
                  value={form.specialty}
                  onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))}
                  placeholder="Ví dụ: Tim mạch can thiệp"
                  className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-on-surface-variant">Năm kinh nghiệm</label>
                  <input
                    type="number"
                    min={0}
                    value={form.yearsExperience}
                    onChange={e => setForm(f => ({ ...f, yearsExperience: Number(e.target.value) }))}
                    className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-on-surface-variant">Học vị</label>
                  <input
                    value={form.degree}
                    onChange={e => setForm(f => ({ ...f, degree: e.target.value }))}
                    placeholder="Ví dụ: ThS.BS"
                    className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container rounded transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || (!editingId && !form.userAccountId) || !form.departmentId}
                className="px-4 py-2 text-sm font-medium bg-primary text-on-primary rounded hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {submitting ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
