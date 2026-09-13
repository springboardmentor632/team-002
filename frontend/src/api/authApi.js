/**
 * Mock auth "API" — no backend required.
 *
 * Everything is simulated in the browser using localStorage, with the same
 * function names/shapes the real Spring Boot version would have
 * (register, login, verifyOtp, resendOtp, requestPasswordReset).
 *
 * Swap this file out for a real axios client later without touching
 * AuthContext or any page — the calling code doesn't need to change.
 */

const USERS_KEY = "dh_mock_users";
const OTP_KEY = "dh_mock_otps";
const DELAY_MS = 500; // pretend there's a network

const delay = (ms = DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

function readUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}
function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function readOtps() {
  return JSON.parse(localStorage.getItem(OTP_KEY) || "{}");
}
function writeOtps(otps) {
  localStorage.setItem(OTP_KEY, JSON.stringify(otps));
}
function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
function fakeJwt(email) {
  return `demo.${btoa(email)}.${Date.now()}`;
}

export const authApi = {
  async register({ name, email, password, role }) {
    await delay();

    const users = readUsers();
    if (users.some((u) => u.email === email)) {
      const err = new Error("An account with that email already exists.");
      err.response = { data: { message: err.message } };
      throw err;
    }

    users.push({ name, email, password, role, verified: false });
    writeUsers(users);

    const otps = readOtps();
    const code = generateOtp();
    otps[email] = code;
    writeOtps(otps);

    // No real email service in demo mode — surface it in the console too.
    console.info(`[DecisionHub demo] OTP for ${email}: ${code}`);

    return { userId: email, email, demoOtp: code };
  },

  async login({ email, password }) {
    await delay();

    const users = readUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      const err = new Error("That email and password don't match our records.");
      err.response = { data: { message: err.message } };
      throw err;
    }

    if (!user.verified) {
      const err = new Error("Account not verified yet.");
      err.response = { status: 403, data: { message: err.message } };
      throw err;
    }

    const token = fakeJwt(email);
    localStorage.setItem("dh_access_token", token);
    return { token, user: { name: user.name, email: user.email, role: user.role } };
  },

  async verifyOtp({ email, otp }) {
    await delay();

    const otps = readOtps();
    if (otps[email] !== otp) {
      const err = new Error("That code didn't match. Try again.");
      err.response = { data: { message: err.message } };
      throw err;
    }

    const users = readUsers();
    const idx = users.findIndex((u) => u.email === email);
    if (idx === -1) {
      const err = new Error("No pending signup found for that email.");
      err.response = { data: { message: err.message } };
      throw err;
    }
    users[idx].verified = true;
    writeUsers(users);

    delete otps[email];
    writeOtps(otps);

    const token = fakeJwt(email);
    localStorage.setItem("dh_access_token", token);
    return { token, user: { name: users[idx].name, email, role: users[idx].role } };
  },

  async resendOtp({ email }) {
    await delay();

    const otps = readOtps();
    const code = generateOtp();
    otps[email] = code;
    writeOtps(otps);

    console.info(`[DecisionHub demo] New OTP for ${email}: ${code}`);
    return { sent: true, demoOtp: code };
  },

  async requestPasswordResetOtp({ email }) {
    await delay();

    const users = readUsers();
    if (!users.some((u) => u.email === email)) {
      const err = new Error("No account found with that email.");
      err.response = { data: { message: err.message } };
      throw err;
    }

    const otps = readOtps();
    const code = generateOtp();
    otps[`reset:${email}`] = code;
    writeOtps(otps);

    console.info(`[DecisionHub demo] Password reset OTP for ${email}: ${code}`);
    return { sent: true, demoOtp: code };
  },

  async verifyPasswordResetOtp({ email, otp }) {
    await delay();

    const otps = readOtps();
    if (otps[`reset:${email}`] !== otp) {
      const err = new Error("That code didn't match. Try again.");
      err.response = { data: { message: err.message } };
      throw err;
    }
    return { verified: true };
  },

  async resetPassword({ email, otp, newPassword }) {
    await delay();

    const otps = readOtps();
    if (otps[`reset:${email}`] !== otp) {
      const err = new Error("Your code expired. Request a new one.");
      err.response = { data: { message: err.message } };
      throw err;
    }

    const users = readUsers();
    const idx = users.findIndex((u) => u.email === email);
    if (idx === -1) {
      const err = new Error("No account found with that email.");
      err.response = { data: { message: err.message } };
      throw err;
    }

    users[idx].password = newPassword;
    writeUsers(users);

    delete otps[`reset:${email}`];
    writeOtps(otps);

    return { success: true };
  },

  // Demo-only helper so OTP screens can display the code (no email backend to send it).
  // `type` is "signup" or "reset" depending on which flow is asking.
  getDebugOtp(email, type = "signup") {
    const otps = readOtps();
    return (type === "reset" ? otps[`reset:${email}`] : otps[email]) || null;
  },

  googleOAuthUrl() {
    return null; // no backend to redirect to in demo mode
  },

  logout() {
    localStorage.removeItem("dh_access_token");
  },
};

export default authApi;
