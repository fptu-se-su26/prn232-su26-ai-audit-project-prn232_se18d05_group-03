import { useState, useEffect } from "react";
import { departmentApi, clinicApi, staffApi, userApi } from "../api/services";
import type {
  Department,
  Clinic,
  StaffProfile,
  UserAccount,
  ClinicWithServices,
} from "../types";

export interface DoctorInfo extends StaffProfile {
  fullName: string;
  email: string;
}

export function useBookingData() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [doctors, setDoctors] = useState<DoctorInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [deptRes, clinicRes, staffRes, userRes] = await Promise.all([
          departmentApi.getAll(),
          clinicApi.getActive(),
          staffApi.getAll(),
          userApi.getAll(),
        ]);

        setDepartments(deptRes.data);
        setClinics(clinicRes.data);

        const userMap = new Map<string, UserAccount>();
        userRes.data.forEach((u) => userMap.set(u.id, u));

        const doctorList: DoctorInfo[] = staffRes.data
          .filter((s) => s.staffType === 0)
          .map((s) => {
            const user = userMap.get(s.userAccountId);
            return {
              ...s,
              fullName: user?.fullName ?? "Unknown",
              email: user?.email ?? "",
            };
          });

        setDoctors(doctorList);
      } catch {
        setError("Khong the tai du lieu. Vui long thu lai.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const getClinicServices = async (clinicId: string) => {
    const { data } = await clinicApi.getServices(clinicId);
    return data as ClinicWithServices;
  };

  return { departments, clinics, doctors, loading, error, getClinicServices };
}
