import api from "./api";

export async function getApod() {
  const response = await api.get("/apod");
  return response.data;
}

export async function getApodByDate(date) {
  const response = await api.get("/apod", {
    params: {
      date,
    },
  });

  return response.data;
}