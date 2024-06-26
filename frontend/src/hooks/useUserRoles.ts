import { useState, useEffect, useContext } from "react";
import { SnackbarContext } from "../contexts/SnackbarContext";
import { fetchWrapper } from "../utils/fetchWrapper";
import { URL } from "../constants";

export const useUserRoles = () => {
  const { setSnackbar } = useContext(SnackbarContext);
  const [userRoleList, setUserRoleLise] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getUserRoles = async (signal: AbortSignal) => {
    try {
      const response = await fetchWrapper({
        url: `${URL}agent/user-roles`,
        method: "GET",
        signal: signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSnackbar("error", errorData.message || "Network response error");
        return;
      }

      const data: string[] = await response.json();
      setUserRoleLise(data);
      console.log(`agent/user-roles response:\n ${data}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        error.name === "AbortError"
          ? console.log("Fetch request was cancelled")
          : setSnackbar("error", `Error: ${error}`);
      } else {
        setSnackbar("error", "An unexpected error occured");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    getUserRoles(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, []);

  return { userRoleList, isLoading };
};
