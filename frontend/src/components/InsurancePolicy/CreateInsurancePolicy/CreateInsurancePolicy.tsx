import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "../../common/Button/PrimaryButton";
import { usePolicyFormErrors } from "./usePolicyFormErrors";
import { URL } from "../../../constants";
import { AuthContext } from "../../../contexts/AuthContext";
import { useRequesters } from "../../../hooks/useRequesters";
import { useItems } from "../../../hooks/useItems";
import { useCoverageTypes } from "../../../hooks/useCoverageTypes";
import { SnackbarContext } from "../../../contexts/SnackbarContext";
import "./CreateInsurancePolicy.scss";

const initPolicyErrors = {
  policyRequester: "",
  policyItem: "",
  policyCheckedCoverages: "",
  polocyPrice: "",
};

export const CreateInsurancePolicy = () => {};
