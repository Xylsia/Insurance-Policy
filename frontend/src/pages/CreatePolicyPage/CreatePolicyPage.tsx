import { useTranslation } from "react-i18next";
import { CreateInsurancePolicy } from "../../components/InsurancePolicy/CreateInsurancePolicy/CreateInsurancePolicy";

export const CreatePolicyPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="main-container">
        <h1>{t("createPolicyPageTitle")}</h1>
        <CreateInsurancePolicy />
      </div>
    </>
  );
};
