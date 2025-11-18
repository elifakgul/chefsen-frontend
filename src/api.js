// front/src/api.js
import axios from "axios";

// === Django API (backend) ===
export const djangoApi = axios.create({
  baseURL: import.meta.env.VITE_DJANGO_API_URL, // Örn: https://chefsen-backend-1.onrender.com/api/
});

// === FastAPI (chatbot) ===
export const fastApi = axios.create({
  baseURL: import.meta.env.VITE_FASTAPI_API_URL, // Örn: https://chefsen-fastapi1.onrender.com
});

// --- İSTEK ÖNCESİ: Bearer token ekle ---
djangoApi.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- CEVAP SONRASI: 401 gelirse refresh dene ---
djangoApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Response yoksa veya status yoksa
    if (!error.response) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          // refresh endpointi: .../api/token/refresh/
          const res = await axios.post(
            `${import.meta.env.VITE_DJANGO_API_URL}token/refresh/`,
            { refresh: refreshToken }
          );

          const newAccessToken = res.data.access;
          localStorage.setItem("token", newAccessToken);

          // Eski isteğin header'ını güncelle
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Django api instance ile tekrar dene
          return djangoApi(originalRequest);
        } catch (refreshError) {
          console.error("Token yenileme başarısız:", refreshError);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);
