import { useState, useEffect, useContext } from "react";
import { SnackbarContext } from "../contexts/SnackbarContext";
import { fetchWrapper } from "../utils/fetchWrapper";
import { URL } from "../constants";

export const useItems = () => {
  const { setSnackbar } = useContext(SnackbarContext);
  const [itemList, setItemList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getItems = async (signal: AbortSignal) => {
    try {
      const response = await fetchWrapper({
        url: `${URL}insurance-policy/insurance-items`,
        method: "GET",
        signal: signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSnackbar("error", errorData.message || "Network response error");
        return;
      }

      const data: string[] = await response.json();
      setItemList(data);
      console.log(`insurance-policy/insurance-items response:\n`, data);
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
    getItems(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, []);

  return { itemList, isLoading };
};
