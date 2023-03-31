import { createAsyncThunk } from "@reduxjs/toolkit";

/**
 * action to finisht the view timer for the notification
 */
const finishTimer = createAsyncThunk("notification/finish", (idx: number) => {
  return { idx };
});

export { finishTimer };
