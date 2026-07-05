import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { patientApi, phrApi, userApi } from "../api/services";
import type {
  PatientProfile,
  OutpatientVisit,
  LabResult,
  LabOrder,
  Prescription,
  PrescriptionItem,
  Drug,
  UserAccount,
  Clinic,
} from "../types";
import { VisitStatus, LabOrderStatus } from "../types";

// ── Enriched display types ─────────────────────────────────────────────────────

interface VisitEnriched extends OutpatientVisit {
  doctorName?: string;
  clinicName?: string;
  clinicRoomNumber?: string;
  prescriptionCount: number;
  labResultCount: number;
}

interface LabResultEnriched extends LabResult {
  testName?: string;
  visitId?: string;
  orderedAt?: string;
  orderStatus?: LabOrderStatus;
  orderNotes?: string;
}

interface PrescriptionItemEnriched extends PrescriptionItem {
  drugName?: string;
  drugUnit?: string;
}

interface PrescriptionEnriched extends Prescription {
  items: PrescriptionItemEnriched[];
  doctorName?: string;
}

// ── Format helpers ─────────────────────────────────────────────────────────────

function fmtDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  // Handle date-only strings like "2000-01-15" safely (no timezone shift)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  }
  const dt = new Date(dateStr);
  return dt.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function fmtDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const dt = new Date(dateStr);
  return dt.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function visitStatusInfo(status: VisitStatus): { label: string; bgColor: string; textColor: string; icon: string } {
  switch (status) {
    case VisitStatus.Waiting:
      return { label: "Chờ khám", bgColor: "bg-yellow-100", textColor: "text-yellow-800", icon: "schedule" };
    case VisitStatus.InProgress:
      return { label: "Đang khám", bgColor: "bg-blue-100", textColor: "text-blue-800", icon: "medical_services" };
    case VisitStatus.Completed:
      return { label: "Hoàn thành", bgColor: "bg-green-100", textColor: "text-green-800", icon: "check_circle" };
    case VisitStatus.Cancelled:
      return { label: "Đã hủy", bgColor: "bg-red-100", textColor: "text-red-800", icon: "cancel" };
    default:
      return { label: "Không rõ", bgColor: "bg-gray-100", textColor: "text-gray-700", icon: "help_outline" };
  }
}

function labStatusInfo(status: LabOrderStatus | undefined): { label: string; bgColor: string; textColor: string } {
  switch (status) {
    case LabOrderStatus.Ordered:
      return { label: "Đã chỉ định", bgColor: "bg-gray-100", textColor: "text-gray-700" };
    case LabOrderStatus.InProgress:
      return { label: "Đang thực hiện", bgColor: "bg-blue-100", textColor: "text-blue-800" };
    case LabOrderStatus.Completed:
      return { label: "Có kết quả", bgColor: "bg-green-100", textColor: "text-green-800" };
    case LabOrderStatus.Cancelled:
      return { label: "Đã hủy", bgColor: "bg-red-100", textColor: "text-red-800" };
    default:
      return { label: "Không xác định", bgColor: "bg-gray-100", textColor: "text-gray-700" };
  }
}

function genderLabel(gender: number | string): string {
  switch (gender) {
    case 1: case "Male": return "Nam";
    case 2: case "Female": return "Nữ";
    case 3: case "Other": return "Khác";
    default: return "Không rõ";
  }
}

// ── InfoRow helper component ───────────────────────────────────────────────────

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex gap-3 items-start">
      <span className="material-symbols-outlined text-on-surface-variant text-xl flex-shrink-0 mt-0.5">
        {icon}
      </span>
      <div>
        <p className="text-xs text-on-surface-variant">{label}</p>
        <p className="text-sm font-medium text-on-surface">{value}</p>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function PHRPage() {
  const { user } = useAuth();

  // Data state
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [noProfile, setNoProfile] = useState(false);
  const [visits, setVisits] = useState<VisitEnriched[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionEnriched[]>([]);
  const [labResults, setLabResults] = useState<LabResultEnriched[]>([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"timeline" | "prescriptions" | "labresults">("timeline");

  // Timeline tab state
  const [visitSearch, setVisitSearch] = useState("");
  const [visitSortDesc, setVisitSortDesc] = useState(true);
  const [selectedVisit, setSelectedVisit] = useState<VisitEnriched | null>(null);

  // Prescriptions tab state
  const [expandedRxId, setExpandedRxId] = useState<string | null>(null);

  // Lab results tab state
  const [labFilter, setLabFilter] = useState<"all" | "has_result" | "no_result">("all");
  const [selectedLab, setSelectedLab] = useState<LabResultEnriched | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setNoProfile(false);
      console.log("[PHR] Bắt đầu tải hồ sơ sức khỏe điện tử...");

      // Bước 1: Lấy hồ sơ bệnh nhân
      let pat: PatientProfile;
      try {
        const res = await patientApi.getMe();
        pat = res.data;
        console.log(`[PHR] Hồ sơ bệnh nhân tải thành công. PatientID=${pat.id}`);
      } catch {
        console.warn("[PHR] Không tìm thấy hồ sơ bệnh nhân.");
        setNoProfile(true);
        setLoading(false);
        return;
      }
      setProfile(pat);

      // Bước 2: Tải song song lịch sử + dữ liệu phụ
      console.log("[PHR] Tải lịch sử khám và dữ liệu hỗ trợ...");
      const [histRes, ordersRes, itemsRes, drugsRes, usersRes, clinicsRes] = await Promise.all([
        patientApi.getHistory(pat.id),
        phrApi.getAllLabOrders(),
        phrApi.getAllPrescriptionItems(),
        phrApi.getAllDrugs(),
        userApi.getAll(),
        phrApi.getAllClinics(),
      ]);

      const history = histRes.data;
      const allLabOrders: LabOrder[] = ordersRes.data;
      const allPrescItems: PrescriptionItem[] = itemsRes.data;
      const allDrugs: Drug[] = drugsRes.data;
      const allUsers: UserAccount[] = usersRes.data;
      const allClinics: Clinic[] = clinicsRes.data;

      console.log(
        `[PHR] Dữ liệu nhận được — Lịch sử: ${history.visits.length} lần khám, ` +
        `${history.labResults.length} kết quả XN, ${history.prescriptions.length} đơn thuốc.`
      );

      // Lọc dữ liệu hỗ trợ theo bệnh nhân này
      const labOrderIds = new Set(history.labResults.map((lr) => lr.labOrderId));
      const prescriptionIds = new Set(history.prescriptions.map((p) => p.id));

      const patientLabOrders = allLabOrders.filter((o) => labOrderIds.has(o.id));
      const patientPrescItems = allPrescItems.filter((pi) => prescriptionIds.has(pi.prescriptionId));
      const usedDrugIds = new Set(patientPrescItems.map((pi) => pi.drugId));
      const patientDrugs = allDrugs.filter((d) => usedDrugIds.has(d.id));

      // Tạo lookup maps
      const labOrderMap = new Map(patientLabOrders.map((o) => [o.id, o]));
      const drugMap = new Map(patientDrugs.map((d) => [d.id, d]));
      const userMap = new Map(allUsers.map((u) => [u.id, u]));
      const clinicMap = new Map(allClinics.map((c) => [c.id, c]));

      // Làm giàu danh sách lần khám
      const enrichedVisits: VisitEnriched[] = history.visits
        .map((v) => {
          const clinic = clinicMap.get(v.clinicId);
          const relatedOrders = patientLabOrders.filter((o) => o.outpatientVisitId === v.id);
          const relatedLabResultCount = history.labResults.filter((lr) =>
            relatedOrders.some((o) => o.id === lr.labOrderId)
          ).length;

          return {
            ...v,
            doctorName: userMap.get(v.doctorId)?.fullName,
            clinicName: clinic?.name,
            clinicRoomNumber: clinic?.roomNumber,
            prescriptionCount: history.prescriptions.filter((p) => p.outpatientVisitId === v.id).length,
            labResultCount: relatedLabResultCount,
          };
        })
        .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());

      // Làm giàu kết quả xét nghiệm
      const enrichedLabResults: LabResultEnriched[] = history.labResults
        .map((lr) => {
          const order = labOrderMap.get(lr.labOrderId);
          return {
            ...lr,
            testName: order?.testName,
            visitId: order?.outpatientVisitId,
            orderedAt: order?.orderedAt,
            orderStatus: order?.status,
            orderNotes: order?.notes,
          };
        })
        .sort((a, b) => {
          const da = a.resultedAt || a.orderedAt || "";
          const db = b.resultedAt || b.orderedAt || "";
          return db > da ? 1 : -1;
        });

      // Làm giàu đơn thuốc
      const enrichedPrescriptions: PrescriptionEnriched[] = history.prescriptions
        .map((p) => {
          const items: PrescriptionItemEnriched[] = patientPrescItems
            .filter((pi) => pi.prescriptionId === p.id)
            .map((pi) => {
              const drug = drugMap.get(pi.drugId);
              return { ...pi, drugName: drug?.name, drugUnit: drug?.unit };
            });
          return {
            ...p,
            items,
            doctorName: userMap.get(p.doctorId)?.fullName,
          };
        })
        .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());

      setVisits(enrichedVisits);
      setLabResults(enrichedLabResults);
      setPrescriptions(enrichedPrescriptions);

      console.log(
        `[PHR] Xử lý hoàn tất — ${enrichedVisits.length} lần khám, ` +
        `${enrichedPrescriptions.length} đơn thuốc, ${enrichedLabResults.length} kết quả XN hiển thị.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi không xác định";
      console.error("[PHR] Lỗi khi tải dữ liệu:", msg);
      setError("Không thể tải hồ sơ sức khỏe. Vui lòng kiểm tra kết nối và thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Computed: danh sách lần khám đã lọc và sắp xếp
  const filteredVisits = visits.filter((v) => {
    if (!visitSearch.trim()) return true;
    const q = visitSearch.toLowerCase();
    return (
      v.chiefComplaint?.toLowerCase().includes(q) ||
      v.diagnosisCode?.toLowerCase().includes(q) ||
      v.diagnosisDescription?.toLowerCase().includes(q) ||
      v.doctorName?.toLowerCase().includes(q) ||
      v.clinicName?.toLowerCase().includes(q) ||
      false
    );
  });
  const displayVisits = visitSortDesc ? filteredVisits : [...filteredVisits].reverse();

  // Computed: danh sách kết quả XN đã lọc
  const displayLabResults = labResults.filter((lr) => {
    if (labFilter === "has_result") return !!(lr.resultText || lr.resultFileUrl);
    if (labFilter === "no_result") return !(lr.resultText || lr.resultFileUrl);
    return true;
  });

  // Đổi tab + log
  const switchTab = (tab: "timeline" | "prescriptions" | "labresults") => {
    const tabLabel: Record<string, string> = {
      timeline: "Lịch sử khám",
      prescriptions: "Đơn thuốc",
      labresults: "Kết quả xét nghiệm",
    };
    console.log(`[PHR] Người dùng chuyển sang tab: ${tabLabel[tab]}`);
    setActiveTab(tab);
  };

  // ── Render: Loading ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-on-surface-variant">
        <span className="material-symbols-outlined text-5xl text-primary animate-spin">
          progress_activity
        </span>
        <p className="text-base">Đang tải hồ sơ sức khỏe...</p>
      </div>
    );
  }

  // ── Render: Không có hồ sơ ──────────────────────────────────────────────────
  if (noProfile) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <span className="material-symbols-outlined text-6xl text-outline">person_off</span>
        <h2 className="text-xl font-bold text-on-surface mt-4">Chưa có hồ sơ bệnh nhân</h2>
        <p className="text-on-surface-variant mt-2 leading-relaxed">
          Bạn chưa có hồ sơ bệnh nhân trong hệ thống. Hãy đặt lịch khám để hệ thống tạo hồ sơ cho bạn.
        </p>
        <Link
          to="/booking"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined text-base">calendar_add_on</span>
          Đặt lịch khám ngay
        </Link>
      </div>
    );
  }

  // ── Render: Lỗi ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <span className="material-symbols-outlined text-6xl text-error">error_outline</span>
        <h2 className="text-xl font-bold text-on-surface mt-4">Không thể tải dữ liệu</h2>
        <p className="text-on-surface-variant mt-2">{error}</p>
        <button
          onClick={loadData}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          Thử lại
        </button>
      </div>
    );
  }

  // ── Render: Chính ────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Tiêu đề trang */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">folder_shared</span>
            Hồ sơ Sức khỏe Điện tử
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Xem toàn bộ lịch sử khám bệnh, đơn thuốc và kết quả xét nghiệm của bạn
          </p>
        </div>
        <button
          onClick={loadData}
          className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 border border-outline-variant rounded-full text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          <span className="hidden sm:inline">Làm mới</span>
        </button>
      </div>

      {/* Thẻ thông tin bệnh nhân */}
      {profile && (
        <div className="bg-white rounded-2xl border border-outline-variant p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-on-primary-container text-2xl">person</span>
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-4">
              <div>
                <p className="text-xs text-on-surface-variant">Họ và tên</p>
                <p className="font-semibold text-on-surface text-sm">{user?.fullName ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Ngày sinh</p>
                <p className="font-medium text-on-surface text-sm">{fmtDate(profile.dateOfBirth)}</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Giới tính</p>
                <p className="font-medium text-on-surface text-sm">{genderLabel(profile.gender)}</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Số BHYT</p>
                <p className="font-medium text-on-surface text-sm font-mono">{profile.insuranceNumber ?? "—"}</p>
              </div>
              {profile.address && (
                <div className="col-span-2 sm:col-span-4">
                  <p className="text-xs text-on-surface-variant">Địa chỉ</p>
                  <p className="font-medium text-on-surface text-sm">{profile.address}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-outline-variant p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-on-primary-container text-xl">calendar_month</span>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-on-surface leading-none">{visits.length}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Lần khám</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-outline-variant p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary-container rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-on-secondary-container text-xl">medication</span>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-on-surface leading-none">{prescriptions.length}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Đơn thuốc</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-outline-variant p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-tertiary-container rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-on-tertiary-container text-xl">biotech</span>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-on-surface leading-none">{labResults.length}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Kết quả XN</p>
          </div>
        </div>
      </div>

      {/* Khu vực tab chính */}
      <div className="bg-white rounded-2xl border border-outline-variant overflow-hidden">
        {/* Tab navigation bar */}
        <div className="flex border-b border-outline-variant overflow-x-auto">
          {(
            [
              { key: "timeline", label: "Lịch sử khám", icon: "timeline", count: visits.length },
              { key: "prescriptions", label: "Đơn thuốc", icon: "medication", count: prescriptions.length },
              { key: "labresults", label: "Kết quả xét nghiệm", icon: "biotech", count: labResults.length },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => switchTab(tab.key)}
              className={`flex-1 min-w-max flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              <span>{tab.label}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  activeTab === tab.key
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-5">
          {/* ── Tab: Lịch sử khám ─────────────────────────────────────────── */}
          {activeTab === "timeline" && (
            <div className="space-y-4">
              {/* Thanh điều khiển */}
              <div className="flex gap-3 flex-wrap">
                <div className="relative flex-1 min-w-48">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-base text-on-surface-variant pointer-events-none">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Tìm theo triệu chứng, chẩn đoán, bác sĩ..."
                    value={visitSearch}
                    onChange={(e) => setVisitSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
                <button
                  onClick={() => {
                    setVisitSortDesc((v) => !v);
                    console.log(`[PHR] Đảo thứ tự sắp xếp lịch sử khám: ${!visitSortDesc ? "mới nhất" : "cũ nhất"} trước`);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-outline-variant text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-base">
                    {visitSortDesc ? "arrow_downward" : "arrow_upward"}
                  </span>
                  {visitSortDesc ? "Mới nhất" : "Cũ nhất"}
                </button>
              </div>

              {/* Kết quả tìm kiếm */}
              {visitSearch && (
                <p className="text-xs text-on-surface-variant">
                  Tìm thấy <span className="font-semibold text-on-surface">{displayVisits.length}</span> kết quả cho "{visitSearch}"
                </p>
              )}

              {/* Danh sách lần khám */}
              {displayVisits.length === 0 ? (
                <div className="text-center py-14 text-on-surface-variant">
                  <span className="material-symbols-outlined text-5xl text-outline">event_busy</span>
                  <p className="mt-3 text-base">
                    {visitSearch
                      ? "Không tìm thấy lần khám nào phù hợp."
                      : "Bạn chưa có lần khám nào được ghi nhận."}
                  </p>
                  {!visitSearch && (
                    <Link
                      to="/booking"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                      <span className="material-symbols-outlined text-base">add_circle</span>
                      Đặt lịch khám ngay
                    </Link>
                  )}
                </div>
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-outline-variant" />
                  <div className="space-y-3">
                    {displayVisits.map((visit, idx) => {
                      const si = visitStatusInfo(visit.status);
                      return (
                        <div key={visit.id} className="relative pl-10">
                          {/* Timeline dot */}
                          <div
                            className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white z-10 ${
                              visit.status === VisitStatus.Completed
                                ? "bg-green-100 text-green-800"
                                : visit.status === VisitStatus.Cancelled
                                ? "bg-red-100 text-red-700"
                                : "bg-primary-container text-on-primary-container"
                            }`}
                          >
                            {visits.length - visits.indexOf(visit)}
                          </div>

                          {/* Nội dung thẻ */}
                          <div className="bg-white border border-outline-variant rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition-all">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                {/* Dòng tiêu đề */}
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-on-surface">
                                    {fmtDate(visit.visitDate)}
                                  </span>
                                  <span
                                    className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${si.bgColor} ${si.textColor}`}
                                  >
                                    <span className="material-symbols-outlined text-xs">{si.icon}</span>
                                    {si.label}
                                  </span>
                                </div>

                                {/* Lý do khám */}
                                {visit.chiefComplaint && (
                                  <p className="text-sm text-on-surface-variant mt-1.5">
                                    <span className="font-medium text-on-surface">Lý do khám: </span>
                                    {visit.chiefComplaint}
                                  </p>
                                )}

                                {/* Chẩn đoán */}
                                {(visit.diagnosisCode || visit.diagnosisDescription) && (
                                  <div className="mt-1.5 flex items-start gap-1.5">
                                    <span className="material-symbols-outlined text-sm text-secondary mt-0.5">
                                      diagnosis
                                    </span>
                                    <p className="text-sm text-on-surface leading-relaxed">
                                      {visit.diagnosisCode && (
                                        <span className="font-mono text-primary font-semibold">
                                          {visit.diagnosisCode}
                                        </span>
                                      )}
                                      {visit.diagnosisCode && visit.diagnosisDescription && " – "}
                                      {visit.diagnosisDescription}
                                    </p>
                                  </div>
                                )}

                                {/* Bác sĩ & phòng khám */}
                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-on-surface-variant">
                                  {visit.doctorName && (
                                    <span className="flex items-center gap-1">
                                      <span className="material-symbols-outlined text-xs">stethoscope</span>
                                      BS. {visit.doctorName}
                                    </span>
                                  )}
                                  {visit.clinicName && (
                                    <span className="flex items-center gap-1">
                                      <span className="material-symbols-outlined text-xs">meeting_room</span>
                                      {visit.clinicName}
                                      {visit.clinicRoomNumber && ` (${visit.clinicRoomNumber})`}
                                    </span>
                                  )}
                                  {visit.prescriptionCount > 0 && (
                                    <span className="flex items-center gap-1 text-secondary font-medium">
                                      <span className="material-symbols-outlined text-xs">medication</span>
                                      {visit.prescriptionCount} đơn thuốc
                                    </span>
                                  )}
                                  {visit.labResultCount > 0 && (
                                    <span className="flex items-center gap-1 text-tertiary font-medium">
                                      <span className="material-symbols-outlined text-xs">biotech</span>
                                      {visit.labResultCount} kết quả XN
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Nút xem chi tiết */}
                              <button
                                onClick={() => {
                                  console.log(
                                    `[PHR] Người dùng xem chi tiết lần khám: ID=${visit.id}, ngày=${visit.visitDate}`
                                  );
                                  setSelectedVisit(visit);
                                }}
                                className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-full hover:bg-primary/10 transition-colors"
                              >
                                Chi tiết
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Tab: Đơn thuốc ────────────────────────────────────────────── */}
          {activeTab === "prescriptions" && (
            <div className="space-y-3">
              {prescriptions.length === 0 ? (
                <div className="text-center py-14 text-on-surface-variant">
                  <span className="material-symbols-outlined text-5xl text-outline">medication_liquid</span>
                  <p className="mt-3">Chưa có đơn thuốc nào được kê trong hệ thống.</p>
                </div>
              ) : (
                prescriptions.map((rx, idx) => {
                  const isOpen = expandedRxId === rx.id;
                  return (
                    <div key={rx.id} className="border border-outline-variant rounded-xl overflow-hidden">
                      {/* Header đơn thuốc */}
                      <button
                        onClick={() => {
                          const nextId = isOpen ? null : rx.id;
                          setExpandedRxId(nextId);
                          if (nextId) {
                            console.log(
                              `[PHR] Người dùng mở đơn thuốc #${prescriptions.length - idx}: ID=${rx.id}, ngày=${rx.issuedAt}`
                            );
                          }
                        }}
                        className="w-full flex items-center justify-between gap-3 p-4 hover:bg-surface-container transition-colors text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 bg-secondary-container rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-on-secondary-container text-base">
                              medication
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-on-surface text-sm">
                              Đơn thuốc #{prescriptions.length - idx}
                            </p>
                            <p className="text-xs text-on-surface-variant truncate">
                              Ngày kê: {fmtDateTime(rx.issuedAt)}
                              {rx.doctorName && ` · BS. ${rx.doctorName}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-on-surface-variant hidden sm:block">
                            {rx.items.length} loại thuốc
                          </span>
                          <span
                            className={`material-symbols-outlined text-on-surface-variant text-xl transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          >
                            expand_more
                          </span>
                        </div>
                      </button>

                      {/* Nội dung đơn thuốc */}
                      {isOpen && (
                        <div className="border-t border-outline-variant">
                          {rx.items.length === 0 ? (
                            <div className="text-center py-6 text-on-surface-variant text-sm">
                              <span className="material-symbols-outlined text-2xl text-outline">medication_liquid</span>
                              <p className="mt-1">Không có thông tin chi tiết thuốc.</p>
                            </div>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead className="bg-surface-container">
                                  <tr>
                                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-on-surface-variant">
                                      Tên thuốc
                                    </th>
                                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-on-surface-variant">
                                      Liều dùng
                                    </th>
                                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-on-surface-variant">
                                      Tần suất
                                    </th>
                                    <th className="text-center px-4 py-2.5 text-xs font-semibold text-on-surface-variant">
                                      Số ngày
                                    </th>
                                    <th className="text-center px-4 py-2.5 text-xs font-semibold text-on-surface-variant">
                                      Số lượng
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant">
                                  {rx.items.map((item) => (
                                    <tr
                                      key={item.id}
                                      className="hover:bg-surface-container/50 transition-colors"
                                    >
                                      <td className="px-4 py-3">
                                        <p className="font-medium text-on-surface">
                                          {item.drugName ?? (
                                            <span className="text-on-surface-variant italic">Không xác định</span>
                                          )}
                                        </p>
                                        {item.drugUnit && (
                                          <p className="text-xs text-on-surface-variant">{item.drugUnit}</p>
                                        )}
                                      </td>
                                      <td className="px-4 py-3 text-on-surface">{item.dose ?? "—"}</td>
                                      <td className="px-4 py-3 text-on-surface">{item.frequency ?? "—"}</td>
                                      <td className="px-4 py-3 text-center text-on-surface">
                                        {item.durationDays > 0 ? `${item.durationDays} ngày` : "—"}
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <span className="font-semibold text-on-surface">{item.quantity}</span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          {/* Ghi chú của bác sĩ */}
                          {rx.notes && (
                            <div className="px-4 py-3 bg-yellow-50 border-t border-outline-variant flex items-start gap-2">
                              <span className="material-symbols-outlined text-yellow-700 text-base flex-shrink-0 mt-0.5">
                                info
                              </span>
                              <p className="text-xs text-yellow-800 leading-relaxed">
                                <span className="font-semibold">Lưu ý từ bác sĩ: </span>
                                {rx.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ── Tab: Kết quả xét nghiệm ───────────────────────────────────── */}
          {activeTab === "labresults" && (
            <div className="space-y-4">
              {/* Filter pills */}
              <div className="flex items-center gap-2 flex-wrap">
                {(
                  [
                    { key: "all", label: "Tất cả" },
                    { key: "has_result", label: "Đã có kết quả" },
                    { key: "no_result", label: "Chờ kết quả" },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.key}
                    onClick={() => {
                      setLabFilter(f.key);
                      console.log(`[PHR] Lọc kết quả XN: ${f.label}`);
                    }}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      labFilter === f.key
                        ? "bg-primary text-on-primary"
                        : "border border-outline-variant text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
                <span className="ml-auto text-xs text-on-surface-variant self-center">
                  {displayLabResults.length}/{labResults.length} kết quả
                </span>
              </div>

              {/* Danh sách kết quả */}
              {displayLabResults.length === 0 ? (
                <div className="text-center py-14 text-on-surface-variant">
                  <span className="material-symbols-outlined text-5xl text-outline">science</span>
                  <p className="mt-3">
                    {labFilter === "has_result"
                      ? "Chưa có kết quả xét nghiệm nào trong hệ thống."
                      : labFilter === "no_result"
                      ? "Không có xét nghiệm nào đang chờ kết quả."
                      : "Chưa có xét nghiệm nào được chỉ định."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {displayLabResults.map((lr) => {
                    const hasResult = !!(lr.resultText || lr.resultFileUrl);
                    const si = labStatusInfo(lr.orderStatus);
                    return (
                      <div
                        key={lr.id}
                        className="border border-outline-variant rounded-xl p-4 hover:border-primary/30 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          {/* Icon + thông tin */}
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                hasResult ? "bg-tertiary-container" : "bg-surface-container"
                              }`}
                            >
                              <span
                                className={`material-symbols-outlined text-base ${
                                  hasResult ? "text-on-tertiary-container" : "text-on-surface-variant"
                                }`}
                              >
                                {hasResult ? "biotech" : "pending"}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-on-surface text-sm">
                                  {lr.testName ?? "Xét nghiệm không xác định"}
                                </h3>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${si.bgColor} ${si.textColor}`}
                                >
                                  {si.label}
                                </span>
                                {lr.resultFileUrl && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium flex items-center gap-0.5">
                                    <span className="material-symbols-outlined text-xs">attach_file</span>
                                    Có file
                                  </span>
                                )}
                              </div>

                              {/* Thời gian */}
                              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-on-surface-variant">
                                {lr.orderedAt && (
                                  <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">calendar_today</span>
                                    Chỉ định: {fmtDateTime(lr.orderedAt)}
                                  </span>
                                )}
                                {lr.resultedAt && (
                                  <span className="flex items-center gap-1 text-tertiary">
                                    <span className="material-symbols-outlined text-xs">check_circle</span>
                                    Kết quả: {fmtDateTime(lr.resultedAt)}
                                  </span>
                                )}
                              </div>

                              {/* Preview kết quả */}
                              {lr.resultText && (
                                <div className="mt-2 px-3 py-2 bg-surface-container rounded-lg">
                                  <p className="text-xs text-on-surface line-clamp-2 leading-relaxed">
                                    {lr.resultText}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Nút hành động */}
                          <div className="flex flex-col gap-1.5 flex-shrink-0">
                            {hasResult && (
                              <button
                                onClick={() => {
                                  console.log(
                                    `[PHR] Người dùng xem chi tiết kết quả XN: ID=${lr.id}, ` +
                                    `xét nghiệm="${lr.testName ?? "không rõ"}"`
                                  );
                                  setSelectedLab(lr);
                                }}
                                className="px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-full hover:bg-primary/10 transition-colors whitespace-nowrap"
                              >
                                Xem chi tiết
                              </button>
                            )}
                            {lr.resultFileUrl && (
                              <a
                                href={lr.resultFileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => {
                                  console.log(
                                    `[PHR] Người dùng tải file kết quả XN: "${lr.testName ?? "không rõ"}", URL=${lr.resultFileUrl}`
                                  );
                                }}
                                className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-secondary border border-secondary/30 rounded-full hover:bg-secondary/10 transition-colors whitespace-nowrap"
                              >
                                <span className="material-symbols-outlined text-xs">download</span>
                                Tải file
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Modal: Chi tiết lần khám ─────────────────────────────────────────── */}
      {selectedVisit && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVisit(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg max-h-[88vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="flex items-center justify-between p-5 border-b border-outline-variant sticky top-0 bg-white rounded-t-2xl z-10">
              <div>
                <h2 className="font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">event_note</span>
                  Chi tiết lần khám
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {fmtDateTime(selectedVisit.visitDate)}
                </p>
              </div>
              <button
                onClick={() => setSelectedVisit(null)}
                className="p-2 rounded-full hover:bg-surface-container transition-colors"
                aria-label="Đóng"
              >
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            {/* Nội dung modal */}
            <div className="p-5 space-y-4">
              {/* Trạng thái */}
              {(() => {
                const si = visitStatusInfo(selectedVisit.status);
                return (
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${si.bgColor} ${si.textColor}`}
                  >
                    <span className="material-symbols-outlined text-sm">{si.icon}</span>
                    {si.label}
                  </span>
                );
              })()}

              {/* Thông tin chi tiết */}
              <div className="space-y-3.5">
                {selectedVisit.chiefComplaint && (
                  <InfoRow icon="sick" label="Lý do / Triệu chứng" value={selectedVisit.chiefComplaint} />
                )}

                {(selectedVisit.diagnosisCode || selectedVisit.diagnosisDescription) && (
                  <div className="flex gap-3 items-start">
                    <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0 mt-0.5">
                      diagnosis
                    </span>
                    <div>
                      <p className="text-xs text-on-surface-variant">Chẩn đoán</p>
                      <p className="text-sm font-medium text-on-surface leading-relaxed">
                        {selectedVisit.diagnosisCode && (
                          <span className="font-mono text-primary font-bold">
                            {selectedVisit.diagnosisCode}
                          </span>
                        )}
                        {selectedVisit.diagnosisCode && selectedVisit.diagnosisDescription && " – "}
                        {selectedVisit.diagnosisDescription}
                      </p>
                    </div>
                  </div>
                )}

                {selectedVisit.doctorName && (
                  <InfoRow icon="stethoscope" label="Bác sĩ phụ trách" value={`BS. ${selectedVisit.doctorName}`} />
                )}

                {selectedVisit.clinicName && (
                  <InfoRow
                    icon="meeting_room"
                    label="Phòng khám"
                    value={`${selectedVisit.clinicName}${
                      selectedVisit.clinicRoomNumber ? ` – Phòng ${selectedVisit.clinicRoomNumber}` : ""
                    }`}
                  />
                )}

                {selectedVisit.notes && (
                  <div className="flex gap-3 items-start">
                    <span className="material-symbols-outlined text-on-surface-variant text-xl flex-shrink-0 mt-0.5">
                      note
                    </span>
                    <div>
                      <p className="text-xs text-on-surface-variant">Ghi chú của bác sĩ</p>
                      <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                        {selectedVisit.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Liên kết sang tab khác */}
              {(selectedVisit.prescriptionCount > 0 || selectedVisit.labResultCount > 0) && (
                <div className="border-t border-outline-variant pt-4">
                  <p className="text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wide">
                    Dữ liệu liên quan đến lần khám này
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedVisit.prescriptionCount > 0 && (
                      <button
                        onClick={() => {
                          setSelectedVisit(null);
                          switchTab("prescriptions");
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 bg-secondary-container text-on-secondary-container rounded-full text-xs font-medium hover:opacity-80 transition-opacity"
                      >
                        <span className="material-symbols-outlined text-xs">medication</span>
                        {selectedVisit.prescriptionCount} đơn thuốc
                      </button>
                    )}
                    {selectedVisit.labResultCount > 0 && (
                      <button
                        onClick={() => {
                          setSelectedVisit(null);
                          switchTab("labresults");
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 bg-tertiary-container text-on-tertiary-container rounded-full text-xs font-medium hover:opacity-80 transition-opacity"
                      >
                        <span className="material-symbols-outlined text-xs">biotech</span>
                        {selectedVisit.labResultCount} kết quả xét nghiệm
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Chi tiết kết quả xét nghiệm ─────────────────────────────── */}
      {selectedLab && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedLab(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg max-h-[88vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="flex items-center justify-between p-5 border-b border-outline-variant sticky top-0 bg-white rounded-t-2xl z-10">
              <div>
                <h2 className="font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-xl">biotech</span>
                  {selectedLab.testName ?? "Kết quả xét nghiệm"}
                </h2>
                {selectedLab.orderedAt && (
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Ngày chỉ định: {fmtDateTime(selectedLab.orderedAt)}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedLab(null)}
                className="p-2 rounded-full hover:bg-surface-container transition-colors"
                aria-label="Đóng"
              >
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>

            {/* Nội dung */}
            <div className="p-5 space-y-4">
              {/* Trạng thái + ngày có kết quả */}
              <div className="flex items-center gap-3 flex-wrap">
                {(() => {
                  const si = labStatusInfo(selectedLab.orderStatus);
                  return (
                    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${si.bgColor} ${si.textColor}`}>
                      {si.label}
                    </span>
                  );
                })()}
                {selectedLab.resultedAt && (
                  <span className="text-xs text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">event_available</span>
                    Có kết quả: {fmtDateTime(selectedLab.resultedAt)}
                  </span>
                )}
              </div>

              {/* Nội dung kết quả */}
              {selectedLab.resultText ? (
                <div>
                  <p className="text-xs font-semibold text-on-surface-variant mb-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">assignment</span>
                    Nội dung kết quả
                  </p>
                  <div className="bg-surface-container rounded-xl p-4 text-sm text-on-surface font-mono leading-relaxed whitespace-pre-wrap break-words">
                    {selectedLab.resultText}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-on-surface-variant">
                  <span className="material-symbols-outlined text-3xl text-outline">pending_actions</span>
                  <p className="text-sm mt-2">Chưa có nội dung kết quả chi tiết.</p>
                </div>
              )}

              {/* File đính kèm */}
              {selectedLab.resultFileUrl && (
                <div className="border-t border-outline-variant pt-4">
                  <p className="text-xs font-semibold text-on-surface-variant mb-3 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">attach_file</span>
                    File kết quả đính kèm
                  </p>
                  <a
                    href={selectedLab.resultFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      console.log(
                        `[PHR] Người dùng tải file kết quả XN từ modal: "${selectedLab.testName ?? "không rõ"}", URL=${selectedLab.resultFileUrl}`
                      );
                    }}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-on-primary rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">download</span>
                    Tải xuống file kết quả
                  </a>
                  <p className="text-xs text-on-surface-variant text-center mt-2">
                    File sẽ mở trong tab mới hoặc tải về máy tính của bạn
                  </p>
                </div>
              )}

              {/* Ghi chú xét nghiệm */}
              {selectedLab.orderNotes && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                  <span className="material-symbols-outlined text-yellow-700 text-base flex-shrink-0">info</span>
                  <p className="text-xs text-yellow-800 leading-relaxed">
                    <span className="font-semibold">Ghi chú: </span>
                    {selectedLab.orderNotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
