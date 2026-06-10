import api from "./client";
import type {
  AuthResponse,
  Department,
  Clinic,
  ClinicWithServices,
  StaffProfile,
  UserAccount,
  PatientProfile,
  PatientHistoryDto,
  AppointmentRead,
  AppointmentWrite,
  QueueTicketDetail,
  ClinicQueueSummary,
  ClinicQueue,
  MedicalService,
  LabOrder,
  PrescriptionItem,
  Drug,
} from "../types";

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { email, password }),
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    role?: number;
  }) => api.post<AuthResponse>("/auth/register", data),
};

export const departmentApi = {
  getAll: () => api.get<Department[]>("/departments"),
};

export const clinicApi = {
  getActive: () => api.get<Clinic[]>("/clinics/active"),
  getServices: (clinicId: string) =>
    api.get<ClinicWithServices>(`/clinics/${clinicId}/services`),
};

export const staffApi = {
  getAll: () => api.get<StaffProfile[]>("/staff"),
  getById: (id: string) => api.get<StaffProfile>(`/staff/${id}`),
};

export const userApi = {
  getAll: () => api.get<UserAccount[]>("/users"),
  getById: (id: string) => api.get<UserAccount>(`/users/${id}`),
};

export const patientApi = {
  getMe: () => api.get<PatientProfile>("/patients/me"),
  create: (data: { userAccountId: string }) =>
    api.post<PatientProfile>("/patients", data),
  getHistory: (id: string) =>
    api.get<PatientHistoryDto>(`/patients/${id}/history`),
};

export const phrApi = {
  getAllLabOrders: () => api.get<LabOrder[]>("/LabOrders"),
  getAllPrescriptionItems: () => api.get<PrescriptionItem[]>("/PrescriptionItems"),
  getAllDrugs: () => api.get<Drug[]>("/drugs"),
  getAllClinics: () => api.get<Clinic[]>("/clinics"),
};

export const appointmentApi = {
  getAll: () => api.get<AppointmentRead[]>("/appointments"),
  getById: (id: string) => api.get<AppointmentRead>(`/appointments/${id}`),
  create: (data: AppointmentWrite) =>
    api.post<AppointmentRead>("/appointments", data),
  updateStatus: (id: string, status: number) =>
    api.patch(`/appointments/${id}/status`, { status }),
};

export const queueApi = {
  checkIn: (clinicId: string, appointmentId?: string) =>
    api.post<QueueTicketDetail>("/queue/check-in", {
      clinicId,
      appointmentId,
    }),
};

export const clinicDashboardApi = {
  getOverview: () =>
    api.get<ClinicQueueSummary[]>("/clinic-dashboard/overview"),
  getQueue: (clinicId: string) =>
    api.get<ClinicQueue>(`/clinic-dashboard/clinics/${clinicId}/queue`),
  checkIn: (data: { clinicId: string; appointmentId?: string; patientName?: string }) =>
    api.post<QueueTicketDetail>("/clinic-dashboard/check-in", data),
  callNext: (clinicId: string) =>
    api.post<{ message: string; ticket: QueueTicketDetail | null }>(`/clinic-dashboard/clinics/${clinicId}/call-next`),
  transferTicket: (ticketId: string, targetClinicId: string) =>
    api.patch<QueueTicketDetail>(`/clinic-dashboard/tickets/${ticketId}/transfer`, { targetClinicId }),
};

export const clinicManagementApi = {
  // Departments
  getDepartments: () =>
    api.get<Department[]>("/clinic-management/departments"),
  getDepartmentById: (id: string) =>
    api.get<Department>(`/clinic-management/departments/${id}`),
  createDepartment: (data: { name: string; code?: string; description?: string }) =>
    api.post<Department>("/clinic-management/departments", data),
  updateDepartment: (id: string, data: { name: string; code?: string; description?: string }) =>
    api.put(`/clinic-management/departments/${id}`, data),
  deleteDepartment: (id: string) =>
    api.delete(`/clinic-management/departments/${id}`),

  // Clinics
  getClinics: () =>
    api.get<ClinicWithServices[]>("/clinic-management/clinics"),
  getClinicById: (id: string) =>
    api.get<ClinicWithServices>(`/clinic-management/clinics/${id}`),
  createClinic: (data: { departmentId: string; name: string; roomNumber?: string; isActive?: boolean }) =>
    api.post<Clinic>("/clinic-management/clinics", data),
  updateClinic: (id: string, data: { departmentId: string; name: string; roomNumber?: string; isActive?: boolean }) =>
    api.put(`/clinic-management/clinics/${id}`, data),
  toggleClinicActive: (id: string) =>
    api.patch<{ id: string; isActive: boolean }>(`/clinic-management/clinics/${id}/toggle-active`),
  deleteClinic: (id: string) =>
    api.delete(`/clinic-management/clinics/${id}`),

  // Services
  getServices: (departmentId?: string, activeOnly?: boolean) =>
    api.get<MedicalService[]>("/clinic-management/services", {
      params: { departmentId, activeOnly },
    }),
  getServiceById: (id: string) =>
    api.get<MedicalService>(`/clinic-management/services/${id}`),
  createService: (data: { departmentId: string; name: string; code?: string; price: number; isActive?: boolean }) =>
    api.post<MedicalService>("/clinic-management/services", data),
  updateService: (id: string, data: { departmentId: string; name: string; code?: string; price: number; isActive?: boolean }) =>
    api.put(`/clinic-management/services/${id}`, data),
  updateServicePrice: (id: string, price: number) =>
    api.patch<{ id: string; price: number }>(`/clinic-management/services/${id}/price`, { price }),
  toggleServiceActive: (id: string) =>
    api.patch<{ id: string; isActive: boolean }>(`/clinic-management/services/${id}/toggle-active`),
  deleteService: (id: string) =>
    api.delete(`/clinic-management/services/${id}`),
};

