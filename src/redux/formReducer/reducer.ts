import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  FormType,
  updateColumns,
  updateRows,
} from "../../utils/TableManager/utils";
import { getFormData, postData } from "./actions";

const initialState: {
  data: FormType;
  [key: string]: any;
} = {
  data: {
    username: "",
    dimensions: { rows: 0, cols: 0 },
    table: [],
  },
  loading: false,
  error: "",
};

const formReducer = createSlice({
  name: "form",
  initialState: initialState,
  reducers: {
    // update the username
    updateUsername(state, action: PayloadAction<string>) {
      state.data.username = action.payload;
    },
    // update dimensions, add or remove rows or cols from the table
    updateDimensions(
      state,
      action: PayloadAction<{ rows: number; cols: number }>
    ) {
      const { rows: prev_rows, cols: prev_cols } = state.data.dimensions;
      const { rows: new_rows, cols: new_cols } = action.payload;
      const table = state.data.table;

      updateRows(table, prev_rows, new_rows, prev_cols);
      updateColumns(table, prev_cols, new_cols);

      state.data.dimensions = { rows: new_rows, cols: new_cols };
      state.data.table = table;
    },
    //update table items
    updateTable(
      state,
      action: PayloadAction<{ tableRow: string[]; rowIdx: number }>
    ) {
      state.data.table[action.payload.rowIdx] = action.payload.tableRow;
    },

    // reset the state
    clearState(state) {
      state.data = {
        username: "",
        dimensions: { rows: 0, cols: 0 },
        table: [],
      };
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
      .addCase(getFormData.pending, (state, _action) => {
        state.loading = true;
      })
      .addCase(getFormData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getFormData.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { updateUsername, updateDimensions, updateTable, clearState } =
  formReducer.actions;
export default formReducer.reducer;
