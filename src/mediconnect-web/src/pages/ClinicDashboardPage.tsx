import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { clinicDashboardApi, clinicManagementApi, appointmentApi, userApi } from "../api/services";
import { useAuth } from "../context/AuthContext";
import type { ClinicQueueSummary, ClinicQueue, QueueTicketDetail, AppointmentRead, UserAccount } from "../types";
import { QueueStatus, AppointmentStatus } from "../types";

export default function ClinicDashboardPage() {
  const [summaries, setSummaries] = useState<ClinicQueueSummary[]>([]);
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const [selectedQueue, setSelectedQueue] = useState<ClinicQueue | null>(null);
  
  // Modals & Forms
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [checkInType, setCheckInType] = useState<"walk-in" | "appointment">("walk-in");
  const [walkInName, setWalkInName] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
  const [checkInClinicId, setCheckInClinicId] = useState("");
  
  const [transferTicket, setTransferTicket] = useState<QueueTicketDetail | null>(null);
  const [transferTargetClinicId, setTransferTargetClinicId] = useState("");

  const [appointments, setAppointments] = useState<AppointmentRead[]>([]);
  const [patientsMap, setPatientsMap] = useState<Map<string, string>>(new Map()); // patientProfileId -> fullName
  
  const [loading, setLoading] = useState(true);
  const [queueLoading, setQueueLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Load dashboard overview and helper data
  const loadOverview = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const { data } = await clinicDashboardApi.getOverview();
      setSummaries(data);
      if (selectedClinicId) {
        // If a clinic was selected, refresh its queue details too
        await loadQueueDetails(selectedClinicId);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải danh sách phòng khám.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const loadQueueDetails = async (clinicId: string) => {
    setQueueLoading(true);
    try {
      const { data } = await clinicDashboardApi.getQueue(clinicId);
      setSelectedQueue(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải chi tiết hàng đợi.");
    } finally {
      setQueueLoading(false);
    }
  };

  // Load appointments and patients for the check-in modal
  const loadCheckInData = async () => {
    try {
      const [aptRes, userRes] = await Promise.all([
        appointmentApi.getAll(),
        userApi.getAll(),
      ]);
      
      // Filter for requested/confirmed but not checked-in/completed appointments
      const activeApts = aptRes.data.filter(
        (a) => a.status === AppointmentStatus.Requested || a.status === AppointmentStatus.Confirmed
      );
      setAppointments(activeApts);

      const userMap = new Map<string, string>();
      userRes.data.forEach((u) => userMap.set(u.id, u.fullName));

      // Fetch patient profiles to map patientId to fullName.
      // Since booking API uses patientProfileId, we match patient profiles.
      // However, since we already have user details, let's build the mapping.
      // To keep it simple, we can fetch all patients or resolve from the list.
      // We will try our best to map. We will inject patient profile mappings.
      // Let's call the list of appointments and try to map user name if patient ID corresponds.
      // Actually, since appointment contains patientId, we can just resolve it.
      // Let's create a mapping from appointments.
      // Let's match appointments and user profiles or fallback to patient ID.
      setPatientsMap(new Map(userRes.data.map(u => [u.id, u.fullName])));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadOverview();
    loadCheckInData();
    
    // Auto-refresh every 10 seconds for real-time queue experience
    const interval = setInterval(() => {
      loadOverview(false);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [selectedClinicId]);

  const handleSelectClinic = (clinicId: string) => {
    setSelectedClinicId(clinicId);
    loadQueueDetails(clinicId);
  };

  const handleCallNext = async (clinicId: string) => {
    try {
      setQueueLoading(true);
      const { data } = await clinicDashboardApi.callNext(clinicId);
      if (data.ticket) {
        setSuccessMsg(`Đã gọi số thứ tự: ${data.ticket.number} (${data.ticket.patientName || "Bệnh nhân vãng lai"})`);
      } else {
        setSuccessMsg(data.message || "Hàng đợi hiện tại đã trống.");
      }
      await loadOverview(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi khi gọi bệnh nhân tiếp theo.");
    } finally {
      setQueueLoading(false);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const handleCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInClinicId) return;

    setSubmitting(true);
    setError(null);
    try {
      let payload: any = { clinicId: checkInClinicId };
      if (checkInType === "appointment") {
        if (!selectedAppointmentId) return;
        payload.appointmentId = selectedAppointmentId;
      } else {
        if (!walkInName.trim()) return;
        payload.patientName = walkInName.trim();
      }

      const { data } = await clinicDashboardApi.checkIn(payload);
      setSuccessMsg(`Đã phát số ${data.number} cho phòng ${data.clinicName}`);
      setIsCheckInOpen(false);
      setWalkInName("");
      setSelectedAppointmentId("");
      await loadOverview(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi khi phát số khám.");
    } finally {
      setSubmitting(false);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferTicket || !transferTargetClinicId) return;

    setSubmitting(true);
    setError(null);
    try {
      const { data } = await clinicDashboardApi.transferTicket(transferTicket.id, transferTargetClinicId);
      setSuccessMsg(`Đã chuyển vé số ${data.number} sang phòng khám ${data.clinicName}`);
      setTransferTicket(null);
      setTransferTargetClinicId("");
      await loadOverview(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi khi chuyển phòng khám.");
    } finally {
      setSubmitting(false);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const currentPatient = useMemo(() => {
    if (!selectedQueue) return null;
    return selectedQueue.tickets.find((t) => t.status === QueueStatus.InProgress) || null;
  }, [selectedQueue]);

  const waitingTickets = useMemo(() => {
    if (!selectedQueue) return [];
    return selectedQueue.tickets
      .filter((t) => t.status === QueueStatus.Waiting)
      .sort((a, b) => a.number - b.number);
  }, [selectedQueue]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header and Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-4xl">dashboard</span>
            Hàng đợi phòng khám
          </h1>
          <p className="text-slate-500 mt-1">Quản lý và điều phối luồng bệnh nhân theo thời gian thực.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadOverview(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
            Làm mới
          </button>
          <button
            onClick={() => {
              setIsCheckInOpen(true);
              if (selectedClinicId) setCheckInClinicId(selectedClinicId);
              else if (summaries.length > 0) setCheckInClinicId(summaries[0].clinicId);
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary/95 text-on-primary font-semibold rounded-xl transition-colors shadow-md shadow-primary/20"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Tiếp nhận bệnh nhân
          </button>
        </div>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-3 animate-fade-in shadow-sm">
          <span className="material-symbols-outlined text-emerald-600">check_circle</span>
          <span className="font-medium">{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-center gap-3 animate-fade-in shadow-sm">
          <span className="material-symbols-outlined text-rose-600">error</span>
          <span className="font-medium">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-rose-500 hover:text-rose-700">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-150 rounded-2xl shadow-sm">
          <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
          <p className="mt-4 text-slate-500 font-medium">Đang tải dữ liệu hàng đợi...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* List of clinics (Overview) */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-1.5 mb-2">
              <span className="material-symbols-outlined">meeting_room</span>
              Phòng khám đang hoạt động ({summaries.length})
            </h2>

            <div className="grid grid-cols-1 gap-4 max-h-[70vh] overflow-y-auto pr-2">
              {summaries.map((clinic) => {
                const isSelected = selectedClinicId === clinic.clinicId;
                return (
                  <div
                    key={clinic.clinicId}
                    onClick={() => handleSelectClinic(clinic.clinicId)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-sm flex flex-col justify-between ${
                      isSelected
                        ? "bg-primary/5 border-primary ring-2 ring-primary/20"
                        : "bg-white border-slate-200 hover:border-slate-350 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${clinic.isActive ? "bg-emerald-500" : "bg-slate-300"}`}></span>
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Phòng {clinic.roomNumber || "N/A"}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-800 mt-1 text-lg">{clinic.clinicName}</h3>
                      </div>
                      
                      {/* Ticket Count Badge */}
                      <div className="px-3.5 py-1 bg-primary-container text-on-primary-container rounded-full text-xs font-bold flex items-center gap-1 shadow-sm shrink-0">
                        <span className="material-symbols-outlined text-sm font-bold">hourglass_empty</span>
                        Chờ: {clinic.waitingCount}
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <span className="material-symbols-outlined text-slate-400 text-lg">play_circle</span>
                        <span>Đang khám:</span>
                        {clinic.currentNumber ? (
                          <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                            #{clinic.currentNumber}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Trống</span>
                        )}
                      </div>
                      
                      {clinic.currentPatientName && (
                        <span className="font-semibold text-slate-600 max-w-[140px] truncate" title={clinic.currentPatientName}>
                          {clinic.currentPatientName}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Queue for Selected Clinic */}
          <div className="lg:col-span-7">
            {selectedClinicId ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[50vh]">
                {queueLoading && !selectedQueue ? (
                  <div className="flex items-center justify-center h-full min-h-[30vh]">
                    <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
                  </div>
                ) : selectedQueue ? (
                  <div className="space-y-6">
                    {/* Selected Clinic Header */}
                    <div className="flex items-start justify-between border-b border-slate-150 pb-5 gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                            Phòng {selectedQueue.roomNumber || "N/A"}
                          </span>
                          <span className="text-emerald-500 text-sm font-semibold flex items-center gap-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Hoạt động
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mt-1">{selectedQueue.clinicName}</h2>
                      </div>
                      
                      {/* Call Next Patient Button */}
                      <button
                        onClick={() => handleCallNext(selectedQueue.clinicId)}
                        className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-emerald-600/10 shrink-0"
                      >
                        <span className="material-symbols-outlined font-bold">play_arrow</span>
                        Gọi tiếp theo
                      </button>
                    </div>

                    {/* Current Patient Section */}
                    <div className="bg-slate-50 border border-slate-150 rounded-2xl p-6">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm font-bold">medical_services</span>
                        Bệnh nhân đang khám
                      </h3>

                      {currentPatient ? (
                        <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-2xl flex flex-col items-center justify-center shadow-inner shrink-0">
                              <span className="text-xs font-bold tracking-wider opacity-75">SỐ</span>
                              <span className="text-3xl font-extrabold leading-none">{currentPatient.number}</span>
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-slate-850">{currentPatient.patientName || "Bệnh nhân vãng lai"}</h4>
                              <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm text-slate-400">schedule</span>
                                Vào khám lúc: {new Date(currentPatient.issuedAt).toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'})}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <button
                              onClick={() => {
                                setTransferTicket(currentPatient);
                                setTransferTargetClinicId("");
                              }}
                              className="px-4 py-2 text-sm font-semibold border border-slate-200 hover:border-slate-350 bg-white text-slate-700 rounded-xl transition-colors shadow-sm flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-sm">move_down</span>
                              Chuyển phòng
                            </button>
                            <button
                              onClick={() => {
                                // open outpatient record page for this patient
                                navigate('/outpatient-record', { state: { ticket: currentPatient, clinicId: selectedClinicId } });
                              }}
                              className="px-4 py-2 text-sm font-semibold border border-slate-200 hover:border-slate-350 bg-primary text-on-primary rounded-xl transition-colors shadow-sm flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-sm">medical_services</span>
                              Ghi khám
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 py-3 flex items-center gap-3 text-slate-450 italic">
                          <span className="material-symbols-outlined text-3xl">sentiment_dissatisfied</span>
                          <p className="text-sm font-medium">Hiện tại không có bệnh nhân nào đang trong phòng khám.</p>
                        </div>
                      )}
                    </div>

                    {/* Waiting Queue List */}
                    <div>
                      <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5 mb-4">
                        <span className="material-symbols-outlined">format_list_bulleted</span>
                        Danh sách chờ khám ({waitingTickets.length})
                      </h3>

                      {waitingTickets.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl text-slate-400">
                          <span className="material-symbols-outlined text-4xl">hourglass_empty</span>
                          <p className="mt-2 text-sm font-semibold text-slate-500">Hàng đợi đang trống</p>
                          <p className="text-xs mt-1">Sử dụng nút "Tiếp nhận bệnh nhân" để thêm bệnh nhân vào hàng đợi.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto rounded-xl border border-slate-150">
                          <table className="min-w-full divide-y divide-slate-150 text-left">
                            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                              <tr>
                                <th className="px-6 py-4">Số TT</th>
                                <th className="px-6 py-4">Tên bệnh nhân</th>
                                <th className="px-6 py-4">Giờ vào hàng</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100 text-sm">
                              {waitingTickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-6 py-4 font-bold text-slate-800 text-base">
                                    #{ticket.number}
                                  </td>
                                  <td className="px-6 py-4 font-semibold text-slate-700">
                                    {ticket.patientName || "Bệnh nhân vãng lai"}
                                  </td>
                                  <td className="px-6 py-4 text-slate-500">
                                    {new Date(ticket.issuedAt).toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'})}
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 bg-yellow-50 text-yellow-800 text-xs font-bold rounded-full border border-yellow-250">
                                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0"></span>
                                      Đang chờ
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <button
                                      onClick={() => {
                                        setTransferTicket(ticket);
                                        setTransferTargetClinicId("");
                                      }}
                                      className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition-all"
                                      title="Chuyển phòng khám"
                                    >
                                      <span className="material-symbols-outlined text-lg">move_down</span>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <span className="material-symbols-outlined text-5xl">warning</span>
                    <p className="mt-2 text-sm">Đã có lỗi xảy ra khi tải dữ liệu hàng đợi.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center text-slate-400 min-h-[50vh] shadow-inner">
                <span className="material-symbols-outlined text-6xl text-slate-300">room_service</span>
                <h3 className="text-lg font-bold text-slate-600 mt-4">Chọn một phòng khám</h3>
                <p className="text-slate-400 text-sm max-w-sm mt-1">
                  Chọn một phòng khám từ danh sách bên trái để xem chi tiết hàng đợi và bắt đầu điều phối bệnh nhân.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHECK-IN MODAL */}
      {isCheckInOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg border border-slate-150 overflow-hidden transform transition-all">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-2xl">how_to_reg</span>
                Tiếp nhận & phát số khám
              </h3>
              <button
                onClick={() => setIsCheckInOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCheckInSubmit} className="p-6 space-y-6">
              {/* Target Clinic Room Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Chọn phòng khám tiếp nhận</label>
                <select
                  required
                  value={checkInClinicId}
                  onChange={(e) => setCheckInClinicId(e.target.value)}
                  className="w-full rounded-xl border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 text-slate-700 py-3"
                >
                  <option value="" disabled>-- Chọn phòng khám --</option>
                  {summaries.map((c) => (
                    <option key={c.clinicId} value={c.clinicId}>
                      Phòng {c.roomNumber || "N/A"} - {c.clinicName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Loại tiếp nhận</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setCheckInType("walk-in")}
                    className={`py-3 px-4 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      checkInType === "walk-in"
                        ? "bg-primary/5 border-primary text-primary shadow-sm"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">person_add</span>
                    Bệnh nhân vãng lai
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckInType("appointment");
                      loadCheckInData();
                    }}
                    className={`py-3 px-4 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      checkInType === "appointment"
                        ? "bg-primary/5 border-primary text-primary shadow-sm"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">event_available</span>
                    Theo lịch hẹn trước
                  </button>
                </div>
              </div>

              {/* Walk-in patient details */}
              {checkInType === "walk-in" ? (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Họ và tên bệnh nhân</label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập đầy đủ họ và tên..."
                    value={walkInName}
                    onChange={(e) => setWalkInName(e.target.value)}
                    className="w-full rounded-xl border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 text-slate-700 py-3"
                  />
                </div>
              ) : (
                /* Appointment check-in selection */
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Chọn lịch hẹn trong ngày</label>
                  {appointments.length === 0 ? (
                    <div className="p-4 bg-slate-50 text-slate-500 rounded-xl border text-center text-sm">
                      <span className="material-symbols-outlined text-2xl block text-slate-400">event_busy</span>
                      Không có lịch hẹn nào đang chờ check-in.
                    </div>
                  ) : (
                    <select
                      required
                      value={selectedAppointmentId}
                      onChange={(e) => setSelectedAppointmentId(e.target.value)}
                      className="w-full rounded-xl border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 text-slate-700 py-3"
                    >
                      <option value="" disabled>-- Chọn lịch hẹn bệnh nhân --</option>
                      {appointments.map((apt) => {
                        const patientName = patientsMap.get(apt.patientId) || `Bệnh nhân (${apt.patientId.slice(0,8)})`;
                        const timeStr = new Date(apt.appointmentTime).toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'});
                        return (
                          <option key={apt.id} value={apt.id}>
                            [{timeStr}] {patientName} - {apt.reason || "Khám tổng quát"}
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCheckInOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting || (checkInType === "appointment" && !selectedAppointmentId)}
                  className="px-6 py-2.5 bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {submitting && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                  Xác nhận & phát số
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TRANSFER MODAL */}
      {transferTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md border border-slate-150 overflow-hidden transform transition-all">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-2xl">move_down</span>
                Chuyển phòng khám
              </h3>
              <button
                onClick={() => setTransferTicket(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="p-6 space-y-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 text-sm space-y-1">
                <p className="text-slate-500 font-medium">Bệnh nhân cần chuyển:</p>
                <p className="font-bold text-slate-800 text-lg">
                  #{transferTicket.number} - {transferTicket.patientName || "Bệnh nhân vãng lai"}
                </p>
                <p className="text-xs text-slate-400 mt-1">Phòng hiện tại: {transferTicket.clinicName}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Chọn phòng khám chuyển đến</label>
                <select
                  required
                  value={transferTargetClinicId}
                  onChange={(e) => setTransferTargetClinicId(e.target.value)}
                  className="w-full rounded-xl border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 text-slate-700 py-3"
                >
                  <option value="" disabled>-- Chọn phòng khám đích --</option>
                  {summaries
                    .filter((c) => c.clinicId !== transferTicket.clinicId) // Do not show current clinic
                    .map((c) => (
                      <option key={c.clinicId} value={c.clinicId}>
                        Phòng {c.roomNumber || "N/A"} - {c.clinicName}
                      </option>
                    ))}
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setTransferTicket(null)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting || !transferTargetClinicId}
                  className="px-6 py-2.5 bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {submitting && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                  Chuyển phòng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
