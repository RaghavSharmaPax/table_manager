import axios, { AxiosError } from "axios";
import { NavigateFunction } from "react-router-dom";
import { AppDispatch } from "../redux";
import { createNotification } from "../redux/notificationReducer/reducer";
import { NotificationType } from "../utils/TableManager/utils";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_SERVICE_ROUTE;
const authBaseUrl = process.env.REACT_APP_AUTH_ROUTE;

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
      const isServerReachable = !(axiosError.code === "ERR_NETWORK");
      if (!isServerReachable) {
        navigate("/login", { replace: true });
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

/**
 * api request to get the list of all the users
 * @returns resposne from the server
 */
const getUsers = async () => await getRequest("/user/users", {});

/**
 * sends the table data to be shared and the list of users to be shared with
 * @param data tableData
 * @returns response
 */
const share = async (data: any) =>
  await postRequest("/user/share_table", { ...data });

/**
 * creates a new table entry at the backend
 * @param tableData table data
 * @returns response
 */
const createNewTable = async (tableData: any) =>
  postRequest("/table/create_table", tableData);

/**
 * to update the user data
 * @param formData user form data
 * @returns response
 */
const updateTableData = async (tableData: any) =>
  putRequest("/table/update_table", tableData);

/**
 * to fetch user data from the server
 * @param username string
 * @returns response
 */
const fetchTableData = async (tableId: string) =>
  getRequest("/table/table_data", { tableId });

/**
 * fetches the user list
 * @returns userList
 */
const fetchUserTables = async () => getRequest("/user/list_tables", {});

/**
 * sends request to the backend to download table
 * @param tableId table id to download
 * @returns response
 */
const sendDownloadReq = async (tableId: string) =>
  getRequest("/table/download", { tableId });

const uploadReq = async (file: File, updateReq: boolean) => {
  const formData = new FormData();
  formData.append("data", file);
  return updateReq
    ? putRequest("/table/upload_table", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    : postRequest("/table/upload_table", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
};

/**
 * authenticates the users
 * @param userData username password
 * @returns response
 */
const authenticate = async (userData: { username: string; password: string }) =>
  postRequest("/auth/authenticate", userData, { baseURL: authBaseUrl });

/**
 * sends logout request to the server
 * @returns response
 */
const logout = async () => postRequest("/user/logout", {});

/**
 * api request to delete the user from the application db
 * @returns signout
 */
const signout = async () => postRequest("/user/signout", {});

/**
 * signs a new user in
 * @param userData username password
 * @returns response
 */
const createUser = async (userData: { username: string; password: string }) =>
  postRequest("/auth/create_user", userData, { baseURL: authBaseUrl });

const deleteTable = async (tableId: string) =>
  postRequest("/table/delete_table", { tableId });

export {
  createNewTable,
  updateTableData,
  fetchTableData,
  sendDownloadReq,
  uploadReq,
  fetchUserTables,
  authenticate,
  logout,
  signout,
  createUser,
  setupInterceptor,
  getUsers,
  share,
  deleteTable,
};
