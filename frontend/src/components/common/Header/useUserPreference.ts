import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../contexts/AuthContext";
import { SnackbarContext } from "../../../contexts/SnackbarContext";
import { fetchWrapper } from "../../../utils/fetchWrapper";
import { URL, NOT_ACCEPTED_VALS } from "../../../constants";

export const useUserPreference = () => {
  const { handleLogin } = useContext(AuthContext);
  const { setSnackbar } = useContext(SnackbarContext);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updateLanguagePreference = async (id: number, language: string) => {
    try {
      const body = {
        id: id,
        language: language,
      };
      const response = await fetchWrapper({
        url: `${URL}agent/language-preference`,
        method: "PUT",
        body: body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSnackbar("error", errorData.message || t("snackbarNetworkError"));
        return;
      }

      const newToken = await response.json();
      if (NOT_ACCEPTED_VALS.includes(newToken.token)) {
        return;
      }
      handleLogin(newToken);
      setSnackbar("success", t("userPrefLangSnackbarSuccess"));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSnackbar("error", `${t("userPrefLangSnackbarError")}: ${error}`);
      } else {
        setSnackbar("error", t("snackbarUnexpectedError"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateThemePreference = async (id: number, theme: string) => {
    try {
      const body = {
        id: id,
        theme: theme,
      };
      const response = await fetchWrapper({
        url: `${URL}agent/theme-preference`,
        method: "PUT",
        body: body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSnackbar("error", errorData.message || t("snackbarNetworkError"));
        return;
      }

      const newToken = await response.json();
      if (NOT_ACCEPTED_VALS.includes(newToken.token)) {
        return;
      }
      handleLogin(newToken);
      setSnackbar("success", t("userPrefLangSnackbarSuccess"));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSnackbar("error", `${t("userPrefLangSnackbarError")}: ${error}`);
      } else {
        setSnackbar("error", t("snackbarUnexpectedError"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { updateLanguagePreference, updateThemePreference, isLoading };
};
