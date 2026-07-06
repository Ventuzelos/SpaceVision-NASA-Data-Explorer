// const NASA_API_KEY = "TxaaZFCkFzyFosJIPfKWYFRuJhtTBVMBxhSxgOl2";

// const BASE_URL = "https://api.nasa.gov";

// export { NASA_API_KEY, BASE_URL };

import axios from "axios";

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || "TxaaZFCkFzyFosJIPfKWYFRuJhtTBVMBxhSxgOl2";
const NASA_BASE_URL = "https://api.nasa.gov";

const api = axios.create({
  baseURL: NASA_BASE_URL,
  params: {
    api_key: NASA_API_KEY,
  },
});

export { NASA_API_KEY, NASA_BASE_URL };
export default api;
