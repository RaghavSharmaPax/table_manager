import { createSlice } from "@reduxjs/toolkit";
import { UserTableType } from "../../utils/TableManager/utils";
import {
  authenticateUser,
  createNewUser,
  getUserTables,
  logoutUser,
  signoutUser,
} from "./actions";

const userReducer = createSlice({
  name: "user",
  initialState: {
    user: "",
    isAuthenticated: false,
    userTables: [] as UserTableType[],
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state, _action) => {
        state.loading = true;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.user = action.payload.username;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = "";
        state.userTables = [] as UserTableType[];
        state.error = "";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signoutUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(signoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = "";
        state.userTables = [] as UserTableType[];
        state.error = "";
      })
      .addCase(signoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getUserTables.pending, (state, _action) => {
        state.loading = true;
      })
      .addCase(getUserTables.fulfilled, (state, action) => {
        state.userTables = [].concat(
          action.payload.tables,
          action.payload.sharedTables
        );
        state.user = action.payload.username;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(getUserTables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createNewUser.pending, (state, _action) => {
        state.loading = true;
      })
      .addCase(createNewUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(createNewUser.rejected, (state, _action) => {
        state.isAuthenticated = false;
      });
  },
});

export default userReducer.reducer;
