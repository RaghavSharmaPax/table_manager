import { FormType } from "../utils/TableManager/utils";

/**
 * @function handleResponse utility function to handle the responses from various requests
 * @param res response to the request sent
 * @returns json response
 */
const handleResponse = async (res: Response) => {
  return await res.json();
};

/**
 * @function sendData post the data to the server
 * @param formData
 * @returns ack or error
 */
const sendData = async (formData: FormType) => {
  try {
    const res = await fetch("/form/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    return await handleResponse(res);
  } catch (error) {
    return { error };
  }
};

/**
 * @function sendData get userdata for the given username
 * @param username user selected from the dropdown list
 * @returns userData or error
 */
const getUserData = async (username: string) => {
  try {
    const res = await fetch(
      "/form/data?" + new URLSearchParams({ username: username })
    );

    return await handleResponse(res);
  } catch (error) {
    return { error };
  }
};

/**
 * @function fetchUsers fetches the list of users
 * @returns usernames of all the registered users
 */
const fetchUsers = async () => {
  try {
    const res = await fetch("/user/list", {
      method: "GET",
    });

    return await handleResponse(res);
  } catch (error) {
    return { error };
  }
};

export { sendData, getUserData, fetchUsers };
