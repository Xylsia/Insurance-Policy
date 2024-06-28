import { useState, useEffect, useContext } from "react";
import { AgentModel } from "../models/AgentModel";
import { SnackbarContext } from "../contexts/SnackbarContext";
import { fetchWrapper } from "../utils/fetchWrapper";
import { URL } from "../constants";

export const useAgents = () => {
  const { setSnackbar } = useContext(SnackbarContext);
  const [agentList, setAgentList] = useState<AgentModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getAgents = async (signal: AbortSignal) => {
    try {
      const response = await fetchWrapper({
        url: `${URL}agent/list`,
        method: "GET",
        signal: signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSnackbar("error", errorData.message || "Network response error");
        return;
      }

      const data: AgentModel[] = await response.json();
      setAgentList(data);
      console.log("agent/list response:\n", data);
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
    getAgents(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, []);

  return { agentList, isLoading };
};
