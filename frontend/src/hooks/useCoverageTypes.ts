import { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { SnackbarContext } from "../contexts/SnackbarContext";
import { fetchWrapper } from "../utils/fetchWrapper";
import { URL } from "../constants";

const itemsPriceRange = [
  {
    item: "CAR",
    min: 1000,
    max: 20000,
  },
  {
    item: "HOUSE",
    min: 40000,
    max: 250000,
  },
  {
    item: "HEALTH",
    min: 1000,
    max: 200000,
  },
  {
    item: "JEWELRY",
    min: 500,
    max: 10000,
  },
  {
    item: "TRAVEL",
    min: 1000,
    max: 10000,
  },
  {
    item: "BUSINESS",
    min: 100000,
    max: 1000000,
  },
];

export const useCoverageTypes = (selectedItem: string) => {
  const { setSnackbar } = useContext(SnackbarContext);
  const { t } = useTranslation();

  const [coverageTypeList, setCoverageTypeList] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>("");
  const [priceRangeMin, setPriceRangeMin] = useState<string>("");
  const [priceRangeMax, setPriceRangeMax] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getCoverageTypes = async (signal: AbortSignal) => {
    try {
      const response = await fetchWrapper({
        url: `${URL}insurance-policy/coverage-types/${selectedItem}`,
        method: "GET",
        signal: signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSnackbar("error", errorData.message || "Network response error");
        return;
      }

      const data: string[] = await response.json();
      setCoverageTypeList(data);
      console.log(`insurance-policy/coverage-types/${selectedItem} response:\n`, data);
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
    if (selectedItem) {
      if (selectedItem === "-1") {
        setCoverageTypeList([]);
        setPriceRange("");
        setPriceRangeMin("");
        setPriceRangeMax("");
      } else {
        const abortController = new AbortController();
        getCoverageTypes(abortController.signal);

        const item = itemsPriceRange.find((item) => item.item === selectedItem.toLocaleUpperCase());
        if (item) {
          setPriceRange(
            t("useCoveragesTypesPriceRange", {
              item: item.item,
              min: item.min,
              max: item.max,
            })
          );
          setPriceRangeMin(`${item.min}`);
          setPriceRangeMax(`${item.max}`);

          return () => {
            abortController.abort();
          };
        }
      }
    }
  }, [selectedItem]);

  return { coverageTypeList, priceRange, priceRangeMin, priceRangeMax, isLoading };
};
