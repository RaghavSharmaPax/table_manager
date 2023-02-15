import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./formReducer/reducer";
import notificationReducer from "./notificationReducer/reducer";
import userReducer from "./userReducer/reducer";

// creating the store
const store = configureStore({
  reducer: {
    form: formReducer,
    notification: notificationReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
