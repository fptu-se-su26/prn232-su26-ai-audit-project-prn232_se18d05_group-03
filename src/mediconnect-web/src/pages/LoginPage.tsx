import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === UserRole.Patient) {
        navigate("/booking");
      } else if (user.role === UserRole.Doctor || user.role === UserRole.Nurse) {
        navigate("/clinic-dashboard");
      } else if (user.role === UserRole.Admin) {
        navigate("/manage-services");
      } else {
        navigate("/");
      }
    } catch {
      setError("Email hoặc mật khẩu không đúng.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="material-symbols-outlined text-5xl text-primary">
            local_hospital
          </span>
          <h1 className="text-2xl font-bold text-on-surface mt-3">
            Dang nhap MediConnect
          </h1>
          <p className="text-on-surface-variant mt-1">
            Nhap thong tin tai khoan de tiep tuc
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
              Mat khau
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              placeholder="Nhap mat khau"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-on-primary rounded-full font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Dang xu ly..." : "Dang nhap"}
          </button>

          <p className="text-center text-sm text-on-surface-variant">
            Chua co tai khoan?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Dang ky ngay
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
