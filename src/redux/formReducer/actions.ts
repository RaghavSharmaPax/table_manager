import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";
import { getUserData, sendData } from "../../api/apiController";

import { getFilteredTable, validateData } from "../../utils/TableManager/utils";

const postData = createAsyncThunk(
  "form/post",
  // function to validate the data and send it to the server
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;

    const { data, toShow } = state.form;

    // checking if the data is valid
    const isDataValid = validateData(data);

    if (!isDataValid) {
      return rejectWithValue("Please Enter a valid Username");
    }

    const filteredTable = getFilteredTable(data.table, toShow);

    const res = await sendData({
      ...data,
      dimensions: {
        rows: filteredTable.length,
        cols: filteredTable[0]?.length,
      },
      table: filteredTable,
    });

    if (res.error) return rejectWithValue("Error Occured");

    return res;
  }
);

const getFormData = createAsyncThunk(
  "form/getData",
  // function to fetch the form data of a user from the server
  async (name: string, { rejectWithValue }) => {
    const res = await getUserData(name);

    if (res.error) return rejectWithValue(res.error);

    return res;
  }
);

export { postData, getFormData };
