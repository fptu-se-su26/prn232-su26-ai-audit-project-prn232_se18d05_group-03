import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  patientApi,
  billingApi,
  paymentApi,
  phrApi,
  userApi,
} from "../api/services";
import type {
  PatientProfile,
  BillingInvoice,
  Payment,
  OutpatientVisit,
  Clinic,
  UserAccount,
} from "../types";
import {
  InvoiceStatus,
  BillingItemType,
  PaymentMethod,
  PaymentStatus,
} from "../types";

// ── Format helpers ──────────────────────────────────────────────────────────
function fmtVnd(v: number | null | undefined): string {
  if (v == null) return "—";
  return v.toLocaleString("vi-VN") + " ₫";
}

function fmtDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const dt = new Date(dateStr);
  return dt.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function invoiceStatusInfo(status: InvoiceStatus) {
  switch (status) {
    case InvoiceStatus.Draft:
      return { label: "Nháp", bg: "bg-surface-container-high", text: "text-on-surface-variant", icon: "draft" };
    case InvoiceStatus.Pending:
      return { label: "Chờ thanh toán", bg: "bg-yellow-100", text: "text-yellow-800", icon: "schedule" };
    case InvoiceStatus.Paid:
      return { label: "Đã thanh toán", bg: "bg-tertiary-container", text: "text-on-tertiary-container", icon: "task_alt" };
    case InvoiceStatus.Cancelled:
      return { label: "Đã hủy", bg: "bg-error-container", text: "text-on-error-container", icon: "cancel" };
    default:
      return { label: "Không rõ", bg: "bg-surface-container", text: "text-on-surface-variant", icon: "help" };
  }
}

function itemTypeLabel(t: BillingItemType): string {
  switch (t) {
    case BillingItemType.Service: return "Khám";
    case BillingItemType.Lab: return "Xét nghiệm";
    case BillingItemType.Drug: return "Thuốc";
    case BillingItemType.Bed: return "Giường";
    case BillingItemType.Procedure: return "Thủ thuật";
    default: return "Khác";
  }
}

function paymentMethodLabel(method: PaymentMethod): string {
  switch (method) {
    case PaymentMethod.VnPay: return "VNPay";
    case PaymentMethod.Momo: return "Momo";
    case PaymentMethod.BankTransfer: return "Chuyển khoản";
    case PaymentMethod.Cash: return "Tiền mặt";
    default: return "Khác";
  }
}

function paymentStatusInfo(status: PaymentStatus) {
  switch (status) {
    case PaymentStatus.Paid:
      return { label: "Thành công", cls: "text-on-tertiary-container bg-tertiary-container" };
    case PaymentStatus.Pending:
      return { label: "Đang xử lý", cls: "text-yellow-800 bg-yellow-100" };
    case PaymentStatus.Failed:
      return { label: "Thất bại", cls: "text-on-error-container bg-error-container" };
    case PaymentStatus.Refunded:
      return { label: "Đã hoàn tiền", cls: "text-on-surface-variant bg-surface-container-high" };
    default:
      return { label: "—", cls: "text-on-surface-variant bg-surface-container" };
  }
}

interface VisitOption extends OutpatientVisit {
  doctorName?: string;
  clinicName?: string;
}

export default function BillingPage() {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [visits, setVisits] = useState<VisitOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [noProfile, setNoProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNoProfile(false);
    try {
      console.log("[Billing] Bắt đầu tải dữ liệu viện phí...");

      let pat: PatientProfile;
      try {
        const res = await patientApi.getMe();
        pat = res.data;
      } catch {
        console.warn("[Billing] Không tìm thấy hồ sơ bệnh nhân.");
        setNoProfile(true);
        setLoading(false);
        return;
      }
      setProfile(pat);

      const [invRes, payRes, histRes, usersRes, clinicsRes] = await Promise.all([
        billingApi.getAll(),
        paymentApi.getAll(),
        patientApi.getHistory(pat.id),
        userApi.getAll(),
        phrApi.getAllClinics(),
      ]);

      const myInvoices = invRes.data.filter((i) => i.patientId === pat.id);
      const myInvoiceIds = new Set(myInvoices.map((i) => i.id));
      const myPayments = payRes.data.filter((p) => myInvoiceIds.has(p.billingInvoiceId));

      const userMap = new Map<string, UserAccount>(usersRes.data.map((u) => [u.id, u]));
      const clinicMap = new Map<string, Clinic>(clinicsRes.data.map((c) => [c.id, c]));

      const visitOptions: VisitOption[] = histRes.data.visits
        .map((v) => ({
          ...v,
          doctorName: userMap.get(v.doctorId)?.fullName,
          clinicName: clinicMap.get(v.clinicId)?.name,
        }))
        .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());

      // Sort invoices newest first
      myInvoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setInvoices(myInvoices);
      setPayments(myPayments);
      setVisits(visitOptions);

      console.log(
        `[Billing] Tải xong — ${myInvoices.length} phiếu thu, ${myPayments.length} giao dịch, ${visitOptions.length} lần khám.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi không xác định";
      console.error("[Billing] Lỗi khi tải dữ liệu:", msg);
      setError("Không thể tải dữ liệu viện phí. Vui lòng kiểm tra kết nối và thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const paymentsFor = (invoiceId: string) =>
    payments.filter((p) => p.billingInvoiceId === invoiceId);

  // ── BHYT recalc ───────────────────────────────────────────────────────────
  const handleRecalcInsurance = async (invoice: BillingInvoice, insuranceNumber: string) => {
    setBusyId(invoice.id);
    try {
      console.log(`[Billing] Tính lại khấu trừ BHYT cho phiếu ${invoice.id}...`);
      const res = await billingApi.calculateInsurance(invoice.id, insuranceNumber.trim() || undefined);
      setInvoices((prev) => prev.map((i) => (i.id === invoice.id ? res.data : i)));
      showToast("Đã cập nhật mức khấu trừ BHYT.");
    } catch {
      showToast("Không thể tính khấu trừ BHYT. Vui lòng thử lại.");
    } finally {
      setBusyId(null);
    }
  };

  // ── Online payment ────────────────────────────────────────────────────────
  const handlePay = async (invoice: BillingInvoice, method: PaymentMethod) => {
    setBusyId(invoice.id);
    try {
      console.log(`[Billing] Tạo thanh toán ${paymentMethodLabel(method)} cho phiếu ${invoice.id}...`);
      const payRes = await paymentApi.create({
        billingInvoiceId: invoice.id,
        method,
        amount: invoice.totalAmount,
        status: PaymentStatus.Pending,
      });
      const payment = payRes.data;

      const urlRes =
        method === PaymentMethod.VnPay
          ? await paymentApi.createVnPayUrl(payment.id)
          : await paymentApi.createMomoUrl(payment.id);

      setPayments((prev) => [...prev, payment]);
      console.log(`[Billing] Link thanh toán: ${urlRes.data.paymentUrl}`);
      window.open(urlRes.data.paymentUrl, "_blank", "noopener");
      showToast("Đã mở cổng thanh toán ở tab mới. Hoàn tất giao dịch rồi tải lại trang.");
    } catch {
      showToast("Không thể tạo giao dịch thanh toán. Vui lòng thử lại.");
    } finally {
      setBusyId(null);
    }
  };

  // ── Render states ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
          <p>Đang tải dữ liệu viện phí...</p>
        </div>
      </div>
    );
  }

  if (noProfile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <span className="material-symbols-outlined text-6xl text-primary mb-4">receipt_long</span>
        <h1 className="text-2xl font-bold text-on-surface mb-2">Chưa có hồ sơ bệnh nhân</h1>
        <p className="text-on-surface-variant mb-6">
          Bạn cần đặt lịch khám để tạo hồ sơ bệnh nhân trước khi xem viện phí.
        </p>
        <Link
          to="/booking"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined">event</span>
          Đặt lịch khám
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
        <p className="text-on-surface-variant mb-6">{error}</p>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined">refresh</span>
          Thử lại
        </button>
      </div>
    );
  }

  const totalOutstanding = invoices
    .filter((i) => i.status === InvoiceStatus.Pending || i.status === InvoiceStatus.Draft)
    .reduce((sum, i) => sum + i.totalAmount, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">receipt_long</span>
            Viện phí &amp; Thanh toán
          </h1>
          <p className="text-on-surface-variant mt-1">
            Xem phiếu thu, khấu trừ BHYT và thanh toán trực tuyến.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined">add</span>
          Tạo phiếu thu
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-primary-container rounded-2xl p-5">
          <p className="text-sm text-on-primary-container/80">Tổng số phiếu thu</p>
          <p className="text-3xl font-bold text-on-primary-container mt-1">{invoices.length}</p>
        </div>
        <div className="bg-tertiary-container rounded-2xl p-5">
          <p className="text-sm text-on-tertiary-container/80">Đã thanh toán</p>
          <p className="text-3xl font-bold text-on-tertiary-container mt-1">
            {invoices.filter((i) => i.status === InvoiceStatus.Paid).length}
          </p>
        </div>
        <div className="bg-surface-container-high rounded-2xl p-5">
          <p className="text-sm text-on-surface-variant">Còn phải thanh toán</p>
          <p className="text-2xl font-bold text-on-surface mt-1">{fmtVnd(totalOutstanding)}</p>
        </div>
      </div>

      {/* Invoice list */}
      {invoices.length === 0 ? (
        <div className="bg-surface-container-low rounded-2xl p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3">receipt</span>
          <p className="text-on-surface-variant">
            Chưa có phiếu thu nào. Nhấn “Tạo phiếu thu” để gom chi phí từ một lần khám.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((inv) => (
            <InvoiceCard
              key={inv.id}
              invoice={inv}
              expanded={expandedId === inv.id}
              busy={busyId === inv.id}
              payments={paymentsFor(inv.id)}
              defaultInsurance={inv.insuranceNumber ?? profile?.insuranceNumber ?? ""}
              onToggle={() => setExpandedId(expandedId === inv.id ? null : inv.id)}
              onRecalc={handleRecalcInsurance}
              onPay={handlePay}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <CreateInvoiceModal
          visits={visits}
          defaultInsurance={profile?.insuranceNumber ?? ""}
          onClose={() => setShowCreate(false)}
          onCreated={(inv) => {
            setInvoices((prev) => [inv, ...prev]);
            setExpandedId(inv.id);
            setShowCreate(false);
            showToast("Đã tạo phiếu thu tổng.");
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-on-surface text-surface px-5 py-3 rounded-full shadow-lg z-50 text-sm max-w-[90vw]">
          {toast}
        </div>
      )}
    </div>
  );
}

// ── Invoice card ────────────────────────────────────────────────────────────
function InvoiceCard({
  invoice,
  expanded,
  busy,
  payments,
  defaultInsurance,
  onToggle,
  onRecalc,
  onPay,
}: {
  invoice: BillingInvoice;
  expanded: boolean;
  busy: boolean;
  payments: Payment[];
  defaultInsurance: string;
  onToggle: () => void;
  onRecalc: (invoice: BillingInvoice, insuranceNumber: string) => void;
  onPay: (invoice: BillingInvoice, method: PaymentMethod) => void;
}) {
  const [insurance, setInsurance] = useState(defaultInsurance);
  const st = invoiceStatusInfo(invoice.status);
  const isPaid = invoice.status === InvoiceStatus.Paid;
  const canPay = !isPaid && invoice.totalAmount > 0;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden">
      {/* Row header */}
      <button
        onClick={onToggle}
        className="w-full flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-left hover:bg-surface-container-low transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${st.bg} ${st.text}`}>
            <span className="material-symbols-outlined text-[16px]">{st.icon}</span>
            {st.label}
          </span>
          <div>
            <p className="font-semibold text-on-surface">Phiếu #{invoice.id.slice(0, 8).toUpperCase()}</p>
            <p className="text-xs text-on-surface-variant">{fmtDateTime(invoice.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-lg font-bold text-primary">{fmtVnd(invoice.totalAmount)}</p>
            {invoice.insuranceDeduction > 0 && (
              <p className="text-xs text-tertiary">BHYT giảm {fmtVnd(invoice.insuranceDeduction)}</p>
            )}
          </div>
          <span className="material-symbols-outlined text-on-surface-variant">
            {expanded ? "expand_less" : "expand_more"}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-outline-variant">
          {/* Items */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-on-surface-variant border-b border-outline-variant">
                  <th className="py-2 pr-3 font-medium">Khoản mục</th>
                  <th className="py-2 px-3 font-medium">Loại</th>
                  <th className="py-2 px-3 font-medium text-right">SL</th>
                  <th className="py-2 px-3 font-medium text-right">Đơn giá</th>
                  <th className="py-2 pl-3 font-medium text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-on-surface-variant">
                      Phiếu thu không có khoản mục chi phí.
                    </td>
                  </tr>
                ) : (
                  invoice.items.map((item) => (
                    <tr key={item.id} className="border-b border-outline-variant/50">
                      <td className="py-2 pr-3 text-on-surface">{item.description}</td>
                      <td className="py-2 px-3 text-on-surface-variant">{itemTypeLabel(item.itemType)}</td>
                      <td className="py-2 px-3 text-right text-on-surface-variant">{item.quantity}</td>
                      <td className="py-2 px-3 text-right text-on-surface-variant">{fmtVnd(item.unitPrice)}</td>
                      <td className="py-2 pl-3 text-right font-medium text-on-surface">{fmtVnd(item.amount)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-4 flex flex-col items-end gap-1 text-sm">
            <div className="flex justify-between w-full sm:w-64">
              <span className="text-on-surface-variant">Tạm tính</span>
              <span className="text-on-surface">{fmtVnd(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between w-full sm:w-64">
              <span className="text-on-surface-variant">Khấu trừ BHYT</span>
              <span className="text-tertiary">- {fmtVnd(invoice.insuranceDeduction)}</span>
            </div>
            <div className="flex justify-between w-full sm:w-64 pt-1 border-t border-outline-variant">
              <span className="font-semibold text-on-surface">Phải thanh toán</span>
              <span className="font-bold text-primary">{fmtVnd(invoice.totalAmount)}</span>
            </div>
          </div>

          {/* BHYT input */}
          {!isPaid && (
            <div className="mt-5 bg-surface-container-low rounded-xl p-4">
              <label className="block text-sm font-medium text-on-surface mb-2">
                Mã thẻ BHYT (nhập ≥ 10 ký tự để được khấu trừ 80%)
              </label>
              <div className="flex flex-wrap gap-2">
                <input
                  value={insurance}
                  onChange={(e) => setInsurance(e.target.value)}
                  placeholder="VD: BHYT-0123456789"
                  className="flex-1 min-w-[180px] px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  onClick={() => onRecalc(invoice, insurance)}
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-on-secondary font-medium hover:bg-secondary/90 transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">calculate</span>
                  Tính khấu trừ
                </button>
              </div>
            </div>
          )}

          {/* Payment actions */}
          {canPay && (
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => onPay(invoice, PaymentMethod.VnPay)}
                disabled={busy}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">account_balance</span>
                Thanh toán VNPay
              </button>
              <button
                onClick={() => onPay(invoice, PaymentMethod.Momo)}
                disabled={busy}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#a50064] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">wallet</span>
                Thanh toán Momo
              </button>
            </div>
          )}

          {/* Payment history */}
          {payments.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-medium text-on-surface mb-2">Lịch sử giao dịch</p>
              <ul className="space-y-1.5">
                {payments.map((p) => {
                  const ps = paymentStatusInfo(p.status);
                  return (
                    <li key={p.id} className="flex items-center justify-between text-sm bg-surface-container-low rounded-lg px-3 py-2">
                      <span className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[18px]">
                          {p.method === PaymentMethod.VnPay ? "account_balance" : p.method === PaymentMethod.Momo ? "wallet" : "payments"}
                        </span>
                        {paymentMethodLabel(p.method)} · {fmtVnd(p.amount)}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${ps.cls}`}>{ps.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Create invoice modal ────────────────────────────────────────────────────
function CreateInvoiceModal({
  visits,
  defaultInsurance,
  onClose,
  onCreated,
}: {
  visits: VisitOption[];
  defaultInsurance: string;
  onClose: () => void;
  onCreated: (invoice: BillingInvoice) => void;
}) {
  const [visitId, setVisitId] = useState<string>(visits[0]?.id ?? "");
  const [insurance, setInsurance] = useState(defaultInsurance);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!visitId) {
      setErr("Vui lòng chọn một lần khám.");
      return;
    }
    setSubmitting(true);
    setErr(null);
    try {
      console.log(`[Billing] Tạo phiếu thu từ lần khám ${visitId}...`);
      const res = await billingApi.generate({
        outpatientVisitId: visitId,
        insuranceNumber: insurance.trim() || undefined,
      });
      onCreated(res.data);
    } catch {
      setErr("Không thể tạo phiếu thu. Lần khám có thể chưa có chi phí hoặc đã có lỗi xảy ra.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        className="bg-surface-container-lowest rounded-2xl w-full max-w-md p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">add_card</span>
            Tạo phiếu thu tổng
          </h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <p className="text-sm text-on-surface-variant mb-4">
          Hệ thống tự động gom chi phí khám, xét nghiệm và thuốc của lần khám đã chọn thành một phiếu thu tổng.
        </p>

        {visits.length === 0 ? (
          <p className="text-sm text-on-surface-variant bg-surface-container-low rounded-lg p-3">
            Bạn chưa có lần khám nào để tạo phiếu thu.
          </p>
        ) : (
          <>
            <label className="block text-sm font-medium text-on-surface mb-1">Chọn lần khám</label>
            <select
              value={visitId}
              onChange={(e) => setVisitId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/40 mb-4"
            >
              {visits.map((v) => (
                <option key={v.id} value={v.id}>
                  {new Date(v.visitDate).toLocaleDateString("vi-VN")} ·{" "}
                  {v.clinicName ?? "Phòng khám"} · BS {v.doctorName ?? "—"}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium text-on-surface mb-1">Mã thẻ BHYT (tùy chọn)</label>
            <input
              value={insurance}
              onChange={(e) => setInsurance(e.target.value)}
              placeholder="VD: BHYT-0123456789"
              className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/40 mb-4"
            />
          </>
        )}

        {err && <p className="text-sm text-error mb-3">{err}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-on-surface-variant hover:bg-surface-container-low font-medium"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || visits.length === 0}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {submitting && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
            Tạo phiếu thu
          </button>
        </div>
      </div>
    </div>
  );
}
