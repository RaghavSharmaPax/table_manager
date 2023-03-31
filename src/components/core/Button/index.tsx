import "./styles.css";

const Button = ({
  type,
  text,
  onClick,
  children,
}: {
  type: "button" | "submit" | "reset" | undefined;
  text: string;
  onClick: (e?: any) => void;
  children?: any;
}) => {
  return (
    <button
      data-testid="test_button"
      className="btn"
      type={type}
      onClick={onClick}
    >
      {text}
      {children}
    </button>
  );
};

export default Button;
