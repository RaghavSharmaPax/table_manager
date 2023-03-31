import { Link, useNavigate } from "react-router-dom";

import CredentialForm from "../../components/core/CredentialsForm";
import { authenticateUser } from "../../redux/userReducer/actions";
import { useAppDispatch } from "../../redux/hooks";
import { createNotification } from "../../redux/notificationReducer/reducer";
import { NotificationType } from "../../utils/TableManager/utils";

import "./styles.css";

const LogIn = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  /**
   * logs the user in
   * @param userData username password
   * @returns notification action if the user login request is rejected || redirects the table manager if success
   */
  const loginUser = async (userData: {
    username: string;
    password: string;
  }) => {
    const res = await dispatch(authenticateUser(userData));

    if (res.meta.requestStatus === "rejected") {
      return dispatch(
        createNotification({
          message: res.payload,
          type: NotificationType.Error,
        })
      );
    }

    navigate("/", { replace: true });
  };

  return (
    <div className="login_page">
      <div className="login_page__hero">
        <h2 className="login_page__header">Login</h2>
        <CredentialForm onFormSubmit={loginUser} />
        <p>
          Don't have an account?{" "}
          <Link className="login_page__redirect" to="/signup">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LogIn;
