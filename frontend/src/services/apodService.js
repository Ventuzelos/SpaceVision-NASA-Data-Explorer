import api from "./api";

export async function getApod() {
  const { data } = await api.get("/planetary/apod");
  return data;
}

export async function getApodByDate(date) {
  const { data } = await api.get("/planetary/apod", {
    params: {
      date,
    },
  });

  return data;
}