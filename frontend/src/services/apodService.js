import nasaApi from "./nasaApi";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function validateDate(date, fieldName = "data") {
  if (!date) {
    throw new Error(`É necessário indicar a ${fieldName}.`);
  }

  if (!DATE_PATTERN.test(date)) {
    throw new Error(`A ${fieldName} deve estar no formato AAAA-MM-DD.`);
  }

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(`A ${fieldName} não é válida.`);
  }
}

export async function getApod() {
  const { data } = await nasaApi.get("/apod");

  return data;
}

export async function getApodByDate(date) {
  validateDate(date);

  const { data } = await nasaApi.get("/apod", {
    params: {
      date,
    },
  });

  return data;
}

export async function getApodsByDateRange(startDate, endDate) {
  validateDate(startDate, "data inicial");
  validateDate(endDate, "data final");

  if (startDate > endDate) {
    throw new Error(
      "A data inicial não pode ser posterior à data final."
    );
  }

  const { data } = await nasaApi.get("/apod", {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });

  return data;
}