import { useEffect, useState, useMemo } from "react";
import { clinicManagementApi } from "../api/services";
import type { Department, ClinicWithServices, MedicalService } from "../types";
import { useAuth } from "../context/AuthContext";
type ActiveTab = "departments" | "clinics" | "services";

export default function ManageServicesPage() {
    const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>("departments");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [clinics, setClinics] = useState<ClinicWithServices[]>([]);
  const [services, setServices] = useState<MedicalService[]>([]);

  // Load States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modals & Action States
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [deptForm, setDeptForm] = useState<{ id?: string; name: string; code: string; description: string }>({
    name: "", code: "", description: ""
  });

  const [isClinicModalOpen, setIsClinicModalOpen] = useState(false);
  const [clinicForm, setClinicForm] = useState<{ id?: string; departmentId: string; name: string; roomNumber: string; isActive: boolean }>({
    departmentId: "", name: "", roomNumber: "", isActive: true
  });

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceForm, setServiceForm] = useState<{ id?: string; departmentId: string; name: string; code: string; price: number; isActive: boolean }>({
    departmentId: "", name: "", code: "", price: 0, isActive: true
  });

  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [priceForm, setPriceForm] = useState<{ id: string; name: string; price: number }>({ id: "", name: "", price: 0 });

  const [submitting, setSubmitting] = useState(false);

  // Helper Maps for display
  const departmentMap = useMemo(() => new Map(departments.map(d => [d.id, d.name])), [departments]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [deptRes, clinicRes, serviceRes] = await Promise.all([
        clinicManagementApi.getDepartments(),
        clinicManagementApi.getClinics(),
        clinicManagementApi.getServices(),
      ]);
      setDepartments(deptRes.data);
      setClinics(clinicRes.data);
      setServices(serviceRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải dữ liệu quản lý.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // ---------------------------------------------------------------------------
  // Department Actions
  // ---------------------------------------------------------------------------
  const handleOpenCreateDept = () => {
    setDeptForm({ name: "", code: "", description: "" });
    setIsDeptModalOpen(true);
  };

  const handleOpenEditDept = (dept: Department) => {
    setDeptForm({
      id: dept.id,
      name: dept.name,
      code: dept.code || "",
      description: dept.description || ""
    });
    setIsDeptModalOpen(true);
  };

  const handleDeptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (deptForm.id) {
        await clinicManagementApi.updateDepartment(deptForm.id, deptForm);
        triggerSuccess(`Cập nhật khoa "${deptForm.name}" thành công.`);
      } else {
        await clinicManagementApi.createDepartment(deptForm);
        triggerSuccess(`Thêm mới khoa "${deptForm.name}" thành công.`);
      }
      setIsDeptModalOpen(false);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi khi xử lý khoa.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDept = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa khoa "${name}"?`)) return;
    try {
      await clinicManagementApi.deleteDepartment(id);
      triggerSuccess(`Xóa khoa "${name}" thành công.`);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể xóa khoa. Vui lòng kiểm tra ràng buộc phòng khám.");
      setTimeout(() => setError(null), 5000);
    }
  };

  // ---------------------------------------------------------------------------
  // Clinic Actions
  // ---------------------------------------------------------------------------
  const handleOpenCreateClinic = () => {
    setClinicForm({
      departmentId: departments[0]?.id || "",
      name: "",
      roomNumber: "",
      isActive: true
    });
    setIsClinicModalOpen(true);
  };

  const handleOpenEditClinic = (clinic: ClinicWithServices) => {
    setClinicForm({
      id: clinic.id,
      departmentId: clinic.departmentId,
      name: clinic.name,
      roomNumber: clinic.roomNumber || "",
      isActive: clinic.isActive
    });
    setIsClinicModalOpen(true);
  };

  const handleClinicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (clinicForm.id) {
        await clinicManagementApi.updateClinic(clinicForm.id, clinicForm);
        triggerSuccess(`Cập nhật phòng khám "${clinicForm.name}" thành công.`);
      } else {
        await clinicManagementApi.createClinic(clinicForm);
        triggerSuccess(`Thêm mới phòng khám "${clinicForm.name}" thành công.`);
      }
      setIsClinicModalOpen(false);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi khi xử lý phòng khám.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleClinic = async (id: string, name: string) => {
    try {
      const { data } = await clinicManagementApi.toggleClinicActive(id);
      triggerSuccess(`Đã chuyển trạng thái phòng "${name}" thành ${data.isActive ? "Hoạt động" : "Tạm ngưng"}.`);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi khi thay đổi trạng thái phòng khám.");
    }
  };

  const handleDeleteClinic = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa phòng khám "${name}"?`)) return;
    try {
      await clinicManagementApi.deleteClinic(id);
      triggerSuccess(`Xóa phòng khám "${name}" thành công.`);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể xóa phòng khám.");
    }
  };

  // ---------------------------------------------------------------------------
  // Service Actions
  // ---------------------------------------------------------------------------
  const handleOpenCreateService = () => {
    setServiceForm({
      departmentId: departments[0]?.id || "",
      name: "",
      code: "",
      price: 0,
      isActive: true
    });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (service: MedicalService) => {
    setServiceForm({
      id: service.id,
      departmentId: service.departmentId,
      name: service.name,
      code: service.code || "",
      price: service.price,
      isActive: service.isActive
    });
    setIsServiceModalOpen(true);
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (serviceForm.id) {
        await clinicManagementApi.updateService(serviceForm.id, serviceForm);
        triggerSuccess(`Cập nhật dịch vụ "${serviceForm.name}" thành công.`);
      } else {
        await clinicManagementApi.createService(serviceForm);
        triggerSuccess(`Thêm mới dịch vụ "${serviceForm.name}" thành công.`);
      }
      setIsServiceModalOpen(false);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi khi xử lý dịch vụ.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleService = async (id: string, name: string) => {
    try {
      const { data } = await clinicManagementApi.toggleServiceActive(id);
      triggerSuccess(`Đã chuyển trạng thái dịch vụ "${name}" thành ${data.isActive ? "Hoạt động" : "Tạm ngưng"}.`);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi khi thay đổi trạng thái dịch vụ.");
    }
  };

  const handleOpenUpdatePrice = (service: MedicalService) => {
    setPriceForm({
      id: service.id,
      name: service.name,
      price: service.price
    });
    setIsPriceModalOpen(true);
  };

  const handlePriceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await clinicManagementApi.updateServicePrice(priceForm.id, priceForm.price);
      triggerSuccess(`Cập nhật giá khám dịch vụ "${priceForm.name}" thành công.`);
      setIsPriceModalOpen(false);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi khi cập nhật giá dịch vụ.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteService = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa dịch vụ "${name}"?`)) return;
    try {
      await clinicManagementApi.deleteService(id);
      triggerSuccess(`Xóa dịch vụ "${name}" thành công.`);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể xóa dịch vụ.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-4xl">settings</span>
            Quản lý khoa & dịch vụ
          </h1>
          <p className="text-slate-500 mt-1">Cấu hình danh mục khoa phòng, cơ sở vật chất phòng khám và bảng giá dịch vụ.</p>
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

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("departments")}
          className={`py-3.5 px-6 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "departments"
              ? "border-primary text-primary"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span className="material-symbols-outlined text-lg">domain</span>
          Chuyên khoa ({departments.length})
        </button>
        <button
          onClick={() => setActiveTab("clinics")}
          className={`py-3.5 px-6 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "clinics"
              ? "border-primary text-primary"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span className="material-symbols-outlined text-lg">meeting_room</span>
          Phòng khám ({clinics.length})
        </button>
        <button
          onClick={() => setActiveTab("services")}
          className={`py-3.5 px-6 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "services"
              ? "border-primary text-primary"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span className="material-symbols-outlined text-lg">medical_services</span>
          Dịch vụ khám ({services.length})
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-150 rounded-2xl shadow-sm">
          <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
          <p className="mt-4 text-slate-500 font-medium">Đang tải cấu hình...</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* DEPARTMENTS TAB */}
          {activeTab === "departments" && (
            <div>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-lg">Danh sách khoa chuyên môn</h3>
                <button
                  onClick={handleOpenCreateDept}
                  className="flex items-center gap-1 px-4 py-2 bg-primary hover:bg-primary/95 text-on-primary text-sm font-semibold rounded-xl transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  Thêm khoa mới
                </button>
              </div>

              {departments.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <span className="material-symbols-outlined text-5xl">domain_disabled</span>
                  <p className="mt-2 text-sm">Chưa có khoa nào trong danh mục.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-150 text-left">
                    <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Mã khoa</th>
                        <th className="px-6 py-4">Tên khoa</th>
                        <th className="px-6 py-4">Mô tả chi tiết</th>
                        <th className="px-6 py-4 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {departments.map((dept) => (
                        <tr key={dept.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-primary">{dept.code || "N/A"}</td>
                          <td className="px-6 py-4 font-semibold text-slate-800">{dept.name}</td>
                          <td className="px-6 py-4 text-slate-500 max-w-sm truncate" title={dept.description}>
                            {dept.description || <span className="italic text-slate-350">Không có mô tả</span>}
                          </td>
                          <td className="px-6 py-4 text-right space-x-1">
                            <button
                              onClick={() => handleOpenEditDept(dept)}
                              className="p-1.5 text-slate-550 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteDept(dept.id, dept.name)}
                              className="p-1.5 text-slate-550 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* CLINICS TAB */}
          {activeTab === "clinics" && (
            <div>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-lg">Danh sách phòng khám bệnh</h3>
                <button
                  disabled={departments.length === 0}
                  onClick={handleOpenCreateClinic}
                  className="flex items-center gap-1 px-4 py-2 bg-primary hover:bg-primary/95 text-on-primary text-sm font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  Thêm phòng khám
                </button>
              </div>

              {clinics.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <span className="material-symbols-outlined text-5xl">meeting_room</span>
                  <p className="mt-2 text-sm">Chưa có phòng khám nào được cấu hình.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-150 text-left">
                    <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Số phòng</th>
                        <th className="px-6 py-4">Tên phòng</th>
                        <th className="px-6 py-4">Thuộc khoa</th>
                        <th className="px-6 py-4">Trạng thái</th>
                        <th className="px-6 py-4 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {clinics.map((clinic) => (
                        <tr key={clinic.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-850">
                            Phòng {clinic.roomNumber || "N/A"}
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-800">{clinic.name}</td>
                          <td className="px-6 py-4 text-slate-600">
                            {departmentMap.get(clinic.departmentId) || "Unknown Department"}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleClinic(clinic.id, clinic.name)}
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                                clinic.isActive
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100"
                                  : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${clinic.isActive ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                              {clinic.isActive ? "Hoạt động" : "Tạm ngưng"}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right space-x-1">
                            <button
                              onClick={() => handleOpenEditClinic(clinic)}
                              className="p-1.5 text-slate-550 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteClinic(clinic.id, clinic.name)}
                              className="p-1.5 text-slate-550 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* SERVICES TAB */}
          {activeTab === "services" && (
            <div>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-lg">Danh mục dịch vụ khám & giá tiền</h3>
                <button
                  disabled={departments.length === 0}
                  onClick={handleOpenCreateService}
                  className="flex items-center gap-1 px-4 py-2 bg-primary hover:bg-primary/95 text-on-primary text-sm font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  Thêm dịch vụ
                </button>
              </div>

              {services.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <span className="material-symbols-outlined text-5xl">medical_services</span>
                  <p className="mt-2 text-sm">Chưa cấu hình dịch vụ khám.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-150 text-left">
                    <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Mã DV</th>
                        <th className="px-6 py-4">Tên dịch vụ y tế</th>
                        <th className="px-6 py-4">Khoa phụ trách</th>
                        <th className="px-6 py-4 text-right">Giá khám</th>
                        <th className="px-6 py-4">Trạng thái</th>
                        <th className="px-6 py-4 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {services.map((srv) => (
                        <tr key={srv.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-500">{srv.code || "N/A"}</td>
                          <td className="px-6 py-4 font-semibold text-slate-800">{srv.name}</td>
                          <td className="px-6 py-4 text-slate-600">
                            {departmentMap.get(srv.departmentId) || "Unknown Department"}
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-slate-800 text-base">
                            <span className="flex items-center justify-end gap-1.5">
                              {srv.price.toLocaleString("vi-VN")} đ
                              <button
                                onClick={() => handleOpenUpdatePrice(srv)}
                                className="p-1 text-slate-450 hover:text-primary hover:bg-slate-100 rounded-md transition-colors"
                                title="Sửa giá khám"
                              >
                                <span className="material-symbols-outlined text-sm">edit_square</span>
                              </button>
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleService(srv.id, srv.name)}
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                                srv.isActive
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100"
                                  : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${srv.isActive ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                              {srv.isActive ? "Hoạt động" : "Tạm ngưng"}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right space-x-1">
                            <button
                              onClick={() => handleOpenEditService(srv)}
                              className="p-1.5 text-slate-550 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteService(srv.id, srv.name)}
                              className="p-1.5 text-slate-550 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* DEPARTMENT MODAL */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md border border-slate-150 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-2xl">domain</span>
                {deptForm.id ? "Sửa thông tin chuyên khoa" : "Thêm chuyên khoa mới"}
              </h3>
              <button
                onClick={() => setIsDeptModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleDeptSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Mã khoa</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: ENT, PED, NEUR..."
                  value={deptForm.code}
                  onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value })}
                  className="w-full rounded-xl border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tên khoa chuyên môn</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Khoa Tai Mũi Họng..."
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  className="w-full rounded-xl border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Mô tả chi tiết</label>
                <textarea
                  rows={3}
                  placeholder="Nhập mô tả giới thiệu về chuyên khoa..."
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                  className="w-full rounded-xl border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 text-slate-700"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDeptModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/10 disabled:opacity-50"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLINIC MODAL */}
      {isClinicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md border border-slate-150 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-2xl">meeting_room</span>
                {clinicForm.id ? "Sửa phòng khám" : "Tạo phòng khám mới"}
              </h3>
              <button
                onClick={() => setIsClinicModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleClinicSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Chuyên khoa trực thuộc</label>
                <select
                  required
                  value={clinicForm.departmentId}
                  onChange={(e) => setClinicForm({ ...clinicForm, departmentId: e.target.value })}
                  className="w-full rounded-xl border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 text-slate-700"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Số phòng</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Room 101, Phòng 204..."
                  value={clinicForm.roomNumber}
                  onChange={(e) => setClinicForm({ ...clinicForm, roomNumber: e.target.value })}
                  className="w-full rounded-xl border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tên phòng khám</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Phòng Khám Nhi 1..."
                  value={clinicForm.name}
                  onChange={(e) => setClinicForm({ ...clinicForm, name: e.target.value })}
                  className="w-full rounded-xl border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 text-slate-700"
                />
              </div>

              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="clinic-active"
                  checked={clinicForm.isActive}
                  onChange={(e) => setClinicForm({ ...clinicForm, isActive: e.target.checked })}
                  className="rounded border-slate-300 text-primary focus:ring-primary/25"
                />
                <label htmlFor="clinic-active" className="text-sm font-medium text-slate-700 select-none">
                  Cho phép hoạt động tiếp nhận
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsClinicModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/10 disabled:opacity-50"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SERVICE MODAL */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md border border-slate-150 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-2xl">medical_services</span>
                {serviceForm.id ? "Sửa dịch vụ khám" : "Tạo dịch vụ y tế mới"}
              </h3>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleServiceSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Khoa phụ trách</label>
                <select
                  required
                  value={serviceForm.departmentId}
                  onChange={(e) => setServiceForm({ ...serviceForm, departmentId: e.target.value })}
                  className="w-full rounded-xl border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 text-slate-700"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Mã DV</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: ENT01"
                    value={serviceForm.code}
                    onChange={(e) => setServiceForm({ ...serviceForm, code: e.target.value })}
                    className="w-full rounded-xl border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 text-slate-700"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Tên dịch vụ y tế</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Khám Tai Mũi Họng thường"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    className="w-full rounded-xl border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Giá khám (VNĐ)</label>
                <input
                  type="number"
                  required
                  min={0}
                  step={1000}
                  value={serviceForm.price}
                  onChange={(e) => setServiceForm({ ...serviceForm, price: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-xl border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 text-slate-700 font-bold text-slate-800"
                />
              </div>

              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="service-active"
                  checked={serviceForm.isActive}
                  onChange={(e) => setServiceForm({ ...serviceForm, isActive: e.target.checked })}
                  className="rounded border-slate-300 text-primary focus:ring-primary/25"
                />
                <label htmlFor="service-active" className="text-sm font-medium text-slate-700 select-none">
                  Cho phép đặt khám dịch vụ này
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/10 disabled:opacity-50"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE PRICE MODAL */}
      {isPriceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm border border-slate-150 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-2xl">edit_square</span>
                Cập nhật giá khám
              </h3>
              <button
                onClick={() => setIsPriceModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handlePriceSubmit} className="p-6 space-y-4">
              <div className="text-sm space-y-1">
                <p className="text-slate-500 font-medium">Dịch vụ điều chỉnh:</p>
                <p className="font-bold text-slate-850 text-base">{priceForm.name}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Giá tiền khám mới (VNĐ)</label>
                <input
                  type="number"
                  required
                  min={0}
                  step={1000}
                  autoFocus
                  value={priceForm.price}
                  onChange={(e) => setPriceForm({ ...priceForm, price: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-xl border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 text-slate-700 font-bold text-slate-800 text-lg py-2.5"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPriceModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/10 disabled:opacity-50"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
