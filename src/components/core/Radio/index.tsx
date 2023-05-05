import "./styles.css";

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

export default Radio;
