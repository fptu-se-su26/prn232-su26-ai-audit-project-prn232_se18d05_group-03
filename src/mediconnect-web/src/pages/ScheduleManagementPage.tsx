import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { departmentApi, scheduleApi, staffApi } from "../api/services";
import type {
  Department, ScheduleFlat, ScheduleWrite, StaffDirectory, StaffProfile,
} from "../types";
import { ShiftType, StaffType } from "../types";

// ─── Config ──────────────────────────────────────────────────────────────────

const SHIFT_CFG: Record<ShiftType, { label: string; icon: string; bg: string; text: string; border: string; barBg: string; barBorder: string }> = {
  [ShiftType.Morning]:   { label: "Ca Sáng",  icon: "wb_sunny",          bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  barBg: "bg-amber-100/80",  barBorder: "border-l-amber-500"  },
  [ShiftType.Afternoon]: { label: "Ca Chiều",  icon: "partly_cloudy_day", bg: "bg-sky-50",    text: "text-sky-700",    border: "border-sky-200",    barBg: "bg-sky-100/80",    barBorder: "border-l-sky-500"    },
  [ShiftType.Evening]:   { label: "Ca Tối",    icon: "nights_stay",       bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", barBg: "bg-indigo-100/80", barBorder: "border-l-indigo-500" },
};

const STAFF_CFG: Record<StaffType, { label: string; chip: string }> = {
  [StaffType.Doctor]:    { label: "Bác sĩ",    chip: "bg-primary-container text-on-primary-container" },
  [StaffType.Nurse]:     { label: "Y tá",       chip: "bg-secondary-container text-secondary"          },
  [StaffType.Admin]:     { label: "Quản trị",   chip: "bg-surface-container-high text-on-surface-variant" },
  [StaffType.Caregiver]: { label: "Điều dưỡng", chip: "bg-green-100 text-green-700"                    },
};

const VN_DAYS      = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const VN_DAYS_FULL = ["Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
const DAY_HOURS    = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]; // 2h ticks

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getMondayOfWeek(d = new Date()): Date {
  const m = new Date(d);
  m.setDate(d.getDate() - (d.getDay() === 0 ? 6 : d.getDay() - 1));
  m.setHours(0, 0, 0, 0);
  return m;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d); r.setDate(d.getDate() + n); return r;
}

function toDateStr(d: Date): string { return d.toISOString().slice(0, 10); }

function formatShort(s: string): string {
  const [, m, d] = s.split("-"); return `${d}/${m}`;
}

function formatFull(s: string): string {
  const [y, m, d] = s.split("-"); return `${d}/${m}/${y}`;
}

function isToday(dateStr: string): boolean { return dateStr === toDateStr(new Date()); }

function timeToMins(t: string): number {
  const [h, m] = t.split(":").map(Number); return h * 60 + (m || 0);
}

function getBarStyle(startTime: string, endTime: string): { left: string; width: string } {
  const start = timeToMins(startTime);
  let end = timeToMins(endTime);
  if (end === 0 || end < start) end = 1440;
  return {
    left: `${(start / 1440) * 100}%`,
    width: `${((end - start) / 1440) * 100}%`,
  };
}

function uid(): string { return Math.random().toString(36).slice(2); }

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastKind = "success" | "error" | "warning";
interface ToastItem { id: string; kind: ToastKind; message: string; }
type ViewMode = "week" | "day";

interface GanttRow {
  staffId: string; name: string; email: string;
  staffType: StaffType; department: string; departmentId: string;
  specialty?: string; yearsExperience: number; degree?: string;
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

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ icon, label, value, sub, accent }: {
  icon: string; label: string; value: string; sub?: string; accent?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-outline-variant p-4 flex items-center gap-3 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent ?? "bg-primary/10"}`}>
        <span className={`material-symbols-outlined text-xl ${accent ? "text-white" : "text-primary"}`}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-on-surface-variant leading-none mb-0.5">{label}</p>
        <p className="text-xl font-extrabold text-on-surface leading-none">{value}</p>
        {sub && <p className="text-[11px] text-on-surface-variant mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Staff Card ───────────────────────────────────────────────────────────────

function StaffCard({ staff, isOnDuty, onViewSchedule }: {
  staff: StaffDirectory; isOnDuty: boolean; onViewSchedule: () => void;
}) {
  const stc = STAFF_CFG[staff.staffType];
  const initial = staff.name.charAt(0).toUpperCase();
  return (
    <div className="bg-white rounded-xl shadow-[0px_2px_4px_rgba(0,0,0,0.05)] border border-outline-variant hover:shadow-md transition-all group p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-xl font-extrabold text-primary select-none">
          {initial}
        </div>
        <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-tight ${isOnDuty ? "bg-tertiary-container text-on-tertiary-container" : "bg-surface-container-high text-on-surface-variant"}`}>
          {isOnDuty ? "Đang trực" : "Nghỉ"}
        </span>
      </div>
      <h3 className="font-bold text-sm text-on-surface mb-2 group-hover:text-primary transition-colors leading-tight">
        {staff.name}
      </h3>
      <div className="flex flex-wrap gap-1 mb-3">
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold leading-none ${stc.chip}`}>{stc.label}</span>
        <span className="bg-primary-fixed text-on-primary-fixed-variant px-1.5 py-0.5 rounded text-[10px] font-bold leading-none">
          {staff.department}
        </span>
        {staff.degree && (
          <span className="bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 rounded text-[10px] font-bold leading-none">
            {staff.degree}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between border-t border-outline-variant pt-3">
        <button
          onClick={onViewSchedule}
          className="text-primary text-xs font-semibold flex items-center gap-1 hover:underline"
        >
          <span className="material-symbols-outlined text-sm">visibility</span>
          Xem lịch trực
        </button>
        <span className="text-[10px] text-on-surface-variant truncate max-w-[80px]" title={staff.specialty}>
          {staff.specialty ?? "—"}
        </span>
      </div>
    </div>
  );
}

// ─── Info Row (popup) ─────────────────────────────────────────────────────────

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

function DetailPopup({ schedule, onClose, onEdit, onDelete, deleting }: {
  schedule: ScheduleFlat; onClose: () => void;
  onEdit: () => void; onDelete: () => void; deleting: boolean;
}) {
  const sc  = SHIFT_CFG[schedule.shiftType];
  const stc = STAFF_CFG[schedule.staffType];
  const dateObj = new Date(schedule.date + "T00:00:00");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-surface-container-low px-5 pt-5 pb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center text-xl font-bold text-primary shrink-0 select-none">
              {schedule.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-on-surface text-base leading-tight truncate">{schedule.name}</h3>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${stc.chip}`}>{stc.label}</span>
                <span className="text-xs text-on-surface-variant">· {schedule.department}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors shrink-0">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>

        <div className="px-5 py-4 grid grid-cols-2 gap-3 border-b border-outline-variant">
          <div className="col-span-2"><InfoRow icon="mail" label="Email" value={schedule.email} /></div>
          {schedule.specialty && <div className="col-span-2"><InfoRow icon="medical_services" label="Chuyên khoa" value={schedule.specialty} /></div>}
          <InfoRow icon="workspace_premium" label="Kinh nghiệm" value={`${schedule.yearsExperience} năm`} />
          {schedule.degree && <InfoRow icon="school" label="Học vị" value={schedule.degree} />}
        </div>

        <div className="px-5 py-4 border-b border-outline-variant space-y-3">
          <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">Chi tiết ca trực</p>
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${sc.bg} ${sc.border}`}>
            <span className={`material-symbols-outlined text-2xl ${sc.text}`}>{sc.icon}</span>
            <div>
              <p className={`font-bold text-sm ${sc.text}`}>{schedule.shift}</p>
              <p className={`text-xs ${sc.text} opacity-75`}>{schedule.startTime?.slice(0, 5)} – {schedule.endTime?.slice(0, 5)}</p>
            </div>
          </div>
          <InfoRow icon="calendar_today" label="Ngày trực" value={`${VN_DAYS_FULL[dateObj.getDay()]}, ${formatFull(schedule.date)}`} />
          {schedule.workRoom && <InfoRow icon="meeting_room" label="Phòng" value={schedule.workRoom} />}
        </div>

        <div className="px-5 py-4 flex gap-2.5">
          <button onClick={onEdit} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 border border-outline-variant rounded-xl text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-base">edit</span> Chỉnh sửa
          </button>
          <button onClick={onDelete} disabled={deleting} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-error/10 border border-error/20 text-error rounded-xl text-sm font-medium hover:bg-error/20 transition-colors disabled:opacity-50">
            {deleting
              ? <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
              : <span className="material-symbols-outlined text-base">delete</span>}
            Xóa ca
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Shift Block (week view cell) ─────────────────────────────────────────────

function ShiftBlock({ schedule, onClick, highlighted }: {
  schedule: ScheduleFlat; onClick: () => void; highlighted?: boolean;
}) {
  const c = SHIFT_CFG[schedule.shiftType];
  return (
    <button
      onClick={onClick}
      title={`${schedule.shift} · ${schedule.startTime?.slice(0, 5)}–${schedule.endTime?.slice(0, 5)}`}
      className={`w-full text-left rounded-lg px-2 py-1.5 border cursor-pointer ${c.bg} ${c.border} hover:shadow-sm hover:brightness-95 active:scale-[0.97] transition-all ${highlighted ? "ring-2 ring-primary" : ""}`}
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

// ─── Day Gantt Bar ────────────────────────────────────────────────────────────

function DayGanttRow({ staffId, name, staffType, shifts, onShiftClick, highlighted }: {
  staffId: string; name: string; staffType: StaffType;
  shifts: ScheduleFlat[]; onShiftClick: (s: ScheduleFlat) => void;
  highlighted?: boolean;
}) {
  const stc = STAFF_CFG[staffType];
  return (
    <div className={`flex border-b border-outline-variant hover:bg-surface-container-low/40 transition-colors group ${highlighted ? "bg-primary/[0.03]" : ""}`}>
      {/* staff label */}
      <div className="w-52 shrink-0 border-r border-outline-variant px-3 py-2 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0 select-none">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm text-on-surface leading-tight truncate">{name}</p>
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold leading-none ${stc.chip}`}>{stc.label}</span>
        </div>
      </div>

      {/* timeline track */}
      <div className="flex-1 relative h-14">
        {/* hour grid lines */}
        {DAY_HOURS.map(h => (
          <div key={h} style={{ left: `${(h / 24) * 100}%` }} className="absolute top-0 bottom-0 w-px bg-outline-variant/25" />
        ))}

        {/* shift bars */}
        {shifts.map(s => {
          const c = SHIFT_CFG[s.shiftType];
          const { left, width } = getBarStyle(s.startTime, s.endTime);
          return (
            <button
              key={s.id}
              onClick={() => onShiftClick(s)}
              title={`${s.shift} (${s.startTime?.slice(0, 5)} – ${s.endTime?.slice(0, 5)})${s.workRoom ? " · " + s.workRoom : ""}`}
              style={{ left, width, top: "20%", height: "60%" }}
              className={`absolute border-l-4 rounded-r-lg flex items-center px-3 cursor-pointer hover:brightness-95 hover:shadow-sm active:scale-y-95 transition-all ${c.barBg} ${c.barBorder} group/bar`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className={`material-symbols-outlined text-sm shrink-0 ${c.text}`}>{c.icon}</span>
                <span className={`text-[11px] font-bold ${c.text} truncate`}>{s.shift}</span>
                {s.workRoom && <span className={`text-[10px] ${c.text} opacity-60 truncate`}>· {s.workRoom}</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Schedule Modal ───────────────────────────────────────────────────────────

function ScheduleModal({ editingId, form, setForm, staff, saving, onSave, onClose }: {
  editingId: string | null; form: ScheduleWrite;
  setForm: (update: (prev: ScheduleWrite) => ScheduleWrite) => void;
  staff: StaffProfile[]; saving: boolean; onSave: () => void; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary-container text-lg">
                {editingId ? "edit_calendar" : "calendar_add_on"}
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-on-surface text-sm">{editingId ? "Cập nhật ca trực" : "Tạo lịch trực mới"}</h2>
              <p className="text-xs text-on-surface-variant">Điền đầy đủ thông tin bên dưới</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={e => { e.preventDefault(); onSave(); }} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">
              Nhân viên <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">person_search</span>
              <select required value={form.staffId} onChange={e => setForm(f => ({ ...f, staffId: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-white text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none appearance-none transition-all">
                <option value="">— Chọn nhân viên —</option>
                {staff.map(s => (
                  <option key={s.id} value={s.id}>
                    {STAFF_CFG[s.staffType as StaffType]?.label ?? "NV"} — {s.specialty ?? s.id.slice(0, 8)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">
              Ngày trực <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">calendar_month</span>
              <input type="date" required value={form.shiftDate} onChange={e => setForm(f => ({ ...f, shiftDate: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-white text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">
              Ca trực <span className="text-error">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.values(ShiftType).filter(v => typeof v === "number") as ShiftType[]).map(st => {
                const cfg = SHIFT_CFG[st];
                const active = form.shiftType === st;
                return (
                  <button key={st} type="button" onClick={() => setForm(f => ({ ...f, shiftType: st }))}
                    className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium transition-all ${active ? "border-primary bg-primary-container text-on-primary-container shadow-sm" : "border-outline-variant bg-white text-on-surface-variant hover:bg-surface-container"}`}>
                    <span className={`material-symbols-outlined text-base ${active ? "text-primary" : ""}`}>{cfg.icon}</span>
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wide">
              Phòng <span className="text-outline font-normal">(tùy chọn)</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">meeting_room</span>
              <input type="text" value={form.workRoom ?? ""} onChange={e => setForm(f => ({ ...f, workRoom: e.target.value }))}
                placeholder="VD: P.201" maxLength={100}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-white text-sm placeholder:text-outline focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-outline-variant rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors">
              Hủy
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
              {saving
                ? <><span className="material-symbols-outlined text-base animate-spin">progress_activity</span>Đang lưu...</>
                : <><span className="material-symbols-outlined text-base">save</span>{editingId ? "Cập nhật" : "Tạo lịch trực"}</>}
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
  const [schedules,    setSchedules]    = useState<ScheduleFlat[]>([]);
  const [todayScheds,  setTodayScheds]  = useState<ScheduleFlat[]>([]);
  const [directory,    setDirectory]    = useState<StaffDirectory[]>([]);
  const [staff,        setStaff]        = useState<StaffProfile[]>([]);
  const [departments,  setDepartments]  = useState<Department[]>([]);

  // ── ui state
  const [loading,           setLoading]           = useState(true);
  const [toasts,            setToasts]            = useState<ToastItem[]>([]);
  const [selectedSchedule,  setSelectedSchedule]  = useState<ScheduleFlat | null>(null);
  const [deleting,          setDeleting]          = useState(false);
  const [showModal,         setShowModal]         = useState(false);
  const [editingId,         setEditingId]         = useState<string | null>(null);
  const [saving,            setSaving]            = useState(false);
  const [viewMode,          setViewMode]          = useState<ViewMode>("week");
  const [highlightStaffId,  setHighlightStaffId]  = useState<string | null>(null);
  const [monday,            setMonday]            = useState<Date>(getMondayOfWeek());
  const [filterDept,        setFilterDept]        = useState("");

  const scheduleBoardRef = useRef<HTMLDivElement>(null);

  // ── form
  const [form, setForm] = useState<ScheduleWrite>({
    staffId: "", shiftDate: toDateStr(new Date()), shiftType: ShiftType.Morning, workRoom: "",
  });

  // ── computed: week dates
  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => toDateStr(addDays(monday, i))),
    [monday],
  );

  // ── computed: week gantt rows
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

  // ── computed: day gantt rows (group today's schedules by staff)
  const dayRows = useMemo(() => {
    const map = new Map<string, { staffId: string; name: string; staffType: StaffType; shifts: ScheduleFlat[] }>();
    for (const s of todayScheds) {
      if (!map.has(s.staffId)) map.set(s.staffId, { staffId: s.staffId, name: s.name, staffType: s.staffType, shifts: [] });
      map.get(s.staffId)!.shifts.push(s);
    }
    return Array.from(map.values()).sort((a, b) => a.staffType - b.staffType || a.name.localeCompare(b.name));
  }, [todayScheds]);

  // ── computed: KPIs
  const onDutyIds = useMemo(() => new Set(todayScheds.map(s => s.staffId)), [todayScheds]);
  const weekTotal  = schedules.length;
  const coverage   = directory.length > 0 ? Math.round((onDutyIds.size / directory.length) * 100) : 0;

  // ── computed: week label
  const weekLabel = useMemo(() => {
    return `${formatShort(toDateStr(monday))} – ${formatShort(toDateStr(addDays(monday, 6)))}/${monday.getFullYear()}`;
  }, [monday]);
  const isCurrentWeek = toDateStr(monday) === toDateStr(getMondayOfWeek());

  // ── toast
  const pushToast = useCallback((kind: ToastKind, message: string) => {
    const id = uid();
    setToasts(p => [...p, { id, kind, message }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4500);
  }, []);

  // ── load metadata once
  useEffect(() => {
    Promise.all([staffApi.getAll(), staffApi.getDirectory(), departmentApi.getAll()])
      .then(([s, d, dept]) => { setStaff(s.data); setDirectory(d.data); setDepartments(dept.data); })
      .catch(() => pushToast("error", "Không thể tải dữ liệu nhân sự."));
  }, [pushToast]);

  // ── load today's schedules once on mount (for KPIs + Day view)
  const loadTodaySchedules = useCallback(async () => {
    const today = toDateStr(new Date());
    try {
      const { data } = await scheduleApi.filter({
        startDate: today, endDate: today,
        departmentId: filterDept || undefined,
        page: 1, pageSize: 200,
      });
      setTodayScheds(data.items);
    } catch { /* silent */ }
  }, [filterDept]);

  useEffect(() => { loadTodaySchedules(); }, [loadTodaySchedules]);

  // ── load weekly schedules
  const loadSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await scheduleApi.filter({
        startDate: toDateStr(monday), endDate: toDateStr(addDays(monday, 6)),
        departmentId: filterDept || undefined, page: 1, pageSize: 200,
      });
      setSchedules(data.items);
    } catch { pushToast("error", "Không thể tải lịch trực."); }
    finally { setLoading(false); }
  }, [monday, filterDept, pushToast]);

  useEffect(() => { loadSchedules(); }, [loadSchedules]);

  // ── week nav
  const prevWeek = () => setMonday(m => addDays(m, -7));
  const nextWeek = () => setMonday(m => addDays(m, 7));
  const thisWeek = () => setMonday(getMondayOfWeek());

  // ── view staff schedule (from card)
  function viewStaffSchedule(staffId: string) {
    setHighlightStaffId(staffId);
    setViewMode("week");
    setTimeout(() => scheduleBoardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    setTimeout(() => setHighlightStaffId(null), 3000);
  }

  // ── open create
  function openCreate() {
    setEditingId(null);
    setForm({ staffId: staff[0]?.id ?? "", shiftDate: toDateStr(new Date()), shiftType: ShiftType.Morning, workRoom: "" });
    setShowModal(true);
  }

  // ── open edit from popup
  function openEditFromPopup() {
    if (!selectedSchedule) return;
    setEditingId(selectedSchedule.id);
    setForm({ staffId: selectedSchedule.staffId, shiftDate: selectedSchedule.date, shiftType: selectedSchedule.shiftType, workRoom: selectedSchedule.workRoom ?? "" });
    setSelectedSchedule(null);
    setShowModal(true);
  }

  // ── save
  async function handleSave() {
    if (!form.staffId) { pushToast("warning", "Vui lòng chọn nhân viên."); return; }
    setSaving(true);
    try {
      if (editingId) { await scheduleApi.update(editingId, form); pushToast("success", "Cập nhật ca trực thành công."); }
      else           { await scheduleApi.create(form);            pushToast("success", "Tạo ca trực thành công.");      }
      setShowModal(false);
      await Promise.all([loadSchedules(), loadTodaySchedules()]);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Lưu lịch trực thất bại.";
      pushToast("error", msg);
    } finally { setSaving(false); }
  }

  // ── delete from popup
  async function handleDeleteFromPopup() {
    if (!selectedSchedule) return;
    setDeleting(true);
    try {
      await scheduleApi.delete(selectedSchedule.id);
      pushToast("success", `Đã xóa ${selectedSchedule.shift} của ${selectedSchedule.name}.`);
      setSelectedSchedule(null);
      await Promise.all([loadSchedules(), loadTodaySchedules()]);
    } catch { pushToast("error", "Không thể xóa ca trực."); }
    finally { setDeleting(false); }
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-6">

      {/* ── Toast ── */}
      <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
        {toasts.map(t => <ToastComp key={t.id} item={t} onDismiss={() => setToasts(p => p.filter(x => x.id !== t.id))} />)}
      </div>

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1 text-xs text-on-surface-variant mb-2">
            <span>Admin</span>
            <span className="material-symbols-outlined text-xs leading-none">chevron_right</span>
            <span className="text-primary font-semibold">HR & Lịch Trực</span>
          </nav>
          <h1 className="text-2xl font-bold text-on-surface">Nhân sự & Lịch trực</h1>
          <p className="text-sm text-on-surface-variant mt-1">Quản lý ca trực và theo dõi tình trạng nhân viên theo thời gian thực.</p>
        </div>
        <button onClick={openCreate}
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-full font-medium text-sm hover:bg-primary/90 active:scale-95 transition-all shadow-sm">
          <span className="material-symbols-outlined text-lg">add_task</span>
          Thêm lịch trực
        </button>
      </div>

      {/* ── KPI bar ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon="groups" label="Tổng nhân viên" value={String(directory.length)} sub="trong hệ thống" />
        <KpiCard icon="badge" label="Đang trực hôm nay" value={String(onDutyIds.size)}
          sub={`${formatFull(toDateStr(new Date()))}`} accent="bg-tertiary-container" />
        <KpiCard icon="event_note" label="Ca trực trong tuần" value={String(weekTotal)}
          sub={weekLabel} accent="bg-primary/80" />
        <KpiCard icon="monitoring" label="Tỷ lệ phủ hôm nay" value={`${coverage}%`}
          sub={`${onDutyIds.size}/${directory.length} nhân viên`}
          accent={coverage >= 50 ? "bg-green-500" : "bg-amber-500"} />
      </div>

      {/* ── Staff Profiles Grid ── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-bold text-on-surface text-lg">Staff Profiles Directory</h2>
            <p className="text-sm text-on-surface-variant">Quản lý nhân viên y tế và theo dõi tình trạng trực.</p>
          </div>
          <span className="text-xs text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-full font-medium">
            {onDutyIds.size} đang trực · {directory.length - onDutyIds.size} nghỉ
          </span>
        </div>

        {directory.length === 0 ? (
          <div className="bg-white rounded-2xl border border-outline-variant py-12 text-center">
            <span className="material-symbols-outlined text-5xl text-outline block mb-2">group</span>
            <p className="text-sm text-on-surface-variant">Chưa có nhân viên nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {directory.map(s => (
              <StaffCard
                key={s.id}
                staff={s}
                isOnDuty={onDutyIds.has(s.id)}
                onViewSchedule={() => viewStaffSchedule(s.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Shift Schedule Board ── */}
      <section
        ref={scheduleBoardRef}
        className="bg-white rounded-2xl border border-outline-variant shadow-[0px_10px_20px_rgba(0,0,0,0.05)] overflow-hidden"
      >
        {/* Board header */}
        <div className="p-4 border-b border-outline-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h2 className="font-bold text-on-surface text-base">Shift Schedule Board</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">Ma trận ca trực theo thời gian thực.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Day / Week toggle */}
            <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant">
              {(["day", "week"] as ViewMode[]).map(m => (
                <button key={m} onClick={() => setViewMode(m)}
                  className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${viewMode === m ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:bg-surface-container-high"}`}>
                  {m === "day" ? "Ngày" : "Tuần"}
                </button>
              ))}
            </div>

            {/* Week nav (week view only) */}
            {viewMode === "week" && (
              <>
                <div className="flex items-center gap-0.5 bg-white border border-outline-variant rounded-xl p-0.5">
                  <button onClick={prevWeek} className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined text-base">chevron_left</span>
                  </button>
                  <span className="px-3 text-xs font-bold text-on-surface min-w-[120px] text-center">{weekLabel}</span>
                  <button onClick={nextWeek} className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                  </button>
                </div>
                <button onClick={thisWeek} disabled={isCurrentWeek}
                  className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${isCurrentWeek ? "border-primary bg-primary-container text-on-primary-container" : "border-outline-variant bg-white text-on-surface-variant hover:bg-surface-container"}`}>
                  <span className="material-symbols-outlined text-sm">today</span> Tuần này
                </button>
              </>
            )}
            {viewMode === "day" && (
              <span className="px-3 py-2 rounded-xl text-xs font-semibold bg-primary-container text-on-primary-container border border-primary/20">
                {VN_DAYS_FULL[new Date().getDay()]}, {formatFull(toDateStr(new Date()))}
              </span>
            )}

            {/* Dept filter */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-base pointer-events-none">domain</span>
              <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
                className="pl-8 pr-8 py-2 rounded-xl border border-outline-variant bg-white text-xs text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none transition-all">
                <option value="">Tất cả khoa</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>

            {/* Shift count badges */}
            <div className="flex items-center gap-1.5">
              {([ShiftType.Morning, ShiftType.Afternoon, ShiftType.Evening] as ShiftType[]).map(st => {
                const src = viewMode === "week" ? schedules : todayScheds;
                const count = src.filter(s => s.shiftType === st).length;
                const c = SHIFT_CFG[st];
                return (
                  <span key={st} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border ${c.bg} ${c.border} ${c.text}`}>
                    <span className="material-symbols-outlined text-xs">{c.icon}</span>{count}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Board body */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span>
            <p className="text-sm text-on-surface-variant">Đang tải lịch trực...</p>
          </div>
        ) : viewMode === "week" ? (
          /* ── Week Gantt ── */
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: "820px" }}>
              <colgroup>
                <col style={{ width: "210px", minWidth: "190px" }} />
                {weekDates.map(d => <col key={d} style={{ width: "calc((100% - 210px) / 7)", minWidth: "108px" }} />)}
              </colgroup>
              <thead>
                <tr>
                  <th className="sticky left-0 z-20 bg-surface-container-low px-4 py-3 border-b-2 border-r-2 border-outline-variant text-left">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">
                      <span className="material-symbols-outlined text-sm">group</span>
                      Nhân viên · {ganttRows.length}
                    </div>
                  </th>
                  {weekDates.map(dateStr => {
                    const d = new Date(dateStr + "T00:00:00");
                    const today = isToday(dateStr);
                    const weekend = d.getDay() === 0 || d.getDay() === 6;
                    return (
                      <th key={dateStr} className={`px-2 py-2.5 border-b-2 border-r border-outline-variant text-center transition-colors ${today ? "bg-primary/10" : weekend ? "bg-surface-container-low/60" : "bg-surface-container-low/20"}`}>
                        <div className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${today ? "text-primary" : "text-on-surface-variant/70"}`}>{VN_DAYS[d.getDay()]}</div>
                        <div className={`text-lg font-extrabold leading-none ${today ? "text-primary" : weekend ? "text-on-surface/40" : "text-on-surface"}`}>{d.getDate().toString().padStart(2, "0")}</div>
                        <div className={`text-[10px] mt-0.5 ${today ? "text-primary/70" : "text-on-surface-variant/40"}`}>/{d.getMonth() + 1}</div>
                        {today && <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary mx-auto" />}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {ganttRows.length === 0 ? (
                  <tr><td colSpan={8} className="py-20 text-center">
                    <span className="material-symbols-outlined text-6xl text-outline block mx-auto mb-3">event_busy</span>
                    <p className="font-semibold text-on-surface mb-1">Tuần này chưa có lịch trực</p>
                    <p className="text-xs text-on-surface-variant">Nhấn "Thêm lịch trực" để tạo ca trực đầu tiên.</p>
                  </td></tr>
                ) : (
                  ganttRows.map((row, idx) => {
                    const stc = STAFF_CFG[row.staffType];
                    const isHighlighted = highlightStaffId === row.staffId;
                    return (
                      <tr key={row.staffId} className={`group transition-colors border-b border-outline-variant ${isHighlighted ? "bg-primary/[0.05] ring-2 ring-inset ring-primary/20" : "hover:bg-primary/[0.02]"} ${idx === ganttRows.length - 1 ? "" : ""}`}>
                        <td className={`sticky left-0 z-10 px-3 py-2.5 border-r-2 border-outline-variant transition-colors ${isHighlighted ? "bg-primary/5" : "bg-white group-hover:bg-primary/[0.02]"}`}>
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0 select-none">
                              {row.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-on-surface leading-tight truncate">{row.name}</p>
                              <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold leading-none ${stc.chip}`}>{stc.label}</span>
                                <span className="text-[10px] text-on-surface-variant/70 truncate">{row.department}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        {weekDates.map(dateStr => {
                          const d = new Date(dateStr + "T00:00:00");
                          const today = isToday(dateStr);
                          const weekend = d.getDay() === 0 || d.getDay() === 6;
                          const shifts = row.byDate.get(dateStr) ?? [];
                          return (
                            <td key={dateStr} className={`px-1.5 py-1.5 border-r border-outline-variant align-top ${today ? "bg-primary/[0.04]" : weekend ? "bg-surface-container-low/20" : ""}`}>
                              <div className="space-y-1">
                                {shifts.map(s => (
                                  <ShiftBlock key={s.id} schedule={s} highlighted={isHighlighted}
                                    onClick={() => setSelectedSchedule(s)} />
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
        ) : (
          /* ── Day Gantt (24h timeline) ── */
          <div className="overflow-x-auto">
            <div style={{ minWidth: "800px" }}>
              {/* Timeline header */}
              <div className="flex border-b border-outline-variant">
                <div className="w-52 shrink-0 border-r border-outline-variant bg-surface-container-low px-3 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">
                  Nhân viên
                </div>
                <div className="flex-1 relative h-10 bg-surface-container-low">
                  {DAY_HOURS.map(h => (
                    <div key={h} style={{ left: `${(h / 24) * 100}%` }} className="absolute top-0 bottom-0 flex flex-col items-center justify-center border-r border-outline-variant/30 pr-1">
                      <span className="text-[10px] font-bold text-on-surface-variant">{String(h).padStart(2, "0")}:00</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Day rows */}
              <div className="divide-y divide-outline-variant">
                {dayRows.length === 0 ? (
                  <div className="py-16 text-center">
                    <span className="material-symbols-outlined text-5xl text-outline block mb-2">event_busy</span>
                    <p className="font-semibold text-on-surface mb-1">Hôm nay chưa có ca trực</p>
                    <p className="text-xs text-on-surface-variant">Nhấn "Thêm lịch trực" để tạo ca trực đầu tiên.</p>
                  </div>
                ) : (
                  dayRows.map(row => (
                    <DayGanttRow
                      key={row.staffId}
                      staffId={row.staffId}
                      name={row.name}
                      staffType={row.staffType}
                      shifts={row.shifts}
                      onShiftClick={s => setSelectedSchedule(s)}
                      highlighted={highlightStaffId === row.staffId}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Board footer / legend */}
        <div className="p-3 bg-surface-container-low border-t border-outline-variant flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
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
              <span className="w-2 h-2 rounded-full bg-primary inline-block" /> Hôm nay
            </span>
          </div>
          <div className="text-xs text-on-surface-variant font-medium">
            Tỷ lệ phủ hôm nay: <span className="font-bold text-on-surface">{coverage}% ({onDutyIds.size}/{directory.length})</span>
          </div>
        </div>
      </section>

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

      {/* ── FAB ── */}
      <button
        onClick={openCreate}
        title="Thêm lịch trực"
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group"
      >
        <span className="material-symbols-outlined">add_task</span>
        <span className="absolute right-16 bg-inverse-surface text-inverse-on-surface px-3 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Thêm lịch trực
        </span>
      </button>
    </div>
  );
}
