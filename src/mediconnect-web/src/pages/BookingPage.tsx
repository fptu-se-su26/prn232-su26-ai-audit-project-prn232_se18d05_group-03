import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useBookingData, type DoctorInfo } from "../hooks/useBookingData";
import { appointmentApi, patientApi } from "../api/services";
import { AppointmentStatus, type Department } from "../types";
import ProgressBar from "../components/booking/ProgressBar";
import StepSpecialty from "../components/booking/StepSpecialty";
import StepDoctor from "../components/booking/StepDoctor";
import StepDateTime from "../components/booking/StepDateTime";
import BookingSuccess from "../components/booking/BookingSuccess";

export default function BookingPage() {
  const { user } = useAuth();
  const { departments, clinics, doctors, loading, error } = useBookingData();

  const [step, setStep] = useState(0);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorInfo | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);

  const filteredDoctors = useMemo(
    () =>
      selectedDept
        ? doctors.filter((d) => d.departmentId === selectedDept.id)
        : [],
    [doctors, selectedDept]
  );

  const selectedClinic = useMemo(() => {
    if (!selectedDept) return null;
    return clinics.find((c) => c.departmentId === selectedDept.id) ?? null;
  }, [clinics, selectedDept]);

  const handleSelectDept = (dept: Department) => {
    setSelectedDept(dept);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setTimeout(() => setStep(1), 300);
  };

  const handleSelectDoctor = (doctor: DoctorInfo) => {
    setSelectedDoctor(doctor);
    setSelectedDate(null);
    setSelectedTime(null);
    setTimeout(() => setStep(2), 300);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleComplete = async () => {
    if (!user || !selectedDoctor || !selectedClinic || !selectedDate || !selectedTime)
      return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      let patientProfileId: string;
      try {
        const { data: profile } = await patientApi.getMe();
        patientProfileId = profile.id;
      } catch {
        const { data: newProfile } = await patientApi.create({
          userAccountId: user.id,
        });
        patientProfileId = newProfile.id;
      }

      const appointmentTime = `${selectedDate}T${selectedTime}:00`;
      const { data } = await appointmentApi.create({
        patientId: patientProfileId,
        doctorId: selectedDoctor.id,
        clinicId: selectedClinic.id,
        appointmentTime,
        status: AppointmentStatus.Requested,
        reason: `Kham ${selectedDept?.name ?? ""}`,
      });
      setAppointmentId(data.id);
      setStep(3);
    } catch {
      setSubmitError("Dat lich that bai. Vui long thu lai.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-primary animate-spin">
            progress_activity
          </span>
          <p className="mt-4 text-on-surface-variant">Dang tai du lieu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-error">
            error
          </span>
          <p className="mt-4 text-error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {step < 3 && <ProgressBar currentStep={step} />}

      {step === 0 && (
        <StepSpecialty
          departments={departments}
          selectedId={selectedDept?.id ?? null}
          onSelect={handleSelectDept}
        />
      )}

      {step === 1 && (
        <StepDoctor
          doctors={filteredDoctors}
          selectedId={selectedDoctor?.id ?? null}
          onSelect={handleSelectDoctor}
        />
      )}

      {step === 2 && (
        <StepDateTime
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onSelectDate={setSelectedDate}
          onSelectTime={setSelectedTime}
        />
      )}

      {step === 3 && selectedDept && selectedDoctor && selectedDate && selectedTime && appointmentId && (
        <BookingSuccess
          department={selectedDept}
          doctor={selectedDoctor}
          date={selectedDate}
          time={selectedTime}
          appointmentId={appointmentId}
        />
      )}

      {/* Navigation buttons */}
      {step > 0 && step < 3 && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-outline-variant">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-5 py-2.5 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container transition-colors font-medium"
          >
            <span className="material-symbols-outlined text-xl">
              arrow_back
            </span>
            Quay lai
          </button>

          {step === 2 && (
            <div className="flex items-center gap-3">
              {submitError && (
                <p className="text-sm text-error">{submitError}</p>
              )}
              <button
                onClick={handleComplete}
                disabled={!selectedDate || !selectedTime || submitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-full font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <span className="material-symbols-outlined text-xl animate-spin">
                      progress_activity
                    </span>
                    Dang xu ly...
                  </>
                ) : (
                  <>
                    Hoan tat dat lich
                    <span className="material-symbols-outlined text-xl">
                      check
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
