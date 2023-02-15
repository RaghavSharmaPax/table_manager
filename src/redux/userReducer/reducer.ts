import { createSlice } from "@reduxjs/toolkit";
import { getUserList } from "./actions";

const userReducer = createSlice({
  name: "user",
  initialState: {
    users: [],
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserList.pending, (state, _action) => {
        state.loading = true;
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(getUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userReducer.reducer;
