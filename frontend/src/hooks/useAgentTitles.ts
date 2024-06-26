import { useState, useEffect, useContext } from "react";
import { SnackbarContext } from "../contexts/SnackbarContext";
import { fetchWrapper } from "../utils/fetchWrapper";
import { URL } from "../constants";

export const useAgentTitles = () => {
  const { setSnackbar } = useContext(SnackbarContext);
  const [agentTitleList, setAgentTitleList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getAgentTitles = async (signal: AbortSignal) => {
    try {
      const response = await fetchWrapper({
        url: `${URL}agent/agent-titles`,
        method: "GET",
        signal: signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSnackbar("error", errorData.message || "Network response error");
        return;
      }

      const data: string[] = await response.json();
      setAgentTitleList(data);
      console.log(`agent/agent-titles response:\n ${data}`);
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
    getAgentTitles(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, []);

  return { agentTitleList, isLoading };
};
