import { updateTable } from "../../redux/formReducer/reducer";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Input from "../core/Input/Input";

const CustomTable = () => {
  const tableData = useAppSelector((state) => state.form.data.table);
  const dispatch = useAppDispatch();

  // function to reflect the change in row
  const updateRowVal = (e: any) => {
    const [rowIndex, colIndex] = e.target.name.split(",");
    const newTableRow = [...tableData[+rowIndex]];
    newTableRow[+colIndex] = e.target.value;

    dispatch(updateTable({ tableRow: newTableRow, rowIdx: +rowIndex }));
  };

  return (
    <div className="custom_table">
      <table>
        <tbody>
          {tableData.map((row, rowIdx) => (
            <tr key={"table_row" + rowIdx}>
              {row?.map((col, colIdx) => (
                <td key={`input ${rowIdx},${colIdx}`}>
                  <Input
                    type="text"
                    label=""
                    name={`${rowIdx},${colIdx}`}
                    value={col}
                    onChange={updateRowVal}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
