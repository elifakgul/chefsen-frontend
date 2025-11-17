import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
});

// Her istekten önce token ekle
api.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Token süresi dolarsa refresh token ile yenile
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response.status === 401) { // Eğer yetkilendirme hatası alırsak
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                try {
                    const response = await axios.post(
                        "http://127.0.0.1:8000/api/token/refresh/",
                        { refresh: refreshToken }
                    );
                    localStorage.setItem("token", response.data.access);
                    error.config.headers["Authorization"] = `Bearer ${response.data.access}`;
                    return axios(error.config); // Yeniden istek gönder
                } catch (refreshError) {
                    console.error("Token yenileme başarısız:", refreshError);
                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");
                    window.location.href = "/login"; // Kullanıcıyı giriş sayfasına yönlendir
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
