import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
});

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;
    if (err.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const res = await axios.post("http://localhost:4000/auth/refresh", { token: refreshToken });
          localStorage.setItem("token", res.data.token);
          originalRequest.headers["Authorization"] = `Bearer ${res.data.token}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(err);
  }
);

export default api;
