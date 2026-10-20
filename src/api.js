const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const productionApiBaseUrl =
  "https://mocktest-backend-26c22.containers.snapdeploy.app";
const API_BASE_URL = (
  configuredApiBaseUrl ||
  (import.meta.env.PROD ? productionApiBaseUrl : "")
).replace(/\/+$/, "");
const USER_STORAGE_KEY = "formative.user";

export function resolveApiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

export async function apiRequest(path, options = {}) {
  let token;
  try {
    token = JSON.parse(localStorage.getItem(USER_STORAGE_KEY))?.token;
  } catch {
    token = undefined;
  }

  const response = await fetch(resolveApiUrl(path), {
    ...options,
    headers: {
      ...(options.body && !(options.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401 && token) {
      localStorage.removeItem(USER_STORAGE_KEY);
      window.dispatchEvent(new Event("formative:auth-expired"));
    }
    const body = await response.json().catch(() => null);
    const error = new Error(
      body?.message || body?.error || `Request failed (${response.status})`,
    );
    error.status = response.status;
    throw error;
  }

  return response.status === 204 ? null : response.json();
}
