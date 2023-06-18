import {
  faArrowRightFromBracket,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { logoutUser, signoutUser } from "../../../redux/userReducer/actions";
import Button from "../Button";

import "./styles.css";
import { shouldClose } from "../../../utils/TableManager/utils";

const Avatar = () => {
  const dispatch = useAppDispatch();
  const username = useAppSelector((state) => state.user.user);
  const isTableNamePresent = useAppSelector(
    (state) => !!state.form.data.tableName
  );
  const doesTableHaveData = useAppSelector((state) => {
    const { toShow } = state.form;
    const { dimensions } = state.form.data;

    return (
      (dimensions.rows === 0 && toShow.rows > 0) ||
      (dimensions.cols === 0 && toShow.cols > 0)
    );
  });
  const [avatarHash, setAvatarHash] = useState<number>(Math.random());
  const [drop, setDrop] = useState(false);

  /**
   * generates a random hash for a random avatar image
   */
  useEffect(() => {
    setAvatarHash(Math.random());
  }, []);

  /**
   * dispatches action to logout the user
   */
  const onLogout = async () => {
    if (!shouldClose(isTableNamePresent, doesTableHaveData)) return;
    await dispatch(logoutUser());
  };

  const onSignout = async () => {
    if (!shouldClose(isTableNamePresent, doesTableHaveData)) return;
    await dispatch(signoutUser());
  };

  const toggleDrop = () => setDrop((prevState) => !prevState);

  return (
    <div className="avatar">
      <img
        className="avatar__img"
        src={`https://api.multiavatar.com/${avatarHash}.png`}
        alt=""
      />
      <div className={`user_actions ${drop ? "drop" : ""}`}>
        <Button type="button" text={username} onClick={toggleDrop}>
          <FontAwesomeIcon icon={faCaretDown} />
        </Button>
        <Button type="button" text="Logout" onClick={onLogout}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
        </Button>
        <Button type="button" text="SignOut" onClick={onSignout}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
        </Button>
      </div>
    </div>
  );
};

export default Avatar;
