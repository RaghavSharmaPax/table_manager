import { forwardRef } from "react";
import { SharedTableType, UserTableType } from "../../../utils/types";
import "./styles.css";
import { TagName } from "../../../utils/enums";

const Input = ({
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
}) => {
  return (
    <div className="input">
      <label>{label}</label>
      <input
        disabled={disable}
        data-testid={
          name === TagName.TableName ? `test_input_${name}` : `test_input`
        }
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

const FileInput = forwardRef<HTMLInputElement, any>(({ onChange }, ref) => (
  <input
    type="file"
    name="file_upload"
    ref={ref}
    onChange={onChange}
    accept=".csv"
  />
));

const Checkbox = ({
  label,
  name,
  onChange,
}: {
  label: string;
  name: string;
  onChange: (e: any) => void;
}) => {
  return (
    <div className="radio_input" onChange={onChange}>
      <input type="checkbox" name={name} />
      <label>{label}</label>
    </div>
  );
};

const Radio = ({
  label,
  name,
  value,
  onChange,
  disable = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: any) => void;
  disable?: boolean;
}) => {
  return (
    <div className="radio_input" onChange={onChange}>
      <input disabled={disable} type="radio" name={name} value={value} />
      <label>{label}</label>
    </div>
  );
};

const Select = ({
  data,
  value,
  name,
  label,
  onChange,
}: {
  data: { own: UserTableType[]; shared: SharedTableType[] };
  value: string;
  name: string;
  label: string;
  onChange: (e: any) => void;
}) => {
  return (
    <div className="select">
      <label>{label}</label>
      <select
        data-testid="test_select"
        className="select__input"
        value={value}
        name={name}
        onChange={onChange}
      >
        <option className="option__default" value="" data-testid="test_option">
          Clear Choice
        </option>
        {data.own.map((item: UserTableType) => (
          <option data-testid="test_option" key={item._id} value={item._id}>
            {item.tableName}
          </option>
        ))}
        {data.shared.map((item: SharedTableType) => (
          <option
            className="option__shared"
            data-testid="test_option"
            key={item._id}
            value={item._id}
            data-sharedby={item.owner}
          >
            {item.tableName} (--{item.owner})
          </option>
        ))}
      </select>
    </div>
  );
};

export { Input, Checkbox, Radio, Select, FileInput };
