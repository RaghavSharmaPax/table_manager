import { memo } from "react";
import { updateTable } from "../../redux/formReducer/reducer";
import { useAppDispatch } from "../../redux/hooks";

import Input from "../core/Input/Input";

const Cell = ({
  rowIdx,
  colIdx,
  value,
}: {
  rowIdx: number;
  colIdx: number;
  value: string;
}) => {
  const dispatch = useAppDispatch();

  /**
   * @function updateRowVal handles the changes to cells in a row and updates the table in the store
   * @param e synthetic event
   */
  const updateCellValue = (newValue: string) => {
    dispatch(updateTable({ newValue, rowIdx, colIdx }));
  };
  return (
    <Input
      type="text"
      label=""
      name={`${rowIdx},${colIdx}`}
      value={value}
      onChange={(e: any) => updateCellValue(e.target.value)}
    />
  );
};

export default memo(Cell);
