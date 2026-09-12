import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import authApi from "../api/authApi";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Enter your email address.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Enter your password.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 403) {
        // Account created but not yet OTP-verified.
        navigate("/verify-otp");
        return;
      }
      setServerError(
        err?.response?.data?.message || "That email and password don't match our records."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="auth-card__eyebrow-free-heading">Welcome back</h2>
      <p className="auth-card__sub">
        New to DecisionHub? <Link to="/signup">Create an account</Link>
      </p>

      {serverError && <div className="banner banner--error">{serverError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="field-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className={`field-input${errors.email ? " has-error" : ""}`}
            placeholder="you@example.com"
            value={form.email}
            onChange={updateField("email")}
            autoComplete="email"
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div className="field-group password-toggle">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className={`field-input${errors.password ? " has-error" : ""}`}
            placeholder="••••••••"
            value={form.password}
            onChange={updateField("password")}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>

        <div className="field-row">
          <span />
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="divider">or</div>

      <button
        type="button"
        className="oauth-btn"
        onClick={() => setServerError("Google sign-in needs a backend — not available in this demo.")}
      >
        Continue with Google
      </button>

      <p className="form-footnote">
        By continuing you agree to DecisionHub's Terms and Privacy Policy.
      </p>
    </AuthLayout>
  );
}
