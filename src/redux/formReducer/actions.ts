import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";
import {
  createNewTable,
  fetchTableData,
  sendDownloadReq,
  updateTableData,
  uploadReq,
} from "../../api/axiosController";

import {
  doesTableExist,
  getFilteredTable,
  validateData,
} from "../../utils/TableManager/utils";
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
      tableName: data.tableName,
      dimensions: {
        rows: filteredTable.length,
        cols: filteredTable[0]?.length || 0,
      },
      table: filteredTable,
    };

    const userTables = state.user.userTables;

    // send apt request
    const { res, error } = doesTableExist(userTables, filteredData.tableName)
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
  async (tableId: string, { rejectWithValue }) => {
    const { res, error } = await fetchTableData(tableId);

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
    const tableId = state.form.data._id;
    const { res, error } = await sendDownloadReq(tableId!);

    if (error) return rejectWithValue(error.response?.data || error.message);

    return res.data;
  }
);

const updloadTable = createAsyncThunk(
  "form/upload",
  async (file: File, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const userTables = state.user.userTables;

    const { res, error } = doesTableExist(userTables, file.name.split(".")[0])
      ? await uploadReq(file, true)
      : await uploadReq(file, false);

    if (error) return rejectWithValue(error.response?.data || error.message);
    return res.data;
  }
);

export { postData, getTableData, downloadTable, updloadTable };
