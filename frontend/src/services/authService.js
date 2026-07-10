import backendApi from "./backendApi";

const TOKEN_KEY = "spacevision_token";

export async function loginUser(credentials) {
  const response = await backendApi.post("/login", credentials);

  const { user, token } = response.data;

  sessionStorage.setItem(TOKEN_KEY, token);

  return {
    user,
    token,
  };
}

export async function registerUser(userData) {
  const response = await backendApi.post("/register", userData);

  const { user, token } = response.data;

  sessionStorage.setItem(TOKEN_KEY, token);

  return {
    user,
    token,
  };
}

export async function getAuthenticatedUser() {
  const response = await backendApi.get("/user");

  return response.data;
}

export async function logoutUser() {
  try {
    await backendApi.post("/logout");
  } finally {
    sessionStorage.removeItem(TOKEN_KEY);
  }
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}