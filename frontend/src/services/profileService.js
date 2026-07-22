import backendApi from "./backendApi";

export async function updateNasaApiKey(nasaApiKey) {
  const response = await backendApi.patch(
    "/profile/nasa-api-key",
    {
      nasa_api_key: nasaApiKey,
    }
  );

  return response.data;
}

export async function removeNasaApiKey() {
  const response = await backendApi.patch(
    "/profile/nasa-api-key",
    {
      nasa_api_key: null,
    }
  );

  return response.data;
}