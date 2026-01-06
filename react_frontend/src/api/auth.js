import { apiRequest } from "./client";

const TOKEN_KEY = "mediexpress_token";
const USER_KEY = "mediexpress_user";

// PUBLIC_INTERFACE
export function loadStoredAuth() {
  /** Loads token/user from localStorage. */
  try {
    const token = localStorage.getItem(TOKEN_KEY) || "";
    const userRaw = localStorage.getItem(USER_KEY);
    const user = userRaw ? JSON.parse(userRaw) : null;
    return { token, user };
  } catch {
    return { token: "", user: null };
  }
}

// PUBLIC_INTERFACE
export function storeAuth({ token, user }) {
  /** Stores token/user to localStorage. */
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);

    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch {
    // ignore
  }
}

// PUBLIC_INTERFACE
export async function loginApi({ email, password }) {
  /** Calls backend login. Expected response: { token, user }. */
  return apiRequest("/auth/login", { method: "POST", body: { email, password } });
}

// PUBLIC_INTERFACE
export async function registerApi({ name, email, password }) {
  /** Calls backend register. Expected response: { token, user }. */
  return apiRequest("/auth/register", { method: "POST", body: { name, email, password } });
}

// PUBLIC_INTERFACE
export async function meApi(token) {
  /** Fetches current user profile. */
  return apiRequest("/auth/me", { token });
}
