import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { mapToAlpha } from "../../utils/TableManager/utils";
import Cell from "./Cell";

const CustomTable = () => {
  /**
   * @var viewMode checks if the current user is allowed to make changes to the table
   * @var toShow stores the object which determines how many rows and columns to show on the display
   */
  const toShow = useAppSelector((state) => state.form.toShow);
  const viewMode = useAppSelector((state) => state.form.data.viewMode);

  useEffect(() => {
    if (toShow.rows === 0) setRowStart(0);
    if (toShow.cols === 0) setColStart(0);
  }, [toShow.rows, toShow.cols]);

  /**
   * @var rowStart keeps the current row index from which the table is being displayed
   * @var colStart keeps the current col index from which the table is being displayed
   */
  const [rowStart, setRowStart] = useState<number>(0);
  const [colStart, setColStart] = useState<number>(0);

  /**
   * helper variables
   * @var haveMoreOnTop resolve to true if we have more rows to show before the current rowStart
   * @var haveMoreOnBottom resolves to true if we have more rows to show after the current rowStart+15 viewing rows
   * @var haveMoreOnRight resolve to true if we have more cols to show after the current colStart+15 viewing cols
   * @var haveMoreonLeft resovles to true if we have more cols to show before the current colStart
   */
  const haveMoreOnTop = rowStart !== 0;
  const haveMoreOnBottom = rowStart + 15 < toShow.rows;
  const haveMoreOnRight = colStart + 15 < toShow.cols;
  const haveMoreOnLeft = colStart !== 0;

  /**
   * function handles loading next set of rows and cols when the user reaches any edge of the x and y scroll bars
   * @param e scroll event
   * @returns void
   */
  const handleScroll = (e: any) => {
    if (haveMoreOnTop && e.target.scrollTop === 0) {
      //if we are at the top and have rows to show
      setRowStart((prevRowStart) =>
        prevRowStart - 15 <= 0 ? 0 : prevRowStart - 15
      );
      setTimeout(() => {
        e.target.scrollTop = 20;
      }, 250);
      return;
    }

    if (haveMoreOnLeft && e.target.scrollLeft === 0) {
      // if we are on the left edge and there are more columns to show
      setColStart((prevColStart) =>
        prevColStart - 15 <= 0 ? 0 : prevColStart - 15
      );
      setTimeout(() => {
        e.target.scrollLeft = 100;
      }, 250);
    }
    const hasReachedBottom =
      Math.floor(e.target.scrollHeight - e.target.scrollTop) ===
      Math.floor(e.target.clientHeight);
    const hasReachedRight =
      Math.floor(e.target.scrollWidth - e.target.scrollLeft) ===
      Math.floor(e.target.clientWidth);

    if (haveMoreOnBottom && hasReachedBottom) {
      // change the row indexs to show the next set if we have reached the bottom and have more rows to show
      if (rowStart + 15 + 15 <= toShow.rows) {
        setRowStart((prevRowStart) => prevRowStart + 15);
      } else {
        setRowStart(
          (prevRowStart) => prevRowStart + toShow.rows - prevRowStart - 15
        );
      }

      setTimeout(() => {
        e.target.scrollTop = e.target.scrollTop - 20;
      }, 250);
    }
    if (haveMoreOnRight && hasReachedRight) {
      // change the column indexes to show the next set if we have reached the right edge of the scrollbar and have more cols to show
      if (colStart + 15 + 15 <= toShow.cols) {
        setColStart((prevColStart) => prevColStart + 15);
      } else {
        setColStart(
          (prevColStart) => prevColStart + toShow.cols - prevColStart - 15
        );
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
                            viewMode={viewMode}
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
