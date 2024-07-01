import { useContext, useState, Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useRequesterFormErrors } from "./useRequesterFormErrors";
import { PrimaryButton } from "../../common/Button/PrimaryButton";
import { URL } from "../../../constants";
import { SnackbarContext } from "../../../contexts/SnackbarContext";
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
};
