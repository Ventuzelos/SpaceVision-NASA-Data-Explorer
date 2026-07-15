import {
  useCallback,
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
  deleteUserAccount,
  updateUserProfile,
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

  const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials);

    clearFavoritesCache();
    setUser(data.user);

    return data.user;
  }, []);

  const register = useCallback(async (userData) => {
    const data = await registerUser(userData);

    clearFavoritesCache();
    setUser(data.user);

    return data.user;
  }, []);

  const updateProfile = useCallback(
    async (profileData) => {
      const response =
        await updateUserProfile(profileData);

      setUser(response.user);

      return response;
    },
    []
  );

  const deleteAccount = useCallback(async (password) => {
    const response = await deleteUserAccount(password);

    removeToken();
    clearFavoritesCache();
    setUser(null);

    return response;
  }, []);

  const logout = useCallback(async () => {
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
  }, []);

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === "admin";

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isAdmin,
      isAuthLoading,
      login,
      register,
      logout,
      updateProfile,
      deleteAccount,
    }),
    [
      user,
      isAuthenticated,
      isAdmin,
      isAuthLoading,
      login,
      register,
      logout,
      updateProfile,
      deleteAccount,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}