import api from "./client";
import type {
  AuthResponse,
  Department,
  Clinic,
  ClinicWithServices,
  StaffProfile,
  StaffDirectory,
  UserAccount,
  PatientProfile,
  AppointmentRead,
  AppointmentWrite,
  QueueTicketDetail,
  ScheduleFlat,
  ScheduleWrite,
  PagedResult,
  ClinicQueueSummary,
  ClinicQueue,
  MedicalService,
  SummaryReport,
  RevenueItem,
  BedOccupancyReport,
  OutpatientVisitItem,
  UserRole,
  Drug,
  DrugInteraction,
  DoseCheckResult,
  OtpSetting,
  OtpCode,
  Icd10Result,
  PatientDiagnosisHistory,
  PatientHistoryDto,
  LabOrder,
  PrescriptionItem,
  BillingInvoice,
  BillingItem,
  Payment,
  PaymentUrlResult,
  ServiceRating,
  DoctorRatingSummary,
  PaymentMethod,
  PaymentStatus,
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
  getDirectory: () => api.get<StaffDirectory[]>("/staff/directory"),
  create: (data: Omit<StaffProfile, "id">) =>
    api.post<StaffProfile>("/staff", data),
  update: (id: string, data: Omit<StaffProfile, "id">) =>
    api.put(`/staff/${id}`, data),
  delete: (id: string) => api.delete(`/staff/${id}`),
};

export const scheduleApi = {
  getAll: () => api.get<ScheduleFlat[]>("/schedules/all"),
  filter: (params: {
    startDate?: string;
    endDate?: string;
    currentWeek?: boolean;
    departmentId?: string;
    page?: number;
    pageSize?: number;
  }) => api.get<PagedResult<ScheduleFlat>>("/schedules", { params }),
  create: (data: ScheduleWrite) =>
    api.post<ScheduleFlat>("/schedules", data),
  update: (id: string, data: ScheduleWrite) =>
    api.put<ScheduleFlat>(`/schedules/${id}`, data),
  delete: (id: string) => api.delete(`/schedules/${id}`),
};

export const userApi = {
  getAll: () => api.get<UserAccount[]>("/users"),
  getById: (id: string) => api.get<UserAccount>(`/users/${id}`),
  create: (data: { fullName: string; email: string; phoneNumber?: string; password?: string; role: UserRole; isActive: boolean }) =>
    api.post<UserAccount>("/users", data),
  update: (id: string, data: { fullName: string; email: string; phoneNumber?: string; password?: string; role: UserRole; isActive: boolean }) =>
    api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
  updateStatus: (id: string, isActive: boolean) =>
    api.patch(`/users/${id}/status`, { isActive }),
  updateRole: (id: string, role: UserRole) =>
    api.patch(`/users/${id}/role`, { role }),
};

export const patientApi = {
  getAll: () => api.get<PatientProfile[]>("/patients"),
  getMe: () => api.get<PatientProfile>("/patients/me"),
  create: (data: { userAccountId: string }) =>
    api.post<PatientProfile>("/patients", data),
  update: (id: string, data: Partial<PatientProfile>) =>
    api.put(`/patients/${id}`, data),
  getHistory: (id: string) =>
    api.get<PatientHistoryDto>(`/patients/${id}/history`),
};

// ── Feature 2: PHR supporting lookups ────────────────────────────────────────
export const phrApi = {
  getAllLabOrders: () => api.get<LabOrder[]>("/LabOrders"),
  getAllPrescriptionItems: () => api.get<PrescriptionItem[]>("/PrescriptionItems"),
  getAllDrugs: () => api.get<Drug[]>("/drugs"),
  getAllClinics: () => api.get<Clinic[]>("/clinics"),
};

// ── Feature 3: Hospital Fee & BHYT ───────────────────────────────────────────
export const billingApi = {
  getAll: () => api.get<BillingInvoice[]>("/BillingInvoices"),
  getById: (id: string) => api.get<BillingInvoice>(`/BillingInvoices/${id}`),
  getItems: (id: string) =>
    api.get<BillingItem[]>(`/BillingInvoices/${id}/items`),
  generate: (data: {
    outpatientVisitId: string;
    examServiceId?: string;
    insuranceNumber?: string;
  }) => api.post<BillingInvoice>("/BillingInvoices/generate", data),
  calculateInsurance: (id: string, insuranceNumber?: string) =>
    api.post<BillingInvoice>(`/BillingInvoices/${id}/calculate-insurance`, {
      insuranceNumber,
    }),
};

// ── Feature 4: Online payment (VNPay/Momo) & service rating ──────────────────
export const paymentApi = {
  getAll: () => api.get<Payment[]>("/Payments"),
  getById: (id: string) => api.get<Payment>(`/Payments/${id}`),
  create: (data: {
    billingInvoiceId: string;
    method: PaymentMethod | number;
    amount: number;
    status?: PaymentStatus | number;
  }) => api.post<Payment>("/Payments", data),
  createVnPayUrl: (id: string) =>
    api.post<PaymentUrlResult>(`/Payments/${id}/vnpay-url`),
  createMomoUrl: (id: string) =>
    api.post<PaymentUrlResult>(`/Payments/${id}/momo-url`),
  confirm: (id: string) => api.post(`/Payments/${id}/confirm`),
};

export const ratingApi = {
  getAll: () => api.get<ServiceRating[]>("/ServiceRatings"),
  create: (data: {
    patientId: string;
    doctorId: string;
    outpatientVisitId: string;
    score: number;
    comment?: string;
  }) => api.post<ServiceRating>("/ServiceRatings", data),
  getDoctorSummary: (doctorId: string) =>
    api.get<DoctorRatingSummary>(`/ServiceRatings/doctor/${doctorId}/summary`),
};

export const outpatientApi = {
  create: (data: {
    patientId: string;
    doctorId: string;
    clinicId: string;
    queueTicketId?: string | null;
    visitDate?: string;
    status?: number;
    notes?: string;
  }) => api.post<{ id: string }>("/OutpatientVisits", data),
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

export const medicalRecordApi = {
  diagnose: (data: {
    visitId: string;
    doctorId: string;
    chiefComplaint?: string;
    symptoms?: string;
    diagnosisCode?: string;
    diagnosisDescription?: string;
    orderedTests?: string[];
    notes?: string;
  }) => api.post("/medical-records/diagnose", data),
  searchIcd10: (query: string) =>
    api.get<Icd10Result[]>("/medical-records/icd10/search", { params: { query } }),
  getDiagnosisHistory: (patientId: string) =>
    api.get<PatientDiagnosisHistory[]>(`/medical-records/patients/${patientId}/diagnosis-history`),
};

export const prescriptionApi = {
  create: (data: {
    outpatientVisitId: string;
    doctorId: string;
    issuedAt: string;
    notes?: string;
  }) => api.post<{ id: string; outpatientVisitId: string; doctorId: string; issuedAt: string; notes?: string }>("/prescriptions", data),
  addItem: (data: {
    prescriptionId: string;
    drugId: string;
    dose?: string;
    frequency?: string;
    durationDays: number;
    quantity: number;
  }) => api.post("/prescriptionitems", data),
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

export const reportApi = {
  getSummary: (period: "today" | "this-month") =>
    api.get<SummaryReport>("/reports/summary", { params: { period } }),

  getRevenue: (params: {
    startDate?: string;
    endDate?: string;
    groupBy?: "day" | "month";
    department?: string;
  }) => api.get<RevenueItem[]>("/reports/revenue", { params }),

  getBedOccupancy: (department?: string) =>
    api.get<BedOccupancyReport>("/reports/bed-occupancy", {
      params: department ? { department } : {},
    }),

  getOutpatientVisits: (params: {
    startDate: string;
    endDate: string;
    groupBy?: "day" | "month";
  }) => api.get<OutpatientVisitItem[]>("/reports/outpatient-visits", { params }),
};

export const drugApi = {
  getAll: () => api.get<Drug[]>("/drugs"),
  getById: (id: string) => api.get<Drug>(`/drugs/${id}`),
  create: (data: Omit<Drug, "id">) => api.post<Drug>("/drugs", data),
  update: (id: string, data: Omit<Drug, "id">) => api.put(`/drugs/${id}`, data),
  delete: (id: string) => api.delete(`/drugs/${id}`),
};

export const drugInteractionApi = {
  getAll: () => api.get<DrugInteraction[]>("/druginteractions"),
  create: (data: Omit<DrugInteraction, "id">) => api.post<DrugInteraction>("/druginteractions", data),
  update: (id: string, data: Omit<DrugInteraction, "id">) => api.put(`/druginteractions/${id}`, data),
  delete: (id: string) => api.delete(`/druginteractions/${id}`),
};

export const cdssApi = {
  checkInteractions: (drugIds: string[]) =>
    api.post<{ interactions: DrugInteraction[] }>("/cdss/drug-interactions/check", { drugIds }),
  checkDose: (data: { patientId: string; drugId: string; doseAmount: number }) =>
    api.post<DoseCheckResult>("/cdss/dose-check", data),
};

export const otpApi = {
  getSettings: () => api.get<OtpSetting>("/otp/settings"),
  updateSettings: (data: Omit<OtpSetting, "updatedAt" | "emailConfigured">) =>
    api.put<OtpSetting>("/otp/settings", data),
  issue: (userAccountId: string, purpose = "AccountActivation") =>
    api.post<OtpCode>("/otp/issue", { userAccountId, purpose }),
  verify: (userAccountId: string, code: string) =>
    api.post<{ success: boolean; message: string }>("/otp/verify", { userAccountId, code }),
  getCodes: (userAccountId?: string) =>
    api.get<OtpCode[]>("/otp/codes", { params: userAccountId ? { userAccountId } : {} }),
};

