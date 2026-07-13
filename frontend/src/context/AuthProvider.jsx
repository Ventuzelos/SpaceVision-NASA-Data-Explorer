import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AuthContext from "./authContext";

import {
  getAuthenticatedUser,
  getToken,
  loginUser,
  logoutUser,
  registerUser,
  removeToken,
} from "../services/authService";

import {
  clearFavoritesCache,
} from "../services/favoritesService";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] =
    useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = getToken();

      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const authenticatedUser =
          await getAuthenticatedUser();

        setUser(authenticatedUser);
      } catch (error) {
        console.error(
          "Não foi possível recuperar a sessão:",
          error
        );

        removeToken();
        clearFavoritesCache();
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    }

    loadUser();
  }, []);

  async function login(credentials) {
    const data = await loginUser(credentials);

    clearFavoritesCache();
    setUser(data.user);

    return data.user;
  }

  async function register(userData) {
    const data = await registerUser(userData);

    clearFavoritesCache();
    setUser(data.user);

    return data.user;
  }

  async function logout() {
    try {
      await logoutUser();
    } catch (error) {
      console.error(
        "Erro ao terminar sessão:",
        error
      );
    } finally {
      removeToken();
      clearFavoritesCache();
      setUser(null);
    }
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      isAuthLoading,
      login,
      register,
      logout,
    }),
    [user, isAuthLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
