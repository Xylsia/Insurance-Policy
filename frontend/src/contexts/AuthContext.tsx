import { jwtDecode, JwtPayload } from "jwt-decode";
import React, { createContext, useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { SnackbarContext } from "./SnackbarContext";

// tells TS that our JwtPayload can have these properties
interface MyTokenPayload extends JwtPayload {
  roles?: string;
  userId?: string;
  languagePreference?: string;
  themePreference?: string;
  firstName?: string;
  lastName?: string;
}

// tells TS that children is expected to be a ReactNode
interface AuthProviderProps {
  children: React.ReactNode;
}

// shape of AuthContext
interface AuthContextType {
  roles: string | null;
  userId: string | null;
  languagePreference: string | null;
  themePreference: string | null;
  firstName?: string | null;
  lastName?: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  handleLogin: (token: string) => void;
  handleLogout: () => void;
}

// TS needs to know the initial values and the shape of the context when it is created
const defaultState: AuthContextType = {
  roles: null,
  userId: null,
  languagePreference: null,
  themePreference: null,
  firstName: null,
  lastName: null,
  isAuthenticated: false,
  loading: true,
  handleLogin: () => {},
  handleLogout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultState);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const { t } = useTranslation();
  const { setSnackbar } = useContext(SnackbarContext);

  const [roles, setRoles] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [languagePreference, setLanguagePreference] = useState<string | null>(null);
  const [themePreference, setThemePreference] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode<MyTokenPayload>(token);
        const isTokenExpired = decodedToken.exp ? decodedToken.exp * 1000 < Date.now() : false;

        if (!isTokenExpired) {
          setIsAuthenticated(true);
          setRoles(decodedToken.roles ?? null);
          setUserId(decodedToken.userId ?? null);
          setLanguagePreference(decodedToken.languagePreference ?? null);
          setThemePreference(decodedToken.themePreference ?? null);
          setFirstName(decodedToken.firstName ?? null);
          setLastName(decodedToken.lastName ?? null);
        } else {
          handleLogout();
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setSnackbar("error", `${t("AuthContextJWTError")} ${error}`);
        } else {
          setSnackbar("error", `${t("snackbarUnexpectedError")} ${error}`);
        }
        handleLogout();
      }
    } else {
      handleLogout();
    }
    setLoading(false);
  }, []);

  const handleLogin = (token: string) => {
    try {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
      const decodedToken = jwtDecode<MyTokenPayload>(token);
      setRoles(decodedToken.roles ?? null);
      setUserId(decodedToken.userId ?? null);
      setLanguagePreference(decodedToken.languagePreference ?? null);
      setThemePreference(decodedToken.themePreference ?? null);
      setFirstName(decodedToken.firstName ?? null);
      setLastName(decodedToken.lastName ?? null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSnackbar("error", `${t("AuthContextJWTError")} ${error}`);
      } else {
        setSnackbar("error", `${t("snackbarUnexpectedError")} ${error}`);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setRoles(null);
    setUserId(null);
    setLanguagePreference(null);
    setThemePreference(null);
    setFirstName(null);
    setLastName(null);
  };

  const value = {
    roles,
    userId,
    languagePreference,
    themePreference,
    firstName,
    lastName,
    isAuthenticated,
    loading,
    handleLogin,
    handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export { AuthContext, AuthProvider };
