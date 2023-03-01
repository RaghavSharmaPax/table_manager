import { createAction } from "@reduxjs/toolkit";
import { NotificationType } from "../../utils/TableManager/utils";

/**
 * @function createNotification sets the payload for the reducer to the message and type of notification
 */
const createNotification = createAction(
  "notification/create",
  (message: string, type: NotificationType) => ({
    payload: { message, type },
  })
);
// deleting the notification
const deleteNotification = createAction("notification/delete");

export { createNotification, deleteNotification };
