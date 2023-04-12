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

const Avatar = () => {
  const dispatch = useAppDispatch();
  const username = useAppSelector((state) => state.user.user);
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
    await dispatch(logoutUser());
  };

  const onSignout = async () => {
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
