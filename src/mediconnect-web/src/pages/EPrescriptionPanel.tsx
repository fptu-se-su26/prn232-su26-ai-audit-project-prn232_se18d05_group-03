import { useState, useEffect, useRef } from "react";
import { drugApi, prescriptionApi, clinicApi } from "../api/services";
import type { DrugResult, ActivePrescriptionItem, Clinic } from "../types";

// Hardcoded demo allergies — PatientProfile has no AllergyInfo field in the current DB schema.
const DEMO_ALLERGIES = ["Penicillin", "Peanuts", "Sulfa"];

interface Props {
  visitId: string;
  doctorId: string;
  patientName: string;
  knownAllergies?: string[];
  onClose: () => void;
}

export default function EPrescriptionPanel({
  visitId,
  doctorId,
  patientName,
  knownAllergies = DEMO_ALLERGIES,
  onClose,
}: Props) {
  const [allDrugs, setAllDrugs] = useState<DrugResult[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinicId, setSelectedClinicId] = useState("");

  const [drugQuery, setDrugQuery] = useState("");
  const [drugResults, setDrugResults] = useState<DrugResult[]>([]);
  const [showDrugDropdown, setShowDrugDropdown] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<DrugResult | null>(null);
  const [allergyWarning, setAllergyWarning] = useState<string | null>(null);

  const [dose, setDose] = useState("");
  const [route, setRoute] = useState("Oral");
  const [frequency, setFrequency] = useState("");
  const [durationDays, setDurationDays] = useState(7);
  const [quantity, setQuantity] = useState(1);

  const [items, setItems] = useState<ActivePrescriptionItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const drugSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    drugApi.getAll().then(({ data }) => setAllDrugs(data.filter((d) => d.isActive))).catch(console.error);
    clinicApi.getActive().then(({ data }) => setClinics(data)).catch(console.error);
  }, []);

  // Debounced client-side drug filter
  // NOTE: Drug.StockQuantity is global — no per-pharmacy stock in current schema.
  useEffect(() => {
    if (drugQuery.trim().length < 1) { setDrugResults([]); setShowDrugDropdown(false); return; }
    const timer = window.setTimeout(() => {
      const q = drugQuery.toLowerCase();
      let pool = allDrugs;
      if (selectedClinicId) pool = pool.filter((d) => d.stockQuantity > 0);
      const results = pool.filter((d) => d.name.toLowerCase().includes(q) || (d.code ?? "").toLowerCase().includes(q)).slice(0, 10);
      setDrugResults(results);
      setShowDrugDropdown(results.length > 0);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [drugQuery, allDrugs, selectedClinicId]);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (drugSearchRef.current && !drugSearchRef.current.contains(e.target as Node)) setShowDrugDropdown(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const handleSelectDrug = (drug: DrugResult) => {
    setSelectedDrug(drug);
    setDrugQuery(drug.name);
    setShowDrugDropdown(false);
    const lower = drug.name.toLowerCase();
    const conflict = knownAllergies.find((a) => lower.includes(a.toLowerCase()));
    setAllergyWarning(conflict ? `"${drug.name}" có thể chứa ${conflict} — chất gây dị ứng đã biết của bệnh nhân.` : null);
  };

  const handleAddToList = () => {
    if (!selectedDrug) return;
    setItems((prev) => [...prev, {
      drugId: selectedDrug.id, drugName: selectedDrug.name,
      dose, route, frequency, durationDays, quantity,
      unitPrice: selectedDrug.unitPrice, stockQuantity: selectedDrug.stockQuantity,
    }]);
    setSelectedDrug(null); setDrugQuery(""); setDose(""); setRoute("Oral");
    setFrequency(""); setDurationDays(7); setQuantity(1); setAllergyWarning(null);
  };

  const handleRemoveItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const handleSend = async () => {
    if (items.length === 0) return;
    setSaving(true);
    try {
      const pharmacyNote = selectedClinicId
        ? `Gửi đến: ${clinics.find((c) => c.id === selectedClinicId)?.name ?? selectedClinicId}`
        : undefined;
      const { data: prescription } = await prescriptionApi.create({
        outpatientVisitId: visitId, doctorId,
        issuedAt: new Date().toISOString(), notes: pharmacyNote,
      });
      for (const item of items) {
        await prescriptionApi.addItem({
          prescriptionId: prescription.id, drugId: item.drugId,
          dose: `${item.dose} — ${item.route}`, frequency: item.frequency,
          durationDays: item.durationDays, quantity: item.quantity,
        });
      }
      setItems([]);
      setMessage({ type: "success", text: "Đơn thuốc đã được gửi thành công." });
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err?.response?.data?.message || "Lỗi khi gửi đơn thuốc." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const addDisabled = !selectedDrug || selectedDrug.stockQuantity === 0;

  return (
    <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Panel header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">medication</span>
          Đơn thuốc điện tử — {patientName}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Known allergies */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-rose-500">warning</span>
            Dị ứng đã biết:
          </span>
          {knownAllergies.map((a) => (
            <span key={a} className="px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-bold">{a}</span>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── Left: Add medication form ── */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-150 space-y-4">
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-slate-400">add_circle</span>
              Thêm thuốc
            </h4>

            {/* Pharmacy selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Nhà thuốc / Phòng khám</label>
              <select
                value={selectedClinicId}
                onChange={(e) => setSelectedClinicId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none"
              >
                <option value="">— Tất cả (hiển thị mọi thuốc) —</option>
                {clinics.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}{c.roomNumber ? ` — Phòng ${c.roomNumber}` : ""}</option>
                ))}
              </select>
              {selectedClinicId && (
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-sm">filter_list</span>
                  Chỉ hiển thị thuốc còn tồn kho.
                </p>
              )}
            </div>

            {/* Drug autocomplete */}
            <div ref={drugSearchRef} className="relative">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tên thuốc</label>
              <input
                type="text"
                value={drugQuery}
                onChange={(e) => { setDrugQuery(e.target.value); setSelectedDrug(null); setAllergyWarning(null); }}
                onFocus={() => drugResults.length > 0 && setShowDrugDropdown(true)}
                placeholder="Nhập tên thuốc để tìm trong kho..."
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none"
                autoComplete="off"
              />
              {showDrugDropdown && drugResults.length > 0 && (
                <ul className="absolute z-20 mt-1 w-full max-h-52 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg">
                  {drugResults.map((d) => (
                    <li key={d.id} className="border-b border-slate-50 last:border-0">
                      <button
                        type="button"
                        onClick={() => handleSelectDrug(d)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm flex justify-between items-center"
                      >
                        <div>
                          <span className="font-bold text-slate-800">{d.name}</span>
                          {d.code && <span className="text-xs text-slate-400 ml-1.5">({d.code})</span>}
                        </div>
                        <span className={`text-xs font-bold shrink-0 ml-3 px-2 py-0.5 rounded-full ${
                          d.stockQuantity === 0
                            ? "bg-rose-50 text-rose-600 border border-rose-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}>
                          {d.stockQuantity === 0 ? "Hết hàng" : `Kho: ${d.stockQuantity}${d.unit ? " " + d.unit : ""}`}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Allergy warning */}
            {allergyWarning && (
              <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-sm text-amber-800">
                <span className="material-symbols-outlined text-amber-500 text-xl shrink-0">warning</span>
                <div>
                  <p className="font-bold">Cảnh báo dị ứng</p>
                  <p className="mt-0.5">{allergyWarning}</p>
                </div>
              </div>
            )}

            {/* Out-of-stock block */}
            {selectedDrug && selectedDrug.stockQuantity === 0 && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
                <span className="material-symbols-outlined text-rose-500">inventory_2</span>
                Thuốc này hiện đã hết kho, không thể kê đơn.
              </div>
            )}

            {/* Dosage fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Liều dùng</label>
                <input value={dose} onChange={(e) => setDose(e.target.value)} placeholder="VD: 500mg"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Đường dùng</label>
                <select value={route} onChange={(e) => setRoute(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none">
                  <option>Oral</option><option>IV</option><option>IM</option>
                  <option>Topical</option><option>Sublingual</option><option>Inhalation</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Tần suất</label>
                <input value={frequency} onChange={(e) => setFrequency(e.target.value)} placeholder="VD: 2 lần/ngày"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Số ngày</label>
                <input type="number" min={1} value={durationDays} onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Số lượng</label>
                <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none" />
              </div>
            </div>

            <button
              type="button"
              disabled={addDisabled}
              onClick={handleAddToList}
              title={selectedDrug?.stockQuantity === 0 ? "Thuốc hết hàng" : undefined}
              className={`w-full flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                addDisabled
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-primary text-on-primary shadow-md shadow-primary/20 hover:bg-primary/95"
              }`}
            >
              <span className="material-symbols-outlined text-base">add</span>
              {selectedDrug?.stockQuantity === 0 ? "Hết kho — Không thể thêm" : "Thêm vào đơn thuốc"}
            </button>
          </div>

          {/* ── Right: Active prescription list ── */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-slate-400">receipt_long</span>
              Danh sách thuốc đã kê
              {items.length > 0 && (
                <span className="ml-auto text-xs font-bold px-2 py-0.5 bg-primary-container text-on-primary-container rounded-full">
                  {items.length}
                </span>
              )}
            </h4>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-2xl py-12 text-slate-400">
                <span className="material-symbols-outlined text-4xl">medication</span>
                <p className="text-sm font-medium mt-2">Chưa có thuốc nào được kê.</p>
                <p className="text-xs mt-1">Thêm thuốc từ form bên trái.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-xl border border-slate-150">
                  <table className="min-w-full divide-y divide-slate-100 text-left">
                    <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Thuốc</th>
                        <th className="px-4 py-3">Liều / Đường</th>
                        <th className="px-4 py-3">Tần suất</th>
                        <th className="px-4 py-3">Ngày</th>
                        <th className="px-4 py-3">SL</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100 text-sm">
                      {items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 font-bold text-slate-800">{item.drugName}</td>
                          <td className="px-4 py-3 text-slate-600">{item.dose || "—"}<br /><span className="text-xs text-slate-400">{item.route}</span></td>
                          <td className="px-4 py-3 text-slate-600">{item.frequency || "—"}</td>
                          <td className="px-4 py-3 text-slate-600">{item.durationDays}d</td>
                          <td className="px-4 py-3 font-semibold">{item.quantity}</td>
                          <td className="px-4 py-3">
                            <button type="button" onClick={() => handleRemoveItem(idx)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Send to pharmacy */}
                <div className="pt-2 flex items-center gap-3 flex-wrap">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleSend}
                    className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-md ${
                      saving
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/10"
                    }`}
                  >
                    {saving
                      ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      : <span className="material-symbols-outlined text-base">send</span>}
                    {saving ? "Đang gửi..." : "Gửi đến nhà thuốc"}
                  </button>
                  {!selectedClinicId && (
                    <p className="text-xs text-slate-400 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-sm">info</span>
                      Chọn nhà thuốc để định tuyến đơn thuốc.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Result message */}
        {message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 border ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}>
            <span className={`material-symbols-outlined ${message.type === "success" ? "text-emerald-600" : "text-rose-600"}`}>
              {message.type === "success" ? "check_circle" : "error"}
            </span>
            <span className="font-medium">{message.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}
