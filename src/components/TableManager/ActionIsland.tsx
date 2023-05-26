import {
  faDownload,
  faShareNodes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import download from "downloadjs";
import Button from "../../components/core/Button";
import {
  deleteTableById,
  downloadTable,
} from "../../redux/formReducer/actions";
import { clearState } from "../../redux/formReducer/reducer";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createNotification } from "../../redux/notificationReducer/reducer";
import {
  deleteFromShared,
  getUserList,
  getUserTables,
} from "../../redux/userReducer/actions";
import { NotificationType } from "../../utils/enums";
import { doesTableExist } from "../../utils/TableManager/utils";

const ActionIsland = ({
  updateModalState,
}: {
  updateModalState: (value: boolean) => void;
}) => {
  /**
   * @var activeTable stores the tablename of the current table being viewed
   */
  const dispatch = useAppDispatch();
  const activeTable = useAppSelector((state) => state.form.data.tableName);
  const userTables = useAppSelector((state) => state.user.userTables);
  const isOwned = doesTableExist(userTables.own, "tableName", activeTable);

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

  return (
    <div className="table_actions">
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
    </div>
  );
};

export default ActionIsland;
