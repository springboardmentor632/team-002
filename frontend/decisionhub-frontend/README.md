# DecisionHub — Auth Frontend (Login · Signup · OTP Verification)

Frontend-only demo of the Milestone 1 auth flow — React frontend skeleton,
role-based signup, JWT-style login, OTP email verification. **No backend
required.** Everything is simulated in the browser with `localStorage`.

## Structure

```
decisionhub-frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                 # React entry point
    ├── App.jsx                  # Routes: /login /signup /verify-otp /forgot-password /dashboard
    ├── api/
    │   └── authApi.js           # Mock auth service — localStorage-backed, no server needed
    ├── context/
    │   └── AuthContext.jsx      # Holds the signed-in user + the OTP-pending email
    ├── components/
    │   ├── AuthLayout.jsx       # Shared split-screen shell (decision/vote hero + form slot)
    │   ├── OtpInput.jsx         # 6-digit code input (auto-advance, backspace, paste)
    │   └── ProtectedRoute.jsx   # Redirects to /login if there's no signed-in user
    ├── pages/
    │   ├── Login.jsx
    │   ├── Signup.jsx
    │   ├── OtpVerification.jsx
    │   └── ForgotPassword.jsx
    └── styles/
        └── auth.css             # Design tokens + component styles for the whole module
```

## Running it

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173/login`).

## How the demo works (no backend)

`src/api/authApi.js` simulates a backend entirely client-side:

- **Signup** stores the new account in `localStorage` (`dh_mock_users`) and
  generates a random 6-digit OTP, stored under `dh_mock_otps`.
- Since there's no real email service, the **Verify OTP** screen shows the
  generated code directly on the page (and logs it to the browser console)
  so you can complete the flow yourself.
- **Login** checks email/password against the mock user list and requires
  the account to be OTP-verified first.
- **Forgot password** and **Google sign-in** are stubbed — they show a
  message rather than actually sending an email or redirecting anywhere.
- A signed-in session is a fake token stored under `dh_access_token` in
  `localStorage`; clearing it (or your browser storage) signs you out.

Because everything lives in `localStorage`, refreshing the page keeps you
signed in, and accounts persist across reloads (but are specific to your
browser).

## Swapping in a real backend later

Replace the contents of `src/api/authApi.js` with real `axios`/`fetch` calls
to your Spring Boot endpoints (`/auth/register`, `/auth/login`,
`/auth/verify-otp`, `/auth/resend-otp`, `/auth/password-reset`). Keep the
same exported function names and return shapes, and nothing in
`AuthContext.jsx` or any page needs to change.

## Design notes

The auth screens use the same compare-and-vote visual language as the
product itself — an animated two-option vote card sits in the hero panel
instead of a generic illustration. Colors: an amber/teal pair standing in
for "Option A / Option B," on an ink-navy base. Fonts: Space Grotesk for
headings and numbers, Inter for body and form text.
