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

export default nasaApi;