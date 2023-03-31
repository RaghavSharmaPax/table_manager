import { useEffect, useState } from "react";
import { getTableData } from "../../redux/formReducer/actions";
import { clearState, updateTableName } from "../../redux/formReducer/reducer";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createNotification } from "../../redux/notificationReducer/reducer";
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
  const { tableName, error: form_error } = useAppSelector((state) => ({
    tableName: state.form.data.tableName,
    error: state.form.error as string,
  }));
  const { userTables } = useAppSelector((state) => state.user);

  const [tableSelected, setTableSelected] = useState("");

  const dispatch = useAppDispatch();

  /**
   * @function useEffect set username to empty if no value is selected
   */
  useEffect(() => {
    if (!tableName) setTableSelected("");
  }, [tableName]);

  const fetchTableData = async (name: string) => {
    const res = await dispatch(getTableData(name));
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
    const name = e.target.value;

    if (e.target.name === TagName.TableSelect) {
      setTableSelected(name);
      // if "" was selected clear the form
      if (!name) return dispatch(clearState());

      // fetch the form data for the given user
      // dispatch(getFormData(name));
      fetchTableData(name);
    }

    dispatch(updateTableName(name));
  };

  return (
    <div className="user_inputs">
      <Input
        error={form_error}
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
    </div>
  );
};

export default TableInput;
