const STEPS = [
  { label: "Chon chuyen khoa", icon: "category" },
  { label: "Chon bac si", icon: "person_search" },
  { label: "Chon ngay gio", icon: "calendar_month" },
];

interface Props {
  currentStep: number;
}

export default function ProgressBar({ currentStep }: Props) {
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-3">
        {STEPS.map((step, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                i <= currentStep
                  ? "bg-primary text-on-primary shadow-md"
                  : "bg-surface-container-high text-outline"
              }`}
            >
              {i < currentStep ? (
                <span className="material-symbols-outlined text-xl">check</span>
              ) : (
                <span className="material-symbols-outlined text-xl">
                  {step.icon}
                </span>
              )}
            </div>
            <span
              className={`text-xs font-medium text-center transition-colors ${
                i <= currentStep ? "text-primary" : "text-outline"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
      <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
