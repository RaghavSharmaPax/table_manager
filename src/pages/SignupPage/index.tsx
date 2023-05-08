import { Link, useNavigate } from "react-router-dom";

import CredentialForm from "../../components/core/CredentialsForm";
import { useAppDispatch } from "../../redux/hooks";
import { createNotification } from "../../redux/notificationReducer/reducer";
import { createNewUser } from "../../redux/userReducer/actions";
import { NotificationType } from "../../utils/enums";

import "./styles.css";

const SignUp = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  /**
   * signs the user up
   * @param userData username password
   * @returns notification if signup fails || redirects to the table manager
   */
  const signupUser = async (userData: {
    username: string;
    password: string;
  }) => {
    const res = await dispatch(createNewUser(userData));

    if (res.meta.requestStatus === "rejected")
      return dispatch(
        createNotification({
          message: res.payload,
          type: NotificationType.Error,
        })
      );

    navigate("/", { replace: true });
  };

  return (
    <div className="signup_page">
      <div className="signup_page__hero">
        <h2 className="signup_page__header">Sign Up</h2>
        <CredentialForm onFormSubmit={signupUser} />
        <p>
          Already have an account?{" "}
          <Link className="signup_page__redirect" to="/login">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
