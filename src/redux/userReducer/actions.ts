import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  authenticate,
  createUser,
  fetchUserTables,
  logout,
} from "../../api/axiosController";

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

/**
 *  async action to fetch the table names for the logged in user
 */
const getUserTables = createAsyncThunk(
  "user/get",
  async (_, { rejectWithValue }) => {
    const { res, error } = await fetchUserTables();

    if (error) return rejectWithValue(error.response?.data || error.message);

    return res.data.tables;
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

export { getUserTables, createNewUser, authenticateUser, logoutUser };
