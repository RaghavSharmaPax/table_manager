import { UserTableType } from "../../../utils/TableManager/utils";
import "./styles.css";
const Select = ({
  data,
  value,
  name,
  label,
  onChange,
}: {
  data: UserTableType[];
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
        <option value="" data-testid="test_option">
          Clear Table
        </option>
        {data?.map((item: any) => (
          <option data-testid="test_option" key={item._id} value={item._id}>
            {item.tableName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
