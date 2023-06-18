import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";
import {
  clearResource,
  createNewTable,
  deleteTable,
  fetchTableData,
  sendDownloadReq,
  updateTableData,
  uploadReq,
} from "../../api/routes";

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

    const isTableOwned =
      data._id && doesTableExist(userTables.own, "_id", data._id);

    // send apt request
    const { res, error } = isTableOwned
      ? await updateTableData({ tableId: data._id, tableData: filteredData }) // update the table owned by user
      : !!data._id // table not owned, check if table has id or not
      ? data.viewMode === "read" // if table has id check view mode
        ? await createNewTable(filteredData) // if viewMode is read create a new table for the user to manipulate
        : await updateTableData({ tableId: data._id, tableData: filteredData }) // if viewMode is write make changes to the existing table
      : await createNewTable(filteredData); // if table is not owned by user and does not have an id then create a new table for user

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
  async (tableId: string, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const { res, error } = await fetchTableData(tableId);

    const isTableOwned = doesTableExist(
      state.user.userTables.own,
      "_id",
      tableId
    );

    if (error) return rejectWithValue(error.response?.data || error.message);

    if (isTableOwned) return { ...res.data, viewMode: "write" };

    const sharedTable = state.user.userTables.shared.find(
      (st) => st._id === tableId
    );
    if (!sharedTable) return rejectWithValue("Table does not exist");

    return { ...res.data, viewMode: sharedTable.viewMode };
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

/**
 * async action to upload the file to the server
 */

const updloadTable = createAsyncThunk(
  "form/upload",
  async (file: File, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const userTables = state.user.userTables;

    const { res, error } = doesTableExist(
      userTables.own,
      "tableName",
      file.name.split(".")[0]
    )
      ? await uploadReq(file, true)
      : await uploadReq(file, false);

    if (error) return rejectWithValue(error.response?.data || error.message);
    return res.data;
  }
);

const clearState = createAsyncThunk(
  "form/clearState",
  async (_, { rejectWithValue }) => {
    const { res, error } = await clearResource();
    if (error) return rejectWithValue(error.response?.data || error.message);
    return res.data;
  }
);

const deleteTableById = createAsyncThunk(
  "form/delete",
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const tableId = state.form.data._id;

    if (!tableId) return rejectWithValue("Cannot delete the table.");

    const { res, error } = await deleteTable(tableId);

    if (error) return rejectWithValue(error.response?.data || error.message);
    return res.data;
  }
);

export {
  postData,
  getTableData,
  downloadTable,
  updloadTable,
  deleteTableById,
  clearState,
};
