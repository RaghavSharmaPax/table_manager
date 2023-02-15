import { FormType } from "../utils/TableManager/utils";

// common function to handle thre response and errors
const handleResponse = async (res: Response) => {
  return await res.json();
};

// function to call the server to upload the new form data
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

// function to get the user data in response to selection from the dropdown
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

// fetching the list of all the users that have created a record
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
