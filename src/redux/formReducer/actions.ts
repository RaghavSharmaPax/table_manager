import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";
import { getUserData, sendData } from "../../api/apiController";

import { getFilteredTable, validateData } from "../../utils/TableManager/utils";
/**
 * @function postData asynchronus store action for sending form data to the server
 */
const postData = createAsyncThunk(
  "form/post",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;

    const { data, toShow } = state.form;

    // checking if the data is valid
    const isDataValid = validateData(data);

    if (!isDataValid) {
      return rejectWithValue("Please Enter a valid Username");
    }

    // get filterer table
    const filteredTable = getFilteredTable(data.table, toShow);

    // send post request
    const res = await sendData({
      ...data,
      dimensions: {
        rows: filteredTable.length,
        cols: filteredTable[0]?.length,
      },
      table: filteredTable,
    });

    // reject the promise if error occurs
    if (res.error) return rejectWithValue("Error Occured");

    // return the response on promise resolved
    return res;
  }
);

/**
 * @function getFormData fetches the userdata based on the username provided
 */
const getFormData = createAsyncThunk(
  "form/getData",
  /**
   *
   * @param name username selected
   * @returns userdata as response
   */
  async (name: string, { rejectWithValue }) => {
    const res = await getUserData(name);

    if (res.error) return rejectWithValue(res.error);

    return res;
  }
);

export { postData, getFormData };
