import { updateDimensions } from "../../redux/formReducer/reducer";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { TagName } from "../../utils/TableManager/utils";
import Input from "../core/Input/Input";

const DimensionInput = () => {
  const { rows, cols } = useAppSelector((state) => state.form.data.dimensions);
  const dispatch = useAppDispatch();

  // handling change in dimensions according to type i.e., row or column
  const onInputChange = (e: any) => {
    const val = +e.target.value;
    switch (e.target.name) {
      case TagName.Row: {
        dispatch(updateDimensions({ rows: val, cols }));
        break;
      }
      case TagName.Col: {
        dispatch(updateDimensions({ rows, cols: val }));
        break;
      }
      default:
        throw new Error("Unexpected type found");
    }
  };
  return (
    <div className="dimension_inputs">
      <Input
        type="number"
        name={TagName.Row}
        value={rows}
        min={0}
        onChange={onInputChange}
        label="Rows"
      />
      <Input
        type="number"
        name={TagName.Col}
        label="Columns"
        value={cols}
        min={0}
        onChange={onInputChange}
      />
    </div>
  );
};

export default DimensionInput;
