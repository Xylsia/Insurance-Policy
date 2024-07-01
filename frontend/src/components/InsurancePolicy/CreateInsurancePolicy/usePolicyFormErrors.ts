import { useTranslation } from "react-i18next";

type createPolicyFormProps = {
  requester: string;
  selectedItem: string;
  price: string;
  priceRangeMin: string;
  priceRangeMax: string;
  checkedCoverages: string[];
};

export const usePolicyFormErrors = ({
  requester,
  selectedItem,
  price,
  priceRangeMin,
  priceRangeMax,
  checkedCoverages,
}: createPolicyFormProps) => {
  const { t } = useTranslation();

  const policyErrorValues = {
    requester: "",
    selectedItem: "",
    price: "",
    checkedCoverages: "",
  };

  if (requester === "-1") {
    policyErrorValues.requester = t("createPolicyFormErrorChooseRequester");
  } else {
    policyErrorValues.requester = "";
  }

  if (selectedItem === "-1") {
    policyErrorValues.selectedItem = t("createPolicyFormErrorChooseItem");
  } else {
    policyErrorValues.selectedItem = "";
  }

  if (price.length === 0) {
    policyErrorValues.price = t("createPolicyFormErrorPriceEmpty");
  } else if (Number(price) < Number(priceRangeMin) || Number(price) > Number(priceRangeMax)) {
    policyErrorValues.price = t("createPolicyFormErrorPriceInvalid", {
      item: selectedItem,
      min: priceRangeMin,
      max: priceRangeMax,
    });
  } else {
    policyErrorValues.price = "";
  }

  if (checkedCoverages.length === 0) {
    policyErrorValues.checkedCoverages = t("createPolicyFormErrorCoverage");
  } else {
    policyErrorValues.checkedCoverages = "";
  }

  return policyErrorValues;
};
