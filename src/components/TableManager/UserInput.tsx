import { useEffect, useState } from "react";
import { getFormData } from "../../redux/formReducer/actions";
import { clearState, updateUsername } from "../../redux/formReducer/reducer";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { TagName } from "../../utils/TableManager/utils";
import Input from "../core/Input/Input";
import Select from "../core/Select/Select";

const UserInput = () => {
  const { username, error: form_error } = useAppSelector((state) => ({
    username: state.form.data.username,
    error: state.form.error as string,
  }));
  const { users: userList } = useAppSelector((state) => state.user);

  // to handle the user dropdown
  const [userSelected, setUserSelected] = useState("");

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!username) setUserSelected("");
  }, [username]);

  // handling change in input to corresponding state property
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
