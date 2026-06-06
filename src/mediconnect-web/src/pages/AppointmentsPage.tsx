import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { appointmentApi, patientApi } from "../api/services";
import { useAuth } from "../context/AuthContext";
import type { AppointmentRead } from "../types";
import { AppointmentStatus } from "../types";

const STATUS_CONFIG: Record<
  number,
  { label: string; color: string; icon: string }
> = {
  [AppointmentStatus.Requested]: {
    label: "Cho xac nhan",
    color: "bg-yellow-100 text-yellow-800",
    icon: "hourglass_empty",
  },
  [AppointmentStatus.Confirmed]: {
    label: "Da xac nhan",
    color: "bg-blue-100 text-blue-800",
    icon: "check_circle",
  },
  [AppointmentStatus.CheckedIn]: {
    label: "Da check-in",
    color: "bg-purple-100 text-purple-800",
    icon: "how_to_reg",
  },
  [AppointmentStatus.Completed]: {
    label: "Hoan thanh",
    color: "bg-green-100 text-green-800",
    icon: "task_alt",
  },
  [AppointmentStatus.Cancelled]: {
    label: "Da huy",
    color: "bg-red-100 text-red-800",
    icon: "cancel",
  },
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentRead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data: profile } = await patientApi.getMe();
        const { data } = await appointmentApi.getAll();
        const mine = data.filter((a) => a.patientId === profile.id);
        mine.sort(
          (a, b) =>
            new Date(b.appointmentTime).getTime() -
            new Date(a.appointmentTime).getTime()
        );
        setAppointments(mine);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined text-5xl text-primary animate-spin">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-on-surface">
          Lich hen cua toi
        </h1>
        <Link
          to="/booking"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          Dat lich moi
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-6xl text-outline">
            event_busy
          </span>
          <h3 className="text-lg font-semibold text-on-surface mt-4 mb-2">
            Chua co lich hen nao
          </h3>
          <p className="text-on-surface-variant mb-6">
            Ban chua co lich hen nao. Hay dat lich kham ngay!
          </p>
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            Dat lich kham
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => {
            const status = STATUS_CONFIG[apt.status] ?? STATUS_CONFIG[0];
            return (
              <div
                key={apt.id}
                className="bg-white rounded-2xl border border-outline-variant p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-on-primary-container">
                        calendar_month
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface">
                        {formatDateTime(apt.appointmentTime)}
                      </p>
                      {apt.reason && (
                        <p className="text-sm text-on-surface-variant mt-1">
                          {apt.reason}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {status.icon}
                    </span>
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
