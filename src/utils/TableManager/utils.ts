import { AxiosResponse, AxiosError } from "axios";

/**
 * @type FormType for the main state and the type of data for api
 */
type TableType = {
  tableName: string;
  dimensions: { rows: number; cols: number };
  table: string[][];
};

type ResponseType = AxiosResponse<any, any> & { err: AxiosError };

/**
 * names for input and select tag
 */
enum TagName {
  Row = "rowsInput",
  Col = "colsInput",
  TableName = "tableInput",
  TableSelect = "tableSelect",
}

/**
 * @type NotificationType
 */
enum NotificationType {
  Error = "error",
  Valid = "valid",
  Default = "default",
}

/**
 * @type UserTable
 */
type UserTableType = {
  tableName: string;
  _id: string;
};

/**
 * @type UserType
 */
type UserType = {
  username: string;
  _id: string;
};

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
  else if (prev_rows - new_rows < 0 && toShow.rows === prev_rows) {
    // new rows are more than prev rows; add more rows
    for (let i = 0; i < Math.abs(prev_rows - new_rows); ++i) {
      table.push(Array(cols).fill(""));
    }
    toShow.rows = new_rows;
  } else toShow.rows += prev_rows - new_rows;
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
    const colsToAdd = Math.abs(prev_cols - new_cols);
    table.forEach(
      (row, index) => (table[index] = row.concat(Array(colsToAdd).fill("")))
    );
    toShow.cols = new_cols;
  } else toShow.cols += prev_cols - new_cols;
};

/**
 * @function validateData validates if a username was given with the data
 * @param data form data containing username, table and dimensions
 * @returns boolean
 */
const validateData = (data: TableType) => {
  if (!data?.tableName?.trim()) {
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

const doesTableExist = (userTables: UserTableType[], currName: string) =>
  userTables.filter((table) => table.tableName === currName).length > 0;

const mapToAlpha = (key: number) => {
  let alpha = "";
  while (key >= 0) {
    alpha = String.fromCharCode((key % 26) + 65) + alpha;
    key = Math.floor(key / 26) - 1;
  }
  return alpha;
};

export {
  TagName,
  NotificationType,
  validateData,
  getFilteredTable,
  updateRows,
  updateColumns,
  doesTableExist,
  mapToAlpha,
};
export type { UserType, TableType, ResponseType, UserTableType };
