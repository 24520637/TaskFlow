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

function withToken(token, options = {}) {
  return {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`
    }
  };
}

export const taskApi = {
  list: (token) => request("/tasks", withToken(token)),
  create: (token, payload) => request("/tasks", withToken(token, {
    method: "POST",
    body: JSON.stringify(payload)
  })),
  update: (token, id, payload) => request(`/tasks/${id}`, withToken(token, {
    method: "PUT",
    body: JSON.stringify(payload)
  })),
  remove: (token, id) => request(`/tasks/${id}`, withToken(token, { method: "DELETE" }))
};

export const categoryApi = {
  list: (token) => request("/categories", withToken(token))
};
