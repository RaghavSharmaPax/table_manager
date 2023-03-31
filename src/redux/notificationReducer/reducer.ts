import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationType } from "../../utils/TableManager/utils";
import { finishTimer } from "./actions";

/**
 * state values for Notification Timer
 */
export enum Timer {
  Active = "Active",
  Finished = "Finished",
  Start = "Start",
}

export const NotificationTemplate = {
  text: "",
  type: NotificationType.Default,
  timer: Timer.Start,
};

const initialState: { messages: typeof NotificationTemplate[] } = {
  messages: [],
};

const NotificationReducer = createSlice({
  name: "notification",
  initialState,
  reducers: {
    createNotification:
      /**
       *
       * @param state current state of the notification reducer
       * @param action object containing the message and type for the notification
       */
      (
        state,
        action: PayloadAction<{ message: string; type: NotificationType }>
      ) => {
        const noti = { ...NotificationTemplate };
        noti.text = action.payload.message;
        noti.type = action.payload.type;
        noti.timer = Timer.Start;
        // state.messages = [noti, ...state.messages];

        const sameNotifications = state.messages.filter(
          (it) => it.text === noti.text
        );

        if (!sameNotifications.length) state.messages.push(noti);
      },

    deleteNotifications:
      /**
       *
       * @param state current state of the notification reducer
       * @param _action empty action
       */
      (state) => {
        state.messages = state.messages.filter(
          (msg) => msg.timer !== Timer.Finished
        );
      },
  },
  extraReducers(builder) {
    builder.addCase(finishTimer.fulfilled, (state, action) => {
      const { idx } = action.payload;
      const len = state.messages.length;

      if (len > idx) {
        state.messages[idx].timer = Timer.Finished;
      }
    });
  },
});

export const { createNotification, deleteNotifications } =
  NotificationReducer.actions;
export default NotificationReducer.reducer;
