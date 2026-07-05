import { useState, useMemo } from "react";

interface Props {
  selectedDate: string | null;
  selectedTime: string | null;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
}

const TIME_SLOTS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

const DAY_NAMES = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function formatTime(t: string) {
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  const suffix = hour < 12 ? "SA" : "CH";
  const display = hour > 12 ? hour - 12 : hour;
  return `${display}:${m} ${suffix}`;
}

export default function StepDateTime({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}: Props) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const calendarDays = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [viewMonth]);

  const isDateDisabled = (day: number) => {
    const d = new Date(
      viewMonth.getFullYear(),
      viewMonth.getMonth(),
      day
    );
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    if (d < todayStart) return true;
    if (d.getDay() === 0) return true;
    return false;
  };

  const formatDateStr = (day: number) => {
    const y = viewMonth.getFullYear();
    const m = String(viewMonth.getMonth() + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const monthLabel = viewMonth.toLocaleDateString("vi-VN", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="step-transition">
      <h2 className="text-2xl font-bold text-on-surface mb-2">
        Chon ngay va gio kham
      </h2>
      <p className="text-on-surface-variant mb-6">
        Chon ngay va khung gio phu hop voi ban.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-white rounded-2xl border border-outline-variant p-5">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() =>
                setViewMonth(
                  new Date(
                    viewMonth.getFullYear(),
                    viewMonth.getMonth() - 1,
                    1
                  )
                )
              }
              className="p-2 hover:bg-surface-container rounded-full transition-colors"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <h3 className="font-semibold text-on-surface capitalize">
              {monthLabel}
            </h3>
            <button
              onClick={() =>
                setViewMonth(
                  new Date(
                    viewMonth.getFullYear(),
                    viewMonth.getMonth() + 1,
                    1
                  )
                )
              }
              className="p-2 hover:bg-surface-container rounded-full transition-colors"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAY_NAMES.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-medium text-outline py-1"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) =>
              day === null ? (
                <div key={i} />
              ) : (
                <button
                  key={i}
                  disabled={isDateDisabled(day)}
                  onClick={() => onSelectDate(formatDateStr(day))}
                  className={`h-10 rounded-xl text-sm font-medium transition-all ${
                    isDateDisabled(day)
                      ? "text-outline/40 cursor-not-allowed"
                      : selectedDate === formatDateStr(day)
                      ? "bg-primary text-on-primary shadow-md"
                      : "hover:bg-primary-container text-on-surface"
                  }`}
                >
                  {day}
                </button>
              )
            )}
          </div>
        </div>

        {/* Time slots */}
        <div className="bg-white rounded-2xl border border-outline-variant p-5">
          <h3 className="font-semibold text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              schedule
            </span>
            Khung gio kham
          </h3>

          {!selectedDate ? (
            <div className="text-center py-8 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">
                event
              </span>
              <p>Vui long chon ngay truoc</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-on-surface-variant mb-3">Buoi sang</p>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {TIME_SLOTS.filter((t) => parseInt(t) < 12).map((t) => (
                  <button
                    key={t}
                    onClick={() => onSelectTime(t)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                      selectedTime === t
                        ? "bg-primary text-on-primary shadow-md"
                        : "bg-surface-container hover:bg-primary-container text-on-surface"
                    }`}
                  >
                    {formatTime(t)}
                  </button>
                ))}
              </div>
              <p className="text-sm text-on-surface-variant mb-3">Buoi chieu</p>
              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.filter((t) => parseInt(t) >= 12).map((t) => (
                  <button
                    key={t}
                    onClick={() => onSelectTime(t)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                      selectedTime === t
                        ? "bg-primary text-on-primary shadow-md"
                        : "bg-surface-container hover:bg-primary-container text-on-surface"
                    }`}
                  >
                    {formatTime(t)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
