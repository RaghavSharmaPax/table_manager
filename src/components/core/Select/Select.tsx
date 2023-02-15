import "./styles.css";
const Select = ({
  data,
  value,
  name,
  label,
  onChange,
}: {
  data: string[];
  value: string;
  name: string;
  label: string;
  onChange: (e: any) => void;
}) => {
  return (
    <div className="select">
      <label>{label}</label>
      <select
        className="select__input"
        value={value}
        name={name}
        onChange={onChange}
      >
        <option value="">Select User</option>
        {data.map((item: any) => (
          <option key={item._id}>{item.username}</option>
        ))}
      </select>
    </div>
  );
};

export default Select;
