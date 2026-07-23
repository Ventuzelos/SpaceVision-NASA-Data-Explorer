import backendApi from "./backendApi";

const TOKEN_KEY = "spacevision_token";

export async function loginUser(credentials) {
  const response = await backendApi.post(
    "/login",
    credentials
  );

  if (response.data.token) {
    sessionStorage.setItem(
      "spacevision_token",
      response.data.token
    );
  }

  return response.data;
}

export async function registerUser(userData) {
  const response = await backendApi.post("/register", userData);

  // O registo já não devolve token/login imediato - a conta só
  // fica utilizável depois de confirmar o email (ver AuthController::register).
  return response.data;
}

export async function resendVerificationEmail(email) {
  const response = await backendApi.post(
    "/email/resend-verification",
    { email }
  );

  return response.data;
}
export async function updateUserProfile(profileData) {
  const response = await backendApi.patch("/user/profile", profileData);

  return response.data;
}

export async function getAuthenticatedUser() {
  const response = await backendApi.get("/user");

  return response.data;
}

export async function deleteUserAccount(password) {
  const response = await backendApi.delete("/user", {
    data: {
      password,
    },
  });

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

export async function requestPasswordReset(email) {
  const response = await backendApi.post("/forgot-password", {
    email,
  });

  return response.data;
}

export async function resetPassword({
  token,
  email,
  password,
  passwordConfirmation,
}) {
  const response = await backendApi.post("/reset-password", {
    token,
    email,
    password,
    password_confirmation: passwordConfirmation,
  });

  return response.data;
}