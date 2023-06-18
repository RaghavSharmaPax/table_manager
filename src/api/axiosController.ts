import axios, { AxiosError } from "axios";
import { NavigateFunction } from "react-router-dom";
import { AppDispatch } from "../redux";
import { createNotification } from "../redux/notificationReducer/reducer";
import { clearUserState } from "../redux/userReducer/reducer";
import { NotificationType } from "../utils/enums";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_SERVICE_ROUTE;

/**
 * axios response interceptor
 * navigates to login page if reponse recieved has 401 status
 * dispatches notification if the session will expire within a minute
 * @param navigate for React Navigation
 * @param dispatch for dispatching redux actions
 */
const setupInterceptor = (
  navigate: NavigateFunction,
  dispatch: AppDispatch
) => {
  axios.interceptors.response.use(
    (res) => {
      if (res.status === 205) {
        navigate("/login", { replace: true });
        return res;
      }

      const cookie = document.cookie.split(";")[0].split("=");
      if (cookie[0] === "timeout" && +cookie[1] <= 60000) {
        dispatch(
          createNotification({
            message: "Session expires soon.",
            type: NotificationType.Default,
          })
        );
      }
      return res;
    },
    (error) => {
      // ask for this proxy error login
      const axiosError = error as AxiosError;
      const isServerReachable =
        !(axiosError.code === "ERR_NETWORK") &&
        !(axiosError.response?.status === 504);

      if (!isServerReachable) {
        navigate("/login", { replace: true });
        dispatch(clearUserState());
        dispatch(
          createNotification({
            message: "Could not reach the server. Try again later.",
            type: NotificationType.Error,
          })
        );
        axiosError.message = "Could not reach the server.";
      } else if (axiosError.response?.status === 401) {
        navigate("/login", { replace: true });
      }
      return Promise.reject(error);
    }
  );
};

/**
 * handles all the post request
 * @param url route path
 * @param data request body data
 * @returns response
 */
const postRequest = async (url: string, data: any, requestConfig?: any) => {
  try {
    const res = await axios.post(url, data, requestConfig);
    return { res, error: null };
  } catch (error) {
    return { res: null, error: error as AxiosError };
  }
};

/**
 * handles all the get requests
 * @param url route path
 * @param params req params
 * @returns response
 */
const getRequest = async (url: string, params: { [key: string]: any }) => {
  try {
    const res = await axios.get(url, { params });
    return { res, error: null };
  } catch (error) {
    return { res: null, error: error as AxiosError };
  }
};

/**
 * handles all the put requests
 * @param url route path
 * @param data req data
 * @returns response
 */

const putRequest = async (url: string, data: any, config?: any) => {
  try {
    const res = await axios.put(url, data, config);
    return { res, error: null };
  } catch (error) {
    return { res: null, error: error as AxiosError };
  }
};

export { postRequest, getRequest, putRequest, setupInterceptor };
