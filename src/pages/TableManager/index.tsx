import { useEffect, useState } from "react";
import Button from "../../components/core/Button";

import CustomTable from "../../components/TableManager/CustomTable";
import DimensionInput from "../../components/TableManager/DimensionInput";
import UserInput from "../../components/TableManager/UserInput";
import Modal from "../../components/core/Modal";

import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalUserSelect from "../../components/TableManager/ModalUserSelect";
import { postData } from "../../redux/formReducer/actions";
import { clearState } from "../../redux/formReducer/reducer";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createNotification } from "../../redux/notificationReducer/reducer";
import { getUserTables, shareTable } from "../../redux/userReducer/actions";
import { NotificationType } from "../../utils/enums";
import "./styles.css";
import ActionIsland from "../../components/TableManager/ActionIsland";

const TableManager = () => {
  /**
   * @var activeTable stores the tablename of the current table being viewed
   * @var showModal governs if the modal should be displayed on the screen; defaults to false
   */
  const dispatch = useAppDispatch();

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
   * sends the share data to the server and closes the modal
   * @param data share data containing list of users, tableId and viewMode for the share
   */
  const handleShareSubmit = async (data: any) => {
    const res = await dispatch(shareTable(data));
    if (res.meta.requestStatus === "rejected")
      return dispatch(
        createNotification({
          message: "Could not share the table. Try again later.",
          type: NotificationType.Error,
        })
      );
    setShowModal(false);
    dispatch(
      createNotification({
        message: "Table shared",
        type: NotificationType.Valid,
      })
    );
  };

  return (
    <div className="table_manager">
      <UserInput />
      <DimensionInput />
      {isTableActionable && <ActionIsland updateModalState={setShowModal} />}
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
