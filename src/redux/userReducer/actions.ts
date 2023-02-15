import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUsers } from "../../api/apiController";

const getUserList = createAsyncThunk(
  "user/get",
  async (_, { rejectWithValue }) => {
    const res = await fetchUsers();

    if (res.error) return rejectWithValue(res.error.message);

    return res;
  }
);

export { getUserList };
