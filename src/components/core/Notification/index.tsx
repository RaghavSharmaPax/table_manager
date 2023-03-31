import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { finishTimer } from "../../../redux/notificationReducer/actions";
import {
  deleteNotifications,
  Timer,
} from "../../../redux/notificationReducer/reducer";
import "./styles.css";

const Notification = () => {
  /**
   * component calls and manages notifications through store
   */
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notification.messages);

  /**
   * starts the timer for displaying the notifications
   */
  const startTimeout = () => {
    const notis = [...notifications];
    notis.forEach((noti, index) => {
      if (noti.timer === Timer.Start) {
        setTimeout(async () => {
          closeNotification(index);
        }, 3000);
      }
    });
  };

  const closeNotification = (idx: number) => {
    let timeout: NodeJS.Timeout;
    const call = async () => {
      await dispatch(finishTimer(idx));

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        dispatch(deleteNotifications());
      }, 1000);
    };
    call();
  };

  /**
   * @function useEffect
   * waits for the notifications array to have viewed all the notifications and then deletes it
   */
  useEffect(() => {
    startTimeout();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);

  return (
    <ul
      className={`notification_container ${
        notifications.length ? "active" : "inactive"
      }`}
    >
      {notifications.map((noti, index) => (
        <li
          key={noti.text + index}
          className={`notification__message ${noti.type} ${
            noti.timer === Timer.Finished ? "timeout" : ""
          }`}
        >
          <p className="notification__message__text">{noti.text}</p>
          <button
            className="notification__close_button"
            onClick={() => closeNotification(index)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default Notification;
