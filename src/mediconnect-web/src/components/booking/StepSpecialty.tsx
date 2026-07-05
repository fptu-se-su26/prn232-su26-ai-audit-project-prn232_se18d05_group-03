import type { Department } from "../../types";

const SPECIALTY_ICONS: Record<string, string> = {
  cardiology: "cardiology",
  "tim mach": "cardiology",
  dermatology: "dermatology",
  "da lieu": "dermatology",
  neurology: "neurology",
  "than kinh": "neurology",
  orthopedics: "orthopedics",
  "chinh hinh": "orthopedics",
  pediatrics: "pediatrics",
  "nhi khoa": "pediatrics",
  general: "stethoscope",
  "da khoa": "stethoscope",
  "noi khoa": "stethoscope",
};

function getIcon(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(SPECIALTY_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return "medical_services";
}

interface Props {
  departments: Department[];
  selectedId: string | null;
  onSelect: (dept: Department) => void;
}

export default function StepSpecialty({
  departments,
  selectedId,
  onSelect,
}: Props) {
  return (
    <div className="step-transition">
      <h2 className="text-2xl font-bold text-on-surface mb-2">
        Chon chuyen khoa
      </h2>
      <p className="text-on-surface-variant mb-6">
        Chon chuyen khoa ban muon kham de chung toi gioi thieu bac si phu hop.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <button
            key={dept.id}
            onClick={() => onSelect(dept)}
            className={`group relative flex flex-col items-start p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
              selectedId === dept.id
                ? "border-primary bg-primary-container/30 ring-2 ring-primary/20 shadow-md"
                : "border-outline-variant bg-white hover:border-primary/50"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                selectedId === dept.id
                  ? "bg-primary text-on-primary"
                  : "bg-primary-container text-on-primary-container group-hover:bg-primary group-hover:text-on-primary"
              }`}
            >
              <span className="material-symbols-outlined">
                {getIcon(dept.name)}
              </span>
            </div>
            <h3 className="font-semibold text-on-surface mb-1">{dept.name}</h3>
            {dept.description && (
              <p className="text-sm text-on-surface-variant line-clamp-2">
                {dept.description}
              </p>
            )}
            {selectedId === dept.id && (
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
