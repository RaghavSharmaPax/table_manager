import { useEffect } from "react";

import CustomTable from "../../components/TableManager/CustomTable";
import DimensionInput from "../../components/TableManager/DimensionInput";
import UserInput from "../../components/TableManager/UserInput";

import { postData } from "../../redux/formReducer/actions";
import { clearState } from "../../redux/formReducer/reducer";
import { useAppDispatch } from "../../redux/hooks";
import { createNotification } from "../../redux/notificationReducer/actions";
import { getUserList } from "../../redux/userReducer/actions";
import { NotificationType } from "../../utils/TableManager/utils";
import "./styles.css";

const TableManager = () => {
  const dispatch = useAppDispatch();

  /**
   * to get the list of users when the page loads
   */
  useEffect(() => {
    /**
     * @returns void
     *
     * dispatches an action to fetch users
     * positive response -> positive notification
     * negative response -> negative notification
     */
    const fetchUsers = async () => {
      const res = await dispatch(getUserList());
      if (res.meta.requestStatus === "rejected")
        // generating notification
        return dispatch(
          createNotification(
            "User's could not be fetched.",
            NotificationType.Error
          )
        );
      dispatch(createNotification("User's Fetched", NotificationType.Valid));
    };
    fetchUsers();
  }, [dispatch]);

  /**
   * clearing the state after successful submission
   */
  const clearForm = () => {
    dispatch(clearState());
  };

  /**
   * handling the form submission
   * dispatches action to post data to db
   * negative res -> negative notification, exit
   * positive res -> positive notification
   * dispatch action to fetch the user list
   * clear the form
   */
  const onSubmit = async () => {
    const res = await dispatch(postData());

    if (res.meta.requestStatus === "rejected")
      return dispatch(createNotification(res.payload, NotificationType.Error));

    dispatch(
      createNotification("New Entry has been added.", NotificationType.Valid)
    );
    dispatch(getUserList());
    clearForm();
  };

  return (
    <div className="table_manager">
      <UserInput />
      <DimensionInput />
      <CustomTable />

      <button
        onClick={onSubmit}
        type="submit"
        className="table_manager__submit_btn"
      >
        Submit
      </button>
    </div>
  );
};

export default TableManager;
