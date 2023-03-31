import "./styles.css";
const Input = ({
  type,
  name,
  error,
  label,
  value,
  onChange,
  min,
}: {
  type: string;
  error?: string;
  name: string;
  label: string;
  value: string | number;
  onChange: (e: any) => void;
  min?: number;
}) => {
  return (
    <div className="input">
      <label>{label}</label>
      <input
        data-testid="test_input"
        type={type}
        value={value}
        name={name}
        min={min}
        onChange={onChange}
      />
      {error && <p className="input__error">{error}</p>}
    </div>
  );
};

export default Input;
