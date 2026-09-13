import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import OtpInput from "../components/OtpInput";
import { useAuth } from "../context/AuthContext";
import authApi from "../api/authApi";

const RESEND_COOLDOWN_SECONDS = 30;
const OTP_LENGTH = 6;

export default function OtpVerification() {
  const navigate = useNavigate();
  const { pendingEmail, verifyOtp, resendOtp } = useAuth();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [debugOtp, setDebugOtp] = useState(null);

  // Demo mode has no real email service — show the generated code on screen.
  useEffect(() => {
    if (pendingEmail) setDebugOtp(authApi.getDebugOtp(pendingEmail));
  }, [pendingEmail]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // If someone lands here without a pending signup, send them back.
  useEffect(() => {
    if (!pendingEmail) navigate("/signup");
  }, [pendingEmail, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== OTP_LENGTH) {
      setError(`Enter the full ${OTP_LENGTH}-digit code.`);
      return;
    }

    setSubmitting(true);
    try {
      await verifyOtp(otp);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "That code didn't match. Try again.");
      setOtp("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");
    try {
      await resendOtp();
      setDebugOtp(authApi.getDebugOtp(pendingEmail));
      setSuccess("A new code is on its way.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't resend the code. Try again shortly.");
    }
  };

  const filledCount = Math.min(otp.length, OTP_LENGTH);

  return (
    <AuthLayout>
      <div className="otp-icon-row" aria-hidden="true">
        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
          <span key={i} className={i < filledCount ? "filled" : ""} />
        ))}
      </div>

      <h2 className="auth-card__eyebrow-free-heading">Verify your email</h2>
      <p className="auth-card__sub">
        Enter the {OTP_LENGTH}-digit code sent to{" "}
        <strong>{pendingEmail || "your email"}</strong>.
      </p>

      {error && <div className="banner banner--error">{error}</div>}
      {success && !error && <div className="banner banner--success">{success}</div>}
      {debugOtp && (
        <div className="banner banner--success">
          Demo mode — no email backend, so here's the code: <strong>{debugOtp}</strong>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <OtpInput length={OTP_LENGTH} value={otp} onChange={setOtp} hasError={!!error} />

        <div className="otp-meta">
          <span>
            {cooldown > 0 ? `Resend code in ${cooldown}s` : "Didn't get a code?"}
          </span>
          <button type="button" onClick={handleResend} disabled={cooldown > 0}>
            Resend code
          </button>
        </div>

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Verifying…" : "Verify and continue"}
        </button>

        <Link to="/signup">
          <button type="button" className="btn-secondary">
            Use a different email
          </button>
        </Link>
      </form>
    </AuthLayout>
  );
}
