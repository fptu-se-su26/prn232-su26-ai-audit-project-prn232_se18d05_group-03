export enum UserRole {
  Patient = 0,
  Doctor = 1,
  Nurse = 2,
  Admin = 3,
}

export enum AppointmentStatus {
  Requested = 0,
  Confirmed = 1,
  CheckedIn = 2,
  Completed = 3,
  Cancelled = 4,
}

export enum QueueStatus {
  Waiting = 0,
  InProgress = 1,
  Skipped = 2,
  Completed = 3,
  Cancelled = 4,
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  verifiedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  expiresAt: string;
  user: UserAccount;
}

export interface Department {
  id: string;
  name: string;
  code?: string;
  description?: string;
}

export interface Clinic {
  id: string;
  departmentId: string;
  name: string;
  roomNumber?: string;
  isActive: boolean;
}

export interface MedicalService {
  id: string;
  departmentId: string;
  name: string;
  code?: string;
  price: number;
  isActive: boolean;
}

export interface ClinicWithServices extends Clinic {
  services: MedicalService[];
}

export interface PatientProfile {
  id: string;
  userAccountId: string;
  dateOfBirth?: string;
  gender: number;
  heightCm?: number;
  weightKg?: number;
  insuranceNumber?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface StaffProfile {
  id: string;
  userAccountId: string;
  staffType: number;
  departmentId: string;
  specialty?: string;
  yearsExperience: number;
  degree?: string;
}

export interface StaffWithUser extends StaffProfile {
  fullName: string;
  email: string;
}

export interface StaffDirectory {
  id: string;
  userId: string;
  name: string;
  email: string;
  staffType: StaffType;
  departmentId: string;
  department: string;
  specialty?: string;
  yearsExperience: number;
  degree?: string;
}

// ── CDSS: Drugs & Drug Interactions ───────────────────────────────────────────

export interface Drug {
  id: string;
  name: string;
  code?: string;
  unit?: string;
  stockQuantity: number;
  unitPrice: number;
  isActive: boolean;
}

export interface DrugInteraction {
  id: string;
  drugId: string;
  interactingDrugId: string;
  severity?: string;
  description?: string;
}

export enum ShiftType {
  Morning = 0,
  Afternoon = 1,
  Evening = 2,
}

export enum StaffType {
  Doctor = 0,
  Nurse = 1,
  Admin = 2,
  Caregiver = 3,
}

export interface ScheduleFlat {
  id: string;
  staffId: string;
  /** "yyyy-MM-dd" — ngày trực */
  date: string;
  /** Vietnamese display name: "Ca Sáng" | "Ca Chiều" | "Ca Tối" */
  shift: string;
  /** Numeric enum — dùng để pre-fill form chỉnh sửa */
  shiftType: ShiftType;
  startTime: string;
  endTime: string;
  workRoom?: string;
  /** UserAccount.Id — khác với staffId (StaffProfile.Id) */
  userId: string;
  name: string;
  email: string;
  specialty?: string;
  yearsExperience: number;
  degree?: string;
  departmentId: string;
  department: string;
  staffType: StaffType;
}

export interface ScheduleWrite {
  staffId: string;
  shiftDate: string;
  shiftType: ShiftType;
  workRoom?: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface AppointmentWrite {
  patientId: string;
  doctorId: string;
  clinicId: string;
  appointmentTime: string;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
}

export interface AppointmentRead extends AppointmentWrite {
  id: string;
}

export interface QueueTicketDetail {
  id: string;
  clinicId: string;
  clinicName: string;
  clinicRoomNumber?: string;
  appointmentId?: string;
  patientId?: string;
  patientName?: string;
  number: number;
  issuedAt: string;
  status: QueueStatus;
}

export interface ClinicQueueSummary {
  clinicId: string;
  clinicName: string;
  roomNumber?: string;
  isActive: boolean;
  waitingCount: number;
  inProgressCount: number;
  currentNumber?: number;
  currentPatientName?: string;
}

export interface ClinicQueue {
  clinicId: string;
  clinicName: string;
  roomNumber?: string;
  waitingCount: number;
  currentNumber?: number;
  tickets: QueueTicketDetail[];
}

// ── Report DTOs ──────────────────────────────────────────────────────────────

export interface SummaryReport {
  totalRevenue: number;
  bedOccupancyRate: number;
  totalOutpatientVisits: number;
  activeInpatients: number;
}

export interface RevenueItem {
  timePeriod: string;
  department: string;
  revenue: number;
}

export interface BedDeptBreakdown {
  department: string;
  total: number;
  occupied: number;
  percentage: number;
}

export interface BedOccupancyReport {
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  occupancyPercentage: number;
  byDepartmentBreakdown: BedDeptBreakdown[];
}

export interface OutpatientVisitItem {
  timePeriod: string;
  visitCount: number;
}
