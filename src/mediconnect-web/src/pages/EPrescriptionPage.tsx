import { useState, useEffect } from "react";
import { staffApi, patientApi, userApi, outpatientApi, clinicApi } from "../api/services";
import { useAuth } from "../context/AuthContext";
import EPrescriptionPanel from "./EPrescriptionPanel";
import type { PatientProfile, UserAccount } from "../types";

interface PatientSearchResult {
  patientId: string;
  name: string;
  phone: string;
}

export default function EPrescriptionPage() {
  const { user } = useAuth();
  const [staffProfileId, setStaffProfileId] = useState<string | null>(null);
  const [activeVisitId, setActiveVisitId] = useState<string | null>(null);
  const [activePatientName, setActivePatientName] = useState("Bệnh nhân");
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<PatientSearchResult[]>([]);
  const [prescribingId, setPrescribingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    staffApi.getDirectory()
      .then(({ data }) => {
        const me = data.find((s) => s.userId === user.id);
        setStaffProfileId(me?.id ?? null);
      })
      .catch(console.error);

    loadRecentPatients();
  }, [user]);

  const loadRecentPatients = async () => {
    try {
      const [{ data: patients }, { data: users }] = await Promise.all([
        patientApi.getAll(),
        userApi.getAll(),
      ]);
      const userMap = new Map<string, UserAccount>(users.map((u) => [u.id, u]));

      const items: PatientSearchResult[] = patients.slice(0, 5).map((p: PatientProfile) => {
        const u = userMap.get(p.userAccountId);
        return {
          patientId: p.id,
          name: u?.fullName || "Bệnh nhân",
          phone: u?.phoneNumber || "",
        };
      });
      setSearchResults(items);
    } catch {
      setSearchResults([]);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      loadRecentPatients();
      setHasSearched(false);
      return;
    }
    setSearching(true);
    setHasSearched(true);
    const q = searchQuery.trim().toLowerCase();

    try {
      const [{ data: patients }, { data: users }] = await Promise.all([
        patientApi.getAll(),
        userApi.getAll(),
      ]);
      const userMap = new Map<string, UserAccount>(users.map((u) => [u.id, u]));

      const matched: PatientSearchResult[] = [];
      for (const p of patients) {
        const u = userMap.get(p.userAccountId);
        const name = u?.fullName || "Bệnh nhân";
        const phone = u?.phoneNumber || "";
        if (name.toLowerCase().includes(q) || phone.includes(q) || p.id.toLowerCase().includes(q)) {
          matched.push({ patientId: p.id, name, phone });
        }
      }
      setSearchResults(matched);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectAndPrescribe = async (item: PatientSearchResult) => {
    if (!user) return;
    setPrescribingId(item.patientId);
    setError(null);
    try {
      const doctorId = staffProfileId || user.id;
      const { data: clinics } = await clinicApi.getActive();
      const defaultClinicId = clinics?.[0]?.id || "";

      const createResp = await outpatientApi.create({
        patientId: item.patientId,
        doctorId,
        clinicId: defaultClinicId,
        visitDate: new Date().toISOString(),
        status: 0,
      } as any);

      const created = createResp?.data ?? createResp;
      if (created?.id) {
        setActiveVisitId(created.id);
        setActivePatientName(item.name);
      } else {
        throw new Error("Không thể tạo phiên khám để kê đơn.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Lỗi khi mở phiên kê đơn thuốc.");
    } finally {
      setPrescribingId(null);
    }
  };

  const handleClose = () => {
    setActiveVisitId(null);
    setActivePatientName("Bệnh nhân");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-4xl">medication</span>
            Đơn thuốc điện tử
          </h1>
          <p className="text-slate-500 mt-1">Tìm kiếm bệnh nhân để kê đơn thuốc trực tiếp.</p>
        </div>
      </div>

      {!activeVisitId ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            {/* Search patient section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">person_search</span>
                Tìm kiếm bệnh nhân để kê đơn
              </h2>

              <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nhập tên bệnh nhân, sđt, mã BN..."
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none"
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="px-5 py-2.5 bg-primary text-on-primary font-bold text-sm rounded-xl shadow-md shadow-primary/20 hover:bg-primary/95 transition-colors"
                >
                  {searching ? "Đang tìm..." : "Tìm bệnh nhân"}
                </button>
              </form>

              {error && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
                  <span className="material-symbols-outlined text-rose-500 text-base">error</span>
                  {error}
                </div>
              )}

              {searchResults.length > 0 ? (
                <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1">
                  {searchResults.map((p) => (
                    <div
                      key={p.patientId}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-extrabold text-base shrink-0">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{p.name}</div>
                          <div className="text-xs text-slate-400">
                            {p.phone ? `SĐT: ${p.phone} • ` : ""}ID: {p.patientId.slice(0, 8)}…
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={prescribingId === p.patientId}
                        onClick={() => handleSelectAndPrescribe(p)}
                        className="flex items-center gap-1 px-4 py-2 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-sm hover:bg-primary/95 transition-colors disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-sm">edit_note</span>
                        Kê đơn thuốc
                      </button>
                    </div>
                  ))}
                </div>
              ) : hasSearched ? (
                <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                  <span className="material-symbols-outlined text-3xl text-slate-300 block mb-1">person_off</span>
                  Không tìm thấy bệnh nhân nào khớp với từ khóa "{searchQuery}".
                </div>
              ) : null}
            </div>
          </div>

          {/* Info / features card */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center text-slate-400 h-full shadow-inner">
              <span className="material-symbols-outlined text-6xl text-primary mb-3">medication</span>
              <h3 className="text-lg font-bold text-slate-700">Kê đơn thuốc điện tử</h3>
              <p className="text-slate-400 text-xs max-w-xs mt-1 mb-6">
                Hệ thống tự động kết nối kho dược thực tế, kiểm tra dị ứng và tương tác thuốc CDSS tự động.
              </p>
              <div className="space-y-2.5 text-left w-full max-w-xs">
                {[
                  { icon: "search", label: "Tìm thuốc theo kho dược thực tế" },
                  { icon: "warning", label: "Cảnh báo dị ứng tự động" },
                  { icon: "inventory_2", label: "Kiểm tra tồn kho trước khi kê" },
                  { icon: "send", label: "Gửi đơn thuốc trực tiếp đến nhà thuốc" },
                ].map((f) => (
                  <div key={f.icon} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-150">
                    <span className="material-symbols-outlined text-primary text-lg">{f.icon}</span>
                    <span className="text-xs font-semibold text-slate-700">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EPrescriptionPanel
          visitId={activeVisitId}
          doctorId={staffProfileId || user?.id || ""}
          patientName={activePatientName}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
