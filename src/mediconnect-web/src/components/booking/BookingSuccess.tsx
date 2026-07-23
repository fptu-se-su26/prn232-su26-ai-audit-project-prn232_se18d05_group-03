import { Link } from "react-router-dom";
import type { DoctorInfo } from "../../hooks/useBookingData";
import type { Department } from "../../types";

interface Props {
  department: Department;
  doctor: DoctorInfo;
  date: string;
  time: string;
  appointmentId: string;
  queueNumber?: number;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(t: string) {
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  const suffix = hour < 12 ? "SA" : "CH";
  const display = hour > 12 ? hour - 12 : hour;
  return `${display}:${m} ${suffix}`;
}

export default function BookingSuccess({
  department,
  doctor,
  date,
  time,
  queueNumber,
}: Props) {
  return (
    <div className="step-transition text-center max-w-lg mx-auto">
      <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="material-symbols-outlined text-success text-5xl">
          check_circle
        </span>
      </div>

      <h2 className="text-2xl font-bold text-on-surface mb-2">
        Dat lich thanh cong!
      </h2>
      <p className="text-on-surface-variant mb-8">
        Lich hen cua ban da duoc dat thanh cong. Vui long den dung gio.
      </p>

      <div className="bg-white rounded-2xl border border-outline-variant p-6 text-left mb-8">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary mt-0.5">
              medical_services
            </span>
            <div>
              <p className="text-sm text-on-surface-variant">Chuyen khoa</p>
              <p className="font-semibold text-on-surface">{department.name}</p>
            </div>
          </div>

          <div className="border-t border-outline-variant" />

          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary mt-0.5">
              person
            </span>
            <div>
              <p className="text-sm text-on-surface-variant">Bac si</p>
              <p className="font-semibold text-on-surface">
                BS. {doctor.fullName}
              </p>
            </div>
          </div>

          <div className="border-t border-outline-variant" />

          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary mt-0.5">
              calendar_month
            </span>
            <div>
              <p className="text-sm text-on-surface-variant">Ngay kham</p>
              <p className="font-semibold text-on-surface">
                {formatDate(date)}
              </p>
            </div>
          </div>

          <div className="border-t border-outline-variant" />

          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary mt-0.5">
              schedule
            </span>
            <div>
              <p className="text-sm text-on-surface-variant">Gio kham</p>
              <p className="font-semibold text-on-surface">
                {formatTime(time)}
              </p>
            </div>
          </div>

          {queueNumber != null && (
            <>
              <div className="border-t border-outline-variant" />
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">
                  confirmation_number
                </span>
                <div>
                  <p className="text-sm text-on-surface-variant">
                    So thu tu
                  </p>
                  <p className="font-bold text-2xl text-primary">
                    #{queueNumber}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/appointments"
          className="px-6 py-3 bg-primary text-on-primary rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          Xem lich hen cua toi
        </Link>
        <Link
          to="/"
          className="px-6 py-3 border-2 border-outline-variant text-on-surface rounded-full font-medium hover:bg-surface-container transition-colors"
        >
          Ve trang chu
        </Link>
      </div>
    </div>
  );
}
