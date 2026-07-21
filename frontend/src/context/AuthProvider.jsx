import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import AuthContext from "./authContext";

import {
  deleteUserAccount,
  getAuthenticatedUser,
  getToken,
  loginUser,
  logoutUser,
  registerUser,
  removeToken,
  updateUserProfile,
} from "../services/authService";

import {
  clearFavoritesCache,
} from "../services/favoritesService";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [isAuthLoading, setIsAuthLoading] =
    useState(() => Boolean(getToken()));

  const [authError, setAuthError] = useState("");

  const handleAuthenticationError = useCallback(
    (error) => {
      console.error(
        "Não foi possível recuperar a sessão:",
        error
      );

      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        removeToken();
        clearFavoritesCache();
        setUser(null);
        setAuthError("");

        return;
      }

      setAuthError(
        "Não foi possível contactar o servidor. Tenta novamente dentro de alguns instantes."
      );
    },
    []
  );

  useEffect(() => {
    const token = getToken();

    if (!token) {
      return undefined;
    }

    let isActive = true;

    getAuthenticatedUser()
      .then((authenticatedUser) => {
        if (!isActive) {
          return;
        }

        setUser(authenticatedUser);
        setAuthError("");
      })
      .catch((error) => {
        if (!isActive) {
          return;
        }

        handleAuthenticationError(error);
      })
      .finally(() => {
        if (isActive) {
          setIsAuthLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [handleAuthenticationError]);

  const retryAuthentication = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setUser(null);
      setAuthError("");
      setIsAuthLoading(false);
      return;
    }

    setIsAuthLoading(true);
    setAuthError("");

    try {
      const authenticatedUser =
        await getAuthenticatedUser();

      setUser(authenticatedUser);
      setAuthError("");
    } catch (error) {
      handleAuthenticationError(error);
    } finally {
      setIsAuthLoading(false);
    }
  }, [handleAuthenticationError]);

  const login = useCallback(async (credentials) => {
    setAuthError("");

    const data = await loginUser(credentials);

    clearFavoritesCache();
    setUser(data.user);

    return data.user;
  }, []);

  const register = useCallback(async (userData) => {
    setAuthError("");

    const data = await registerUser(userData);

    clearFavoritesCache();
    setUser(data.user);

    return data.user;
  }, []);

  const updateProfile = useCallback(
    async (profileData) => {
      setAuthError("");

      const response =
        await updateUserProfile(profileData);

      setUser(response.user);

      return response;
    },
    []
  );

  const deleteAccount = useCallback(
    async (password) => {
      const response =
        await deleteUserAccount(password);

      removeToken();
      clearFavoritesCache();
      setUser(null);
      setAuthError("");

      return response;
    },
    []
  );

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
      setAuthError("");
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
      authError,
      login,
      register,
      logout,
      updateProfile,
      deleteAccount,
      retryAuthentication,
    }),
    [
      user,
      isAuthenticated,
      isAdmin,
      isAuthLoading,
      authError,
      login,
      register,
      logout,
      updateProfile,
      deleteAccount,
      retryAuthentication,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;