import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../contexts/AuthContext";
import { InsurancePolicies } from "../../components/InsurancePolicy/InsurancePolicies/InsurancePolicies";
import "./Dashboard.scss";

export const Dashboard = () => {
  const { t } = useTranslation();
  const { firstName, lastName } = useContext(AuthContext);

  return (
    <div className="main-container">
      <h2>Welcome {`${firstName} ${lastName}`}!</h2>
      <h1>{t("dashboardTitle")}</h1>
      <div className="insurance-policy-container div-card">
        <InsurancePolicies />
      </div>
    </div>
  );
};
