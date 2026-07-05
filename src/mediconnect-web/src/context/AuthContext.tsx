import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { UserAccount } from "../types";
import { UserRole } from "../types";
import { authApi } from "../api/services";

// Backend serializes UserRole as a PascalCase string ("Patient"), but the app
// uses the numeric UserRole enum for routing. Normalize on the way in so the
// stored user always has a numeric role.
const ROLE_NAME_TO_ENUM: Record<string, UserRole> = {
  Patient: UserRole.Patient,
  Doctor: UserRole.Doctor,
  Nurse: UserRole.Nurse,
  Admin: UserRole.Admin,
};

function normalizeUser(user: UserAccount): UserAccount {
  const raw = user.role as unknown;
  if (typeof raw === "string" && raw in ROLE_NAME_TO_ENUM) {
    return { ...user, role: ROLE_NAME_TO_ENUM[raw] };
  }
  return user;
}

interface AuthState {
  user: UserAccount | null;
  token: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<UserAccount>;
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    phoneNumber?: string;
  }) => Promise<UserAccount>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function loadInitialState(): AuthState {
  const token = localStorage.getItem("accessToken");
  const userJson = localStorage.getItem("user");
  return {
    token,
    user: userJson ? normalizeUser(JSON.parse(userJson)) : null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(loadInitialState);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await authApi.login(email, password);
    const user = normalizeUser(data.user);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    setState({ token: data.accessToken, user });
    return user;
  }, []);

  const register = useCallback(
    async (req: {
      fullName: string;
      email: string;
      password: string;
      phoneNumber?: string;
    }) => {
      const { data } = await authApi.register({ ...req, role: 0 });
      const user = normalizeUser(data.user);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      setState({ token: data.accessToken, user });
      return user;
    },
    []
  );


  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setState({ token: null, user: null });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        isAuthenticated: !!state.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
