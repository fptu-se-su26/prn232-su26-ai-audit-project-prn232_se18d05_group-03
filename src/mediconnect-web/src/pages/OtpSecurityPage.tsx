import { useEffect, useMemo, useState } from "react";
import { otpApi, userApi } from "../api/services";
import type { OtpSetting, OtpCode, UserAccount } from "../types";
import { OtpChannel, OtpStatus } from "../types";

const CHANNEL_LABELS: Record<OtpChannel, string> = {
  [OtpChannel.Email]: "Email",
  [OtpChannel.Sms]: "SMS",
};

const STATUS_META: Record<OtpStatus, { label: string; cls: string }> = {
  [OtpStatus.Pending]: { label: "Đang chờ", cls: "bg-secondary-container text-on-secondary-container" },
  [OtpStatus.Verified]: { label: "Đã xác thực", cls: "bg-tertiary-container text-on-tertiary-container" },
  [OtpStatus.Expired]: { label: "Hết hạn", cls: "bg-surface-container text-on-surface-variant" },
  [OtpStatus.Failed]: { label: "Thất bại", cls: "bg-error-container text-on-error-container" },
};

export default function OtpSecurityPage() {
  const [setting, setSetting] = useState<OtpSetting | null>(null);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [codes, setCodes] = useState<OtpCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [savingSetting, setSavingSetting] = useState(false);

  // Activation workflow
  const [selectedUserId, setSelectedUserId] = useState("");
  const [issuing, setIssuing] = useState(false);
  const [lastIssued, setLastIssued] = useState<OtpCode | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{ success: boolean; message: string } | null>(null);

  const userById = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);

  const loadAll = () => {
    setLoading(true);
    setError(null);
    Promise.all([otpApi.getSettings(), userApi.getAll(), otpApi.getCodes()])
      .then(([s, u, c]) => {
        setSetting(s.data);
        setUsers(u.data);
        setCodes(c.data);
      })
      .catch(() => setError("Không thể tải cấu hình OTP."))
      .finally(() => setLoading(false));
  };

  useEffect(loadAll, []);

  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(null), 3000);
    return () => clearTimeout(t);
  }, [successMsg]);

  const refreshCodes = () => otpApi.getCodes().then(c => setCodes(c.data)).catch(() => {});

  const saveSettings = async () => {
    if (!setting) return;
    setSavingSetting(true);
    setError(null);
    try {
      const res = await otpApi.updateSettings({
        isEnabled: setting.isEnabled,
        channel: setting.channel,
        codeLength: setting.codeLength,
        expiryMinutes: setting.expiryMinutes,
        maxAttempts: setting.maxAttempts,
      });
      setSetting(res.data);
      setSuccessMsg("Đã lưu cấu hình OTP.");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Không thể lưu cấu hình OTP.");
    } finally {
      setSavingSetting(false);
    }
  };

  const issueOtp = async () => {
    if (!selectedUserId) {
      setError("Chọn tài khoản cần kích hoạt.");
      return;
    }
    setIssuing(true);
    setError(null);
    setVerifyResult(null);
    try {
      const res = await otpApi.issue(selectedUserId);
      setLastIssued(res.data);
      setVerifyCode("");
      setSuccessMsg(res.data.delivered ? "Đã gửi mã OTP tới email người dùng." : "Đã tạo mã OTP (mô phỏng).");
      refreshCodes();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Không thể gửi OTP.");
    } finally {
      setIssuing(false);
    }
  };

  const verifyOtp = async () => {
    if (!selectedUserId || !verifyCode) {
      setError("Nhập mã OTP để xác thực.");
      return;
    }
    setVerifying(true);
    setError(null);
    try {
      const res = await otpApi.verify(selectedUserId, verifyCode.trim());
      setVerifyResult(res.data);
      if (res.data.success) setLastIssued(null);
      refreshCodes();
    } catch {
      setError("Không thể xác thực OTP.");
    } finally {
      setVerifying(false);
    }
  };

  const numberField = (label: string, value: number, onChange: (n: number) => void, min: number, max: number) => (
    <div>
      <label className="text-xs font-medium text-on-surface-variant">{label}</label>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-on-surface">Cấu hình & Bảo mật OTP</h2>
        <p className="text-sm text-on-surface-variant mt-1">
          Thiết lập chính sách OTP và kích hoạt tài khoản bằng mã xác thực một lần.
        </p>
      </div>

      {setting?.emailConfigured ? (
        <div className="bg-tertiary-container text-on-tertiary-container px-4 py-3 rounded-xl flex items-start gap-2 text-sm">
          <span className="material-symbols-outlined text-lg">mark_email_read</span>
          <p>
            Đã cấu hình gửi email thật. Mã OTP sẽ được <b>gửi tới hộp thư của người dùng</b> và
            không hiển thị trong màn hình này vì lý do bảo mật.
          </p>
        </div>
      ) : (
        <div className="bg-secondary-container text-on-secondary-container px-4 py-3 rounded-xl flex items-start gap-2 text-sm">
          <span className="material-symbols-outlined text-lg">info</span>
          <p>
            Chưa cấu hình SMTP (Gmail App Password / SendGrid) nên OTP đang gửi <b>mô phỏng</b>:
            mã hiển thị ngay trong màn hình này để demo. Điền mục <code>OtpEmail</code> trong
            <code> appsettings.Development.json</code> rồi bật <code>Enabled=true</code> để gửi thật.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-lg">error</span>
          {error}
        </div>
      )}
      {successMsg && (
        <div className="bg-tertiary-container text-on-tertiary-container px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          {successMsg}
        </div>
      )}

      {loading || !setting ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-surface-container-low animate-pulse rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── Config panel ─────────────────────────────────────────── */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant space-y-4">
            <h3 className="text-lg font-semibold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">tune</span>
              Cấu hình chính sách OTP
            </h3>

            <label className="flex items-center justify-between text-sm">
              <span className="font-medium text-on-surface">Bật xác thực OTP</span>
              <button
                onClick={() => setSetting(s => s && { ...s, isEnabled: !s.isEnabled })}
                className={`relative w-11 h-6 rounded-full transition-colors ${setting.isEnabled ? "bg-primary" : "bg-surface-container-high"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${setting.isEnabled ? "translate-x-5" : ""}`} />
              </button>
            </label>

            <div>
              <label className="text-xs font-medium text-on-surface-variant">Kênh gửi</label>
              <select
                value={setting.channel}
                onChange={e => setSetting(s => s && { ...s, channel: Number(e.target.value) as OtpChannel })}
                className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface"
              >
                {Object.entries(CHANNEL_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {numberField("Độ dài mã", setting.codeLength, n => setSetting(s => s && { ...s, codeLength: n }), 4, 10)}
              {numberField("Hết hạn (phút)", setting.expiryMinutes, n => setSetting(s => s && { ...s, expiryMinutes: n }), 1, 60)}
              {numberField("Số lần thử", setting.maxAttempts, n => setSetting(s => s && { ...s, maxAttempts: n }), 1, 20)}
            </div>

            <button
              onClick={saveSettings}
              disabled={savingSetting}
              className="w-full bg-primary text-on-primary rounded px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {savingSetting ? "Đang lưu..." : "Lưu cấu hình"}
            </button>
          </div>

          {/* ── Activation workflow ──────────────────────────────────── */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant space-y-4">
            <h3 className="text-lg font-semibold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
              Kích hoạt tài khoản bằng OTP
            </h3>

            <div>
              <label className="text-xs font-medium text-on-surface-variant">Tài khoản</label>
              <select
                value={selectedUserId}
                onChange={e => { setSelectedUserId(e.target.value); setLastIssued(null); setVerifyResult(null); }}
                className="w-full mt-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface"
              >
                <option value="">— Chọn tài khoản —</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.fullName} ({u.email}){u.verifiedAt ? " ✓" : ""}
                  </option>
                ))}
              </select>
              {selectedUserId && userById.get(selectedUserId)?.verifiedAt && (
                <p className="text-xs text-on-tertiary-container mt-1">Tài khoản này đã được xác thực trước đó.</p>
              )}
            </div>

            <button
              onClick={issueOtp}
              disabled={issuing || !selectedUserId || !setting.isEnabled}
              className="w-full bg-primary text-on-primary rounded px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {issuing ? "Đang gửi..." : "Gửi mã OTP"}
            </button>
            {!setting.isEnabled && (
              <p className="text-xs text-error -mt-2">OTP đang tắt. Bật ở panel cấu hình để gửi mã.</p>
            )}

            {lastIssued && (
              lastIssued.delivered ? (
                <div className="bg-tertiary-container text-on-tertiary-container rounded-lg p-4 text-center space-y-1">
                  <span className="material-symbols-outlined text-3xl">outgoing_mail</span>
                  <p className="text-sm font-semibold">{lastIssued.deliveryDetail || `Đã gửi mã qua ${CHANNEL_LABELS[lastIssued.channel]}`}</p>
                  <p className="text-xs opacity-80">Người dùng kiểm tra hộp thư và nhập mã. Hết hạn lúc {new Date(lastIssued.expiresAt).toLocaleTimeString("vi-VN")}.</p>
                </div>
              ) : (
                <div className="bg-primary-container text-on-primary-container rounded-lg p-4 text-center space-y-1">
                  <p className="text-xs uppercase font-semibold opacity-80">Mã OTP (mô phỏng qua {CHANNEL_LABELS[lastIssued.channel]})</p>
                  <p className="text-3xl font-bold tracking-[0.3em] font-mono">{lastIssued.code}</p>
                  {lastIssued.deliveryDetail && <p className="text-xs opacity-80">{lastIssued.deliveryDetail}</p>}
                  <p className="text-xs opacity-80">Hết hạn lúc {new Date(lastIssued.expiresAt).toLocaleTimeString("vi-VN")}</p>
                </div>
              )
            )}

            <div className="flex gap-2">
              <input
                value={verifyCode}
                onChange={e => setVerifyCode(e.target.value)}
                placeholder="Nhập mã OTP"
                className="flex-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface tracking-widest"
              />
              <button
                onClick={verifyOtp}
                disabled={verifying || !selectedUserId || !verifyCode}
                className="bg-tertiary text-on-tertiary rounded px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {verifying ? "..." : "Xác thực"}
              </button>
            </div>

            {verifyResult && (
              <div className={`px-4 py-3 rounded-xl flex items-center gap-2 text-sm ${
                verifyResult.success ? "bg-tertiary-container text-on-tertiary-container" : "bg-error-container text-on-error-container"
              }`}>
                <span className="material-symbols-outlined text-lg">{verifyResult.success ? "check_circle" : "cancel"}</span>
                {verifyResult.message}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── OTP log ──────────────────────────────────────────────────── */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
        <div className="px-6 py-3 border-b border-outline-variant flex items-center justify-between">
          <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">history</span>
            Nhật ký OTP gần đây
          </h3>
          <button onClick={refreshCodes} className="text-xs text-primary hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">refresh</span> Làm mới
          </button>
        </div>
        {codes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[140px] text-on-surface-variant gap-2">
            <span className="material-symbols-outlined text-4xl">inbox</span>
            <p className="text-sm">Chưa có mã OTP nào được phát hành</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-xs text-on-surface-variant">
              <tr>
                <th className="px-6 py-3 font-semibold">Tài khoản</th>
                <th className="px-6 py-3 font-semibold">Mã</th>
                <th className="px-6 py-3 font-semibold">Kênh</th>
                <th className="px-6 py-3 font-semibold">Trạng thái</th>
                <th className="px-6 py-3 font-semibold text-right">Số lần thử</th>
                <th className="px-6 py-3 font-semibold">Thời điểm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-sm">
              {codes.map(c => (
                <tr key={c.id} className="hover:bg-surface transition-colors">
                  <td className="px-6 py-3">
                    <p className="font-medium text-on-surface">{c.userFullName}</p>
                    <p className="text-xs text-on-surface-variant">{c.userEmail}</p>
                  </td>
                  <td className="px-6 py-3 font-mono tracking-widest text-on-surface">{c.code}</td>
                  <td className="px-6 py-3 text-on-surface-variant">{CHANNEL_LABELS[c.channel]}</td>
                  <td className="px-6 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${STATUS_META[c.status].cls}`}>
                      {STATUS_META[c.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right text-on-surface-variant">{c.attemptCount}</td>
                  <td className="px-6 py-3 text-on-surface-variant text-xs">
                    {new Date(c.createdAt).toLocaleString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
