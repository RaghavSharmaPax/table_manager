import { useEffect, useState } from "react";
import { getFormData } from "../../redux/formReducer/actions";
import { clearState, updateUsername } from "../../redux/formReducer/reducer";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { TagName } from "../../utils/TableManager/utils";
import Input from "../core/Input/Input";
import Select from "../core/Select/Select";

const UserInput = () => {
  /**
   * @var username fetch and store the username from the store
   * @var error fetch and store any error occurred during form submission
   * @var users fetch and store the userlist from the store
   * @var userSelected to manage the user dropdown list
   */
  const { username, error: form_error } = useAppSelector((state) => ({
    username: state.form.data.username,
    error: state.form.error as string,
  }));
  const { users: userList } = useAppSelector((state) => state.user);

  const [userSelected, setUserSelected] = useState("");

  const dispatch = useAppDispatch();

  /**
   * @function useEffect set username to empty if no value is selected
   */
  useEffect(() => {
    if (!username) setUserSelected("");
  }, [username]);

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

    if (e.target.name === TagName.UserSelect) {
      setUserSelected(name);
      // if "" was selected clear the form
      if (!name) return dispatch(clearState());

      // fetch the form data for the given user
      dispatch(getFormData(name));
    }

    dispatch(updateUsername(name));
  };

  return (
    <div className="user_inputs">
      <Input
        error={form_error}
        type="text"
        label="Username"
        value={username}
        name={TagName.Username}
        onChange={onInputChange}
      />
      <Select
        data={userList}
        value={userSelected}
        name={TagName.UserSelect}
        onChange={onInputChange}
        label="Select User"
      />
    </div>
  );
};

export default UserInput;
