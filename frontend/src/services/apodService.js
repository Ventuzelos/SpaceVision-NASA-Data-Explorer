import nasaApi from "./nasaApi";

export async function getApod() {
  const { data } = await nasaApi.get("/apod");

  return data;
}

export async function getApodByDate(date) {
  if (!date) {
    throw new Error("É necessário indicar uma data.");
  }

  const { data } = await nasaApi.get("/apod", {
    params: {
      date,
    },
  });

  return data;
}