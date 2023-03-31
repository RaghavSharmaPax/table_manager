import { updateTable } from "../../redux/formReducer/reducer";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Input from "../core/Input/Input";

const CustomTable = () => {
  /**
   * @var tableData stores the table data from the global state
   * @var toShow stores the object which determines how many rows and columns to show on the display
   */
  const [tableData, toShow] = useAppSelector((state) => [
    state.form.data.table,
    state.form.toShow,
  ]);

  const dispatch = useAppDispatch();

  /**
   * @function updateRowVal handles the changes to cells in a row and updates the table in the store
   * @param e synthetic event
   */
  const updateRowVal = (newValue: string, rowIdx: number, colIdx: number) => {
    dispatch(updateTable({ newValue, rowIdx, colIdx }));
  };

  return (
    <div
      data-testid="test_table"
      className={`custom_table ${tableData.length > 5 ? "filled" : ""}`}
    >
      <table>
        <tbody>
          {tableData.map((row, rowIdx) =>
            rowIdx < toShow.rows ? (
              <tr key={"table_row" + rowIdx}>
                {row?.map((col, colIdx) =>
                  colIdx < toShow.cols ? (
                    <td key={`input ${rowIdx},${colIdx}`}>
                      <Input
                        type="text"
                        label=""
                        name={`${rowIdx},${colIdx}`}
                        value={col}
                        onChange={(e: any) =>
                          updateRowVal(e.target.value, rowIdx, colIdx)
                        }
                      />
                    </td>
                  ) : null
                )}
              </tr>
            ) : null
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
