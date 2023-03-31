import { createSlice } from "@reduxjs/toolkit";
import { UserTableType, UserType } from "../../utils/TableManager/utils";
import {
  authenticateUser,
  createNewUser,
  getUserTables,
  logoutUser,
} from "./actions";

const userReducer = createSlice({
  name: "user",
  initialState: {
    user: {} as UserType,
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
        state.user = action.payload;
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
        state.user = {} as UserType;
        state.userTables = [] as UserTableType[];
        state.error = "";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getUserTables.pending, (state, _action) => {
        state.loading = true;
      })
      .addCase(getUserTables.fulfilled, (state, action) => {
        state.userTables = action.payload;
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
