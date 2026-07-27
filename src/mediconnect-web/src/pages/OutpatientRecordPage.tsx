import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { medicalRecordApi, clinicDashboardApi, userApi, outpatientApi, staffApi, patientApi, phrApi } from "../api/services";
import type { ClinicQueue, QueueTicketDetail, Icd10Result, PatientDiagnosisHistory } from "../types";
import { useAuth } from "../context/AuthContext";
import EPrescriptionPanel from "./EPrescriptionPanel";

export default function OutpatientRecordPage() {
  const { user } = useAuth();
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [queue, setQueue] = useState<ClinicQueue | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<QueueTicketDetail | null>(null);
  const loc = useLocation();
  const [patient, setPatient] = useState<any | null>(null);
  const [bloodType, setBloodType] = useState<string | null>(null);
  const [vitals, setVitals] = useState<{ label: string; value: string; note?: string }[]>([]);
  const [staffProfileId, setStaffProfileId] = useState<string | null>(null);
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [diagnosisCode, setDiagnosisCode] = useState("");
  const [diagnosisDescription, setDiagnosisDescription] = useState("");
  const [icdQuery, setIcdQuery] = useState("");
  const [icdResults, setIcdResults] = useState<Icd10Result[]>([]);
  const [icdSearching, setIcdSearching] = useState(false);
  const [showIcdDropdown, setShowIcdDropdown] = useState(false);
  const [diagnosisHistory, setDiagnosisHistory] = useState<PatientDiagnosisHistory[]>([]);
  const icdSearchRef = useRef<HTMLDivElement>(null);
  const [orderedTests, setOrderedTests] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [localQuery, setLocalQuery] = useState<string>("");
  const [topQuery, setTopQuery] = useState<string>("");
  const [savedVisitId, setSavedVisitId] = useState<string | null>(null);
  const [savedPatientName, setSavedPatientName] = useState<string>("");
  const [patientPrescriptions, setPatientPrescriptions] = useState<any[]>([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);

  const loadPatientPrescriptions = async (patientId: string) => {
    setLoadingPrescriptions(true);
    try {
      const { data: history } = await patientApi.getHistory(patientId);
      const prescriptions = history?.prescriptions || [];
      if (prescriptions.length === 0) {
        setPatientPrescriptions([]);
        return;
      }

      const [{ data: allItems }, { data: drugs }] = await Promise.all([
        phrApi.getAllPrescriptionItems(),
        phrApi.getAllDrugs(),
      ]);

      const drugDict = new Map(drugs.map((d: any) => [d.id, d]));

      const rxList = prescriptions
        .sort((a: any, b: any) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())
        .map((p: any) => ({
          id: p.id,
          issuedAt: p.issuedAt,
          notes: p.notes,
          items: allItems
            .filter((i: any) => i.prescriptionId === p.id)
            .map((i: any) => {
              const drug = drugDict.get(i.drugId);
              return {
                drugName: drug?.name || "Thuốc chưa xác định",
                unit: drug?.unit || "đơn vị",
                dose: i.dose || "",
                frequency: i.frequency || "",
                durationDays: i.durationDays,
                quantity: i.quantity,
              };
            }),
        }));
      setPatientPrescriptions(rxList);
    } catch {
      setPatientPrescriptions([]);
    } finally {
      setLoadingPrescriptions(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await clinicDashboardApi.getOverview();
        if (data.length > 0) setClinicId(data[0].clinicId);
      } catch (e) { console.error(e); }
    })();
  }, []);

  useEffect(() => {
    if (!clinicId) return;
    (async () => {
      try {
        const { data } = await clinicDashboardApi.getQueue(clinicId);
        setQueue(data);
        const state: any = loc.state;
        const q = state?.searchQuery?.toLowerCase?.();
        if (q) {
          const matched = data.tickets.find((t: any) => (t.patientName || "").toLowerCase().includes(q) || (t.number + "").toLowerCase().includes(q));
          if (matched) setSelectedTicket(matched);
        }
      } catch (e) { console.error(e); }
    })();
  }, [clinicId]);

  useEffect(() => {
    const state: any = loc.state;
    if (state?.ticket) {
      setSelectedTicket(state.ticket as QueueTicketDetail);
      if (state?.clinicId) setClinicId(state.clinicId as string);
    }
  }, [loc.state]);

  useEffect(() => {
    (async () => {
      if (!selectedTicket) { setPatient(null); setVitals([]); setBloodType(null); return; }
      try {
        if (selectedTicket.patientId) {
          const { data } = await userApi.getById(selectedTicket.patientId);
          setPatient(data);
          setBloodType(null);
          setVitals([
            { label: "BP", value: "- / -" },
            { label: "Temp", value: "- °C" },
            { label: "HR", value: "- BPM" },
          ]);
        }
      } catch (err) { console.error(err); setPatient(null); }
    })();
  }, [selectedTicket]);

  useEffect(() => {
    if (!selectedTicket?.patientId) {
      setDiagnosisHistory([]);
      setPatientPrescriptions([]);
      return;
    }
    (async () => {
      try {
        const { data } = await medicalRecordApi.getDiagnosisHistory(selectedTicket.patientId!);
        setDiagnosisHistory(data);
      } catch { setDiagnosisHistory([]); }
      loadPatientPrescriptions(selectedTicket.patientId!);
    })();
  }, [selectedTicket?.patientId]);

  const openEPrescriptionForSelectedPatient = async () => {
    if (!selectedTicket || !user) return;
    let patientIdToUse = selectedTicket.patientId || patient?.id;
    if (!patientIdToUse) {
      setMessage({ type: "error", text: "Bệnh nhân vãng lai chưa có hồ sơ tài khoản — không thể kê đơn thuốc." });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      const visitId = selectedTicket.appointmentId || selectedTicket.id;
      const createResp = await outpatientApi.create({
        patientId: patientIdToUse,
        doctorId: staffProfileId || user.id,
        clinicId: clinicId || selectedTicket.clinicId,
        queueTicketId: selectedTicket.id,
        visitDate: new Date().toISOString(),
        status: 0,
      } as any);
      const created = createResp?.data ?? createResp;
      const finalVisitId = created?.id || visitId;
      setSavedVisitId(finalVisitId);
      setSavedPatientName(patient?.fullName || selectedTicket?.patientName || "Bệnh nhân");
    } catch {
      setMessage({ type: "error", text: "Lỗi khi mở form kê đơn thuốc." });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  useEffect(() => {
    if (icdQuery.trim().length < 2) { setIcdResults([]); setIcdSearching(false); return; }
    setIcdSearching(true);
    const timer = window.setTimeout(async () => {
      try {
        const { data } = await medicalRecordApi.searchIcd10(icdQuery.trim());
        setIcdResults(data);
        setShowIcdDropdown(true);
      } catch { setIcdResults([]); }
      finally { setIcdSearching(false); }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [icdQuery]);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (icdSearchRef.current && !icdSearchRef.current.contains(e.target as Node)) setShowIcdDropdown(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  useEffect(() => {
    (async () => {
      if (!user) return;
      try {
        const { data } = await staffApi.getDirectory();
        const me = data.find((s: any) => s.userId === user.id);
        setStaffProfileId(me ? me.id : null);
      } catch { setStaffProfileId(null); }
    })();
  }, [user]);

  const handleSelectTicket = (t: QueueTicketDetail) => {
    setSelectedTicket(t);
    setChiefComplaint(""); setSymptoms(""); setDiagnosisCode(""); setDiagnosisDescription("");
    setIcdQuery(""); setIcdResults([]); setShowIcdDropdown(false); setOrderedTests([]); setMessage(null);
  };

  const handleSelectIcd = (item: Icd10Result) => {
    setDiagnosisCode(item.code);
    setDiagnosisDescription(item.description);
    setIcdQuery(`${item.code} - ${item.description}`);
    setShowIcdDropdown(false);
  };

  const handleSelectHistoryDiagnosis = (item: PatientDiagnosisHistory) => {
    setDiagnosisCode(item.diagnosisCode || "");
    setDiagnosisDescription(item.diagnosisDescription || "");
    setIcdQuery(item.diagnosisCode && item.diagnosisDescription
      ? `${item.diagnosisCode} - ${item.diagnosisDescription}`
      : item.diagnosisCode || item.diagnosisDescription || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !user) return;
    setSubmitting(true);
    try {
      const payload: any = {
        visitId: selectedTicket.appointmentId || selectedTicket.id,
        doctorId: staffProfileId || user.id,
        chiefComplaint, symptoms,
        diagnosisCode: diagnosisCode || undefined,
        diagnosisDescription,
        orderedTests: orderedTests.slice(),
        notes: undefined,
      };
      try {
        await medicalRecordApi.diagnose(payload);
      } catch (err: any) {
        const status = err?.response?.status;
        const serverMsg = err?.response?.data?.message ?? err?.response?.data ?? err?.message;
        if (status === 404 || (status === 500 && typeof serverMsg === "string" && serverMsg.includes("Outpatient visit not found"))) {
          let patientIdToUse = selectedTicket.patientId || patient?.id || null;
          if (!patientIdToUse && user) {
            try {
              const { data: me } = await patientApi.getMe();
              if (me?.id) patientIdToUse = me.id;
            } catch (e2: any) {
              if ([404, 400].includes(e2?.response?.status)) {
                const created = await patientApi.create({ userAccountId: user.id });
                patientIdToUse = (created?.data ?? created).id;
              } else throw e2;
            }
          }
          const createResp = await outpatientApi.create({
            patientId: patientIdToUse, doctorId: staffProfileId || user.id,
            clinicId: clinicId || selectedTicket.clinicId,
            queueTicketId: selectedTicket.id,
            visitDate: new Date().toISOString(), status: 0,
          } as any);
          const created = createResp?.data ?? createResp;
          if (!created?.id) throw new Error("Outpatient create did not return id");
          payload.visitId = created.id;
          await medicalRecordApi.diagnose(payload);
        } else throw err;
      }
      setMessage({ type: "success", text: "Đã lưu hồ sơ khám cho bệnh nhân." });
      setSavedVisitId(payload.visitId);
      setSavedPatientName(patient?.fullName || selectedTicket?.patientName || "Bệnh nhân");
      if (clinicId) {
        const { data } = await clinicDashboardApi.getQueue(clinicId);
        setQueue(data);
      }
      setSelectedTicket(null);
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err?.response?.data?.message || "Lỗi khi lưu hồ sơ khám." });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const LAB_TESTS = [
    "Complete Blood Count (CBC)",
    "Basic Metabolic Panel (BMP)",
    "Chest X-Ray (PA/Lateral)",
    "HbA1c Glycated Hgb",
    "Lipid Profile",
    "Urinalysis",
    "Liver Function Tests (LFT)",
    "Custom Order",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-4xl">folder_shared</span>
            Ghi nhận hồ sơ ngoại trú
          </h1>
          <p className="text-slate-500 mt-1">Chẩn đoán, ghi hồ sơ và chỉ định xét nghiệm cho bệnh nhân.</p>
        </div>

        {/* Quick search */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!topQuery) return;
            const q = topQuery.toLowerCase();
            if (queue?.tickets) {
              const found = queue.tickets.find((t: any) => (t.patientName || "").toLowerCase().includes(q) || String(t.number).includes(q));
              if (found) { setSelectedTicket(found); setTopQuery(""); return; }
            }
            try {
              const { data: clinics } = await clinicDashboardApi.getOverview();
              for (const c of clinics) {
                const { data: cq } = await clinicDashboardApi.getQueue(c.clinicId);
                const matched = cq.tickets.find((t: any) => (t.patientName || "").toLowerCase().includes(q) || String(t.number).includes(q));
                if (matched) { setClinicId(c.clinicId); setQueue(cq); setSelectedTicket(matched); setTopQuery(""); return; }
              }
              setMessage({ type: "error", text: "Không tìm thấy bệnh nhân." });
              setTimeout(() => setMessage(null), 3000);
            } catch { setMessage({ type: "error", text: "Lỗi khi tìm kiếm." }); setTimeout(() => setMessage(null), 3000); }
          }}
          className="flex gap-2 w-full md:w-auto"
        >
          <input
            value={topQuery}
            onChange={(e) => setTopQuery(e.target.value)}
            placeholder="Tìm nhanh theo tên hoặc số..."
            className="w-full md:w-64 rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none"
          />
          <button type="submit" className="px-4 py-2.5 bg-primary text-on-primary font-bold rounded-xl text-sm shadow-md shadow-primary/20 hover:bg-primary/95 transition-colors">
            Tìm
          </button>
          {topQuery && (
            <button type="button" onClick={() => setTopQuery("")} className="px-3 py-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 text-sm">✕</button>
          )}
        </form>
      </div>

      {/* Toast messages */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 shadow-sm border ${
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ── Left: Waiting list ── */}
        <div className="md:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5 mb-4">
            <span className="material-symbols-outlined text-slate-400">format_list_bulleted</span>
            Danh sách đang chờ
            {queue && (
              <span className="ml-auto text-xs font-bold px-2 py-0.5 bg-primary-container text-on-primary-container rounded-full">
                {queue.tickets.filter((t) => t.status === 0).length}
              </span>
            )}
          </h3>

          <div className="mb-3 flex gap-2">
            <input
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Lọc theo tên hoặc số..."
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none"
            />
            {localQuery && (
              <button type="button" onClick={() => setLocalQuery("")} className="px-3 py-2 rounded-xl border border-slate-200 text-slate-500 text-sm hover:bg-slate-50">✕</button>
            )}
          </div>

          <div className="space-y-2.5 max-h-[65vh] overflow-y-auto pr-1">
            {queue?.tickets
              .filter((t) => t.status === 0)
              .filter((t) => {
                if (!localQuery) return true;
                const q = localQuery.toLowerCase();
                return (t.patientName || "").toLowerCase().includes(q) || String(t.number).toLowerCase().includes(q);
              })
              .map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleSelectTicket(t)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all shadow-sm ${
                    selectedTicket?.id === t.id
                      ? "bg-primary/5 border-primary ring-2 ring-primary/20"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center font-extrabold text-base shrink-0">
                      #{t.number}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 truncate">{t.patientName || "Bệnh nhân vãng lai"}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-0.5 mt-0.5">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        {new Date(t.issuedAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {(!queue || queue.tickets.filter((t) => t.status === 0).filter((t) => {
              if (!localQuery) return true;
              const q = localQuery.toLowerCase();
              return (t.patientName || "").toLowerCase().includes(q) || String(t.number).includes(q);
            }).length === 0) && (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl text-slate-400">
                <span className="material-symbols-outlined text-3xl">hourglass_empty</span>
                <p className="text-sm mt-1 font-medium">Hàng đợi trống</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Patient + consultation form ── */}
        <div className="md:col-span-2">
          {!selectedTicket ? (
            <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center text-slate-400 min-h-[50vh] shadow-inner">
              <span className="material-symbols-outlined text-6xl text-slate-300">person_search</span>
              <h3 className="text-lg font-bold text-slate-600 mt-4">Chọn một bệnh nhân</h3>
              <p className="text-slate-400 text-sm max-w-xs mt-1">
                Chọn bệnh nhân từ danh sách bên trái để bắt đầu ghi nhận hồ sơ khám.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Patient sidebar */}
                <div className="md:col-span-1 space-y-5">
                  {/* Avatar + name */}
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center text-2xl font-extrabold shrink-0">
                      {(patient?.fullName || selectedTicket?.patientName || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-lg leading-tight">
                        {patient?.fullName || selectedTicket?.patientName || "Bệnh nhân"}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        ID: {(patient?.id || selectedTicket?.patientId || selectedTicket?.id || "—").slice(0, 8)}…
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 text-center">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tuổi/GT</div>
                      <div className="font-bold text-slate-700 mt-1">N/A</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 text-center">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nhóm máu</div>
                      <div className={`font-bold mt-1 ${bloodType ? "text-rose-600" : "text-slate-400"}`}>{bloodType || "—"}</div>
                    </div>
                  </div>

                  {/* Vitals */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                      <span className="material-symbols-outlined text-sm">monitor_heart</span>
                      Sinh hiệu gần đây
                    </h4>
                    <div className="space-y-2">
                      {vitals.map((v, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-150">
                          <span className="text-xs font-bold text-slate-400">{v.label}</span>
                          <span className="font-bold text-slate-700 text-sm">{v.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ICD-10 history */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                      <span className="material-symbols-outlined text-sm">history</span>
                      Lịch sử ICD-10
                    </h4>
                    <div className="space-y-1.5 max-h-44 overflow-y-auto">
                      {diagnosisHistory.length === 0 ? (
                        <div className="text-xs text-slate-400 italic p-3 rounded-xl bg-slate-50 border border-slate-150 text-center">
                          {selectedTicket?.patientId ? "Chưa có chẩn đoán trước đây." : "Chọn bệnh nhân có hồ sơ."}
                        </div>
                      ) : (
                        diagnosisHistory.map((item, idx) => (
                          <button
                            key={`${item.diagnosisCode}-${idx}`}
                            type="button"
                            onClick={() => handleSelectHistoryDiagnosis(item)}
                            className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-primary/5 border border-slate-150 hover:border-primary/30 transition-colors"
                          >
                            <div className="text-xs font-bold text-primary">
                              {item.diagnosisCode || "—"}
                              {item.diagnosisDescription ? ` — ${item.diagnosisDescription}` : ""}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              {new Date(item.visitDate).toLocaleDateString("vi-VN")}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Consultation form */}
                <div className="md:col-span-2">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5 mb-4 pb-3 border-b border-slate-100">
                    <span className="material-symbols-outlined text-primary">description</span>
                    Chi tiết khám bệnh
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Lý do khám chính</label>
                      <textarea
                        value={chiefComplaint}
                        onChange={(e) => setChiefComplaint(e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Mô tả triệu chứng</label>
                      <textarea
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none resize-none"
                      />
                    </div>

                    {/* ICD-10 autocomplete */}
                    <div ref={icdSearchRef} className="relative">
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-base text-slate-400">search</span>
                        Mã ICD-10
                        {icdSearching && <span className="ml-auto text-xs text-slate-400 font-normal animate-pulse">Đang tìm...</span>}
                      </label>
                      <input
                        type="text"
                        value={icdQuery}
                        onChange={(e) => setIcdQuery(e.target.value)}
                        onFocus={() => icdResults.length > 0 && setShowIcdDropdown(true)}
                        placeholder="Tìm mã hoặc tên bệnh (vd: I10, diabetes)..."
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none"
                        autoComplete="off"
                      />
                      {showIcdDropdown && icdResults.length > 0 && (
                        <ul className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg">
                          {icdResults.map((item) => (
                            <li key={item.code}>
                              <button
                                type="button"
                                onClick={() => handleSelectIcd(item)}
                                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm border-b border-slate-50 last:border-0"
                              >
                                <span className="font-bold text-primary">{item.code}</span>
                                <span className="text-slate-600"> — {item.description}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      {diagnosisCode && (
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm">
                          <span className="font-bold text-primary">{diagnosisCode}</span>
                          {diagnosisDescription && <span className="text-slate-600">— {diagnosisDescription}</span>}
                          <button
                            type="button"
                            onClick={() => { setDiagnosisCode(""); setDiagnosisDescription(""); setIcdQuery(""); }}
                            className="text-slate-400 hover:text-rose-500 ml-1 font-bold"
                          >×</button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Mô tả chẩn đoán</label>
                      <textarea
                        value={diagnosisDescription}
                        onChange={(e) => setDiagnosisDescription(e.target.value)}
                        placeholder="Mô tả chi tiết chẩn đoán lâm sàng..."
                        rows={3}
                        className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none resize-none"
                      />
                    </div>

                    {/* Lab tests */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150">
                      <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5 mb-3">
                        <span className="material-symbols-outlined text-base text-slate-400">biotech</span>
                        Chỉ định xét nghiệm / Chẩn đoán hình ảnh
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {LAB_TESTS.map((opt) => {
                          const checked = orderedTests.includes(opt);
                          return (
                            <label
                              key={opt}
                              className={`flex items-center gap-2.5 p-3 rounded-xl border bg-white cursor-pointer transition-all ${
                                checked ? "border-primary ring-1 ring-primary/30 bg-primary/5" : "border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => setOrderedTests((prev) => prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt])}
                                className="accent-primary"
                              />
                              <span className="text-xs font-medium text-slate-700">{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-on-primary font-bold rounded-xl shadow-md shadow-primary/20 hover:bg-primary/95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                        <span className="material-symbols-outlined text-base">save</span>
                        Lưu hồ sơ
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedTicket(null)}
                        className="px-5 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>

                  {/* Đơn thuốc đã kê section */}
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">medication</span>
                        Đơn thuốc đã kê
                        {patientPrescriptions.length > 0 && (
                          <span className="text-xs font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                            {patientPrescriptions.length}
                          </span>
                        )}
                      </h3>
                      <button
                        type="button"
                        onClick={openEPrescriptionForSelectedPatient}
                        className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 border border-primary/30 px-3 py-1.5 rounded-xl transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Kê đơn thuốc mới
                      </button>
                    </div>

                    {loadingPrescriptions ? (
                      <div className="flex items-center justify-center py-6 text-slate-400 text-sm gap-2">
                        <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                        <span>Đang tải danh sách đơn thuốc...</span>
                      </div>
                    ) : patientPrescriptions.length === 0 ? (
                      <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl text-slate-400">
                        <span className="material-symbols-outlined text-3xl text-slate-300">prescriptions</span>
                        <p className="text-sm font-semibold mt-1">Chưa có đơn thuốc nào được kê</p>
                        <p className="text-xs text-slate-400 mt-0.5 mb-3">Bệnh nhân chưa có đơn thuốc nào trong hồ sơ khám này.</p>
                        <button
                          type="button"
                          onClick={openEPrescriptionForSelectedPatient}
                          className="px-4 py-2 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-sm hover:bg-primary/95 transition-colors inline-flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">add_circle</span>
                          Kê đơn thuốc ngay
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {patientPrescriptions.map((rx) => (
                          <div key={rx.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-600 text-lg">task_alt</span>
                                <span className="font-bold text-sm text-slate-800">
                                  Ngày kê: {new Date(rx.issuedAt).toLocaleString("vi-VN")}
                                </span>
                              </div>
                              <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                                {rx.items.length} thuốc
                              </span>
                            </div>
                            {rx.notes && (
                              <p className="text-xs text-slate-500 mb-2"><strong>Ghi chú:</strong> {rx.notes}</p>
                            )}
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs text-left text-slate-600">
                                <thead>
                                  <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                                    <th className="py-1.5 w-8">#</th>
                                    <th className="py-1.5">Thuốc</th>
                                    <th className="py-1.5">Liều dùng</th>
                                    <th className="py-1.5">Tần suất</th>
                                    <th className="py-1.5">Số ngày</th>
                                    <th className="py-1.5 text-right">Số lượng</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {rx.items.map((item: any, idx: number) => (
                                    <tr key={idx} className="border-b border-slate-100 last:border-0">
                                      <td className="py-1.5 text-slate-400">{idx + 1}</td>
                                      <td className="py-1.5 font-bold text-primary">{item.drugName}</td>
                                      <td className="py-1.5">{item.dose || "—"}</td>
                                      <td className="py-1.5">{item.frequency || "—"}</td>
                                      <td className="py-1.5">{item.durationDays} ngày</td>
                                      <td className="py-1.5 text-right font-semibold">{item.quantity} {item.unit}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* E-Prescription panel — appears after successful diagnosis save or manual click */}
      {savedVisitId && staffProfileId && (
        <EPrescriptionPanel
          visitId={savedVisitId}
          doctorId={staffProfileId}
          patientName={savedPatientName}
          onClose={() => {
            const pid = selectedTicket?.patientId || patient?.id;
            setSavedVisitId(null);
            setSavedPatientName("");
            if (pid) loadPatientPrescriptions(pid);
          }}
        />
      )}
    </div>
  );
}
