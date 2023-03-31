import download from "downloadjs";
import { useEffect } from "react";
import Button from "../../components/core/Button";

import CustomTable from "../../components/TableManager/CustomTable";
import DimensionInput from "../../components/TableManager/DimensionInput";
import UserInput from "../../components/TableManager/UserInput";

import { faDownload, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { downloadTable, postData } from "../../redux/formReducer/actions";
import { clearState } from "../../redux/formReducer/reducer";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createNotification } from "../../redux/notificationReducer/reducer";
import { getUserTables } from "../../redux/userReducer/actions";
import { NotificationType } from "../../utils/TableManager/utils";
import "./styles.css";

const TableManager = () => {
  const dispatch = useAppDispatch();
  const activeTable = useAppSelector((state) => state.form.data.tableName);

  useEffect(() => {
    /**
     * @returns void
     *
     * dispatches an action to fetch users
     * positive response -> positive notification
     * negative response -> negative notification
     */
    const fetchUsers = async () => {
      const res = await dispatch(getUserTables());
      if (res.meta.requestStatus === "rejected") return;
      dispatch(
        createNotification({
          message: "User Tables Fetched",
          type: NotificationType.Valid,
        })
      );
    };
    fetchUsers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      return dispatch(
        createNotification({
          message: res.payload,
          type: NotificationType.Error,
        })
      );

    dispatch(
      createNotification({
        message: "New Entry has been added.",
        type: NotificationType.Valid,
      })
    );
    dispatch(getUserTables());
    clearForm();
  };

  /**
   * dispatches a request to download a table
   * uses downloadjs to download data to the client
   * @returns void
   */
  const onDownload = async () => {
    const res = await dispatch(downloadTable());

    if (res.meta.requestStatus === "rejected") {
      return dispatch(
        createNotification({
          message: res.payload,
          type: NotificationType.Error,
        })
      );
    }

    dispatch(
      createNotification({
        message: "Download should start momentarily",
        type: NotificationType.Valid,
      })
    );

    download(res.payload, activeTable + ".csv", "text/csv");
  };

  return (
    <div className="table_manager">
      <UserInput />
      <DimensionInput />
      <CustomTable />
      <div className="table_manager__cta">
        <Button type="submit" text="Save" onClick={onSubmit}>
          <FontAwesomeIcon icon={faFloppyDisk} />
        </Button>
        <Button type="button" text="Download" onClick={onDownload}>
          <FontAwesomeIcon icon={faDownload} />
        </Button>
      </div>
    </div>
  );
};

export default TableManager;
