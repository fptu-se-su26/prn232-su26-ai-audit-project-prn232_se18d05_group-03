import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { UserAccount } from "../types";
import { authApi } from "../api/services";

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
    user: userJson ? JSON.parse(userJson) : null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(loadInitialState);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await authApi.login(email, password);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    setState({ token: data.accessToken, user: data.user });
    return data.user;
  }, []);

  const register = useCallback(
    async (req: {
      fullName: string;
      email: string;
      password: string;
      phoneNumber?: string;
    }) => {
      const { data } = await authApi.register({ ...req, role: 0 });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setState({ token: data.accessToken, user: data.user });
      return data.user;
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
