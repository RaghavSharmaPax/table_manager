import axios, { AxiosError } from "axios";
import { NavigateFunction } from "react-router-dom";
import { AppDispatch } from "../redux";
import { createNotification } from "../redux/notificationReducer/reducer";
import { NotificationType, TableType } from "../utils/TableManager/utils";

axios.defaults.withCredentials = true;
// axios.defaults.baseURL = "http://localhost:4000";

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
      const data = axiosError.response?.data as string;
      const isServerReachable = !data.includes("ECONNREFUSED");

      if (!isServerReachable) {
        navigate("/login", { replace: true });
        (error as AxiosError).response!.data = "Could not reach the server.";
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
const postRequest = async (url: string, data: any) => {
  try {
    const res = await axios.post(url, data);
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

const putRequest = async (url: string, data: any) => {
  try {
    const res = await axios.put(url, data);
    return { res, error: null };
  } catch (error) {
    return { res: null, error: error as AxiosError };
  }
};

/**
 * creates a new table entry at the backend
 * @param tableData table data
 * @returns response
 */
const createNewTable = async (tableData: TableType) =>
  postRequest("/form/data", tableData);

/**
 * to update the user data
 * @param formData user form data
 * @returns response
 */
const updateTableData = async (tableData: TableType) =>
  putRequest("/form/data", tableData);

/**
 * to fetch user data from the server
 * @param username string
 * @returns response
 */
const fetchTableData = async (tableName: string) =>
  getRequest("/form/data", { tableName });

/**
 * fetches the user list
 * @returns userList
 */
const fetchUserTables = async () => getRequest("/user/list_tables", {});

/**
 * sends request to the backend to download table
 * @param tableName table name to download
 * @returns response
 */
const sendDownloadReq = async (tableName: string) =>
  getRequest("/form/download", { tableName });

/**
 * authenticates the users
 * @param userData username password
 * @returns response
 */
const authenticate = async (userData: { username: string; password: string }) =>
  postRequest("/authenticate", userData);

/**
 * sends logout request to the server
 * @returns response
 */
const logout = async () => postRequest("/user/logout", {});
/**
 * signs a new user in
 * @param userData username password
 * @returns response
 */
const createUser = async (userData: { username: string; password: string }) =>
  postRequest("/create_user", userData);

export {
  createNewTable,
  updateTableData,
  fetchTableData,
  sendDownloadReq,
  fetchUserTables,
  authenticate,
  logout,
  createUser,
  setupInterceptor,
};
