import { useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { mapToAlpha } from "../../utils/TableManager/utils";
import Cell from "./Cell";

const CustomTable = () => {
  /**
   * @var tableData stores the table data from the global state
   * @var toShow stores the object which determines how many rows and columns to show on the display
   */
  const toShow = useAppSelector((state) => state.form.toShow);

  const [rowStart, setRowStart] = useState<number>(0);
  const [colStart, setColStart] = useState<number>(0);

  const haveMoreOnTop = rowStart !== 0;
  const haveMoreOnBottom = rowStart + 15 < toShow.rows;
  const haveMoreOnRight = colStart + 15 < toShow.cols;
  const haveMoreOnLeft = colStart !== 0;

  const handleScroll = (e: any) => {
    if (haveMoreOnTop && e.target.scrollTop === 0) {
      // at the top
      setRowStart((prevRowStart) =>
        prevRowStart - 15 <= 0 ? 0 : prevRowStart - 15
      );
      setTimeout(() => {
        e.target.scrollTop = 20;
      }, 250);
      return;
    }

    if (haveMoreOnLeft && e.target.scrollLeft === 0) {
      // at the left
      // TODO add previous set of columns
      setColStart((prevColStart) =>
        prevColStart - 15 <= 0 ? 0 : prevColStart - 15
      );
      setTimeout(() => {
        e.target.scrollLeft = 100;
      }, 250);
    }

    const hasReachedBottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    const hasReachedRight =
      e.target.scrollWidth - e.target.scrollLeft === e.target.clientWidth;

    if (haveMoreOnBottom && hasReachedBottom) {
      // change the row indexs to show the next set
      if (rowStart + 15 + 15 <= toShow.rows) {
        setRowStart((prevRowStart) => prevRowStart + 15);
      } else {
        setRowStart((prevRowStart) => toShow.rows - prevRowStart + 15);
      }

      setTimeout(() => {
        e.target.scrollTop = e.target.scrollTop - 20;
      }, 250);
    }
    if (haveMoreOnRight && hasReachedRight) {
      // change the column indexes to show the next set
      if (colStart + 15 + 15 <= toShow.cols) {
        setColStart((prevColStart) => prevColStart + 15);
      } else {
        setColStart((prevColStart) => toShow.cols - prevColStart + 15);
      }

      setTimeout(() => {
        e.target.scrollLeft = e.target.scrollLeft - 20;
      }, 250);
    }
  };

  return (
    <div
      data-testid="test_table"
      onScroll={handleScroll}
      className={`custom_table ${toShow.rows > 5 ? "filled" : ""} 
      
       `}
    >
      <table>
        <thead>
          <tr>
            <td></td>
            {toShow.rows > 0 &&
              toShow.cols > 0 &&
              Array(15)
                .fill("")
                .map((_, colIdx) =>
                  colIdx + colStart < toShow.cols ? (
                    <td key={"colIndex" + colIdx}>
                      {mapToAlpha(colIdx + colStart)}
                    </td>
                  ) : null
                )}
          </tr>
        </thead>
        <tbody>
          {Array(15)
            .fill("")
            .map((_, rowIdx) =>
              rowIdx + rowStart < toShow.rows ? (
                <tr key={"table_row" + rowIdx}>
                  {toShow.cols > 0 && <td>{rowIdx + rowStart + 1}</td>}
                  {Array(15)
                    .fill("")
                    .map((_col, colIdx) =>
                      colIdx + colStart < toShow.cols ? (
                        <td key={`input ${rowIdx},${colIdx}`}>
                          <Cell
                            rowIdx={rowIdx + rowStart}
                            colIdx={colIdx + colStart}
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
