import { useTranslation } from "react-i18next";
import { PrimaryButton } from "../Button/PrimaryButton";
import { MdClose } from "react-icons/md";
import "./Modal.scss";

type ConfirmationModalProps = {
  headerText: string;
  bodyText: string;
  confirmBtnLabel: string;
  itemId?: number;
  onClose: () => void;
  onConfirm: (id?: number) => void;
};

export const ConfirmationModal = ({
  headerText,
  bodyText,
  confirmBtnLabel,
  itemId,
  onClose,
  onConfirm,
}: ConfirmationModalProps) => {
  const { t } = useTranslation();

  return (
    <div className="modal-bg">
      <div className="modal-window">
        <div className="modal-top">
          <h2>{headerText}</h2>
          <PrimaryButton
            type="button"
            style="svg-icon rm-defult-btn"
            action={onClose}
            icon={<MdClose />}
          />
        </div>
        <div className="modal-mid">
          <p>{bodyText}</p>
        </div>
        <div className="modal-bot">
          <PrimaryButton
            type="button"
            style="btn btn-warning"
            action={onClose}
            text={t("componentBtnCancel")}
          />
          <PrimaryButton
            type="button"
            style="btn btn-danger"
            action={() => onConfirm(itemId)}
            text={confirmBtnLabel}
          />
        </div>
      </div>
    </div>
  );
};
