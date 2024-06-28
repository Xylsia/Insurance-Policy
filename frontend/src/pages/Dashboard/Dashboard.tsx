import { useTranslation } from "react-i18next";
import { InsurancePolicies } from "../../components/InsurancePolicy/InsurancePolicies/InsurancePolicies";
import "./Dashboard.scss";

export const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="main-container">
      <h1>{t("dashboardTitle")}</h1>
      <div className="insurance-policy-container div-card">
        <InsurancePolicies />
      </div>
    </div>
  );
};
