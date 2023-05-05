import "./styles.css";

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

export default Checkbox;
