// UserRole stays numeric app-wide; the API returns it as a PascalCase string,
// which AuthContext normalizes back to this enum on login. Other enums below are
// string enums that match the API's JsonStringEnumConverter output directly.
export enum UserRole {
  Patient = 0,
  Doctor = 1,
  Nurse = 2,
  Admin = 3,
}

export enum AppointmentStatus {
  Requested = "Requested",
  Confirmed = "Confirmed",
  CheckedIn = "CheckedIn",
  Completed = "Completed",
  Cancelled = "Cancelled",
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
  maxDailyDose?: number | null;
  maxDosePerKg?: number | null;
}

export interface DrugInteraction {
  id: string;
  drugId: string;
  interactingDrugId: string;
  severity?: string;
  description?: string;
}

export interface DoseCheckResult {
  isOverDose: boolean;
  message: string;
  drugName: string;
  unit?: string;
  enteredDose?: number | null;
  recommendedMaxDose?: number | null;
  patientWeightKg?: number | null;
  thresholdBasis: "per-kg" | "absolute" | "none";
}

export enum OtpChannel {
  Email = 0,
  Sms = 1,
}

export enum OtpStatus {
  Pending = 0,
  Verified = 1,
  Expired = 2,
  Failed = 3,
}

export interface OtpSetting {
  isEnabled: boolean;
  channel: OtpChannel;
  codeLength: number;
  expiryMinutes: number;
  maxAttempts: number;
  updatedAt: string;
  emailConfigured: boolean;
}

export interface OtpCode {
  id: string;
  userAccountId: string;
  userFullName: string;
  userEmail: string;
  code: string;
  channel: OtpChannel;
  purpose: string;
  status: OtpStatus;
  attemptCount: number;
  delivered: boolean;
  deliveryDetail: string;
  createdAt: string;
  expiresAt: string;
  consumedAt?: string | null;
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

export interface Icd10Result {
  code: string;
  description: string;
}

export interface PatientDiagnosisHistory {
  diagnosisCode?: string;
  diagnosisDescription?: string;
  visitDate: string;
}

export interface DrugResult {
  id: string;
  name: string;
  code?: string;
  unit?: string;
  stockQuantity: number;
  unitPrice: number;
  isActive: boolean;
}

export interface ActivePrescriptionItem {
  drugId: string;
  drugName: string;
  dose: string;
  route: string;
  frequency: string;
  durationDays: number;
  quantity: number;
  unitPrice: number;
  stockQuantity: number;
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

// ── PHR / Feature 2: Electronic Health Record (member 2) ─────────────────────
export enum VisitStatus {
  Waiting = "Waiting",
  InProgress = "InProgress",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

export enum LabOrderStatus {
  Ordered = "Ordered",
  InProgress = "InProgress",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

export enum Gender {
  Unknown = "Unknown",
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export interface OutpatientVisit {
  id: string;
  patientId: string;
  doctorId: string;
  clinicId: string;
  queueTicketId?: string;
  visitDate: string;
  chiefComplaint?: string;
  diagnosisCode?: string;
  diagnosisDescription?: string;
  status: VisitStatus;
  notes?: string;
}

export interface LabOrder {
  id: string;
  outpatientVisitId: string;
  orderedById: string;
  testName: string;
  status: LabOrderStatus;
  orderedAt: string;
  notes?: string;
}

export interface LabResult {
  id: string;
  labOrderId: string;
  resultText?: string;
  resultFileUrl?: string;
  resultedAt?: string;
}

export interface Prescription {
  id: string;
  outpatientVisitId: string;
  doctorId: string;
  issuedAt: string;
  notes?: string;
}

export interface PrescriptionItem {
  id: string;
  prescriptionId: string;
  drugId: string;
  dose?: string;
  frequency?: string;
  durationDays: number;
  quantity: number;
}

export interface PatientHistoryDto {
  visits: OutpatientVisit[];
  labResults: LabResult[];
  prescriptions: Prescription[];
}

// ── Billing / Feature 3: Hospital Fee & BHYT (member 2) ──────────────────────
export enum InvoiceStatus {
  Draft = "Draft",
  Pending = "Pending",
  Paid = "Paid",
  Cancelled = "Cancelled",
}

export enum BillingItemType {
  Service = "Service",
  Lab = "Lab",
  Drug = "Drug",
  Bed = "Bed",
  Procedure = "Procedure",
  Other = "Other",
}

export interface BillingItem {
  id: string;
  billingInvoiceId: string;
  itemType: BillingItemType;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface BillingInvoice {
  id: string;
  patientId: string;
  createdAt: string;
  status: InvoiceStatus;
  subtotal: number;
  insuranceDeduction: number;
  totalAmount: number;
  insuranceNumber?: string;
  items: BillingItem[];
}

// ── Payment & Rating / Feature 4 (member 2) ──────────────────────────────────
export enum PaymentMethod {
  Cash = "Cash",
  VnPay = "VnPay",
  Momo = "Momo",
  BankTransfer = "BankTransfer",
}

export enum PaymentStatus {
  Pending = "Pending",
  Paid = "Paid",
  Failed = "Failed",
  Refunded = "Refunded",
}

export interface Payment {
  id: string;
  billingInvoiceId: string;
  method: PaymentMethod;
  amount: number;
  paidAt?: string | null;
  status: PaymentStatus;
  transactionRef?: string | null;
}

export interface PaymentUrlResult {
  paymentId: string;
  paymentUrl: string;
}

export interface ServiceRating {
  id: string;
  patientId: string;
  doctorId: string;
  outpatientVisitId: string;
  score: number;
  comment?: string;
  createdAt: string;
}

export interface DoctorRatingSummary {
  doctorId: string;
  averageScore: number;
  totalRatings: number;
}
