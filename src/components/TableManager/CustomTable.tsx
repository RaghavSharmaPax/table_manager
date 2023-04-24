import { useAppSelector } from "../../redux/hooks";
import Cell from "./Cell";

const CustomTable = () => {
  /**
   * @var tableData stores the table data from the global state
   * @var toShow stores the object which determines how many rows and columns to show on the display
   */
  const [tableData, toShow] = useAppSelector((state) => [
    state.form.data.table,
    state.form.toShow,
  ]);

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
                      <Cell rowIdx={rowIdx} colIdx={colIdx} value={col} />
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
