import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import Button from "../core/Button";
import Checkbox from "../core/Checkbox";
import Radio from "../core/Radio";

const ModalUserSelect = ({
  onShareSubmit,
}: {
  onShareSubmit: (data: any) => void;
}) => {
  /**
   * @var users monitors the list of users when the modal window loads
   * @var checklist(react state) to keep track of the chosen users and their details
   * @var viewMode(react state) to keep the view mode value selected by the user
   */
  const users = useAppSelector((state) => state.user.users);
  const [checklist, setChecklist] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"read" | "write">("read");

  /**
   * updates the state of the viewMode
   * @param e onChange event on the radio group
   * @returns void
   */
  const updateViewMode = (e: any) => setViewMode("read");

  /**
   * if the user list changes update the checklist to reflect the changes
   */
  useEffect(() => {
    const checkList = users.map((user) => ({ ...user, checked: false }));
    setChecklist(checkList);
  }, [users]);

  /**
   * toggles the checked property of the user in the checklist
   * @param idx index of the user in the checklist
   */
  const onCheckboxClicked = (idx: number) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[idx].checked = !checklist[idx].checked;
    setChecklist(updatedChecklist);
  };

  /**
   * to get only the checked users and their ids and send the data back to the table manager component
   */
  const handleSubmit = () => {
    const selectedUsers = checklist.filter((user) => user.checked);
    const userIds = selectedUsers.map((user) => user._id);

    onShareSubmit({
      usersToShare: userIds,
      viewMode,
    });
  };

  return (
    <div className="modal__content__user_select">
      <h3 className="user__select__title">Users</h3>
      {checklist.map((user, idx) => (
        <Checkbox
          key={user._id}
          label={user.username}
          name="user_select"
          onChange={(e: any) => onCheckboxClicked(idx)}
        />
      ))}

      <div className="user__select__view_mode">
        <h3 className="user__select__title">Select View mode</h3>
        <div className="view_mode__buttons">
          <Radio
            label="read"
            name="viewMode"
            value="read"
            onChange={updateViewMode}
          />
          <Radio
            disable={true}
            label="write"
            name="viewMode"
            value="write"
            onChange={updateViewMode}
          />
        </div>
      </div>

      <Button type="submit" text="Share" onClick={handleSubmit} />
    </div>
  );
};

export default ModalUserSelect;
