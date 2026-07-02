import { useState, useEffect } from "react";
import { staffApi } from "../api/services";
import { useAuth } from "../context/AuthContext";
import EPrescriptionPanel from "./EPrescriptionPanel";

export default function EPrescriptionPage() {
  const { user } = useAuth();
  const [staffProfileId, setStaffProfileId] = useState<string | null>(null);
  const [visitInput, setVisitInput] = useState("");
  const [activeVisitId, setActiveVisitId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    staffApi.getDirectory()
      .then(({ data }) => {
        const me = data.find((s) => s.userId === user.id);
        setStaffProfileId(me?.id ?? null);
      })
      .catch(console.error);
  }, [user]);

  const handleOpen = () => {
    const id = visitInput.trim();
    if (!id) { setError("Vui lòng nhập Visit ID."); return; }
    setError(null);
    setActiveVisitId(id);
  };

  const handleClose = () => { setActiveVisitId(null); setVisitInput(""); };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-4xl">medication</span>
            Đơn thuốc điện tử
          </h1>
          <p className="text-slate-500 mt-1">Kê đơn thuốc điện tử kết nối kho dược trực tiếp.</p>
        </div>
      </div>

      {!activeVisitId ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Visit ID input card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary-container text-2xl">assignment</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Nhập mã phiên khám</h2>
                  <p className="text-sm text-slate-500">Lấy Visit ID từ màn hình Hồ sơ ngoại trú.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Visit ID</label>
                <input
                  type="text"
                  value={visitInput}
                  onChange={(e) => setVisitInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleOpen()}
                  placeholder="Dán GUID phiên khám vào đây..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-mono focus:border-primary focus:ring focus:ring-primary/20 outline-none"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
                  <span className="material-symbols-outlined text-rose-500 text-base">error</span>
                  {error}
                </div>
              )}

              {!staffProfileId && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
                  <span className="material-symbols-outlined text-amber-500 text-base">warning</span>
                  Không tìm thấy hồ sơ nhân viên cho tài khoản này.
                </div>
              )}

              <button
                type="button"
                disabled={!staffProfileId}
                onClick={handleOpen}
                className={`w-full flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl font-bold text-sm transition-colors ${
                  !staffProfileId
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-primary text-on-primary shadow-md shadow-primary/20 hover:bg-primary/95"
                }`}
              >
                <span className="material-symbols-outlined text-base">open_in_new</span>
                Mở đơn thuốc
              </button>
            </div>
          </div>

          {/* Info / empty state */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center text-slate-400 min-h-[50vh] shadow-inner">
              <span className="material-symbols-outlined text-6xl text-slate-300">medication</span>
              <h3 className="text-lg font-bold text-slate-600 mt-4">Chưa có đơn thuốc nào</h3>
              <p className="text-slate-400 text-sm max-w-sm mt-1">
                Nhập Visit ID từ phiên khám ngoại trú để bắt đầu kê đơn thuốc điện tử có liên kết kho dược.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-3 text-left w-full max-w-xs">
                {[
                  { icon: "search", label: "Tìm thuốc theo kho dược thực tế" },
                  { icon: "warning", label: "Cảnh báo dị ứng tự động" },
                  { icon: "inventory_2", label: "Kiểm tra tồn kho trước khi kê" },
                  { icon: "send", label: "Gửi đơn thuốc trực tiếp đến nhà thuốc" },
                ].map((f) => (
                  <div key={f.icon} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-150">
                    <span className="material-symbols-outlined text-primary text-xl">{f.icon}</span>
                    <span className="text-sm font-medium text-slate-700">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EPrescriptionPanel
          visitId={activeVisitId}
          doctorId={staffProfileId!}
          patientName="Bệnh nhân"
          onClose={handleClose}
        />
      )}
    </div>
  );
}
