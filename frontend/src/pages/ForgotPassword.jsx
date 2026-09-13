import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import OtpInput from "../components/OtpInput";
import authApi from "../api/authApi";

const OTP_LENGTH = 6;

// Step 1: enter email -> Step 2: enter OTP -> Step 3: set new password.
export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [debugOtp, setDebugOtp] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const { demoOtp } = await authApi.requestPasswordResetOtp({ email });
      setDebugOtp(demoOtp);
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't send a code. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== OTP_LENGTH) {
      setError(`Enter the full ${OTP_LENGTH}-digit code.`);
      return;
    }

    setSubmitting(true);
    try {
      await authApi.verifyPasswordResetOtp({ email, otp });
      setStep(3);
    } catch (err) {
      setError(err?.response?.data?.message || "That code didn't match. Try again.");
      setOtp("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccess("");
    try {
      const { demoOtp } = await authApi.requestPasswordResetOtp({ email });
      setDebugOtp(demoOtp);
      setSuccess("A new code is on its way.");
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't resend the code.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      await authApi.resetPassword({ email, otp, newPassword });
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't reset your password. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      {step === 1 && (
        <>
          <h2 className="auth-card__eyebrow-free-heading">Reset your password</h2>
          <p className="auth-card__sub">
            Remembered it after all? <Link to="/login">Back to sign in</Link>
          </p>

          {error && <div className="banner banner--error">{error}</div>}

          <form onSubmit={handleRequestOtp} noValidate>
            <div className="field-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className={`field-input${error ? " has-error" : ""}`}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Sending code…" : "Send verification code"}
            </button>
          </form>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="auth-card__eyebrow-free-heading">Enter your code</h2>
          <p className="auth-card__sub">
            We sent a {OTP_LENGTH}-digit code to <strong>{email}</strong>.
          </p>

          {error && <div className="banner banner--error">{error}</div>}
          {success && !error && <div className="banner banner--success">{success}</div>}
          {debugOtp && (
            <div className="banner banner--success">
              Demo mode — no email backend, so here's the code: <strong>{debugOtp}</strong>
            </div>
          )}

          <form onSubmit={handleVerifyOtp} noValidate>
            <OtpInput length={OTP_LENGTH} value={otp} onChange={setOtp} hasError={!!error} />

            <div className="otp-meta">
              <span>Didn't get a code?</span>
              <button type="button" onClick={handleResendOtp}>
                Resend code
              </button>
            </div>

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Verifying…" : "Verify code"}
            </button>

            <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
              Use a different email
            </button>
          </form>
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="auth-card__eyebrow-free-heading">Set a new password</h2>
          <p className="auth-card__sub">Choose something you haven't used before.</p>

          {error && <div className="banner banner--error">{error}</div>}

          <form onSubmit={handleResetPassword} noValidate>
            <div className="field-group">
              <label htmlFor="newPassword">New password</label>
              <input
                id="newPassword"
                type="password"
                className={`field-input${error ? " has-error" : ""}`}
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="field-group">
              <label htmlFor="confirmPassword">Confirm new password</label>
              <input
                id="confirmPassword"
                type="password"
                className={`field-input${error ? " has-error" : ""}`}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Saving…" : "Reset password"}
            </button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}
