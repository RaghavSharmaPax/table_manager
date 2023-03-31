import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

import { useAppDispatch } from "../../../redux/hooks";
import { logoutUser } from "../../../redux/userReducer/actions";
import Button from "../Button";

import "./styles.css";

const Avatar = () => {
  const dispatch = useAppDispatch();
  const [avatarHash, setAvatarHash] = useState<number>(Math.random());

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
  return (
    <div className="avatar">
      <img
        className="avatar__img"
        src={`https://api.multiavatar.com/${avatarHash}.png`}
        alt=""
      />
      <Button type="button" text="Logout" onClick={onLogout}>
        <FontAwesomeIcon icon={faArrowRightFromBracket} />
      </Button>
    </div>
  );
};

export default Avatar;
