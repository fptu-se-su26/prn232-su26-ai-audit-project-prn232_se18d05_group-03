import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Mat khau xac nhan khong khop.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await register({
        fullName,
        email,
        password,
        phoneNumber: phone || undefined,
      });
      navigate("/booking");
    } catch {
      setError("Dang ky that bai. Email co the da duoc su dung.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="material-symbols-outlined text-5xl text-primary">
            local_hospital
          </span>
          <h1 className="text-2xl font-bold text-on-surface mt-3">
            Dang ky tai khoan
          </h1>
          <p className="text-on-surface-variant mt-1">
            Tao tai khoan de dat lich kham benh
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-outline-variant p-6 space-y-4"
        >
          {error && (
            <div className="p-3 bg-error/10 text-error rounded-xl text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">
              Ho va ten
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              placeholder="Nguyen Van A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">
              So dien thoai
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              placeholder="0912345678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">
              Mat khau
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              placeholder="Toi thieu 6 ky tu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">
              Xac nhan mat khau
            </label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              placeholder="Nhap lai mat khau"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-on-primary rounded-full font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Dang xu ly..." : "Dang ky"}
          </button>

          <p className="text-center text-sm text-on-surface-variant">
            Da co tai khoan?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Dang nhap
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
