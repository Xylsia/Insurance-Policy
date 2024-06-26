import { vi } from "vitest";
import { USER_ROLES, USER_LANGUAGE_PREFS, USER_THEME_PREFS } from "./constants";

export const authValueLoggedIn = {
  roles: USER_ROLES.ADMIN,
  userId: "1",
  languagePreference: USER_LANGUAGE_PREFS.EN,
  themePreference: USER_THEME_PREFS.LIGHT,
  userName: "John Doe",
  isAuthenticated: true,
  handleLogin: vi.fn(),
  handleLogout: vi.fn(),
  loading: true,
};

export const authValueLoggedOut = {
  roles: null,
  userId: null,
  languagePreference: null,
  themePreference: null,
  userName: null,
  isAuthenticated: false,
  handleLogin: vi.fn(),
  handleLogout: vi.fn(),
  loading: true,
};
