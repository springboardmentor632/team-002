import React, { createContext, useContext, useMemo, useState } from "react";
import authApi from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [pendingEmail, setPendingEmail] = useState(null); // email awaiting OTP verification

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    const data = await authApi.register(payload);
    setPendingEmail(payload.email);
    return data;
  };

  const verifyOtp = async (otp) => {
    const data = await authApi.verifyOtp({ email: pendingEmail, otp });
    setUser(data.user);
    setPendingEmail(null);
    return data;
  };

  const resendOtp = async () => {
    if (!pendingEmail) throw new Error("No pending signup to resend a code for.");
    return authApi.resendOtp({ email: pendingEmail });
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, pendingEmail, setPendingEmail, login, register, verifyOtp, resendOtp, logout }),
    [user, pendingEmail]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
