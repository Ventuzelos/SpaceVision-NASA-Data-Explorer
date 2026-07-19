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

export async function getApodsByDateRange(startDate, endDate) {
  if (!startDate || !endDate) {
    throw new Error("É necessário indicar a data inicial e a data final.");
  }

  const { data } = await nasaApi.get("/apod", {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });

  return data;
}