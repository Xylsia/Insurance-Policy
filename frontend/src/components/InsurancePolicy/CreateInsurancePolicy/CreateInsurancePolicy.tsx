import { useNavigate } from "react-router-dom";
import { useContext, useState, ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "../../common/Button/PrimaryButton";
import { usePolicyFormErrors } from "./usePolicyFormErrors";
import { URL } from "../../../constants";
import { AuthContext } from "../../../contexts/AuthContext";
import { fetchWrapper } from "../../../utils/fetchWrapper";
import { useRequesters } from "../../../hooks/useRequesters";
import { useItems } from "../../../hooks/useItems";
import { useCoverageTypes } from "../../../hooks/useCoverageTypes";
import { SnackbarContext } from "../../../contexts/SnackbarContext";
import "./CreateInsurancePolicy.scss";
import { InsurancePolicyModel } from "../../../models/InsurancePolicyModel";
import { CreateRequester } from "../../Requester/CreateRequester/CreateRequester";

const initPolicyErrors = {
  requester: "",
  selectedItem: "",
  price: "",
  checkedCoverages: "",
};

export const CreateInsurancePolicy = () => {
  const navigate = useNavigate();
  const { userId } = useContext(AuthContext);
  const { setSnackbar } = useContext(SnackbarContext);
  const { t } = useTranslation();
  const { requesterList, refreshRequesterList } = useRequesters();
  const { itemList } = useItems();

  const [isVisibleRequesterForm, setIsVisibleRequesterForm] = useState<boolean>(false);
  const [isVisiblePolicyForm, setIsVisiblePolicyForm] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<string>("-1");
  const [requester, setRequester] = useState<string>("-1");
  const [checkedCoverages, setCheckedCoverages] = useState<string[]>([]);
  const [price, setPrice] = useState<string>("");
  const [policyErrors, setPolicyErrors] = useState(initPolicyErrors);

  const { coverageTypeList, priceRange, priceRangeMin, priceRangeMax } =
    useCoverageTypes(selectedItem);

  const policyErrorCheck = usePolicyFormErrors({
    requester,
    selectedItem,
    price,
    priceRangeMin,
    priceRangeMax,
    checkedCoverages,
  });

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.target;

    if (checked) {
      setCheckedCoverages((prevValues) => [...prevValues, value]);
    } else {
      setCheckedCoverages((prevValues) => prevValues.filter((coverage) => coverage !== value));
    }
  };

  const handleEventChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    switch (name) {
      case "requester":
        setRequester(value);

        break;
      case "selectedItem":
        setSelectedItem(value);
        break;
      case "price":
        setPrice(value);
        break;
      default:
        break;
    }
  };

  const handleCreatePolicy = async (event: FormEvent) => {
    event.preventDefault();

    const isInvalid = Object.values(policyErrorCheck).some((error) => error !== "");

    if (isInvalid) {
      setPolicyErrors(policyErrorCheck);
    } else {
      const dateCreated = new Date().toISOString().slice(0, 10);

      const formData = {
        dateCreated: dateCreated,
        agent: { id: Number(userId) },
        requester: { id: Number(requester) },
        coverages: checkedCoverages,
        insuranceItem: selectedItem,
        estimatedPrice: price,
        lossPriceRangeMin: priceRangeMin,
        lossPriceRangeMax: priceRangeMax,
      };

      try {
        const response = await fetchWrapper({
          url: `${URL}insurance-policy/create`,
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          setSnackbar("error", errorData.message || t("snackbarNetworkError"));
          return;
        }

        const data: InsurancePolicyModel = await response.json();
        console.log(`insurance-policy/create response:\n`, data);
        setSnackbar("success", t("createPolicySnackbarCreatePolicySuccess"));
        navigate("/dashboard");
      } catch (error: unknown) {
        if (error instanceof Error) {
          setSnackbar("error", t("createPolicySnackbarCreatePolicyError"));
        } else {
          setSnackbar("error", t("snackbarUnexpectedError"));
        }
      }
    }
  };

  const onNewRequesterCreated = () => {
    refreshRequesterList();
  };

  return (
    <div className="create-policy-form-c div-card">
      {isVisibleRequesterForm && (
        <CreateRequester
          setIsVisibleRequesterForm={setIsVisibleRequesterForm}
          setIsVisiblePolicyForm={setIsVisiblePolicyForm}
          refreshRequesterProps={onNewRequesterCreated}
        />
      )}

      {isVisiblePolicyForm && (
        <div className="create-insurance-policy-form-c">
          <form onSubmit={handleCreatePolicy}>
            <div className="create-choose-requester">
              <div className="create-policy-form-grp">
                <div className="create-policy-form-grp-content">
                  <label htmlFor="requester-list">
                    {t("createPolicyChooseRequesterLabel")} <span className="required">*</span>
                  </label>
                  <select
                    id="requester-list"
                    name="requester"
                    onChange={handleEventChange}
                    className={`${policyErrors.requester ? "required-border" : ""}`}
                  >
                    <option value="-1">{t("createPolicyChooseRequesterPlaceholder")}</option>
                    {requesterList.map((requester) => (
                      <option key={requester.id} value={requester.id}>
                        {requester.firstName} {requester.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="create-policy-form-grp-error">
                  {policyErrors.requester && (
                    <span className="required">{policyErrors.requester}</span>
                  )}
                </div>
              </div>

              <b>OR</b>

              <div className="create-new-requester-c">
                <div className="create-new-requester">
                  <label>
                    {t("createPolicyCreateNewRequesterLabel")} <span className="required">*</span>
                  </label>
                  <PrimaryButton
                    type="button"
                    style="btn btn-success"
                    action={() => {
                      setIsVisiblePolicyForm(false);
                      setIsVisibleRequesterForm(true);
                    }}
                    text={t("createPolicyCreateNewRequesterBtn")}
                  />
                </div>
              </div>
            </div>

            <div className="create-policy-form-grp">
              <div className="create-policy-form-grp-content">
                <label htmlFor="insurance-item-list">
                  {t("createPolicyChooseItemLabel")} <span className="required">*</span>
                </label>
                <select
                  id="insurance-item-list"
                  name="selectedItem"
                  onChange={handleEventChange}
                  className={`${policyErrors.selectedItem ? "required-border" : ""}`}
                >
                  <option value="-1">{t("createPolicyChooseItemPlaceholder")}</option>
                  {itemList.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="create-policy-form-grp-error">
                {policyErrors.selectedItem && (
                  <span className="required">{policyErrors.selectedItem}</span>
                )}
              </div>
            </div>

            {selectedItem !== "-1" && (
              <>
                <div className="create-policy-form-grp">
                  <div className="create-policy-form-grp-content checkboxes-grp">
                    <label htmlFor="coverage-type-list">
                      {t("createPolicyPickCoverageTypes")} <span className="required">*</span>
                    </label>
                    <div className="coverage-types">
                      {coverageTypeList.map((type, index) => (
                        <div className="one-coverage-type" key={index}>
                          <input
                            type="checkbox"
                            id={type}
                            name="coverage-type"
                            value={type}
                            onChange={handleCheckboxChange}
                            className={`${policyErrors.checkedCoverages ? "required-border" : ""}`}
                          />
                          <label htmlFor={type}>{type}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="create-policy-form-grp-error">
                    {policyErrors.checkedCoverages && (
                      <span className="required">{policyErrors.checkedCoverages}</span>
                    )}
                  </div>
                </div>

                <div className="create-policy-form-grp">
                  <div className="create-policy-form-grp-content">
                    <label htmlFor="estimated-price">
                      {t("createPolicyPriceLabel")} <span className="required">*</span>
                    </label>
                    <div className="estimated-price-input-range">
                      <input
                        type="number"
                        id="estimated-price"
                        name="price"
                        placeholder={t("createPolicyPricePlaceholder")}
                        value={price}
                        onChange={handleEventChange}
                        className={`${policyErrors.price ? "required-border" : ""}`}
                      />
                      <span>{priceRange}</span>
                    </div>
                  </div>
                  <div className="create-policy-form-grp-error">
                    {policyErrors.price && <span className="required">{policyErrors.price}</span>}
                  </div>
                </div>
              </>
            )}

            <div className="create-form-btns">
              <PrimaryButton
                type="button"
                style="btn btn-danger"
                action={() => navigate("/dashboard")}
                text={t("componentBtnCancel")}
              />
              <PrimaryButton type="submit" style="btn btn-success" text={t("componentBtnCreate")} />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
