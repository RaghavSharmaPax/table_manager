/**
 * @type FormType for the main state and the type of data for api
 */
type FormType = {
  username: string;
  dimensions: { rows: number; cols: number };
  table: string[][];
};

/**
 * names for input and select tag
 */
enum TagName {
  Row = "rowsInput",
  Col = "colsInput",
  Username = "userInput",
  UserSelect = "userSelect",
}

/**
 * @type NotificationType
 */
enum NotificationType {
  Error = "error",
  Valid = "valid",
  Default = "",
}

/**
 * @function updateRows adds the rows to the table upon change from the user
 * @param table 2D matrix for storing table data
 * @param toShow object containing number of rows and columns to show to the user
 * @param prev_rows number of rows before updating the table
 * @param new_rows number of new rows added to the table
 * @param cols number of cols in the table
 */
const updateRows = (
  table: string[][],
  toShow: { rows: number; cols: number },
  prev_rows: number,
  new_rows: number,
  cols: number
) => {
  if (prev_rows - new_rows > 0)
    // new rows are less than prev rows; show less rows
    toShow.rows -= prev_rows - new_rows;
  else if (prev_rows - new_rows < 0 && toShow.rows === prev_rows)
    // new rows are more than prev rows; add more rows
    for (let i = 0; i < Math.abs(prev_rows - new_rows); ++i) {
      const row = [];
      for (let j = 0; j < cols; ++j) {
        row.push("");
      }
      table.push(row);

      toShow.rows = new_rows;
    }
  else toShow.rows += prev_rows - new_rows;
};

/**
 * @function updateColumns updates the columns in the table
 * @param table 2D string matrix to store table data
 * @param toShow object defining number of rows and columns to show to the user
 * @param prev_cols number of columns before updating
 * @param new_cols number of new columns added to the table
 */

const updateColumns = (
  table: string[][],
  toShow: { rows: number; cols: number },
  prev_cols: number,
  new_cols: number
) => {
  if (prev_cols - new_cols > 0) {
    // new cols less than prev cols; pop cols from each row
    toShow.cols -= prev_cols - new_cols;
  } else if (prev_cols - new_cols < 0 && toShow.cols === prev_cols) {
    // new cols more than prev cols; push new cols in each row
    for (let row of table) {
      for (let i = 1; i <= Math.abs(prev_cols - new_cols); ++i) {
        row.push("");
      }
    }
    toShow.cols = new_cols;
  } else toShow.cols += prev_cols - new_cols;
};

/**
 * @function validateData validates if a username was given with the data
 * @param data form data containing username, table and dimensions
 * @returns boolean
 */
const validateData = (data: FormType) => {
  if (!data?.username?.trim()) {
    return false;
  }
  return true;
};

/**
 * @function getFilteredTable filters out the empty rows
 * @param table 2D string table for storing table data
 * @param toShow object containing number of rows and columns to show to the user
 * @returns filtered table
 */
const getFilteredTable = (
  table: string[][],
  toShow: { rows: number; cols: number }
) => {
  return table
    .slice(0, toShow.rows) // first slice the hidden rows
    .map((row: string[]) => {
      return row.slice(0, toShow.cols); // second slice the hidden columns
    })
    .filter((row: string[]) => {
      // filter the remaining table
      return row.some((value: string) => value.trim().length > 0);
    });
};

export {
  TagName,
  NotificationType,
  validateData,
  getFilteredTable,
  updateRows,
  updateColumns,
};
export type { FormType };
