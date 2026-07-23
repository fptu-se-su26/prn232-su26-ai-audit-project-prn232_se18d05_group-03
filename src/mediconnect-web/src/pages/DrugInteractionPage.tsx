import { useEffect, useMemo, useState } from "react";
import { drugApi, drugInteractionApi, cdssApi, patientApi, userApi } from "../api/services";
import type { Drug, DrugInteraction, DoseCheckResult, PatientProfile, UserAccount } from "../types";

type Tab = "check" | "dose" | "drugs" | "interactions";

const SEVERITY_STYLES: Record<string, string> = {
  high: "bg-error text-on-error",
  severe: "bg-error text-on-error",
  medium: "bg-secondary text-on-secondary",
  moderate: "bg-secondary text-on-secondary",
  low: "bg-tertiary-container text-on-tertiary-container",
};

function severityClass(sev?: string) {
  if (!sev) return "bg-surface-container text-on-surface-variant";
  return SEVERITY_STYLES[sev.toLowerCase()] ?? "bg-surface-container text-on-surface-variant";
}

interface DrugFormState {
  name: string;
  code: string;
  unit: string;
  stockQuantity: number;
  unitPrice: number;
  isActive: boolean;
  maxDailyDose: string;
  maxDosePerKg: string;
}
const EMPTY_DRUG: DrugFormState = { name: "", code: "", unit: "", stockQuantity: 0, unitPrice: 0, isActive: true, maxDailyDose: "", maxDosePerKg: "" };

interface InteractionFormState {
  drugId: string;
  interactingDrugId: string;
  severity: string;
  description: string;
}
const EMPTY_INTERACTION: InteractionFormState = { drugId: "", interactingDrugId: "", severity: "Medium", description: "" };

export default function DrugInteractionPage() {
  const [tab, setTab] = useState<Tab>("check");
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Checker tool state
  const [selectedDrugIds, setSelectedDrugIds] = useState<string[]>([]);
  const [checkResult, setCheckResult] = useState<DrugInteraction[] | null>(null);
  const [checking, setChecking] = useState(false);

  // Dose checker state (Screen 2.2)
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [patientUsers, setPatientUsers] = useState<UserAccount[]>([]);
  const [doseForm, setDoseForm] = useState({ patientId: "", drugId: "", doseAmount: "" });
  const [doseResult, setDoseResult] = useState<DoseCheckResult | null>(null);
  const [doseChecking, setDoseChecking] = useState(false);

  // Drug modal
  const [isDrugModalOpen, setIsDrugModalOpen] = useState(false);
  const [editingDrugId, setEditingDrugId] = useState<string | null>(null);
  const [drugForm, setDrugForm] = useState<DrugFormState>(EMPTY_DRUG);

  // Interaction modal
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [interactionForm, setInteractionForm] = useState<InteractionFormState>(EMPTY_INTERACTION);

  const [submitting, setSubmitting] = useState(false);

  const drugMap = useMemo(() => new Map(drugs.map(d => [d.id, d.name])), [drugs]);

  const loadAll = () => {
    setLoading(true);
    setError(null);
    Promise.all([drugApi.getAll(), drugInteractionApi.getAll(), patientApi.getAll(), userApi.getAll()])
      .then(([d, i, p, u]) => {
        setDrugs(d.data);
        setInteractions(i.data);
        setPatients(p.data);
        setPatientUsers(u.data);
      })
      .catch(() => setError("Không thể tải dữ liệu thuốc."))
      .finally(() => setLoading(false));
  };

  const patientNameById = useMemo(() => {
    const userById = new Map(patientUsers.map(u => [u.id, u.fullName]));
    return new Map(patients.map(p => [p.id, userById.get(p.userAccountId) ?? p.id]));
  }, [patients, patientUsers]);

  useEffect(loadAll, []);

  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(null), 3000);
    return () => clearTimeout(t);
  }, [successMsg]);

  // ── Checker tool ─────────────────────────────────────────────────────────
  const toggleDrugSelection = (id: string) => {
    setCheckResult(null);
    setSelectedDrugIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const runCheck = async () => {
    if (selectedDrugIds.length < 2) {
      setError("Chọn ít nhất 2 loại thuốc để kiểm tra tương tác.");
      return;
    }
    setChecking(true);
    setError(null);
    try {
      const res = await cdssApi.checkInteractions(selectedDrugIds);
      setCheckResult(res.data.interactions);
    } catch {
      setError("Không thể kiểm tra tương tác thuốc.");
    } finally {
      setChecking(false);
    }
  };

  // ── Dose checker (Screen 2.2) ────────────────────────────────────────────
  const runDoseCheck = async () => {
    if (!doseForm.patientId || !doseForm.drugId || doseForm.doseAmount === "") {
      setError("Chọn bệnh nhân, thuốc và nhập liều lượng để kiểm tra.");
      return;
    }
    setDoseChecking(true);
    setError(null);
    try {
      const res = await cdssApi.checkDose({
        patientId: doseForm.patientId,
        drugId: doseForm.drugId,
        doseAmount: Number(doseForm.doseAmount),
      });
      setDoseResult(res.data);
    } catch {
      setError("Không thể kiểm tra liều lượng.");
    } finally {
      setDoseChecking(false);
    }
  };

  // ── Drug CRUD ────────────────────────────────────────────────────────────
  const openCreateDrug = () => {
    setEditingDrugId(null);
    setDrugForm(EMPTY_DRUG);
    setIsDrugModalOpen(true);
  };
  const openEditDrug = (d: Drug) => {
    setEditingDrugId(d.id);
    setDrugForm({
      name: d.name, code: d.code ?? "", unit: d.unit ?? "",
      stockQuantity: d.stockQuantity, unitPrice: d.unitPrice, isActive: d.isActive,
      maxDailyDose: d.maxDailyDose != null ? String(d.maxDailyDose) : "",
      maxDosePerKg: d.maxDosePerKg != null ? String(d.maxDosePerKg) : "",
    });
    setIsDrugModalOpen(true);
  };
  const submitDrug = async () => {
    if (!drugForm.name) {
      setError("Vui lòng nhập tên thuốc.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        name: drugForm.name,
        code: drugForm.code || undefined,
        unit: drugForm.unit || undefined,
        stockQuantity: drugForm.stockQuantity,
        unitPrice: drugForm.unitPrice,
        isActive: drugForm.isActive,
        maxDailyDose: drugForm.maxDailyDose === "" ? null : Number(drugForm.maxDailyDose),
        maxDosePerKg: drugForm.maxDosePerKg === "" ? null : Number(drugForm.maxDosePerKg),
      };
      if (editingDrugId) {
        await drugApi.update(editingDrugId, payload);
        setSuccessMsg("Đã cập nhật thuốc.");
      } else {
        await drugApi.create(payload);
        setSuccessMsg("Đã thêm thuốc mới.");
      }
      setIsDrugModalOpen(false);
      loadAll();
    } catch {
      setError("Không thể lưu thông tin thuốc.");
    } finally {
      setSubmitting(false);
    }
  };
  const deleteDrug = async (d: Drug) => {
    if (!window.confirm(`Xóa thuốc "${d.name}"?`)) return;
    try {
      await drugApi.delete(d.id);
      setSuccessMsg("Đã xóa thuốc.");
      loadAll();
    } catch {
      setError("Không thể xóa thuốc (có thể đang được tham chiếu trong tương tác).");
    }
  };

  // ── Interaction CRUD ─────────────────────────────────────────────────────
  const openCreateInteraction = () => {
    setInteractionForm(EMPTY_INTERACTION);
    setIsInteractionModalOpen(true);
  };
  const submitInteraction = async () => {
    if (!interactionForm.drugId || !interactionForm.interactingDrugId) {
      setError("Vui lòng chọn đủ 2 loại thuốc.");
      return;
    }
    if (interactionForm.drugId === interactionForm.interactingDrugId) {
      setError("Hai loại thuốc phải khác nhau.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await drugInteractionApi.create({
        drugId: interactionForm.drugId,
        interactingDrugId: interactionForm.interactingDrugId,
        severity: interactionForm.severity || undefined,
        description: interactionForm.description || undefined,
      });
      setSuccessMsg("Đã thêm cặp tương tác thuốc.");
      setIsInteractionModalOpen(false);
      loadAll();
    } catch {
      setError("Không thể lưu cặp tương tác thuốc.");
    } finally {
      setSubmitting(false);
    }
  };
  const deleteInteraction = async (i: DrugInteraction) => {
    if (!window.confirm("Xóa cặp tương tác thuốc này?")) return;
    try {
      await drugInteractionApi.delete(i.id);
      setSuccessMsg("Đã xóa cặp tương tác.");
      loadAll();
    } catch {
      setError("Không thể xóa cặp tương tác.");
    }
  };

  return (
    <div className="min-h-screen bg-background p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-on-surface">Cảnh báo Tương tác Thuốc (CDSS)</h2>
        <p className="text-sm text-on-surface-variant mt-1">
          Kiểm tra tương tác giữa các loại thuốc và quản lý danh mục dược.
        </p>
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

      {/* Tabs */}
      <div className="flex gap-1 border-b border-outline-variant">
        {[
          { id: "check" as Tab, label: "Kiểm tra tương tác", icon: "fact_check" },
          { id: "dose" as Tab, label: "Cảnh báo quá liều", icon: "vaccines" },
          { id: "drugs" as Tab, label: "Danh mục thuốc", icon: "medication" },
          { id: "interactions" as Tab, label: "Cặp tương tác", icon: "warning" },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium flex items-center gap-1.5 border-b-2 transition-colors ${
              tab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Check ─────────────────────────────────────────────────── */}
      {tab === "check" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant">
            <h4 className="text-lg font-semibold text-on-surface mb-1">Chọn thuốc cần kiểm tra</h4>
            <p className="text-xs text-on-surface-variant mb-4">Chọn từ 2 loại thuốc trở lên</p>
            {loading ? (
              <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-8 bg-surface-container-low animate-pulse rounded" />)}</div>
            ) : (
              <div className="space-y-1 max-h-[360px] overflow-y-auto">
                {drugs.map(d => (
                  <label
                    key={d.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-surface cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDrugIds.includes(d.id)}
                      onChange={() => toggleDrugSelection(d.id)}
                      className="accent-primary"
                    />
                    <span className="text-on-surface">{d.name}</span>
                    {d.code && <span className="text-xs text-on-surface-variant">({d.code})</span>}
                  </label>
                ))}
                {drugs.length === 0 && <p className="text-sm text-on-surface-variant">Chưa có thuốc nào. Thêm ở tab "Danh mục thuốc".</p>}
              </div>
            )}
            <button
              onClick={runCheck}
              disabled={checking || selectedDrugIds.length < 2}
              className="mt-4 w-full bg-primary text-on-primary rounded px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {checking ? "Đang kiểm tra..." : `Kiểm tra (${selectedDrugIds.length} thuốc)`}
            </button>
          </div>

          <div>
            {checkResult === null ? (
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant h-full flex flex-col items-center justify-center text-on-surface-variant gap-2">
                <span className="material-symbols-outlined text-4xl">science</span>
                <p className="text-sm">Kết quả kiểm tra sẽ hiện ở đây</p>
              </div>
            ) : checkResult.length === 0 ? (
              <div className="bg-tertiary-container text-on-tertiary-container p-6 rounded-xl border border-outline-variant h-full flex flex-col items-center justify-center gap-2">
                <span className="material-symbols-outlined text-5xl">check_circle</span>
                <p className="font-semibold">Không phát hiện tương tác nguy hiểm</p>
                <p className="text-xs opacity-80">An toàn khi phối hợp các thuốc đã chọn</p>
              </div>
            ) : (
              <div className="bg-error-container text-on-error-container p-6 rounded-xl border-2 border-error animate-pulse-slow space-y-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-3xl">warning</span>
                  <h4 className="text-lg font-bold">
                    Phát hiện {checkResult.length} cặp tương tác nguy hiểm!
                  </h4>
                </div>
                <div className="space-y-2">
                  {checkResult.map(i => (
                    <div key={i.id} className="bg-surface-container-lowest text-on-surface rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">
                          {drugMap.get(i.drugId) ?? i.drugId} ⚡ {drugMap.get(i.interactingDrugId) ?? i.interactingDrugId}
                        </p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${severityClass(i.severity)}`}>
                          {i.severity ?? "N/A"}
                        </span>
                      </div>
                      {i.description && <p className="text-xs text-on-surface-variant mt-1">{i.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tab: Dose overdose check (Screen 2.2) ──────────────────────── */}
      {tab === "dose" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant space-y-3">
            <div>
              <h4 className="text-lg font-semibold text-on-surface mb-1">Kiểm tra liều lượng theo thể trạng</h4>
              <p className="text-xs text-on-surface-variant">Đối chiếu liều nhập vào với ngưỡng an toàn tính theo cân nặng bệnh nhân.</p>
            </div>
            <div>
              <label className="text-xs font-medium text-on-surface-variant">Bệnh nhân</label>
              <select
                value={doseForm.patientId}
                onChange={e => { setDoseResult(null); setDoseForm(f => ({ ...f, patientId: e.target.value })); }}
                className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface"
              >
                <option value="">— Chọn bệnh nhân —</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {patientNameById.get(p.id)}{p.weightKg ? ` — ${p.weightKg} kg` : " (chưa có cân nặng)"}
                  </option>
                ))}
              </select>
              {patients.length === 0 && (
                <p className="text-xs text-on-surface-variant mt-1">Chưa có hồ sơ bệnh nhân nào trong hệ thống.</p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-on-surface-variant">Thuốc</label>
              <select
                value={doseForm.drugId}
                onChange={e => { setDoseResult(null); setDoseForm(f => ({ ...f, drugId: e.target.value })); }}
                className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface"
              >
                <option value="">— Chọn thuốc —</option>
                {drugs.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name}{d.maxDosePerKg ? ` (≤ ${d.maxDosePerKg} ${d.unit ?? ""}/kg)` : d.maxDailyDose ? ` (≤ ${d.maxDailyDose} ${d.unit ?? ""})` : " (chưa có ngưỡng)"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-on-surface-variant">Liều nhập vào ({drugs.find(d => d.id === doseForm.drugId)?.unit ?? "đơn vị"})</label>
              <input
                type="number"
                min={0}
                step="any"
                value={doseForm.doseAmount}
                onChange={e => { setDoseResult(null); setDoseForm(f => ({ ...f, doseAmount: e.target.value })); }}
                placeholder="Ví dụ: 500"
                className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface"
              />
            </div>
            <button
              onClick={runDoseCheck}
              disabled={doseChecking || !doseForm.patientId || !doseForm.drugId || doseForm.doseAmount === ""}
              className="w-full bg-primary text-on-primary rounded px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {doseChecking ? "Đang kiểm tra..." : "Kiểm tra liều"}
            </button>
          </div>

          <div>
            {doseResult === null ? (
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant h-full flex flex-col items-center justify-center text-on-surface-variant gap-2">
                <span className="material-symbols-outlined text-4xl">vaccines</span>
                <p className="text-sm">Kết quả kiểm tra liều sẽ hiện ở đây</p>
              </div>
            ) : doseResult.isOverDose ? (
              <div className="bg-error-container text-on-error-container p-6 rounded-xl border-2 border-error animate-pulse-slow space-y-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-3xl">emergency</span>
                  <h4 className="text-lg font-bold">Cảnh báo quá liều!</h4>
                </div>
                <p className="text-sm">{doseResult.message}</p>
                <div className="bg-surface-container-lowest text-on-surface rounded-lg p-3 text-sm grid grid-cols-2 gap-y-1">
                  <span className="text-on-surface-variant">Liều nhập</span>
                  <span className="font-semibold text-right">{doseResult.enteredDose} {doseResult.unit}</span>
                  <span className="text-on-surface-variant">Ngưỡng khuyến nghị</span>
                  <span className="font-semibold text-right">{doseResult.recommendedMaxDose} {doseResult.unit}</span>
                  {doseResult.patientWeightKg != null && (
                    <>
                      <span className="text-on-surface-variant">Cân nặng BN</span>
                      <span className="font-semibold text-right">{doseResult.patientWeightKg} kg</span>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className={`p-6 rounded-xl border h-full flex flex-col justify-center gap-2 ${
                doseResult.thresholdBasis === "none"
                  ? "bg-surface-container-lowest border-outline-variant text-on-surface-variant"
                  : "bg-tertiary-container text-on-tertiary-container border-outline-variant"
              }`}>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-3xl">
                    {doseResult.thresholdBasis === "none" ? "info" : "check_circle"}
                  </span>
                  <h4 className="font-semibold">
                    {doseResult.thresholdBasis === "none" ? "Chưa thể đánh giá" : "Liều an toàn"}
                  </h4>
                </div>
                <p className="text-sm">{doseResult.message}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tab: Drugs ─────────────────────────────────────────────────── */}
      {tab === "drugs" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={openCreateDrug}
              className="bg-primary text-on-primary rounded px-4 py-2 flex items-center gap-2 text-sm font-medium hover:opacity-90 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Thêm thuốc
            </button>
          </div>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-10 bg-surface-container-low animate-pulse rounded" />)}</div>
            ) : drugs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[160px] text-on-surface-variant gap-2">
                <span className="material-symbols-outlined text-4xl">medication</span>
                <p className="text-sm">Chưa có thuốc nào</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low text-xs text-on-surface-variant">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Tên thuốc</th>
                    <th className="px-6 py-3 font-semibold">Mã</th>
                    <th className="px-6 py-3 font-semibold">Đơn vị</th>
                    <th className="px-6 py-3 font-semibold text-right">Tồn kho</th>
                    <th className="px-6 py-3 font-semibold text-right">Đơn giá</th>
                    <th className="px-6 py-3 font-semibold">Trạng thái</th>
                    <th className="px-6 py-3 font-semibold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant text-sm">
                  {drugs.map(d => (
                    <tr key={d.id} className="hover:bg-surface transition-colors">
                      <td className="px-6 py-3 font-medium text-on-surface">{d.name}</td>
                      <td className="px-6 py-3 text-on-surface-variant">{d.code ?? "—"}</td>
                      <td className="px-6 py-3 text-on-surface-variant">{d.unit ?? "—"}</td>
                      <td className={`px-6 py-3 text-right ${d.stockQuantity <= 10 ? "text-error font-semibold" : "text-on-surface-variant"}`}>
                        {d.stockQuantity}
                      </td>
                      <td className="px-6 py-3 text-right text-on-surface-variant">{d.unitPrice.toLocaleString("vi-VN")}đ</td>
                      <td className="px-6 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${d.isActive ? "bg-tertiary-container text-on-tertiary-container" : "bg-surface-container text-on-surface-variant"}`}>
                          {d.isActive ? "Đang dùng" : "Ngừng dùng"}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button onClick={() => openEditDrug(d)} className="p-1.5 text-on-surface-variant hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button onClick={() => deleteDrug(d)} className="p-1.5 text-on-surface-variant hover:text-error transition-colors">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── Tab: Interactions ──────────────────────────────────────────── */}
      {tab === "interactions" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={openCreateInteraction}
              disabled={drugs.length < 2}
              className="bg-primary text-on-primary rounded px-4 py-2 flex items-center gap-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Thêm cặp tương tác
            </button>
          </div>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-10 bg-surface-container-low animate-pulse rounded" />)}</div>
            ) : interactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[160px] text-on-surface-variant gap-2">
                <span className="material-symbols-outlined text-4xl">warning</span>
                <p className="text-sm">Chưa có cặp tương tác nào</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low text-xs text-on-surface-variant">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Thuốc A</th>
                    <th className="px-6 py-3 font-semibold">Thuốc B</th>
                    <th className="px-6 py-3 font-semibold">Mức độ</th>
                    <th className="px-6 py-3 font-semibold">Mô tả</th>
                    <th className="px-6 py-3 font-semibold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant text-sm">
                  {interactions.map(i => (
                    <tr key={i.id} className="hover:bg-surface transition-colors">
                      <td className="px-6 py-3 font-medium text-on-surface">{drugMap.get(i.drugId) ?? i.drugId}</td>
                      <td className="px-6 py-3 font-medium text-on-surface">{drugMap.get(i.interactingDrugId) ?? i.interactingDrugId}</td>
                      <td className="px-6 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${severityClass(i.severity)}`}>{i.severity ?? "—"}</span>
                      </td>
                      <td className="px-6 py-3 text-on-surface-variant">{i.description ?? "—"}</td>
                      <td className="px-6 py-3 text-right">
                        <button onClick={() => deleteInteraction(i)} className="p-1.5 text-on-surface-variant hover:text-error transition-colors">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Drug Modal */}
      {isDrugModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-xl font-semibold text-on-surface">{editingDrugId ? "Sửa thuốc" : "Thêm thuốc"}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-on-surface-variant">Tên thuốc</label>
                <input value={drugForm.name} onChange={e => setDrugForm(f => ({ ...f, name: e.target.value }))} className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-on-surface-variant">Mã thuốc</label>
                  <input value={drugForm.code} onChange={e => setDrugForm(f => ({ ...f, code: e.target.value }))} className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface" />
                </div>
                <div>
                  <label className="text-xs font-medium text-on-surface-variant">Đơn vị</label>
                  <input value={drugForm.unit} onChange={e => setDrugForm(f => ({ ...f, unit: e.target.value }))} placeholder="Viên, ống..." className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-on-surface-variant">Tồn kho</label>
                  <input type="number" min={0} value={drugForm.stockQuantity} onChange={e => setDrugForm(f => ({ ...f, stockQuantity: Number(e.target.value) }))} className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface" />
                </div>
                <div>
                  <label className="text-xs font-medium text-on-surface-variant">Đơn giá (đ)</label>
                  <input type="number" min={0} value={drugForm.unitPrice} onChange={e => setDrugForm(f => ({ ...f, unitPrice: Number(e.target.value) }))} className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-on-surface-variant">Liều tối đa/ngày</label>
                  <input type="number" min={0} step="any" value={drugForm.maxDailyDose} onChange={e => setDrugForm(f => ({ ...f, maxDailyDose: e.target.value }))} placeholder="vd: 4000" className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface" />
                </div>
                <div>
                  <label className="text-xs font-medium text-on-surface-variant">Liều tối đa/kg</label>
                  <input type="number" min={0} step="any" value={drugForm.maxDosePerKg} onChange={e => setDrugForm(f => ({ ...f, maxDosePerKg: e.target.value }))} placeholder="vd: 15" className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface" />
                </div>
              </div>
              <p className="text-[11px] text-on-surface-variant -mt-1">Dùng cho cảnh báo quá liều (Screen 2.2). Ưu tiên liều/kg khi biết cân nặng bệnh nhân.</p>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={drugForm.isActive} onChange={e => setDrugForm(f => ({ ...f, isActive: e.target.checked }))} className="accent-primary" />
                Đang sử dụng
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setIsDrugModalOpen(false)} className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container rounded transition-colors">Hủy</button>
              <button onClick={submitDrug} disabled={submitting} className="px-4 py-2 text-sm font-medium bg-primary text-on-primary rounded hover:opacity-90 disabled:opacity-50 transition-all">
                {submitting ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interaction Modal */}
      {isInteractionModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-xl font-semibold text-on-surface">Thêm cặp tương tác thuốc</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-on-surface-variant">Thuốc A</label>
                <select value={interactionForm.drugId} onChange={e => setInteractionForm(f => ({ ...f, drugId: e.target.value }))} className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface">
                  <option value="">— Chọn thuốc —</option>
                  {drugs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-on-surface-variant">Thuốc B (tương tác với A)</label>
                <select value={interactionForm.interactingDrugId} onChange={e => setInteractionForm(f => ({ ...f, interactingDrugId: e.target.value }))} className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface">
                  <option value="">— Chọn thuốc —</option>
                  {drugs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-on-surface-variant">Mức độ nghiêm trọng</label>
                <select value={interactionForm.severity} onChange={e => setInteractionForm(f => ({ ...f, severity: e.target.value }))} className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface">
                  <option value="Low">Thấp</option>
                  <option value="Medium">Trung bình</option>
                  <option value="High">Cao</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-on-surface-variant">Mô tả</label>
                <textarea value={interactionForm.description} onChange={e => setInteractionForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setIsInteractionModalOpen(false)} className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container rounded transition-colors">Hủy</button>
              <button onClick={submitInteraction} disabled={submitting} className="px-4 py-2 text-sm font-medium bg-primary text-on-primary rounded hover:opacity-90 disabled:opacity-50 transition-all">
                {submitting ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
