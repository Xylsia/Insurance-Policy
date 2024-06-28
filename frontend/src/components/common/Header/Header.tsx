import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../contexts/AuthContext";
import { useUserPreference } from "./useUserPreference";
import { USER_ROLES, USER_LANGUAGE_PREFS, USER_THEME_PREFS, ISO_CODES } from "../../../constants";
import { MdOutlineLightMode, MdOutlineNightlight } from "react-icons/md";
import { FiMenu, FiX } from "react-icons/fi";
import "flag-icons/css/flag-icons.min.css";
import "./Header.scss";

export const Header = () => {
  const { isAuthenticated, handleLogout, roles, userId, languagePreference, themePreference } =
    useContext(AuthContext);
  const { updateLanguagePreference, updateThemePreference } = useUserPreference();
  const { t, i18n } = useTranslation();
  const { changeLanguage, language } = i18n;

  const [loading, setLoading] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>(themePreference ?? USER_THEME_PREFS.LIGHT);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [mobileMenuAnimation, setMobileMenuAnimation] = useState<string>("");

  useEffect(() => {
    setTheme(themePreference ?? USER_THEME_PREFS.LIGHT);
    changeLanguage(languagePreference ?? undefined);
  }, [languagePreference, themePreference]);

  const handleLanguageChange = async (currentLang: string, newLang: string) => {
    if (currentLang !== newLang && isAuthenticated) {
      setLoading(true);
      await changeLanguage(newLang);
      updateLanguagePreference(Number(userId), newLang);
      setLoading(false);
    }
  };
  const handleThemeChange = async (currentTheme: string, newTheme: string) => {
    if (currentTheme !== newTheme && isAuthenticated) {
      setLoading(true);
      setTheme(newTheme);
      await updateThemePreference(Number(userId), newTheme);
      setLoading(false);
    }
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      setMobileMenuAnimation("swipe-out");
      setTimeout(() => {
        setIsMenuOpen(false);
      }, 300);
    } else {
      setIsMenuOpen(true);
      setMobileMenuAnimation("swipe-in");
    }
  };

  if (loading) {
    return <div>{t("loadingText")}</div>;
  }

  return (
    <header>
      <h2>
        <Link to="/dashboard">{t("appName")}</Link>
      </h2>
      <nav className={isMenuOpen ? `mobile-nav ${mobileMenuAnimation}` : "desktop-nav"}>
        <ul>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/dashboard">{t("headerLinkDashboard")}</Link>
              </li>
              <li>
                <Link to="/create-policy">{t("headerLinkCreatePolicy")}</Link>
              </li>
              {roles === USER_ROLES.ADMIN && (
                <>
                  <li>
                    <Link to="/agents">{t("headerLinkAgents")}</Link>
                  </li>
                  <li>
                    <Link to="/create-agent">{t("headerLinkCreateAgent")}</Link>
                  </li>
                </>
              )}
              <li>
                <Link to="/logout" onClick={handleLogout}>
                  {t("headerLinkLogout")}
                </Link>
              </li>

              <div className="change-pref-c">
                <span
                  className={`fi fi-${
                    language === USER_LANGUAGE_PREFS.EN ? ISO_CODES.GB : ISO_CODES.RS
                  }`}
                ></span>
                <div className="change-pref-select-c">
                  <label htmlFor="change-lang-select" className="change-pref-label">
                    {t("headerSelectLang")}
                  </label>
                  <select
                    id="change-lang-select"
                    value={language}
                    onChange={(e) => handleLanguageChange(language, e.target.value)}
                  >
                    <option value={USER_LANGUAGE_PREFS.EN}>{t("headerSelectGBLang")}</option>
                    <option value={USER_LANGUAGE_PREFS.RS}>{t("headerSelectRSLang")}</option>
                  </select>
                </div>
              </div>

              <div className="change-pref-c">
                {themePreference === USER_THEME_PREFS.LIGHT ? (
                  <div className="svg-icon">
                    <MdOutlineLightMode />
                  </div>
                ) : (
                  <div className="svg-icon">
                    <MdOutlineNightlight />
                  </div>
                )}
                <div className="change-pref-select-c">
                  <label htmlFor="change-theme-select" className="change-pref-label">
                    {t("headerSelectTheme")}
                  </label>
                  <select
                    id="change-theme-select"
                    value={theme}
                    onChange={(e) => handleThemeChange(theme, e.target.value)}
                  >
                    <option value={USER_THEME_PREFS.LIGHT}>{t("headerSelectThemeLight")}</option>
                    <option value={USER_THEME_PREFS.DARK}>{t("headerSelectThemeDark")}</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">{t("headerLinkLogin")}</Link>
              </li>
            </>
          )}
        </ul>
        <button className="rm-default-btn mobile-menu-btn" onClick={toggleMenu}>
          {isMenuOpen && (
            <div className="svg-icon hamburger">
              <FiX />
            </div>
          )}
        </button>
      </nav>
      <button className="rm-default-btn mobile-menu-btn" onClick={toggleMenu}>
        {!isMenuOpen && (
          <div className="svg-icon hamburger">
            <FiMenu />
          </div>
        )}
      </button>
    </header>
  );
};
