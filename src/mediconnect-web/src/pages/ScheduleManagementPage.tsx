import { useCallback, useEffect, useMemo, useState } from "react";
import { departmentApi, scheduleApi, staffApi } from "../api/services";
import type { Department, ScheduleFlat, ScheduleWrite, StaffProfile } from "../types";
import { ShiftType, StaffType } from "../types";

// ─── Config ──────────────────────────────────────────────────────────────────

const SHIFT_CFG: Record<ShiftType, { label: string; icon: string; bg: string; text: string; border: string }> = {
  [ShiftType.Morning]:   { label: "Ca Sáng",  icon: "wb_sunny",          bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200" },
  [ShiftType.Afternoon]: { label: "Ca Chiều",  icon: "partly_cloudy_day", bg: "bg-sky-50",    text: "text-sky-700",    border: "border-sky-200"   },
  [ShiftType.Evening]:   { label: "Ca Tối",    icon: "nights_stay",       bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200"},
};

const STAFF_CFG: Record<StaffType, { label: string; chip: string }> = {
  [StaffType.Doctor]:    { label: "Bác sĩ",    chip: "bg-primary-container text-on-primary-container" },
  [StaffType.Nurse]:     { label: "Y tá",       chip: "bg-secondary-container text-secondary"          },
  [StaffType.Admin]:     { label: "Quản trị",   chip: "bg-surface-container-high text-on-surface-variant" },
  [StaffType.Caregiver]: { label: "Điều dưỡng", chip: "bg-green-100 text-green-700"                    },
};

const VN_DAYS      = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const VN_DAYS_FULL = ["Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getMondayOfWeek(d = new Date()): Date {
  const day = d.getDay();
  const m = new Date(d);
  m.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  m.setHours(0, 0, 0, 0);
  return m;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(d.getDate() + n);
  return r;
}

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatShort(s: string): string {
  const [, m, d] = s.split("-");
  return `${d}/${m}`;
}

function formatFull(s: string): string {
  const [y, m, d] = s.split("-");
  return `${d}/${m}/${y}`;
}

function isToday(dateStr: string): boolean {
  return dateStr === toDateStr(new Date());
}

function uid(): string {
  return Math.random().toString(36).slice(2);
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastKind = "success" | "error" | "warning";
interface ToastItem { id: string; kind: ToastKind; message: string; }

interface GanttRow {
  staffId: string;
  name: string;
  email: string;
  staffType: StaffType;
  department: string;
  departmentId: string;
  specialty?: string;
  yearsExperience: number;
  degree?: string;
  byDate: Map<string, ScheduleFlat[]>;
}

// ─── Toast ────────────────────────────────────────────────────────────────────

const TOAST_STYLE: Record<ToastKind, { bg: string; icon: string; text: string }> = {
  success: { bg: "bg-green-50 border-green-300",  icon: "check_circle", text: "text-green-700" },
  error:   { bg: "bg-red-50 border-red-300",      icon: "error",         text: "text-red-700"   },
  warning: { bg: "bg-amber-50 border-amber-300",  icon: "warning",       text: "text-amber-700" },
};

function ToastComp({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const s = TOAST_STYLE[item.kind];
  return (
    <div className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm text-sm ${s.bg}`}>
      <span className={`material-symbols-outlined text-lg shrink-0 mt-0.5 ${s.text}`}>{s.icon}</span>
      <p className={`flex-1 font-medium ${s.text}`}>{item.message}</p>
      <button onClick={onDismiss} className={`shrink-0 opacity-60 hover:opacity-100 ${s.text}`}>
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
}

// ─── Info Row (popup detail line) ─────────────────────────────────────────────

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="material-symbols-outlined text-base text-on-surface-variant shrink-0 mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] text-on-surface-variant leading-none mb-0.5">{label}</p>
        <p className="text-sm font-medium text-on-surface leading-tight break-words">{value}</p>
      </div>
    </div>
  );
}

// ─── Detail Popup ─────────────────────────────────────────────────────────────

function DetailPopup({
  schedule, onClose, onEdit, onDelete, deleting,
}: {
  schedule: ScheduleFlat;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  const sc  = SHIFT_CFG[schedule.shiftType];
  const stc = STAFF_CFG[schedule.staffType];
  const dateObj = new Date(schedule.date + "T00:00:00");
  const dayName = VN_DAYS_FULL[dateObj.getDay()];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Staff header ── */}
        <div className="bg-surface-container-low px-5 pt-5 pb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center text-xl font-bold text-primary shrink-0 select-none">
              {schedule.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-on-surface text-base leading-tight truncate">{schedule.name}</h3>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${stc.chip}`}>{stc.label}</span>
                <span className="text-xs text-on-surface-variant">·&nbsp;{schedule.department}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>

        {/* ── Staff details ── */}
        <div className="px-5 py-4 grid grid-cols-2 gap-3 border-b border-outline-variant">
          <div className="col-span-2">
            <InfoRow icon="mail" label="Email" value={schedule.email} />
          </div>
          {schedule.specialty && (
            <div className="col-span-2">
              <InfoRow icon="medical_services" label="Chuyên khoa" value={schedule.specialty} />
            </div>
          )}
          <InfoRow icon="workspace_premium" label="Kinh nghiệm" value={`${schedule.yearsExperience} năm`} />
          {schedule.degree && <InfoRow icon="school" label="Học vị" value={schedule.degree} />}
        </div>

        {/* ── Schedule detail ── */}
        <div className="px-5 py-4 border-b border-outline-variant space-y-3">
          <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">Chi tiết ca trực</p>

          {/* Shift badge card */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${sc.bg} ${sc.border}`}>
            <span className={`material-symbols-outlined text-2xl ${sc.text}`}>{sc.icon}</span>
            <div>
              <p className={`font-bold text-sm ${sc.text}`}>{schedule.shift}</p>
              <p className={`text-xs ${sc.text} opacity-75`}>
                {schedule.startTime?.slice(0, 5)} – {schedule.endTime?.slice(0, 5)}
              </p>
            </div>
          </div>

          <InfoRow
            icon="calendar_today"
            label="Ngày trực"
            value={`${dayName}, ${formatFull(schedule.date)}`}
          />
          {schedule.workRoom && (
            <InfoRow icon="meeting_room" label="Phòng làm việc" value={schedule.workRoom} />
          )}
        </div>

        {/* ── Actions ── */}
        <div className="px-5 py-4 flex gap-2.5">
          <button
            onClick={onEdit}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 border border-outline-variant rounded-xl text-sm font-medium text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-base">edit</span>
            Chỉnh sửa
          </button>
          <button
            onClick={onDelete}
            disabled={deleting}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-error/10 border border-error/20 text-error rounded-xl text-sm font-medium hover:bg-error/20 transition-colors disabled:opacity-50"
          >
            {deleting
              ? <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
              : <span className="material-symbols-outlined text-base">delete</span>
            }
            Xóa ca
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Shift Block (cell item) ──────────────────────────────────────────────────

function ShiftBlock({ schedule, onClick }: { schedule: ScheduleFlat; onClick: () => void }) {
  const c = SHIFT_CFG[schedule.shiftType];
  return (
    <button
      onClick={onClick}
      title={`${schedule.shift} · ${schedule.startTime?.slice(0, 5)}–${schedule.endTime?.slice(0, 5)}`}
      className={`w-full text-left rounded-lg px-2 py-1.5 border cursor-pointer ${c.bg} ${c.border} hover:shadow-sm hover:brightness-95 active:scale-[0.97] transition-all`}
    >
      <div className="flex items-center gap-1 leading-none">
        <span className={`material-symbols-outlined text-sm ${c.text}`}>{c.icon}</span>
        <span className={`text-[11px] font-bold ${c.text}`}>{c.label}</span>
      </div>
      <p className={`text-[10px] mt-0.5 ${c.text} opacity-70`}>
        {schedule.startTime?.slice(0, 5)}–{schedule.endTime?.slice(0, 5)}
      </p>
      {schedule.workRoom && (
        <p className={`text-[10px] mt-0.5 ${c.text} opacity-55 truncate`}>{schedule.workRoom}</p>
      )}
    </button>
  );
}

// ─── Schedule Modal (Add / Edit) ──────────────────────────────────────────────

function ScheduleModal({
  editingId, form, setForm, staff, saving, onSave, onClose,
}: {
  editingId: string | null;
  form: ScheduleWrite;
  setForm: React.Dispatch<React.SetStateAction<ScheduleWrite>>;
  staff: StaffProfile[];
  saving: boolean;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary-container text-lg">
                {editingId ? "edit_calendar" : "calendar_add_on"}
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-on-surface text-sm">
                {editingId ? "Cập nhật ca trực" : "Tạo lịch trực mới"}
              </h2>
              <p className="text-xs text-on-surface-variant">Điền đầy đủ thông tin bên dưới</p>
            </div>
          </div>
          <button type="button" onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="px-6 py-5 space-y-4">
          {/* Staff */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">
              Nhân viên <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">person_search</span>
              <select required value={form.staffId}
                onChange={e => setForm(f => ({ ...f, staffId: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-white text-sm text-on-surface focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none appearance-none transition-all">
                <option value="">— Chọn nhân viên —</option>
                {staff.map(s => (
                  <option key={s.id} value={s.id}>
                    {STAFF_CFG[s.staffType as StaffType]?.label ?? "NV"} — {s.specialty ?? s.id.slice(0, 8)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">
              Ngày trực <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">calendar_month</span>
              <input type="date" required value={form.shiftDate}
                onChange={e => setForm(f => ({ ...f, shiftDate: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-white text-sm text-on-surface focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
            </div>
          </div>

          {/* Shift selector */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">
              Ca trực <span className="text-error">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.values(ShiftType).filter(v => typeof v === "number") as ShiftType[]).map(st => {
                const cfg = SHIFT_CFG[st];
                const active = form.shiftType === st;
                return (
                  <button key={st} type="button"
                    onClick={() => setForm(f => ({ ...f, shiftType: st }))}
                    className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium transition-all ${active ? "border-primary bg-primary-container text-on-primary-container shadow-sm" : "border-outline-variant bg-white text-on-surface-variant hover:bg-surface-container"}`}>
                    <span className={`material-symbols-outlined text-base ${active ? "text-primary" : ""}`}>{cfg.icon}</span>
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Work room */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">
              Phòng <span className="text-outline font-normal">(tùy chọn)</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">meeting_room</span>
              <input type="text" value={form.workRoom ?? ""}
                onChange={e => setForm(f => ({ ...f, workRoom: e.target.value }))}
                placeholder="VD: P.201" maxLength={100}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-white text-sm text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-outline-variant rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors">
              Hủy
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
              {saving
                ? <><span className="material-symbols-outlined text-base animate-spin">progress_activity</span>Đang lưu...</>
                : <><span className="material-symbols-outlined text-base">save</span>{editingId ? "Cập nhật" : "Tạo lịch trực"}</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ScheduleManagementPage() {
  // ── data
  const [schedules, setSchedules]     = useState<ScheduleFlat[]>([]);
  const [staff, setStaff]             = useState<StaffProfile[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // ── ui
  const [loading, setLoading]                     = useState(true);
  const [toasts, setToasts]                       = useState<ToastItem[]>([]);
  const [selectedSchedule, setSelectedSchedule]   = useState<ScheduleFlat | null>(null);
  const [deleting, setDeleting]                   = useState(false);
  const [showModal, setShowModal]                 = useState(false);
  const [editingId, setEditingId]                 = useState<string | null>(null);
  const [saving, setSaving]                       = useState(false);

  // ── gantt navigation
  const [monday, setMonday]       = useState<Date>(getMondayOfWeek());
  const [filterDept, setFilterDept] = useState("");

  // ── form
  const [form, setForm] = useState<ScheduleWrite>({
    staffId: "", shiftDate: toDateStr(new Date()), shiftType: ShiftType.Morning, workRoom: "",
  });

  // ── computed
  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => toDateStr(addDays(monday, i))),
    [monday],
  );

  const ganttRows = useMemo<GanttRow[]>(() => {
    const map = new Map<string, GanttRow>();
    for (const s of schedules) {
      if (!map.has(s.staffId)) {
        map.set(s.staffId, {
          staffId: s.staffId, name: s.name, email: s.email,
          staffType: s.staffType, department: s.department, departmentId: s.departmentId,
          specialty: s.specialty, yearsExperience: s.yearsExperience, degree: s.degree,
          byDate: new Map(),
        });
      }
      const row = map.get(s.staffId)!;
      if (!row.byDate.has(s.date)) row.byDate.set(s.date, []);
      row.byDate.get(s.date)!.push(s);
    }
    return Array.from(map.values()).sort(
      (a, b) => a.department.localeCompare(b.department) || a.staffType - b.staffType || a.name.localeCompare(b.name),
    );
  }, [schedules]);

  const weekLabel = useMemo(() => {
    const start = formatShort(toDateStr(monday));
    const end   = formatShort(toDateStr(addDays(monday, 6)));
    return `${start} – ${end}/${monday.getFullYear()}`;
  }, [monday]);

  const isCurrentWeek = toDateStr(monday) === toDateStr(getMondayOfWeek());

  // ── toast
  const pushToast = useCallback((kind: ToastKind, message: string) => {
    const id = uid();
    setToasts(prev => [...prev, { id, kind, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
  }, []);

  // ── load meta once
  useEffect(() => {
    Promise.all([staffApi.getAll(), departmentApi.getAll()])
      .then(([s, d]) => { setStaff(s.data); setDepartments(d.data); })
      .catch(() => pushToast("error", "Không thể tải dữ liệu nhân sự."));
  }, [pushToast]);

  // ── load schedules for current week
  const loadSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await scheduleApi.filter({
        startDate:    toDateStr(monday),
        endDate:      toDateStr(addDays(monday, 6)),
        departmentId: filterDept || undefined,
        page:         1,
        pageSize:     200,
      });
      setSchedules(data.items);
    } catch {
      pushToast("error", "Không thể tải lịch trực.");
    } finally {
      setLoading(false);
    }
  }, [monday, filterDept, pushToast]);

  useEffect(() => { loadSchedules(); }, [loadSchedules]);

  // ── week navigation
  const prevWeek = () => setMonday(m => addDays(m, -7));
  const nextWeek = () => setMonday(m => addDays(m, 7));
  const thisWeek = () => setMonday(getMondayOfWeek());

  // ── open create modal
  function openCreate() {
    setEditingId(null);
    setForm({ staffId: staff[0]?.id ?? "", shiftDate: toDateStr(monday), shiftType: ShiftType.Morning, workRoom: "" });
    setShowModal(true);
  }

  // ── open edit from popup
  function openEditFromPopup() {
    if (!selectedSchedule) return;
    setEditingId(selectedSchedule.id);
    setForm({
      staffId: selectedSchedule.staffId, shiftDate: selectedSchedule.date,
      shiftType: selectedSchedule.shiftType, workRoom: selectedSchedule.workRoom ?? "",
    });
    setSelectedSchedule(null);
    setShowModal(true);
  }

  // ── save (create / update)
  async function handleSave() {
    if (!form.staffId) { pushToast("warning", "Vui lòng chọn nhân viên."); return; }
    setSaving(true);
    try {
      if (editingId) {
        await scheduleApi.update(editingId, form);
        pushToast("success", "Cập nhật ca trực thành công.");
      } else {
        await scheduleApi.create(form);
        pushToast("success", "Tạo ca trực thành công.");
      }
      setShowModal(false);
      await loadSchedules();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Lưu lịch trực thất bại.";
      pushToast("error", msg);
    } finally {
      setSaving(false);
    }
  }

  // ── delete from popup
  async function handleDeleteFromPopup() {
    if (!selectedSchedule) return;
    setDeleting(true);
    try {
      await scheduleApi.delete(selectedSchedule.id);
      pushToast("success", `Đã xóa ${selectedSchedule.shift} của ${selectedSchedule.name}.`);
      setSelectedSchedule(null);
      await loadSchedules();
    } catch {
      pushToast("error", "Không thể xóa ca trực.");
    } finally {
      setDeleting(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-5">

      {/* ── Toast ── */}
      <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
        {toasts.map(t => (
          <ToastComp key={t.id} item={t} onDismiss={() => setToasts(p => p.filter(x => x.id !== t.id))} />
        ))}
      </div>

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1 text-xs text-on-surface-variant mb-2">
            <span>Admin</span>
            <span className="material-symbols-outlined text-xs leading-none">chevron_right</span>
            <span className="text-primary font-semibold">HR & Lịch Trực</span>
          </nav>
          <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">view_timeline</span>
            Biểu đồ Gantt – Lịch trực
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">Nhấn vào ca trực để xem chi tiết và thao tác</p>
        </div>
        <button
          onClick={openCreate}
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-full font-medium text-sm hover:bg-primary/90 active:scale-95 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Thêm lịch trực
        </button>
      </div>

      {/* ── Controls bar ── */}
      <div className="flex flex-wrap items-center gap-3">

        {/* Week navigation */}
        <div className="flex items-center gap-0.5 bg-white border border-outline-variant rounded-xl p-1">
          <button onClick={prevWeek}
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
            title="Tuần trước">
            <span className="material-symbols-outlined text-base">chevron_left</span>
          </button>
          <span className="px-3 py-1.5 text-sm font-semibold text-on-surface min-w-[138px] text-center">
            {weekLabel}
          </span>
          <button onClick={nextWeek}
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
            title="Tuần sau">
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </div>

        {/* Jump to current week */}
        <button
          onClick={thisWeek}
          disabled={isCurrentWeek}
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${isCurrentWeek ? "border-primary bg-primary-container text-on-primary-container cursor-default" : "border-outline-variant bg-white text-on-surface-variant hover:bg-surface-container"}`}
        >
          <span className="material-symbols-outlined text-base">today</span>
          Tuần này
        </button>

        {/* Department filter */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-base pointer-events-none">
            domain
          </span>
          <select
            value={filterDept}
            onChange={e => setFilterDept(e.target.value)}
            className="pl-8 pr-10 py-2.5 rounded-xl border border-outline-variant bg-white text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none transition-all"
          >
            <option value="">Tất cả khoa</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        {/* Shift summary badges */}
        <div className="ml-auto flex items-center gap-2">
          {([ShiftType.Morning, ShiftType.Afternoon, ShiftType.Evening] as ShiftType[]).map(st => {
            const count = schedules.filter(s => s.shiftType === st).length;
            const c = SHIFT_CFG[st];
            return (
              <span key={st} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.border} ${c.text}`}>
                <span className="material-symbols-outlined text-xs">{c.icon}</span>
                {count}
              </span>
            );
          })}
          <span className="text-xs text-on-surface-variant px-2 py-1 bg-surface-container rounded-full font-medium">
            {ganttRows.length} nhân viên
          </span>
        </div>
      </div>

      {/* ── Gantt Chart ── */}
      <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span>
            <p className="text-on-surface-variant text-sm">Đang tải lịch trực...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: "820px" }}>
              <colgroup>
                <col style={{ width: "210px", minWidth: "190px" }} />
                {weekDates.map(d => (
                  <col key={d} style={{ width: "calc((100% - 210px) / 7)", minWidth: "108px" }} />
                ))}
              </colgroup>

              {/* ── Header row ── */}
              <thead>
                <tr>
                  {/* Staff column header */}
                  <th className="sticky left-0 z-20 bg-surface-container-low px-4 py-3 border-b-2 border-r-2 border-outline-variant text-left">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">
                      <span className="material-symbols-outlined text-sm">group</span>
                      Nhân viên &nbsp;·&nbsp; {ganttRows.length}
                    </div>
                  </th>

                  {weekDates.map(dateStr => {
                    const d       = new Date(dateStr + "T00:00:00");
                    const dayIdx  = d.getDay();
                    const today   = isToday(dateStr);
                    const weekend = dayIdx === 0 || dayIdx === 6;
                    return (
                      <th
                        key={dateStr}
                        className={`px-2 py-2.5 border-b-2 border-r border-outline-variant text-center transition-colors ${today ? "bg-primary/10" : weekend ? "bg-surface-container-low/60" : "bg-surface-container-low/20"}`}
                      >
                        <div className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${today ? "text-primary" : weekend ? "text-on-surface-variant/60" : "text-on-surface-variant/80"}`}>
                          {VN_DAYS[dayIdx]}
                        </div>
                        <div className={`text-lg font-extrabold leading-none ${today ? "text-primary" : weekend ? "text-on-surface/40" : "text-on-surface"}`}>
                          {d.getDate().toString().padStart(2, "0")}
                        </div>
                        <div className={`text-[10px] mt-0.5 ${today ? "text-primary/70" : "text-on-surface-variant/40"}`}>
                          /{d.getMonth() + 1}
                        </div>
                        {today && (
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary mx-auto" />
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              {/* ── Body ── */}
              <tbody>
                {ganttRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-20 text-center">
                      <span className="material-symbols-outlined text-6xl text-outline block mx-auto mb-3">
                        event_busy
                      </span>
                      <p className="font-semibold text-on-surface mb-1">Tuần này chưa có lịch trực</p>
                      <p className="text-xs text-on-surface-variant">
                        Nhấn "Thêm lịch trực" để tạo ca trực đầu tiên.
                      </p>
                    </td>
                  </tr>
                ) : (
                  ganttRows.map((row, idx) => {
                    const stc    = STAFF_CFG[row.staffType];
                    const isLast = idx === ganttRows.length - 1;
                    return (
                      <tr
                        key={row.staffId}
                        className={`group hover:bg-primary/[0.02] transition-colors ${!isLast ? "border-b border-outline-variant" : ""}`}
                      >
                        {/* Staff cell (sticky) */}
                        <td className="sticky left-0 z-10 bg-white group-hover:bg-primary/[0.02] px-3 py-2.5 border-r-2 border-outline-variant transition-colors">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0 select-none">
                              {row.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-on-surface leading-tight truncate">
                                {row.name}
                              </p>
                              <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold leading-none ${stc.chip}`}>
                                  {stc.label}
                                </span>
                                <span className="text-[10px] text-on-surface-variant/70 truncate">
                                  {row.department}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Date cells */}
                        {weekDates.map(dateStr => {
                          const dayIdx  = new Date(dateStr + "T00:00:00").getDay();
                          const today   = isToday(dateStr);
                          const weekend = dayIdx === 0 || dayIdx === 6;
                          const shifts  = row.byDate.get(dateStr) ?? [];
                          return (
                            <td
                              key={dateStr}
                              className={`px-1.5 py-1.5 border-r border-outline-variant align-top transition-colors ${today ? "bg-primary/[0.04]" : weekend ? "bg-surface-container-low/20" : ""}`}
                              style={{ minHeight: "60px" }}
                            >
                              <div className="space-y-1">
                                {shifts.map(s => (
                                  <ShiftBlock
                                    key={s.id}
                                    schedule={s}
                                    onClick={() => setSelectedSchedule(s)}
                                  />
                                ))}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold text-on-surface-variant">Chú thích:</span>
        {([ShiftType.Morning, ShiftType.Afternoon, ShiftType.Evening] as ShiftType[]).map(st => {
          const c = SHIFT_CFG[st];
          return (
            <span key={st} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${c.bg} ${c.border} ${c.text}`}>
              <span className="material-symbols-outlined text-sm">{c.icon}</span>
              {c.label}
            </span>
          );
        })}
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 border border-primary/20 text-primary">
          <span className="w-2 h-2 rounded-full bg-primary inline-block" />
          Hôm nay
        </span>
        <span className="text-xs text-on-surface-variant italic">
          · Nhấn vào ô ca trực để xem chi tiết
        </span>
      </div>

      {/* ── Detail Popup ── */}
      {selectedSchedule && (
        <DetailPopup
          schedule={selectedSchedule}
          onClose={() => setSelectedSchedule(null)}
          onEdit={openEditFromPopup}
          onDelete={handleDeleteFromPopup}
          deleting={deleting}
        />
      )}

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <ScheduleModal
          editingId={editingId}
          form={form}
          setForm={setForm}
          staff={staff}
          saving={saving}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
