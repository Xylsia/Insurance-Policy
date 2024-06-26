import "./Button.scss";

type PrimaryButtonProps = {
  type: "button" | "submit" | "reset";
  style: string;
  action?: () => void;
  text?: string;
  icon?: React.ReactNode;
};

export const PrimaryButton = ({ type, style, action, text, icon }: PrimaryButtonProps) => {
  return (
    <button type={type} className={style} onClick={action}>
      {text || icon}
    </button>
  );
};
