import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./formReducer/reducer";
import notificationReducer from "./notificationReducer/reducer";
import userReducer from "./userReducer/reducer";

/**
 * @var store is the global store
 */
const store = configureStore({
  reducer: {
    form: formReducer,
    notification: notificationReducer,
    user: userReducer,
  },
});

/**
 * @type RootState type of state
 * @type AppDispatch type of store.dispatch
 */

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
