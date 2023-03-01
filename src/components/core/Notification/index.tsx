import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { deleteNotification } from "../../../redux/notificationReducer/actions";
import "./styles.css";

const Notification = () => {
  /**
   * component calls and manages notifications through store
   */
  const dispatch = useAppDispatch();
  const notification = useAppSelector((state) => state.notification.message);

  /**
   * @function useEffect
   * everytime notification changes check if text is present and add a timer for notification
   */
  useEffect(() => {
    if (!notification.text) return;

    const timer = setTimeout(() => {
      dispatch(deleteNotification());
    }, 11000);

    return () => {
      clearTimeout(timer);
    };
  }, [notification, dispatch]);

  return (
    <div className={`notification ${!!notification.text ? "active" : ""}`}>
      <p className={`notification__message ${notification.type}`}>
        {notification.text}
      </p>
    </div>
  );
};

export default Notification;
