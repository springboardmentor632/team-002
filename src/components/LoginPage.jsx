import { useState } from 'react'
import './LoginPage.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const [values, setValues] = useState({ email: '', password: '' })
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!values.email.trim()) next.email = 'Email address is required'
    else if (!EMAIL_RE.test(values.email.trim()))
      next.email = 'Enter a valid email address'

    if (!values.password) next.password = 'Password is required'
    else if (values.password.length < 8)
      next.password = 'Password must be at least 8 characters'

    return next
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      // Replace with the real authentication call.
      await new Promise((resolve) => setTimeout(resolve, 900))
      console.log('Sign in', { ...values, remember })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <div className="backdrop" aria-hidden="true">
        <span className="glow glow-a" />
        <span className="glow glow-b" />
        <svg className="swoosh" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <path d="M-80 820 C 240 660, 350 420, 300 100" />
          <path d="M1520 100 C 1240 260, 1160 520, 1230 880" />
          <path d="M1600 340 C 1330 430, 1270 630, 1350 900" />
        </svg>
      </div>

      <main className="card">
        <header className="card-head">
          <h1>Welcome Back</h1>
          <p>Enter your credentials to access your account</p>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="name@company.com"
              value={values.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p className="error" id="email-error" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="password-wrap">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={values.password}
                onChange={handleChange}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && (
              <p className="error" id="password-error" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          <div className="row">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              <span className="box" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M5 12.5 10 17.5 19 7" />
                </svg>
              </span>
              <span>Remember me</span>
            </label>

            <a className="link" href="#forgot-password">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in to your account'}
          </button>
        </form>

        <p className="card-foot">
          Don&apos;t have an account?{' '}
          <a className="link" href="#create-account">
            Create account
          </a>
        </p>
      </main>
    </div>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a3 3 0 0 0 4.2 4.2" />
      <path d="M9.4 5.2A9.6 9.6 0 0 1 12 5c6.4 0 10 7 10 7a17.4 17.4 0 0 1-3.4 4.3M6.2 6.6A17.3 17.3 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 3.6-.7" />
    </svg>
  )
}
