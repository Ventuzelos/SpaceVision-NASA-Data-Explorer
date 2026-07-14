import axios from "axios";

const backendUrl = (
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

const backendApi = axios.create({
  baseURL: backendUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

backendApi.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("spacevision_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default backendApi;