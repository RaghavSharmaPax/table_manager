import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  TableType,
  updateColumns,
  updateRows,
} from "../../utils/TableManager/utils";
import { downloadTable, getTableData, postData } from "./actions";

const initialState: {
  data: TableType;
  [key: string]: any;
} = {
  data: {
    tableName: "",
    dimensions: { rows: 0, cols: 0 },
    table: [],
  },
  toShow: {
    rows: 0,
    cols: 0,
  },
  loading: false,
  error: "",
};

const formReducer = createSlice({
  name: "form",
  initialState: initialState,
  reducers: {
    /**
     * @function updateUsername updates the username of the form
     * @param state current state of the formReducer
     * @param action contains a string representing the username
     */
    updateTableName(state, action: PayloadAction<string>) {
      state.data.tableName = action.payload;
    },
    /**
     * @function updateDimensions updates the dimensions of the table (row, col)
     * @param state current state of the formReducer
     * @param action contains object for number of rows and columns
     */
    updateDimensions(
      state,
      action: PayloadAction<{ rows: number; cols: number }>
    ) {
      const { rows: prev_rows, cols: prev_cols } = state.data.dimensions;
      const { rows: new_rows, cols: new_cols } = action.payload;
      const table = state.data.table;

      updateRows(table, state.toShow, prev_rows, new_rows, prev_cols);
      updateColumns(table, state.toShow, prev_cols, new_cols);

      state.data.dimensions = { rows: new_rows, cols: new_cols };
      state.data.table = table;
    },
    /**
     * @function updateTable updates the rows of the table
     * @param state current state of the form Reducer
     * @param action contains the table row to be updated and index of the row
     */
    updateTable(
      state,
      action: PayloadAction<{
        newValue: string;
        rowIdx: number;
        colIdx: number;
      }>
    ) {
      state.data.table[action.payload.rowIdx][action.payload.colIdx] =
        action.payload.newValue;
    },
    /**
     * @function clearState resets the table state to empty values
     * @param state current state of the form Reducer
     */
    clearState(state) {
      state.data = {
        tableName: "",
        dimensions: { rows: 0, cols: 0 },
        table: [],
      };
      state.toShow = {
        rows: 0,
        cols: 0,
      };
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postData.pending, (state, _action) => {
        state.loading = true;
      })
      .addCase(postData.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(postData.fulfilled, (state, _action) => {
        state.loading = false;
      })
      .addCase(getTableData.pending, (state, _action) => {
        state.loading = true;
      })
      .addCase(getTableData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.toShow = { ...action.payload.dimensions };
        state.loading = false;
      })
      .addCase(getTableData.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(downloadTable.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(downloadTable.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(downloadTable.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const { updateTableName, updateDimensions, updateTable, clearState } =
  formReducer.actions;
export default formReducer.reducer;
