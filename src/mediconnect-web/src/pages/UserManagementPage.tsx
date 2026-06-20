import { useEffect, useMemo, useState } from "react";
import { userApi } from "../api/services";
import type { UserAccount } from "../types";
import { UserRole } from "../types";
import { useAuth } from "../context/AuthContext";

const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.Patient]: "Bệnh nhân",
  [UserRole.Doctor]: "Bác sĩ",
  [UserRole.Nurse]: "Y tá",
  [UserRole.Admin]: "Quản trị viên",
};

const ROLE_BADGE: Record<UserRole, string> = {
  [UserRole.Patient]: "bg-surface-container text-on-surface-variant",
  [UserRole.Doctor]: "bg-primary-container text-on-primary-container",
  [UserRole.Nurse]: "bg-secondary-container text-on-secondary-container",
  [UserRole.Admin]: "bg-error-container text-on-error-container",
};

interface UserFormState {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: UserRole;
  isActive: boolean;
}

const EMPTY_FORM: UserFormState = {
  fullName: "",
  email: "",
  phoneNumber: "",
  password: "",
  role: UserRole.Patient,
  isActive: true,
};

export default function UserManagementPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<UserFormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = () => {
    setLoading(true);
    setError(null);
    userApi
      .getAll()
      .then(res => setUsers(res.data))
      .catch(() => setError("Không thể tải danh sách tài khoản."))
      .finally(() => setLoading(false));
  };

  useEffect(loadUsers, []);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch =
        !search ||
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = filterRole === "" || u.role === Number(filterRole);
      return matchSearch && matchRole;
    });
  }, [users, search, filterRole]);

  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(null), 3000);
    return () => clearTimeout(t);
  }, [successMsg]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEditModal = (u: UserAccount) => {
    setEditingId(u.id);
    setForm({
      fullName: u.fullName,
      email: u.email,
      phoneNumber: u.phoneNumber ?? "",
      password: "",
      role: u.role,
      isActive: u.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.fullName || !form.email) {
      setError("Vui lòng nhập đầy đủ họ tên và email.");
      return;
    }
    if (!editingId && !form.password) {
      setError("Vui lòng nhập mật khẩu cho tài khoản mới.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber || undefined,
        password: form.password || undefined,
        role: form.role,
        isActive: form.isActive,
      };
      if (editingId) {
        await userApi.update(editingId, payload);
        setSuccessMsg("Đã cập nhật tài khoản.");
      } else {
        await userApi.create(payload);
        setSuccessMsg("Đã tạo tài khoản mới.");
      }
      setIsModalOpen(false);
      loadUsers();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Không thể lưu tài khoản.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (u: UserAccount) => {
    try {
      await userApi.updateStatus(u.id, !u.isActive);
      setUsers(prev => prev.map(x => (x.id === u.id ? { ...x, isActive: !u.isActive } : x)));
      setSuccessMsg(!u.isActive ? `Đã mở khóa "${u.fullName}".` : `Đã khóa "${u.fullName}".`);
    } catch {
      setError("Không thể thay đổi trạng thái tài khoản.");
    }
  };

  const changeRole = async (u: UserAccount, role: UserRole) => {
    if (role === u.role) return;
    try {
      await userApi.updateRole(u.id, role);
      setUsers(prev => prev.map(x => (x.id === u.id ? { ...x, role } : x)));
      setSuccessMsg(`Đã đổi quyền của "${u.fullName}" thành ${ROLE_LABELS[role]}.`);
    } catch {
      setError("Không thể đổi quyền tài khoản.");
    }
  };

  const handleDelete = async (u: UserAccount) => {
    if (!window.confirm(`Xóa tài khoản "${u.fullName}" (${u.email})? Hành động này không thể hoàn tác.`)) return;
    try {
      await userApi.delete(u.id);
      setSuccessMsg("Đã xóa tài khoản.");
      loadUsers();
    } catch {
      setError("Không thể xóa tài khoản. Tài khoản có thể đang được tham chiếu ở nơi khác.");
    }
  };

  return (
    <div className="min-h-screen bg-background p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface">Trung tâm Điều khiển Tài khoản</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Quản lý tài khoản hệ thống: khóa/mở khóa và phân quyền theo vai trò.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-primary text-on-primary rounded px-4 py-2 flex items-center gap-2 text-sm font-medium hover:opacity-90 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Tạo tài khoản
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

      {/* KPI summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(
          [
            { label: "Tổng tài khoản", value: users.length, icon: "groups" },
            { label: "Đang hoạt động", value: users.filter(u => u.isActive).length, icon: "check_circle" },
            { label: "Đã khóa", value: users.filter(u => !u.isActive).length, icon: "lock" },
            { label: "Admin", value: users.filter(u => u.role === UserRole.Admin).length, icon: "shield_person" },
          ] as const
        ).map(kpi => (
          <div key={kpi.label} className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
            <div className="flex items-center gap-2 text-on-surface-variant text-xs font-semibold uppercase">
              <span className="material-symbols-outlined text-[16px]">{kpi.icon}</span>
              {kpi.label}
            </div>
            <p className="text-2xl font-bold text-on-surface mt-1">{loading ? "—" : kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 flex items-center gap-2 flex-1 max-w-sm">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên hoặc email..."
            className="bg-transparent border-none text-sm outline-none w-full"
          />
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">filter_list</span>
          <select
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            className="bg-transparent border-none text-sm outline-none cursor-pointer"
          >
            <option value="">Tất cả vai trò</option>
            {Object.entries(ROLE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-12 bg-surface-container-low animate-pulse rounded" />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-on-surface-variant gap-2">
            <span className="material-symbols-outlined text-4xl">person_off</span>
            <p className="text-sm">Không tìm thấy tài khoản nào</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-xs text-on-surface-variant">
              <tr>
                <th className="px-6 py-3 font-semibold">Người dùng</th>
                <th className="px-6 py-3 font-semibold">Vai trò</th>
                <th className="px-6 py-3 font-semibold">Trạng thái</th>
                <th className="px-6 py-3 font-semibold">Ngày tạo</th>
                <th className="px-6 py-3 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-sm">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-surface transition-colors">
                  <td className="px-6 py-3">
                    <p className="font-medium text-on-surface">{u.fullName}</p>
                    <p className="text-xs text-on-surface-variant">{u.email}</p>
                  </td>
                  <td className="px-6 py-3">
                    <select
                      value={u.role}
                      disabled={u.id === currentUser?.id}
                      onChange={e => changeRole(u, Number(e.target.value) as UserRole)}
                      className={`text-xs font-bold px-2 py-1 rounded border-none outline-none cursor-pointer ${ROLE_BADGE[u.role]} disabled:opacity-60 disabled:cursor-not-allowed`}
                      title={u.id === currentUser?.id ? "Không thể đổi quyền của chính mình" : "Đổi vai trò"}
                    >
                      {Object.entries(ROLE_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => toggleActive(u)}
                      disabled={u.id === currentUser?.id}
                      className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                        u.isActive ? "bg-tertiary-container text-on-tertiary-container" : "bg-error-container text-on-error-container"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">{u.isActive ? "lock_open" : "lock"}</span>
                      {u.isActive ? "Hoạt động" : "Đã khóa"}
                    </button>
                  </td>
                  <td className="px-6 py-3 text-on-surface-variant text-xs">
                    {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => openEditModal(u)}
                      className="p-1.5 text-on-surface-variant hover:text-primary transition-colors"
                      title="Sửa"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(u)}
                      disabled={u.id === currentUser?.id}
                      className="p-1.5 text-on-surface-variant hover:text-error transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
              {editingId ? "Sửa tài khoản" : "Tạo tài khoản mới"}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-on-surface-variant">Họ tên</label>
                <input
                  value={form.fullName}
                  onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                  className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-on-surface-variant">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-on-surface-variant">Số điện thoại</label>
                <input
                  value={form.phoneNumber}
                  onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
                  className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-on-surface-variant">
                  Mật khẩu {editingId && <span className="text-on-surface-variant">(để trống nếu không đổi)</span>}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-on-surface-variant">Vai trò</label>
                  <select
                    value={form.role}
                    onChange={e => setForm(f => ({ ...f, role: Number(e.target.value) as UserRole }))}
                    className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface"
                  >
                    {Object.entries(ROLE_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-on-surface-variant">Trạng thái</label>
                  <select
                    value={form.isActive ? "1" : "0"}
                    onChange={e => setForm(f => ({ ...f, isActive: e.target.value === "1" }))}
                    className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface"
                  >
                    <option value="1">Hoạt động</option>
                    <option value="0">Đã khóa</option>
                  </select>
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
                disabled={submitting}
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
