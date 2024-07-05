import { useState, useEffect, useContext } from "react";
import { SnackbarContext } from "../contexts/SnackbarContext";
import { fetchWrapper } from "../utils/fetchWrapper";
import { RequesterModel } from "../models/RequesterModel";
import { URL } from "../constants";

export const useRequesters = () => {
  const { setSnackbar } = useContext(SnackbarContext);
  const [requesterList, setRequesterList] = useState<RequesterModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getItems = async (signal: AbortSignal) => {
    try {
      const response = await fetchWrapper({
        url: `${URL}requester/list`,
        method: "GET",
        signal: signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSnackbar("error", errorData.message || "Network response error");
        return;
      }

      const data: RequesterModel[] = await response.json();
      setRequesterList(data);
      console.log(`requester/list response:\n`, data);
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

  const refreshRequesterList = async () => {
    const abortController = new AbortController();
    getItems(abortController.signal);
  };

  useEffect(() => {
    const abortController = new AbortController();
    getItems(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, []);

  return { requesterList, refreshRequesterList, isLoading };
};
