import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { getTableData, updloadTable } from "../../redux/formReducer/actions";
import { clearState, updateTableName } from "../../redux/formReducer/reducer";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createNotification } from "../../redux/notificationReducer/reducer";
import { getUserTables } from "../../redux/userReducer/actions";
import { NotificationType, TagName } from "../../utils/TableManager/utils";
import Input from "../core/Input/Input";
import Select from "../core/Select/Select";

const TableInput = () => {
  /**
   * @var username fetch and store the username from the store
   * @var error fetch and store any error occurred during form submission
   * @var users fetch and store the userlist from the store
   * @var userSelected to manage the user dropdown list
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
   * @function onInputChange
   * manages the changes made to the user select list and user input
   * if user is selected from the dropdown @var userSelected is updated
   * and form data for the user is fetched
   *
   * if userInput is changed, @var username is updated
   *
   * @param e  synthetic event
   */
  const onInputChange = (e: any) => {
    const tableId = e.target.value;

    if (e.target.name === TagName.TableSelect) {
      setTableSelected(tableId);
      // if "" was selected clear the form
      if (!tableId) return dispatch(clearState());

      // fetch the form data for the given user
      // dispatch(getFormData(name));
      fetchTableData(tableId);
    }
    const tableName = userTables.find(
      (table) => table._id === tableId
    )!.tableName;
    dispatch(updateTableName(tableName));
  };

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
        onChange={onInputChange}
        label="Select Table"
      />

      <div className="cta__file_upload">
        <Input
          ref={fileUploadRef}
          type="file"
          name="file_upload"
          value={undefined}
          label=""
          onChange={handleUpload}
        ></Input>
        <FontAwesomeIcon icon={faUpload} />
      </div>
    </div>
  );
};

export default TableInput;
