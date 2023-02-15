import { createAction } from "@reduxjs/toolkit";
import { NotificationType } from "../../utils/TableManager/utils";

// preparing action with the given message and type
// ****add type of message for notification background
const createNotification = createAction(
  "notification/create",
  (message: string, type: NotificationType) => ({
    payload: { message, type },
  })
);
// deleting the notification
const deleteNotification = createAction("notification/delete");

export { createNotification, deleteNotification };
