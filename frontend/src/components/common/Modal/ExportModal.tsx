import { useState } from "react";
import { useTranslation } from "react-i18next";
import ReactDatePicker from "react-datepicker";
import { PrimaryButton } from "../Button/PrimaryButton";
import { MdClose } from "react-icons/md";
import "react-datepicker/dist/react-datepicker.css";

type ExportModalProps = {
  headerText: string;
  onClose: () => void;
  onExport: (startDate: Date | null, endDate: Date | null) => void;
};

export const ExportModal = ({ headerText, onClose, onExport }: ExportModalProps) => {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const handleExportClick = () => {
    onExport(startDate, endDate);
  };

  return (
    <div className="modal-bg">
      <div className="modal-window">
        <div className="modal-top">
          <h2>{headerText}</h2>
          <PrimaryButton
            type="button"
            style="rm-default-btn svg-icon"
            action={onClose}
            icon={<MdClose />}
          />
        </div>
        <div className="modal-mid export-modal-mid-c">
          <div className="export-modal-content">
            <div className="export-modal-date-picker">
              <span>{t("componentExportModalDatePickerSpan")}</span>
              <ReactDatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={(dates) => {
                  const [start, end] = dates as [Date, Date];
                  setStartDate(start);
                  setEndDate(end);
                }}
                isClearable={true}
                dateFormat="yyyy-MM-dd"
                maxDate={new Date()}
              />
            </div>
          </div>
        </div>
        <hr className="modal-separator" />
        <div className="modal-bot">
          <PrimaryButton
            type="button"
            style="btn btn-danger"
            action={onClose}
            text={t("componentBtnCancel")}
          />
          <PrimaryButton
            type="button"
            style="btn btn-primary"
            action={() => handleExportClick()}
            text={t("componentExportModalBtnConfirm")}
          />
        </div>
      </div>
    </div>
  );
};
