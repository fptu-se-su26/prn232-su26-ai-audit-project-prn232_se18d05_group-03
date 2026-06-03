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
  number: number;
  issuedAt: string;
  status: QueueStatus;
}

export interface ClinicQueue {
  clinicId: string;
  clinicName: string;
  roomNumber?: string;
  waitingCount: number;
  currentNumber?: number;
  tickets: QueueTicketDetail[];
}
