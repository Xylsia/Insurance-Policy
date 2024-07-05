import { useContext, useState, Dispatch, SetStateAction, ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useRequesterFormErrors } from "./useRequesterFormErrors";
import { PrimaryButton } from "../../common/Button/PrimaryButton";
import { SnackbarContext } from "../../../contexts/SnackbarContext";
import { fetchWrapper } from "../../../utils/fetchWrapper";
import { RequesterModel } from "../../../models/RequesterModel";
import { URL } from "../../../constants";
import "./CreateRequester.scss";

type createRequesterProps = {
  setIsVisibleRequesterForm: Dispatch<SetStateAction<boolean>>;
  setIsVisiblePolicyForm: Dispatch<SetStateAction<boolean>>;
  refreshRequesterProps: () => void;
};

const initRequesterErrors = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  requesterEmailExists: "",
};

export const CreateRequester = ({
  setIsVisibleRequesterForm,
  setIsVisiblePolicyForm,
  refreshRequesterProps,
}: createRequesterProps) => {
  const { setSnackbar } = useContext(SnackbarContext);
  const { t } = useTranslation();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [requesterErrors, setRequesterErrors] = useState(initRequesterErrors);

  const requesterErrorsCheck = useRequesterFormErrors({ firstName, lastName, email, phoneNumber });

  const resetRequesterForm = () => {
    setIsVisibleRequesterForm(false);
    setIsVisiblePolicyForm(true);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setRequesterErrors(initRequesterErrors);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    switch (name) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        break;
      default:
        break;
    }
  };

  const handleCreateRequester = async (event: FormEvent) => {
    event.preventDefault();

    const isInvalid = Object.values(requesterErrorsCheck).some((error) => error !== "");

    if (isInvalid) {
      setRequesterErrors(requesterErrorsCheck);
    } else {
      const formData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
      };

      try {
        const response = await fetchWrapper({
          url: `${URL}requester/create`,
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          setSnackbar("error", errorData.message || t("snackbarNetworkError"));
          return;
        }

        const data: RequesterModel = await response.json();
        console.log(`requester/create response:\n`, data);
        refreshRequesterProps();
        resetRequesterForm();
        setSnackbar("success", t("createRequesterSnackbarSuccess"));
      } catch (error: unknown) {
        if (error instanceof Error) {
          setRequesterErrors(() => ({
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            requesterEmailExists: t("createRequesterErrorEmailExists"),
          }));
        } else {
          setSnackbar("error", t("snackbarUnexpectedError"));
        }
      }
    }
  };

  return (
    <div className="create-requester-form-c">
      <h2>{t("createRequesterTitle")}</h2>
      <form onSubmit={handleCreateRequester}>
        <div className="create-requester-form-grps-c">
          <div className="create-requester-form-grps-top">
            <div className="create-requester-form-grp">
              <label>
                {t("createRequesterFirstNameLabel")}
                <span className="required">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                onChange={handleInputChange}
                placeholder={t("createRequesterFirstNamePlaceholder")}
                className={`${requesterErrors.firstName ? "required-border" : ""}`}
              />
              {requesterErrors.firstName && (
                <span className="required">{requesterErrors.firstName}</span>
              )}
            </div>
            <div className="create-requester-form-grp">
              <label>
                {t("createRequesterLastNameLabel")}
                <span className="required">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                onChange={handleInputChange}
                placeholder={t("createRequesterLastNamePlaceholder")}
                className={`${requesterErrors.lastName ? "required-border" : ""}`}
              />
              {requesterErrors.lastName && (
                <span className="required">{requesterErrors.lastName}</span>
              )}
            </div>
          </div>

          <div className="create-requester-form-grps-bottom">
            <div className="create-requester-form-grp">
              <label>
                {t("createRequesterEmailLabel")}
                <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                onChange={handleInputChange}
                placeholder={t("createRequesterEmailPlaceholder")}
                className={`${requesterErrors.email ? "required-border" : ""}`}
              />
              {requesterErrors.email && <span className="required">{requesterErrors.email}</span>}
            </div>
            <div className="create-requester-form-grp">
              <label>
                {t("createRequesterPhoneLabel")}
                <span className="required">*</span>
              </label>
              <input
                type="text"
                name="phoneNumber"
                onChange={handleInputChange}
                placeholder={t("createRequesterPhonePlaceholder")}
                className={`${requesterErrors.phoneNumber ? "required-border" : ""}`}
              />
              {requesterErrors.phoneNumber && (
                <span className="required">{requesterErrors.phoneNumber}</span>
              )}
            </div>
          </div>
        </div>
        {requesterErrors.requesterEmailExists && (
          <span className="required form-error-msg">{requesterErrors.requesterEmailExists}</span>
        )}
        <div className="create-form-btns">
          <PrimaryButton
            type="reset"
            style="btn btn-danger"
            action={() => resetRequesterForm()}
            text={t("componentBtnCancel")}
          />
          <PrimaryButton type="submit" style="btn btn-success" text={t("componentBtnCreate")} />
        </div>
      </form>
    </div>
  );
};
