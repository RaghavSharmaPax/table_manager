import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  authenticate,
  createUser,
  fetchUserTables,
  logout,
  signout,
  getUsers,
  share,
  deleteShared,
} from "../../api/axiosController";
import { RootState } from "..";
import { create } from "domain";

/**
 * async action authenticate user
 */
const authenticateUser = createAsyncThunk(
  "user/auth",
  async (
    userData: { username: string; password: string },
    { rejectWithValue }
  ) => {
    const { res, error } = await authenticate(userData);

    if (error) return rejectWithValue(error.response?.data || error.message);

    return res.data;
  }
);

/**
 * async action to logout user
 */
const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    const { res, error } = await logout();

    if (error) return rejectWithValue(error.response?.data || error.message);

    return res.data;
  }
);

const deleteFromShared = createAsyncThunk(
  "user/deleteFromShared",
  async (_, { rejectWithValue, getState }) => {
    const store = getState() as RootState;
    const tableId = store.form.data._id;
    if (!tableId) return rejectWithValue("Cannot delete the table.");
    const { res, error } = await deleteShared(tableId);
    if (error) return rejectWithValue(error.response?.data || error.message);
    return res.data;
  }
);

/**
 * async action to sign the user out of the app
 */

const signoutUser = createAsyncThunk(
  "user/signout",
  async (_, { rejectWithValue }) => {
    const { res, error } = await signout();
    if (error) return rejectWithValue(error.response?.data || error.message);
    return res.data;
  }
);

/**
 *  async action to fetch the table names for the logged in user
 */
const getUserTables = createAsyncThunk(
  "user/get",
  async (_, { rejectWithValue }) => {
    const { res, error } = await fetchUserTables();

    if (error) return rejectWithValue(error.response?.data || error.message);

    return res.data;
  }
);

/**
 * async action to create a new user entry in the server
 */
const createNewUser = createAsyncThunk(
  "user/create",
  async (
    userData: { username: string; password: string },
    { rejectWithValue }
  ) => {
    const { res, error } = await createUser(userData);

    if (error) return rejectWithValue(error.response?.data || error.message);

    return res.data;
  }
);

/**
 * async action to get the list of users from the server
 */
const getUserList = createAsyncThunk(
  "user/getUsers",
  async (_, { rejectWithValue }) => {
    const { res, error } = await getUsers();
    if (error) return rejectWithValue(error.response?.data || error.message);
    return res.data;
  }
);

/**
 * async action to send the share table data to the server
 */
const shareTable = createAsyncThunk(
  "form/share",
  async (data: any, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const { res, error } = await share({
      ...data,
      tableId: state.form.data._id,
    });
    if (error) return rejectWithValue(error.response?.data || error.message);
    return res.data;
  }
);

export {
  getUserTables,
  shareTable,
  createNewUser,
  authenticateUser,
  logoutUser,
  signoutUser,
  getUserList,
  deleteFromShared,
};
