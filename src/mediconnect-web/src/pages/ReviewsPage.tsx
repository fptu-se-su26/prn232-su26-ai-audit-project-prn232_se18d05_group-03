import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  patientApi,
  ratingApi,
  staffApi,
  phrApi,
} from "../api/services";
import type {
  PatientProfile,
  OutpatientVisit,
  ServiceRating,
  StaffDirectory,
  Clinic,
} from "../types";
import { VisitStatus } from "../types";

function fmtDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const dt = new Date(dateStr);
  return dt.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

interface RateableVisit extends OutpatientVisit {
  doctorName?: string;
  clinicName?: string;
  rating?: ServiceRating;
}

// ── Star rating control ─────────────────────────────────────────────────────
function StarRating({
  value,
  onChange,
  readOnly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = (hover || value) >= n;
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onMouseEnter={() => !readOnly && setHover(n)}
            onMouseLeave={() => !readOnly && setHover(0)}
            onClick={() => !readOnly && onChange?.(n)}
            className={readOnly ? "cursor-default" : "cursor-pointer"}
            aria-label={`${n} sao`}
          >
            <span
              className="material-symbols-outlined text-2xl"
              style={{
                color: active ? "#f5b301" : "var(--color-outline-variant)",
                fontVariationSettings: active ? '"FILL" 1' : '"FILL" 0',
              }}
            >
              star
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function ReviewsPage() {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [visits, setVisits] = useState<RateableVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [noProfile, setNoProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNoProfile(false);
    try {
      console.log("[Reviews] Bắt đầu tải dữ liệu đánh giá...");

      let pat: PatientProfile;
      try {
        const res = await patientApi.getMe();
        pat = res.data;
      } catch {
        setNoProfile(true);
        setLoading(false);
        return;
      }
      setProfile(pat);

      const [histRes, ratingsRes, staffRes, clinicsRes] = await Promise.all([
        patientApi.getHistory(pat.id),
        ratingApi.getAll(),
        staffApi.getDirectory(),
        phrApi.getAllClinics(),
      ]);

      const staffMap = new Map<string, StaffDirectory>(staffRes.data.map((s) => [s.id, s]));
      const clinicMap = new Map<string, Clinic>(clinicsRes.data.map((c) => [c.id, c]));
      const myRatings = ratingsRes.data.filter((r) => r.patientId === pat.id);
      const ratingByVisit = new Map<string, ServiceRating>(
        myRatings.map((r) => [r.outpatientVisitId, r])
      );

      const rateable: RateableVisit[] = histRes.data.visits
        .filter((v) => v.status === VisitStatus.Completed)
        .map((v) => ({
          ...v,
          doctorName: staffMap.get(v.doctorId)?.name,
          clinicName: clinicMap.get(v.clinicId)?.name,
          rating: ratingByVisit.get(v.id),
        }))
        .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());

      setVisits(rateable);
      console.log(`[Reviews] Tải xong — ${rateable.length} lần khám hoàn tất, ${myRatings.length} đã đánh giá.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi không xác định";
      console.error("[Reviews] Lỗi khi tải dữ liệu:", msg);
      setError("Không thể tải dữ liệu đánh giá. Vui lòng thử lại.");
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

  const handleSubmit = async (visit: RateableVisit, score: number, comment: string) => {
    if (!profile) return;
    try {
      console.log(`[Reviews] Gửi đánh giá ${score} sao cho lần khám ${visit.id}...`);
      const res = await ratingApi.create({
        patientId: profile.id,
        doctorId: visit.doctorId,
        outpatientVisitId: visit.id,
        score,
        comment: comment.trim() || undefined,
      });
      setVisits((prev) => prev.map((v) => (v.id === visit.id ? { ...v, rating: res.data } : v)));
      showToast("Cảm ơn bạn đã đánh giá!");
    } catch {
      showToast("Không thể gửi đánh giá. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
          <p>Đang tải dữ liệu đánh giá...</p>
        </div>
      </div>
    );
  }

  if (noProfile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <span className="material-symbols-outlined text-6xl text-primary mb-4">reviews</span>
        <h1 className="text-2xl font-bold text-on-surface mb-2">Chưa có hồ sơ bệnh nhân</h1>
        <p className="text-on-surface-variant mb-6">
          Bạn cần có lần khám hoàn tất để đánh giá chất lượng dịch vụ.
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

  const ratedCount = visits.filter((v) => v.rating).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">reviews</span>
          Đánh giá dịch vụ khám chữa bệnh
        </h1>
        <p className="text-on-surface-variant mt-1">
          Chia sẻ trải nghiệm của bạn sau mỗi lần khám để giúp bệnh viện cải thiện chất lượng.
          Đã đánh giá {ratedCount}/{visits.length} lần khám.
        </p>
      </div>

      {visits.length === 0 ? (
        <div className="bg-surface-container-low rounded-2xl p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3">event_busy</span>
          <p className="text-on-surface-variant">
            Bạn chưa có lần khám nào hoàn tất để đánh giá.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visits.map((v) => (
            <ReviewCard key={v.id} visit={v} onSubmit={handleSubmit} />
          ))}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-on-surface text-surface px-5 py-3 rounded-full shadow-lg z-50 text-sm max-w-[90vw]">
          {toast}
        </div>
      )}
    </div>
  );
}

// ── Review card ─────────────────────────────────────────────────────────────
function ReviewCard({
  visit,
  onSubmit,
}: {
  visit: RateableVisit;
  onSubmit: (visit: RateableVisit, score: number, comment: string) => void;
}) {
  const [score, setScore] = useState(visit.rating?.score ?? 0);
  const [comment, setComment] = useState(visit.rating?.comment ?? "");
  const [submitting, setSubmitting] = useState(false);
  const alreadyRated = !!visit.rating;

  const submit = async () => {
    if (score < 1) return;
    setSubmitting(true);
    await onSubmit(visit, score, comment);
    setSubmitting(false);
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-semibold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">stethoscope</span>
            BS. {visit.doctorName ?? "—"}
          </p>
          <p className="text-sm text-on-surface-variant mt-0.5">
            {visit.clinicName ?? "Phòng khám"} · Khám ngày {fmtDate(visit.visitDate)}
          </p>
          {visit.diagnosisDescription && (
            <p className="text-sm text-on-surface-variant mt-0.5">Chẩn đoán: {visit.diagnosisDescription}</p>
          )}
        </div>
        {alreadyRated && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-tertiary-container text-on-tertiary-container">
            <span className="material-symbols-outlined text-[16px]">task_alt</span>
            Đã đánh giá
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 mb-3">
        <StarRating value={score} onChange={setScore} readOnly={alreadyRated} />
        {score > 0 && <span className="text-sm text-on-surface-variant">{score}/5</span>}
      </div>

      {alreadyRated ? (
        visit.rating?.comment && (
          <p className="text-sm text-on-surface bg-surface-container-low rounded-lg p-3">
            “{visit.rating.comment}”
          </p>
        )
      ) : (
        <>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            placeholder="Nhận xét của bạn về bác sĩ và dịch vụ (tùy chọn)..."
            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm mb-3"
          />
          <div className="flex justify-end">
            <button
              onClick={submit}
              disabled={score < 1 || submitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {submitting && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
              <span className="material-symbols-outlined text-[18px]">send</span>
              Gửi đánh giá
            </button>
          </div>
        </>
      )}
    </div>
  );
}
