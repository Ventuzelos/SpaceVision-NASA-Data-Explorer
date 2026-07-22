import axios from "axios";

const backendUrl = (
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

const nasaApi = axios.create({
  baseURL: `${backendUrl}/nasa`,
  headers: {
    Accept: "application/json",
  },
});

nasaApi.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("spacevision_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default nasaApi;