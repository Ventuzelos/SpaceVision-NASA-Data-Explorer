const USERS_KEY = "spacevision_users";
const SESSION_KEY = "spacevision_session";

// Conta de administrador pré-definida. Em produção isto devia vir do
// back-end, mas como o projeto ainda não tem autenticação real do lado
// do servidor, semeamos uma conta admin no localStorage.
const ADMIN_EMAIL = "admin@spacevision.com";
const ADMIN_DEFAULT_PASSWORD = "Admin123";

function getUsers() {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function ensureAdminSeed() {
  const users = getUsers();
  const hasAdmin = users.some(
    (user) => user.email.toLowerCase() === ADMIN_EMAIL
  );

  if (!hasAdmin) {
    users.push({
      id: "admin-seed",
      name: "Administrador",
      email: ADMIN_EMAIL,
      password: ADMIN_DEFAULT_PASSWORD,
      isAdmin: true,
    });
    saveUsers(users);
  }
}

ensureAdminSeed();

function setSession(user) {
  const session = {
    id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: !!user.isAdmin || user.email.toLowerCase() === ADMIN_EMAIL,
  };
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

export function isAdmin() {
  const user = getCurrentUser();
  return !!user?.isAdmin;
}

export function getRegisteredUsersCount() {
  // Não contamos a conta de administrador semeada como "conta registada".
  return getUsers().filter((user) => user.email.toLowerCase() !== ADMIN_EMAIL)
    .length;
}

export function updateCurrentUser({ name, email }) {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    throw new Error("Não existe sessão iniciada.");
  }

  const users = getUsers();

  const emailTaken = users.some(
    (user) =>
      user.id !== currentUser.id &&
      user.email.toLowerCase() === email.toLowerCase()
  );

  if (emailTaken) {
    throw new Error("Já existe uma conta com este email.");
  }

  const updatedUsers = users.map((user) =>
    user.id === currentUser.id ? { ...user, name, email } : user
  );

  saveUsers(updatedUsers);

  const updatedUser = updatedUsers.find((user) => user.id === currentUser.id);
  return setSession(updatedUser);
}

export function deleteCurrentUser() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    throw new Error("Não existe sessão iniciada.");
  }

  const remainingUsers = getUsers().filter(
    (user) => user.id !== currentUser.id
  );
  saveUsers(remainingUsers);

  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("authUpdated"));
}