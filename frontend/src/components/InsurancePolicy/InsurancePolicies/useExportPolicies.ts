import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { SnackbarContext } from "../../../contexts/SnackbarContext";
import { fetchWrapper } from "../../../utils/fetchWrapper";
import { InsurancePolicyModel } from "../../../models/InsurancePolicyModel";
import { URL } from "../../../constants";

type exportPoliciesProps = {
  startDate: Date | null;
  endDate: Date | null;
  closeModal: () => void;
};

export const useExportPolicies = () => {
  const { setSnackbar } = useContext(SnackbarContext);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const exportPolicies = async ({ startDate, endDate, closeModal }: exportPoliciesProps) => {
    if (startDate && endDate) {
      try {
        const paramsDates = new URLSearchParams({
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        });

        const responseFilteredPolicies = await fetchWrapper({
          url: `${URL}insurance-policy/find-between-dates?${paramsDates.toString()}`,
          method: "GET",
        });

        if (!responseFilteredPolicies.ok) {
          const erroData = await responseFilteredPolicies.json();
          setSnackbar("error", erroData.message || t("snackbarNetworkError"));
          return;
        }

        const filteredPolicies: InsurancePolicyModel[] = await responseFilteredPolicies.json();
        const policyIds = filteredPolicies.map((policy: InsurancePolicyModel) => policy.id);
        const reportParams = new URLSearchParams();
        policyIds.forEach((id: any) => reportParams.append("policyIds", id));

        if (reportParams.toString() === "") {
          setSnackbar("error", t("insurancePoliciesSnackbarExportNoPoliciesError"));
        } else {
          const responseGenerateReport = await fetchWrapper({
            url: `${URL}report/generate-report?${reportParams.toString()}`,
            method: "GET",
          });

          if (!responseGenerateReport.ok) {
            const erroData = await responseGenerateReport.json();
            setSnackbar("error", erroData.message || t("snackbarNetworkError"));
            return;
          }

          // Download report
          const blob = await responseGenerateReport.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.setAttribute("download", "report.xlsx");
          document.body.appendChild(link);
          link.click();
          link.parentNode!.removeChild(link);

          closeModal();
          setSnackbar("success", t("insurancePoliciesSnackbarExportSuccess"));
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setSnackbar("error", t("insurancePoliciesSnackbarExportError"));
        } else {
          setSnackbar("error", t("snackbarUnexpectedError"));
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setSnackbar("error", t("insurancePoliciesSnackbarPickDatesError"));
    }
  };

  return { exportPolicies, isLoading };
};
