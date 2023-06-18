import {
  faDownload,
  faShareNodes,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import download from "downloadjs";
import { useRef } from "react";
import Button from "../../components/core/Button";
import {
  clearState,
  deleteTableById,
  downloadTable,
  updloadTable,
} from "../../redux/formReducer/actions";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createNotification } from "../../redux/notificationReducer/reducer";
import {
  deleteFromShared,
  getUserList,
  getUserTables,
} from "../../redux/userReducer/actions";
import { doesTableExist } from "../../utils/TableManager/utils";
import { NotificationType } from "../../utils/enums";
import { FileInput } from "../core/Inputs";

const ActionIsland = ({
  updateModalState,
}: {
  updateModalState: (value: boolean) => void;
}) => {
  /**
   * @var activeTable stores the tablename of the current table being viewed
   */
  const dispatch = useAppDispatch();
  const isTableActionable = useAppSelector((state) => !!state.form.data._id);
  const { tableName: activeTable, owner: activeTableOwner } = useAppSelector(
    (state) => state.form.data
  );
  const userTables = useAppSelector((state) => state.user.userTables);
  const username = useAppSelector((state) => state.user.user);
  const isOwned =
    username === activeTableOwner &&
    doesTableExist(userTables.own, "tableName", activeTable);
  const fileUploadRef = useRef<HTMLInputElement>(null);

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

    updateModalState(true);
  };

  const onDelete = async () => {
    const res = isOwned
      ? await dispatch(deleteTableById())
      : await dispatch(deleteFromShared());
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

  /**
   *extracts the file using the @var fileUploadRef and passes it along to be sent to the server and generates a notification accordingly
   * @param e onChange event when the users uploads a file
   * @returns void
   */
  const handleUpload = async (e: any) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const res = await dispatch(updloadTable(file));
    if (!fileUploadRef.current) return;
    fileUploadRef.current.value = "";
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
        message: "File upload successful",
        type: NotificationType.Valid,
      })
    );
    dispatch(getUserTables());
  };
  return (
    <div className="table_actions">
      <div className="cta__file_upload">
        <FileInput onChange={handleUpload} ref={fileUploadRef} />
        <FontAwesomeIcon icon={faUpload} />
      </div>
      {isTableActionable && (
        <>
          {isOwned && (
            <>
              <Button type="button" text="" onClick={onDownload}>
                <FontAwesomeIcon icon={faDownload} />
              </Button>
              <Button type="button" text="" onClick={onShare}>
                <FontAwesomeIcon icon={faShareNodes} />
              </Button>
            </>
          )}
          <Button type="button" text="" onClick={onDelete}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </>
      )}
    </div>
  );
};

export default ActionIsland;
