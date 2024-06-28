import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { SnackbarContext } from "../../../contexts/SnackbarContext";
import { VscError } from "react-icons/vsc";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { PrimaryButton } from "../Button/PrimaryButton";
import "./Snackbar.scss";

export const Snackbar: React.FC = () => {
  const { snackbarMessage, snackbarType, isSnackbarOpen, hideSnackbar } =
    useContext(SnackbarContext);
  const { t } = useTranslation();

  if (!isSnackbarOpen) {
    return null;
  }

  const snackbarClass = snackbarType === "error" ? "snackbar-error" : "snackbar-success";
  const snackbarTitle =
    snackbarType === "error"
      ? t("componentSnackbarTitleError")
      : t("componentSnackbarTitleSuccess");
  const snackbarIcon = snackbarType === "error" ? <VscError /> : <IoIosCheckmarkCircleOutline />;
  const snackbarAnimation = isSnackbarOpen && "snackbar-enter";

  return (
    <div className={`snackbar ${snackbarClass} ${snackbarAnimation}`}>
      <div className="snackbar-type-icon">{snackbarIcon}</div>
      <div className="snackbar-middle">
        <h3>{snackbarTitle}</h3>
        <span>{snackbarMessage}</span>
      </div>
      <div className="snackbar-close-icon">
        <PrimaryButton
          type="button"
          style="rm-default-btn"
          action={hideSnackbar}
          icon={<MdClose />}
        />
      </div>
    </div>
  );
};
