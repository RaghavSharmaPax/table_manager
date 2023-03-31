import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";
import {
  createNewTable,
  fetchTableData,
  sendDownloadReq,
  updateTableData,
} from "../../api/axiosController";

import { getFilteredTable, validateData } from "../../utils/TableManager/utils";
/**
 * action for sending form data to the server
 */
const postData = createAsyncThunk(
  "form/post",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { data, toShow } = state.form;

    // checking if the data is valid
    const isDataValid = validateData(data);

    if (!isDataValid) {
      return rejectWithValue("Please Enter a valid Tablename");
    }

    // get filterer table
    const filteredTable = getFilteredTable(data.table, toShow);
    const filteredData = {
      ...data,
      dimensions: {
        rows: filteredTable.length,
        cols: filteredTable[0]?.length,
      },
      table: filteredTable,
    };

    const userTables = state.user.userTables;
    const doesTableExist =
      userTables.filter((table) => table.tableName === filteredData.tableName)
        .length > 0;

    // send apt request
    const { res, error } = doesTableExist
      ? await updateTableData(filteredData)
      : await createNewTable(filteredData);

    // reject the promise if error occurs
    if (error) return rejectWithValue(error.response?.data || error.message);

    // return the response on promise resolved
    return res.data;
  }
);

/**
 * async action fetches the userdata based on the username provided
 */
const getTableData = createAsyncThunk(
  "form/getData",
  /**
   *
   * @param name username selected
   * @returns userdata as response
   */
  async (name: string, { rejectWithValue }) => {
    const { res, error } = await fetchTableData(name);

    if (error) return rejectWithValue(error.response?.data || error.message);

    return res.data;
  }
);

/**
 * action to download data from the server
 */

const downloadTable = createAsyncThunk(
  "form/download",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const tableName = state.form.data.tableName;
    const { res, error } = await sendDownloadReq(tableName);

    if (error) return rejectWithValue(error.response?.data || error.message);

    return res.data;
  }
);

export { postData, getTableData, downloadTable };
