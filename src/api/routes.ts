import { getRequest, postRequest, putRequest } from "./axiosController";

const authBaseUrl = process.env.REACT_APP_AUTH_ROUTE;

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
const updateTableData = async (body: any) =>
  putRequest("/table/update_table", body);

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

const deleteShared = async (tableId: string) =>
  postRequest("/user/delete_from_shared", { tableId });

const clearResource = async () => postRequest("/table/clear_choice", {});

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
  clearResource,
  createUser,
  getUsers,
  share,
  deleteTable,
  deleteShared,
};
