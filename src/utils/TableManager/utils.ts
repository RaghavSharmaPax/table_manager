// type for the main state and the type of data for api
type FormType = {
  username: string;
  dimensions: { rows: number; cols: number };
  table: string[][];
};

// names for input and select tag
enum TagName {
  Row = "rowsInput",
  Col = "colsInput",
  Username = "userInput",
  UserSelect = "userSelect",
}

// notification type
enum NotificationType {
  Error = "error",
  Valid = "valid",
  Default = "",
}

const updateRows = (
  table: string[][],
  prev_rows: number,
  new_rows: number,
  cols: number
) => {
  if (prev_rows - new_rows > 0)
    // new rows are less than prev rows; pop rows
    for (let i = 1; i <= Math.abs(prev_rows - new_rows); ++i) {
      table.pop();
    }
  else if (prev_rows - new_rows < 0)
    // new rows are more than prev rows; add more rows
    for (let i = 0; i < Math.abs(prev_rows - new_rows); ++i) {
      const row = [];
      for (let j = 0; j < cols; ++j) {
        row.push("");
      }
      table.push(row);
    }
};

const updateColumns = (
  table: string[][],
  prev_cols: number,
  new_cols: number
) => {
  if (prev_cols - new_cols > 0) {
    // new cols less than prev cols; pop cols from each row
    for (let row of table) {
      for (let i = 1; i <= Math.abs(prev_cols - new_cols); ++i) {
        row.pop();
      }
    }
  } else if (prev_cols - new_cols < 0) {
    // new cols more than prev cols; push new cols in each row
    for (let row of table) {
      for (let i = 1; i <= Math.abs(prev_cols - new_cols); ++i) {
        row.push("");
      }
    }
  }
};

// function to validate data before sending to the server
const validateData = (data: FormType) => {
  if (!data?.username?.trim()) {
    return false;
  }
  return true;
};

// filtering table to remove the empty rows
const getFilteredTable = (table: string[][]) =>
  table.filter((row: string[]) => {
    return row.some((value: string) => value.trim().length > 0);
  });

export {
  TagName,
  NotificationType,
  validateData,
  getFilteredTable,
  updateRows,
  updateColumns,
};
export type { FormType };
