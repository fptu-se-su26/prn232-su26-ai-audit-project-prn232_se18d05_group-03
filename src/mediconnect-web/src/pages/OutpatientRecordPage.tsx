import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { medicalRecordApi, clinicDashboardApi, userApi, outpatientApi, staffApi, patientApi } from "../api/services";
import type { ClinicQueue, QueueTicketDetail, Icd10Result, PatientDiagnosisHistory } from "../types";
import { useAuth } from "../context/AuthContext";

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
  const [message, setMessage] = useState<string | null>(null);
  const [localQuery, setLocalQuery] = useState<string>("");
  const [topQuery, setTopQuery] = useState<string>("");

  useEffect(() => {
    // load first available clinic overview and pick the first clinic
    (async () => {
      try {
        const { data } = await clinicDashboardApi.getOverview();
        if (data.length > 0) {
          setClinicId(data[0].clinicId);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    if (!clinicId) return;
    (async () => {
      try {
        const { data } = await clinicDashboardApi.getQueue(clinicId);
        setQueue(data);
        // if navigation provided a searchQuery, try auto-select matching ticket
        const state: any = loc.state;
        const q = state?.searchQuery?.toLowerCase?.();
        if (q) {
          const matched = data.tickets.find((t: any) => (t.patientName || "").toLowerCase().includes(q) || (t.number + "").toLowerCase().includes(q));
          if (matched) setSelectedTicket(matched);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [clinicId]);

  useEffect(() => {
    // if navigation provided a ticket via state, preselect it
    const state: any = loc.state;
    if (state?.ticket) {
      setSelectedTicket(state.ticket as QueueTicketDetail);
      if (state?.clinicId) setClinicId(state.clinicId as string);
    }
  }, [loc.state]);

  useEffect(() => {
    // when selected ticket changes, try to load patient basic info and recent vitals if available
    (async () => {
      if (!selectedTicket) {
        setPatient(null);
        setVitals([]);
        setBloodType(null);
        return;
      }
      try {
        if (selectedTicket.patientId) {
          const { data } = await userApi.getById(selectedTicket.patientId);
          setPatient(data);
          // blood type & vitals not available from userApi; keep placeholders
          setBloodType(null);
          setVitals([
            { label: "BP", value: "- / -", note: "" },
            { label: "Temp", value: "- °C", note: "" },
            { label: "HR", value: "- BPM", note: "" },
          ]);
        }
      } catch (err) {
        console.error("failed to load patient", err);
        setPatient(null);
      }
    })();
  }, [selectedTicket]);

  useEffect(() => {
    if (!selectedTicket?.patientId) {
      setDiagnosisHistory([]);
      return;
    }

    (async () => {
      try {
        const { data } = await medicalRecordApi.getDiagnosisHistory(selectedTicket.patientId!);
        setDiagnosisHistory(data);
      } catch (err) {
        console.error("failed to load diagnosis history", err);
        setDiagnosisHistory([]);
      }
    })();
  }, [selectedTicket?.patientId]);

  useEffect(() => {
    if (icdQuery.trim().length < 2) {
      setIcdResults([]);
      setIcdSearching(false);
      return;
    }

    setIcdSearching(true);
    const timer = window.setTimeout(async () => {
      try {
        const { data } = await medicalRecordApi.searchIcd10(icdQuery.trim());
        setIcdResults(data);
        setShowIcdDropdown(true);
      } catch (err) {
        console.error("ICD-10 search failed", err);
        setIcdResults([]);
      } finally {
        setIcdSearching(false);
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [icdQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (icdSearchRef.current && !icdSearchRef.current.contains(e.target as Node)) {
        setShowIcdDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // resolve staff profile id for current user (StaffProfile.Id) so we use correct FK for doctorId
    (async () => {
      if (!user) return;
      try {
        const { data } = await staffApi.getDirectory();
        const me = data.find((s: any) => s.userId === user.id);
        if (me) setStaffProfileId(me.id);
        else {
          console.debug("No staff profile found for user", user.id);
          setStaffProfileId(null);
        }
      } catch (err) {
        console.error("failed to resolve staff profile", err);
        setStaffProfileId(null);
      }
    })();
  }, [user]);

  const handleSelectTicket = (t: QueueTicketDetail) => {
    setSelectedTicket(t);
    setChiefComplaint("");
    setSymptoms("");
    setDiagnosisCode("");
    setDiagnosisDescription("");
    setIcdQuery("");
    setIcdResults([]);
    setShowIcdDropdown(false);
    setOrderedTests([]);
    setMessage(null);
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
    setIcdQuery(
      item.diagnosisCode && item.diagnosisDescription
        ? `${item.diagnosisCode} - ${item.diagnosisDescription}`
        : item.diagnosisCode || item.diagnosisDescription || ""
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !user) return;
    setSubmitting(true);
    try {
      const payload = {
        visitId: selectedTicket.appointmentId || selectedTicket.id,
        // backend expects StaffProfile.Id (DoctorId FK), not UserAccount.Id
        doctorId: staffProfileId || user.id,
        chiefComplaint,
        symptoms,
        diagnosisCode: diagnosisCode || undefined,
        diagnosisDescription,
        orderedTests: orderedTests.slice(),
        notes: undefined,
      };
      // debug payload
      // eslint-disable-next-line no-console
      console.debug("diagnose payload", payload);
    try {
      await medicalRecordApi.diagnose(payload);
    } catch (err: any) {
      // debug log
      // eslint-disable-next-line no-console
      console.debug("diagnose error response", err?.response?.data, err?.response?.status);
      // if visit not found (maybe appointmentId or visitId is not an existing OutpatientVisit), create one
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.message ?? err?.response?.data ?? err?.message;
      // handle backend that throws 500 for missing visit (message contains our text) or returns 404
      if (
        status === 404 ||
        (status === 500 && typeof serverMsg === "string" && serverMsg.includes("Outpatient visit not found")) ||
        (err?.response?.data?.message && err.response.data.message.includes("Outpatient visit not found"))
      ) {
        // create visit first
        let patientIdToUse = selectedTicket.patientId || patient?.id || null;
        if (!patientIdToUse && user) {
          // try to fetch existing PatientProfile for current user before creating to avoid duplicate key
          try {
            const { data: me } = await patientApi.getMe();
            if (me && me.id) {
              // eslint-disable-next-line no-console
              console.debug("found existing patient profile for user", me);
              patientIdToUse = me.id;
            }
          } catch (err: any) {
            // if getMe fails (not found), then create; otherwise surface error
            const status = err?.response?.status;
            if (status === 404 || status === 400 || !status) {
              try {
                // eslint-disable-next-line no-console
                console.debug("attempting to create patient profile for user", user.id);
                const createdPatient = await patientApi.create({ userAccountId: user.id });
                const createdData = createdPatient?.data ?? createdPatient;
                // eslint-disable-next-line no-console
                console.debug("created patient profile", createdData);
                patientIdToUse = createdData.id;
              } catch (e) {
                console.error("failed to create patient profile", e);
                throw e;
              }
            } else {
              console.error("failed to resolve patient profile", err);
              throw err;
            }
          }
        }

        const createPayload = {
          patientId: patientIdToUse,
          // use resolved staffProfileId when available
          doctorId: staffProfileId || user.id,
          clinicId: clinicId || selectedTicket.clinicId,
          queueTicketId: selectedTicket.id,
          visitDate: new Date().toISOString(),
          status: 0,
          notes: undefined,
        } as any;
        // eslint-disable-next-line no-console
        console.debug("create outpatient visit payload", createPayload);
        const createResp = await outpatientApi.create(createPayload as any);
        // eslint-disable-next-line no-console
        console.debug("createResp", createResp?.data ?? createResp);
        const created = createResp?.data ?? createResp;
        if (!created || !created.id) throw new Error("Outpatient create did not return id");
        payload.visitId = created.id;
        // eslint-disable-next-line no-console
        console.debug("retry diagnose payload", payload);
        await medicalRecordApi.diagnose(payload);
      } else {
        throw err;
      }
    }
      setMessage("Đã lưu hồ sơ khám cho bệnh nhân.");
      // refresh queue
      if (clinicId) {
        const { data } = await clinicDashboardApi.getQueue(clinicId);
        setQueue(data);
      }
      setSelectedTicket(null);
    } catch (err: any) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Lỗi khi lưu hồ sơ khám.");
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <form onSubmit={async (e) => {
        e.preventDefault();
        if (!topQuery) return;
        // try current queue first
        const q = topQuery.toLowerCase();
        let found: any = null;
        if (queue?.tickets) {
          found = queue.tickets.find((t: any) => (t.patientName || "").toLowerCase().includes(q) || String(t.number).toLowerCase().includes(q));
          if (found) {
            setSelectedTicket(found);
            setLocalQuery("");
            return;
          }
        }
        // fallback: scan all clinics
        try {
          const { data: clinics } = await clinicDashboardApi.getOverview();
          for (const c of clinics) {
            try {
              const { data: cq } = await clinicDashboardApi.getQueue(c.clinicId);
              const matched = cq.tickets.find((t: any) => (t.patientName || "").toLowerCase().includes(q) || String(t.number).toLowerCase().includes(q));
              if (matched) {
                setClinicId(c.clinicId);
                setQueue(cq);
                setSelectedTicket(matched);
                setLocalQuery("");
                return;
              }
            } catch (err) {
              // ignore per-clinic failures
            }
          }
          setMessage("Không tìm thấy bệnh nhân.");
          setTimeout(() => setMessage(null), 3000);
        } catch (err) {
          console.error(err);
          setMessage("Lỗi khi tìm kiếm.");
          setTimeout(() => setMessage(null), 3000);
        }
      }} className="mb-4">
        <div className="flex gap-3">
          <input value={topQuery} onChange={e => setTopQuery(e.target.value)} placeholder="Tìm nhanh bệnh nhân (tên hoặc số)" className="w-full border rounded-lg px-3 py-2" />
          <button type="submit" className="px-4 py-2 bg-primary text-on-primary rounded-lg">Tìm</button>
          {topQuery && <button type="button" onClick={() => setTopQuery("")} className="px-3 py-2 border rounded-lg">X</button>}
        </div>
      </form>
      <h1 className="text-2xl font-bold mb-4">Ghi nhận hồ sơ ngoại trú</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Waiting list */}
        <div className="md:col-span-1 bg-white p-4 rounded-xl border">
          <h3 className="font-semibold mb-3">Danh sách đang chờ</h3>
          <div className="mb-3 flex gap-2">
            <input
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Tìm bệnh nhân hoặc số..."
              className="w-full border rounded-full px-3 py-2 text-sm"
            />
            {localQuery && (
              <button type="button" onClick={() => setLocalQuery("")} className="px-3 py-2 rounded-full border text-sm">X</button>
            )}
          </div>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto">
            {queue?.tickets
              .filter(t => t.status === 0)
              .filter(t => {
                if (!localQuery) return true;
                const q = localQuery.toLowerCase();
                return (t.patientName || "").toLowerCase().includes(q) || String(t.number).toLowerCase().includes(q);
              })
              .map(t => (
                <div key={t.id} className="p-3 border rounded-lg cursor-pointer hover:shadow-md bg-slate-50" onClick={() => handleSelectTicket(t)}>
                  <div className="font-bold">#{t.number} {t.patientName || 'Bệnh nhân vãng lai'}</div>
                  <div className="text-xs text-slate-500">Vào lúc {new Date(t.issuedAt).toLocaleString()}</div>
                </div>
              ))}

            {(!queue || queue.tickets.filter(t => t.status === 0).filter(t => {
              if (!localQuery) return true; const q = localQuery.toLowerCase(); return (t.patientName || "").toLowerCase().includes(q) || String(t.number).toLowerCase().includes(q);
            }).length === 0) && (
              <div className="text-sm text-slate-500 italic">Không có bệnh nhân chờ.</div>
            )}
          </div>
        </div>

        
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-xl border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* patient overview */}
              <div className="md:col-span-1">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                    {patient?.fullName ? (
                      <span className="text-lg font-bold text-slate-600">{patient.fullName.charAt(0)}</span>
                    ) : (
                      <span className="text-sm text-slate-400">No</span>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{patient?.fullName || selectedTicket?.patientName || 'Bệnh nhân'}</div>
                    <div className="text-xs text-slate-500 mt-1">ID: {patient?.id || selectedTicket?.patientId || selectedTicket?.id}</div>
                  </div>
                </div>

                <div className="mt-6 text-sm text-slate-600 grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-slate-400">AGE/SEX</div>
                    <div className="font-bold mt-1">N/A</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">BLOOD TYPE</div>
                    <div className="font-semibold text-red-600 mt-1">{bloodType || 'Unknown'}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-3">RECENT VITALS</h4>
                  <div className="space-y-3">
                    {vitals.map((v, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-lg border">
                        <div className="text-xs text-slate-400">{v.label}</div>
                        <div className="font-bold">{v.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-3">ICD-10 HISTORY</h4>
                  <div className="space-y-2 text-sm text-slate-600 max-h-40 overflow-y-auto">
                    {diagnosisHistory.length === 0 ? (
                      <div className="text-xs text-slate-400 italic p-2 rounded-md bg-slate-50">
                        {selectedTicket?.patientId ? "Chưa có chẩn đoán ICD trước đây." : "Chọn bệnh nhân có hồ sơ để xem lịch sử."}
                      </div>
                    ) : (
                      diagnosisHistory.map((item, idx) => (
                        <button
                          key={`${item.diagnosisCode}-${item.visitDate}-${idx}`}
                          type="button"
                          onClick={() => handleSelectHistoryDiagnosis(item)}
                          className="w-full text-left p-2 rounded-md bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-primary/30 transition-colors"
                        >
                          <div className="font-medium">
                            {item.diagnosisCode || "—"}
                            {item.diagnosisDescription ? ` - ${item.diagnosisDescription}` : ""}
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

              {/* consultation form */}
              <div className="md:col-span-2">
                <h3 className="font-semibold mb-3">Chi tiết khám</h3>
                {!selectedTicket ? (
                  <div className="text-sm text-slate-500">Chọn một bệnh nhân từ danh sách bên trái để bắt đầu.</div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Triệu chứng chính</label>
                      <textarea value={chiefComplaint} onChange={e => setChiefComplaint(e.target.value)} className="w-full border rounded-lg p-2 h-24" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Mô tả triệu chứng</label>
                      <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)} className="w-full border rounded-lg p-2 h-24" />
                    </div>

                    <div ref={icdSearchRef} className="relative">
                      <label className="block text-sm font-medium mb-1">Mã ICD-10</label>
                      <input
                        type="text"
                        value={icdQuery}
                        onChange={(e) => setIcdQuery(e.target.value)}
                        onFocus={() => icdResults.length > 0 && setShowIcdDropdown(true)}
                        placeholder="Tìm mã hoặc tên bệnh (vd: I10, diabetes, hypertension)..."
                        className="w-full border rounded-lg px-3 py-2"
                        autoComplete="off"
                      />
                      {icdSearching && (
                        <div className="absolute right-3 top-9 text-xs text-slate-400">Đang tìm...</div>
                      )}
                      {showIcdDropdown && icdResults.length > 0 && (
                        <ul className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto bg-white border rounded-lg shadow-lg">
                          {icdResults.map((item) => (
                            <li key={item.code}>
                              <button
                                type="button"
                                onClick={() => handleSelectIcd(item)}
                                className="w-full text-left px-3 py-2 hover:bg-slate-50 text-sm"
                              >
                                <span className="font-semibold text-primary">{item.code}</span>
                                <span className="text-slate-600"> — {item.description}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      {diagnosisCode && (
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-sm">
                          <span className="font-semibold">{diagnosisCode}</span>
                          {diagnosisDescription && <span className="text-slate-600">— {diagnosisDescription}</span>}
                          <button
                            type="button"
                            onClick={() => {
                              setDiagnosisCode("");
                              setDiagnosisDescription("");
                              setIcdQuery("");
                            }}
                            className="text-slate-400 hover:text-slate-600 ml-1"
                            aria-label="Xóa chẩn đoán ICD"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Mô tả chẩn đoán</label>
                      <textarea
                        value={diagnosisDescription}
                        onChange={(e) => setDiagnosisDescription(e.target.value)}
                        placeholder="Mô tả chi tiết chẩn đoán lâm sàng..."
                        className="w-full border rounded-lg p-2 h-24"
                      />
                    </div>

                    <div className="mt-4 p-4 border rounded-lg bg-slate-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold">Order Lab Tests / Imaging</div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                        {[
                          "Complete Blood Count (CBC)",
                          "Basic Metabolic Panel (BMP)",
                          "Chest X-Ray (PA/Lateral)",
                          "HbA1c Glycated Hgb",
                          "Lipid Profile",
                          "Urinalysis",
                          "Liver Function Tests (LFT)",
                          "Custom Order",
                        ].map((opt) => {
                          const checked = orderedTests.includes(opt);
                          return (
                            <label key={opt} className={`flex items-center gap-3 p-3 border rounded-lg bg-white ${checked ? 'ring-2 ring-primary/30' : ''}`}>
                              <input type="checkbox" checked={checked} onChange={() => {
                                setOrderedTests(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]);
                              }} />
                              <div className="text-sm">{opt}</div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold">Lưu hồ sơ</button>
                      <button type="button" onClick={() => setSelectedTicket(null)} className="px-4 py-2 border rounded-lg">Hủy</button>
                    </div>

                    {message && <div className="p-3 bg-slate-50 rounded-lg">{message}</div>}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
