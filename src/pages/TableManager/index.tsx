import download from "downloadjs";
import { useEffect, useState } from "react";
import Button from "../../components/core/Button";

import CustomTable from "../../components/TableManager/CustomTable";
import DimensionInput from "../../components/TableManager/DimensionInput";
import UserInput from "../../components/TableManager/UserInput";
import Modal from "../../components/core/Modal";

import {
  faDownload,
  faFloppyDisk,
  faShareNodes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalUserSelect from "../../components/TableManager/ModalUserSelect";
import {
  deleteTableById,
  downloadTable,
  postData,
} from "../../redux/formReducer/actions";
import { clearState } from "../../redux/formReducer/reducer";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createNotification } from "../../redux/notificationReducer/reducer";
import {
  getUserList,
  getUserTables,
  shareTable,
} from "../../redux/userReducer/actions";
import { NotificationType } from "../../utils/enums";
import "./styles.css";

const TableManager = () => {
  /**
   * @var activeTable stores the tablename of the current table being viewed
   * @var showModal governs if the modal should be displayed on the screen; defaults to false
   */
  const dispatch = useAppDispatch();
  const activeTable = useAppSelector((state) => state.form.data.tableName);
  const isTableActionable = useAppSelector((state) => !!state.form.data._id);
  const [showModal, setShowModal] = useState(false);

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

    return () => {
      clearForm();
    };

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

  /**
   * displays the modal when the user clicks the share button
   * @returns void
   */
  const onShare = async () => {
    const res = await dispatch(getUserList());
    if (res.meta.requestStatus === "rejected")
      return dispatch(
        createNotification({
          message: "Users could not be fetched. Try again later.",
          type: NotificationType.Error,
        })
      );

    setShowModal(true);
  };

  /**
   * sends the share data to the server and closes the modal
   * @param data share data containing list of users, tableId and viewMode for the share
   */
  const handleShareSubmit = async (data: any) => {
    const res = await dispatch(shareTable(data));
    if (res.meta.requestStatus === "rejected")
      dispatch(
        createNotification({
          message: "Could not share the table. Try again later.",
          type: NotificationType.Error,
        })
      );
    setShowModal(false);
  };

  const onDelete = async () => {
    const res = await dispatch(deleteTableById());
    if (res.meta.requestStatus === "rejected") {
      dispatch(
        createNotification({
          message: res.payload,
          type: NotificationType.Error,
        })
      );
    }
    dispatch(clearState());
    dispatch(getUserTables());
  };
  return (
    <div className="table_manager">
      <UserInput />
      <DimensionInput />
      {isTableActionable && (
        <div className="table_actions">
          <Button type="button" text="" onClick={onDownload}>
            <FontAwesomeIcon icon={faDownload} />
          </Button>
          <Button type="button" text="" onClick={onShare}>
            <FontAwesomeIcon icon={faShareNodes} />
          </Button>
          <Button type="button" text="" onClick={onDelete}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
      )}
      <CustomTable />
      <div className="table_manager__cta">
        <Button type="submit" text="Save" onClick={onSubmit}>
          <FontAwesomeIcon icon={faFloppyDisk} />
        </Button>
      </div>

      {showModal && (
        <Modal title="Select Users" closeModal={() => setShowModal(false)}>
          <ModalUserSelect
            onShareSubmit={(data: any) => {
              handleShareSubmit(data);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default TableManager;
