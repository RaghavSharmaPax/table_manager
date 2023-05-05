import {
  SharedTableType,
  UserTableType,
} from "../../../utils/TableManager/utils";
import "./styles.css";
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
          Clear Table
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

export default Select;
