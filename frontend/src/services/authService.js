const USERS_KEY = "spacevision_users";
const SESSION_KEY = "spacevision_session";

function getUsers() {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setSession(user) {
  const session = { id: user.id, name: user.name, email: user.email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("authUpdated"));
  return session;
}

export function registerUser({ name, email, password }) {
  const users = getUsers();

  const exists = users.some(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (exists) {
    throw new Error("Já existe uma conta com este email.");
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password,
  };

  users.push(newUser);
  saveUsers(users);

  return setSession(newUser);
}

export function loginUser({ email, password }) {
  const users = getUsers();

  const user = users.find(
    (item) =>
      item.email.toLowerCase() === email.toLowerCase() &&
      item.password === password
  );

  if (!user) {
    throw new Error("Email ou palavra-passe incorretos.");
  }

  return setSession(user);
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("authUpdated"));
}

export function getCurrentUser() {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
}

export function isAuthenticated() {
  return !!getCurrentUser();
}
