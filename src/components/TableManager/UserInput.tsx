import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { getTableData, updloadTable } from "../../redux/formReducer/actions";
import { clearState, updateTableName } from "../../redux/formReducer/reducer";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createNotification } from "../../redux/notificationReducer/reducer";
import { getUserTables } from "../../redux/userReducer/actions";
import { NotificationType, TagName } from "../../utils/enums";
import { FileInput, Input, Select } from "../core/Inputs";

const UserInput = () => {
  /**
   * @var tableName store observer to monitor the value of the table name input field
   * @var userTables store observer to montior the list of table that the user owns and shared with them
   * @var tableSelected state holds the value of the Select dropdown
   * @var fileUploadRef holds the reference to the file update input to extract the file from
   */
  const tableName = useAppSelector((state) => state.form.data.tableName);
  const { userTables } = useAppSelector((state) => state.user);

  const [tableSelected, setTableSelected] = useState("");
  const fileUploadRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();

  /**
   * @function useEffect set username to empty if no value is selected
   */
  useEffect(() => {
    if (!tableName) setTableSelected("");
  }, [tableName]);

  /**
   * fetches the table data based on the table id and generates a notification accordingly
   * @param tableId id string of table
   * @returns void
   */
  const fetchTableData = async (tableId: string) => {
    const res = await dispatch(getTableData(tableId));
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
        message: "Table data fetched.",
        type: NotificationType.Valid,
      })
    );
  };

  /**
   * updates the value of the tablename
   * @param e onChange event on the input tablename input tag
   */
  const onInputChange = (e: any) => {
    const value = e.target.value;
    dispatch(updateTableName(value));
  };

  /**
   * calls a function to get the data of the table with the given id and populate the UI
   * @param e onChange event on the table select tag
   * @returns void
   */
  const onSelectChange = (e: any) => {
    const value = e.target.value;
    setTableSelected(value);
    if (!value) return dispatch(clearState());

    fetchTableData(value);
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
    fileUploadRef.current!.value = "";
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
    <div className="user_inputs">
      <Input
        type="text"
        label="Table Name"
        value={tableName}
        name={TagName.TableName}
        onChange={onInputChange}
      />
      <Select
        data={userTables}
        value={tableSelected}
        name={TagName.TableSelect}
        onChange={onSelectChange}
        label="Select Table"
      />

      <div className="cta__file_upload">
        <FileInput onChange={handleUpload} />
        <FontAwesomeIcon icon={faUpload} />
      </div>
    </div>
  );
};

export default UserInput;
