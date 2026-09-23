const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }

  return data;
}

export const authApi = {
  register: (payload) => request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  }),
  login: (payload) => request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  }),
  me: (token) => request("/auth/me", {
    headers: { Authorization: `Bearer ${token}` }
  })
};
