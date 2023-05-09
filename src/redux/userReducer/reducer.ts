import { createSlice } from "@reduxjs/toolkit";
import { SharedTableType, UserTableType, UserType } from "../../utils/types";
import {
  authenticateUser,
  createNewUser,
  getUserList,
  getUserTables,
  logoutUser,
  signoutUser,
} from "./actions";

const defaultUserTables = { own: [], shared: [] };

const userReducer = createSlice({
  name: "user",
  initialState: {
    user: "",
    users: [] as UserType[],
    isAuthenticated: false,
    userTables: { own: [], shared: [] } as {
      own: UserTableType[];
      shared: SharedTableType[];
    },
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
        state.userTables = defaultUserTables;
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
        state.userTables = defaultUserTables;
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
        const rawSharedTables = action.payload.sharedTables;
        const formattedSharedTables: SharedTableType[] = rawSharedTables.map(
          (table: {
            id: {
              _id: string;
              tableName: string;
              owner: { _id: string; username: string };
            };
            viewMode: "read" | "write";
            _id: string;
          }): SharedTableType => ({
            _id: table.id._id,
            tableName: table.id.tableName,
            owner: table.id.owner.username,
            viewMode: table.viewMode,
          })
        );

        state.userTables = {
          own: action.payload.tables.map(
            (table: { _id: string; tableName: string }): UserTableType => ({
              ...table,
              viewMode: "write",
            })
          ),
          shared: formattedSharedTables,
        };
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
        state.user = action.payload.username;
        state.isAuthenticated = true;
      })
      .addCase(createNewUser.rejected, (state, _action) => {
        state.isAuthenticated = false;
      })
      .addCase(getUserList.pending, (state, _action) => {
        state.loading = true;
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getUserList.rejected, (state, _action) => {
        state.isAuthenticated = false;
      });
  },
});

export default userReducer.reducer;
