import type { DoctorInfo } from "../../hooks/useBookingData";

interface Props {
  doctors: DoctorInfo[];
  selectedId: string | null;
  onSelect: (doctor: DoctorInfo) => void;
}

export default function StepDoctor({ doctors, selectedId, onSelect }: Props) {
  if (doctors.length === 0) {
    return (
      <div className="step-transition text-center py-12">
        <span className="material-symbols-outlined text-6xl text-outline mb-4">
          person_off
        </span>
        <h3 className="text-lg font-semibold text-on-surface mb-2">
          Chua co bac si
        </h3>
        <p className="text-on-surface-variant">
          Hien tai chua co bac si nao trong chuyen khoa nay. Vui long quay lai
          chon chuyen khoa khac.
        </p>
      </div>
    );
  }

  return (
    <div className="step-transition">
      <h2 className="text-2xl font-bold text-on-surface mb-2">
        Chon bac si
      </h2>
      <p className="text-on-surface-variant mb-6">
        Chon bac si ma ban muon kham. Thong tin kinh nghiem va chuyen mon duoc
        hien thi ben duoi.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {doctors.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onSelect(doc)}
            className={`group relative flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
              selectedId === doc.id
                ? "border-primary bg-primary-container/30 ring-2 ring-primary/20 shadow-md"
                : "border-outline-variant bg-white hover:border-primary/50"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                selectedId === doc.id
                  ? "bg-primary text-on-primary"
                  : "bg-secondary-container text-on-primary-container"
              }`}
            >
              <span className="material-symbols-outlined text-2xl">person</span>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-on-surface mb-1">
                BS. {doc.fullName}
              </h3>
              {doc.specialty && (
                <p className="text-sm text-primary font-medium mb-2">
                  {doc.specialty}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {doc.degree && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-container rounded-full text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-xs">
                      school
                    </span>
                    {doc.degree}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-container rounded-full text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-xs">
                    work_history
                  </span>
                  {doc.yearsExperience} nam kinh nghiem
                </span>
              </div>
            </div>

            {selectedId === doc.id && (
              <span className="absolute top-3 right-3 material-symbols-outlined text-primary">
                check_circle
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
