import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  {
    icon: "event_available",
    title: "Dat lich truc tuyen",
    desc: "Dat lich kham benh nhanh chong, chon bac si va thoi gian phu hop.",
  },
  {
    icon: "smart_toy",
    title: "Hang doi thong minh",
    desc: "He thong phan luong tu dong, giam thoi gian cho kham.",
  },
  {
    icon: "medical_information",
    title: "Ho so dien tu",
    desc: "Quan ly ho so suc khoe ca nhan, lich su kham benh truc tuyen.",
  },
  {
    icon: "monitoring",
    title: "Theo doi suc khoe",
    desc: "Cap nhat ket qua xet nghiem va chi so suc khoe moi luc.",
  },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary to-primary/80 text-on-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTIwIDBMMCAwIDAgMjAiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="max-w-7xl mx-auto px-4 py-20 sm:py-28 relative">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="material-symbols-outlined text-lg">
                verified
              </span>
              Tieu chuan y te the he moi
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
              SmartCare HIS
              <br />
              <span className="text-primary-container">
                He thong quan ly benh vien thong minh
              </span>
            </h1>
            <p className="text-lg text-on-primary/80 mb-8 max-w-xl">
              Dat lich kham, theo doi suc khoe, nhan ket qua xet nghiem — tat ca
              trong mot nen tang duy nhat.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to={isAuthenticated ? "/booking" : "/register"}
                className="px-7 py-3.5 bg-white text-primary rounded-full font-semibold hover:bg-white/90 transition-colors shadow-lg"
              >
                {isAuthenticated ? "Dat lich kham ngay" : "Bat dau ngay"}
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="px-7 py-3.5 border-2 border-white/30 text-on-primary rounded-full font-semibold hover:bg-white/10 transition-colors"
                >
                  Dang nhap
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-on-surface mb-3">
            Tinh nang noi bat
          </h2>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            MediConnect cung cap giai phap toan dien cho benh vien va benh nhan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="group p-6 bg-white rounded-2xl border border-outline-variant hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-on-primary-container group-hover:text-on-primary">
                  {f.icon}
                </span>
              </div>
              <h3 className="font-semibold text-on-surface mb-2">{f.title}</h3>
              <p className="text-sm text-on-surface-variant">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="bg-primary-container rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl font-bold text-on-primary-container mb-3">
              San sang bat dau?
            </h2>
            <p className="text-on-primary-container/70 mb-6 max-w-md mx-auto">
              Dang ky tai khoan mien phi va dat lich kham benh chi trong vai phut.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-on-primary rounded-full font-semibold hover:bg-primary/90 transition-colors"
            >
              Dang ky mien phi
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
