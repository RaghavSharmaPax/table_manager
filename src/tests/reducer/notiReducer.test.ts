import "@testing-library/jest-dom";
import store from "../../redux";
import { finishTimer } from "../../redux/notificationReducer/actions";
import reducer, {
  createNotification,
  deleteNotifications,
  NotificationTemplate,
  Timer,
} from "../../redux/notificationReducer/reducer";
import { NotificationType } from "../../utils/enums";

const defState: { messages: (typeof NotificationTemplate)[] } = {
  messages: [],
};

describe("Test Notification Reducer", () => {
  test("initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual(defState);
  });

  test("create notification", async () => {
    expect(
      reducer(
        defState,
        createNotification({
          message: "Test Notification",
          type: NotificationType.Default,
        })
      )
    ).toEqual({
      messages: [
        {
          text: "Test Notification",
          type: NotificationType.Default,
          timer: Timer.Start,
        },
      ],
    });
  });

  test("delete Notification", () => {
    expect(
      reducer(
        {
          messages: [
            {
              text: "Test Notification",
              type: NotificationType.Default,
              timer: Timer.Finished,
            },
          ],
        },
        deleteNotifications()
      )
    ).toEqual({ messages: [] });
  });

  test("finish timer", async () => {
    const Store = store;

    Store.dispatch(
      createNotification({
        message: "Test Notification",
        type: NotificationType.Default,
      })
    );
    await Store.dispatch(finishTimer(0));
    expect(Store.getState().notification.messages).toEqual([
      {
        text: "Test Notification",
        type: NotificationType.Default,
        timer: Timer.Finished,
      },
    ]);
  });
});
