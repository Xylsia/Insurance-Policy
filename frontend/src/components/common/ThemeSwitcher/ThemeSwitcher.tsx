import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../../contexts/AuthContext";

export const ThemeSwitcher: React.FC = () => {
  const { themePreference } = useContext(AuthContext);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", themePreference ?? "light");
  }, [themePreference]);

  return null;
};
