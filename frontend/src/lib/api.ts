import axios from "axios";

const API_URL = "https://millennium.loaywaleed.tech/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Store CSRF token
let csrfToken: string | null = null;

// Add CSRF token to POST/PUT/DELETE requests
api.interceptors.request.use((config) => {
  if (
    csrfToken &&
    ["post", "put", "delete"].includes(config.method?.toLowerCase() || "")
  ) {
    config.headers["X-CSRF-Token"] = csrfToken;
  }
  return config;
});

// Capture CSRF token from response headers
api.interceptors.response.use(
  (response) => {
    const newToken = response.headers["x-csrf-token"];
    if (newToken) {
      csrfToken = newToken;
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Export function to set CSRF token manually if needed
export const setCsrfToken = (token: string) => {
  csrfToken = token;
};
