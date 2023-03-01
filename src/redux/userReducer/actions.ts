import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUsers } from "../../api/apiController";

/**
 * @function getUserList async action to fetch the usernames of the registered users
 */
const getUserList = createAsyncThunk(
  "user/get",
  async (_, { rejectWithValue }) => {
    const res = await fetchUsers();

    if (res.error) return rejectWithValue(res.error.message);

    return res;
  }
);

export { getUserList };
