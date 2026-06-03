import api from "./client";
import type {
  AuthResponse,
  Department,
  Clinic,
  ClinicWithServices,
  StaffProfile,
  UserAccount,
  PatientProfile,
  AppointmentRead,
  AppointmentWrite,
  QueueTicketDetail,
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
