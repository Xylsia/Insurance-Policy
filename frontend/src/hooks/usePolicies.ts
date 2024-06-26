import { useState, useEffect, useCallback, useContext } from "react";
import { debounce } from "lodash";
import { SnackbarContext } from "../contexts/SnackbarContext";
import { InsurancePolicyModel } from "../models/InsurancePolicyModel";
import { URL } from "../constants";
import { fetchWrapper } from "../utils/fetchWrapper";

export const usePolicies = () => {
  const { setSnackbar } = useContext(SnackbarContext);

  const [policyList, setPolicyList] = useState<InsurancePolicyModel[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  // helps re-render InfiniteScroll component when one policy is deleted
  const [key, setKey] = useState<number>(Math.random());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const PAGE_SIZE = 15;

  const getPolicies = useCallback(
    debounce(async (searchValue: string, page: number) => {
      try {
        const abortController = new AbortController();
        const signal = abortController.signal;

        const params = new URLSearchParams({
          value: searchValue,
          page: page.toString(),
          pageSize: PAGE_SIZE.toString(),
        });

        const response = await fetchWrapper({
          url: `${URL}insurance-policy/search?${params.toString()}`,
          method: "GET",
          signal: signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          setSnackbar("error", errorData.message || "Network response error");
          return;
        }

        const data: InsurancePolicyModel[] = await response.json();

        page === 0
          ? setPolicyList(data)
          : setPolicyList((prevPolicies) => [...prevPolicies, ...data]);

        console.log(`insurance-policy/search?${params.toString()} response:\n ${data}`);

        data.length < PAGE_SIZE ? setHasMore(false) : setHasMore(true);

        return () => {
          abortController.abort();
        };
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
    }, 500),
    []
  );

  const loadMorePolicies = async () => {
    setPage((prevPage) => prevPage + 1);
  };

  const refreshPolicyList = async () => {
    setPage(0);
    setKey(Math.random());
    setIsLoading(true);
    getPolicies(searchValue, 0);
  };

  useEffect(() => {
    getPolicies(searchValue, page);
  }, [searchValue, page]);

  useEffect(() => {
    setPage(0);
    setIsLoading(true);
    setPolicyList(policyList);
    setHasMore(true);
  }, [searchValue]);

  return {
    policyList,
    loadMorePolicies,
    hasMore,
    refreshPolicyList,
    setSearchValue,
    key,
    isLoading,
  };
};
