import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import authApi from "../api/authApi";

const ROLES = [
  { value: "USER", label: "Member" },
  { value: "COMMUNITY_MODERATOR", label: "Moderator" },
];

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Enter your full name.";
    if (!form.email.trim()) next.email = "Enter your email address.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Choose a password.";
    else if (form.password.length < 8) next.password = "Use at least 8 characters.";
    if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords don't match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      navigate("/verify-otp");
    } catch (err) {
      setServerError(
        err?.response?.data?.message || "We couldn't create that account. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="auth-card__eyebrow-free-heading">Create your account</h2>
      <p className="auth-card__sub">
        Already have one? <Link to="/login">Sign in</Link>
      </p>

      {serverError && <div className="banner banner--error">{serverError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="field-group">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            type="text"
            className={`field-input${errors.name ? " has-error" : ""}`}
            placeholder="Aditi Rao"
            value={form.name}
            onChange={updateField("name")}
            autoComplete="name"
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

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
            placeholder="At least 8 characters"
            value={form.password}
            onChange={updateField("password")}
            autoComplete="new-password"
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

        <div className="field-group">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            className={`field-input${errors.confirmPassword ? " has-error" : ""}`}
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChange={updateField("confirmPassword")}
            autoComplete="new-password"
          />
          {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
        </div>

        <div className="field-group">
          <label>Account type</label>
          <div className="role-select" role="group" aria-label="Account type">
            {ROLES.map((r) => (
              <button
                type="button"
                key={r.value}
                className="role-chip"
                aria-pressed={form.role === r.value}
                onClick={() => setForm((prev) => ({ ...prev, role: r.value }))}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
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
        We'll email you a 6-digit code to verify this address next.
      </p>
    </AuthLayout>
  );
}
