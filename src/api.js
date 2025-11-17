// front/src/api.js
import axios from "axios";

export const djangoApi = axios.create({
  baseURL: import.meta.env.VITE_DJANGO_API_URL,
});

export const fastApi = axios.create({
  baseURL: import.meta.env.VITE_FASTAPI_API_URL,
});
