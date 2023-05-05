import { forwardRef } from "react";
import "./styles.css";
const Input = forwardRef<HTMLInputElement, any>(
  (
    {
      type,
      name,
      error,
      label,
      value,
      onChange,
      min,
      disable = false,
    }: {
      type: string;
      error?: string;
      name: string;
      label: string;
      value: string | number;
      onChange: (e: any) => void;
      min?: number;
      disable?: boolean;
    },
    ref
  ) => {
    return (
      <div className="input">
        <label>{label}</label>
        <input
          disabled={disable}
          data-testid="test_input"
          type={type}
          value={value}
          name={name}
          min={min}
          ref={ref}
          onChange={onChange}
        />
        {error && <p className="input__error">{error}</p>}
      </div>
    );
  }
);

export default Input;
