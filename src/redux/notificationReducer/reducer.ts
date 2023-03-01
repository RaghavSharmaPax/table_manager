import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { NotificationType } from "../../utils/TableManager/utils";
import { createNotification, deleteNotification } from "./actions";

const initialState = {
  message: {
    text: "",
    type: NotificationType.Default,
  },
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(
      createNotification,
      /**
       *
       * @param state current state of the notification reducer
       * @param action object containing the message and type for the notification
       */
      (
        state,
        action: PayloadAction<{ message: string; type: NotificationType }>
      ) => {
        state.message.text = action.payload.message;
        state.message.type = action.payload.type;
      }
    )
    .addCase(
      deleteNotification,
      /**
       *
       * @param state current state of the notification reducer
       * @param _action empty action
       */
      (state, _action) => {
        state.message.text = "";
        state.message.type = NotificationType.Default;
      }
    );
});

export default reducer;
