import "@testing-library/jest-dom";
import axios from "axios";
import store from "../../redux";
import {
  authenticateUser,
  createNewUser,
  getUserTables,
  logoutUser,
} from "../../redux/userReducer/actions";
import reducer from "../../redux/userReducer/reducer";

const defState = {
  user: "",
  isAuthenticated: false,
  userTables: { own: [], shared: [] },
  users: [],
  loading: false,
  error: "",
};

describe("Test auth", () => {
  test("authenticate user", async () => {
    const postSpy = jest.spyOn(axios, "post").mockResolvedValueOnce({
      data: {
        username: "test_user_1",
        _id: "641d4894607b974657e51356",
      },
    });
    const Store = store;
    const userData = { username: "test_user_1", password: "123" };
    await Store.dispatch(authenticateUser(userData));
    expect(postSpy).toBeCalled();

    expect(Store.getState().user.user).toEqual("test_user_1");
  });
});

describe("Testing user reducer", () => {
  test("initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual(defState);
  });

  test("getting user tables from server", async () => {
    const getSpy = jest.spyOn(axios, "get").mockResolvedValueOnce({
      data: {
        _id: "6433c1a091a355ef0e1f0a91",
        username: "rag2",
        tables: [
          {
            _id: "645213ab36f782204f9367e4",
            tableName: "first table",
          },
        ],
        sharedTables: [],
      },
    });

    const Store = store;
    await Store.dispatch(getUserTables());
    expect(getSpy).toBeCalled();
    const state = Store.getState().user;

    expect(state.userTables.own).toEqual([
      {
        _id: "645213ab36f782204f9367e4",
        tableName: "first table",
        viewMode: "write",
      },
    ]);

    expect(state.userTables.shared).toEqual([]);
  });

  test("logout user", async () => {
    const postSpy = jest.spyOn(axios, "post").mockResolvedValueOnce({});

    const Store = store;
    await Store.dispatch(logoutUser());
    expect(postSpy).toBeCalled();
    const isAuthenticated = Store.getState().user.isAuthenticated;
    expect(isAuthenticated).toBe(false);
  });

  test("creating a new user", async () => {
    const postSpy = jest.spyOn(axios, "post").mockResolvedValueOnce({
      data: {
        username: "test_user_2",
        password: "U2FsdGVkX1/ulO9xus41xHv7AecwU2SDQr6s8AqP8vg=",
        dimensions: {
          rows: 0,
          cols: 0,
          _id: "641d7fd6607b974657e51365",
        },
        table: [[]],
        _id: "641d7fd6607b974657e51366",
        __v: 0,
      },
    });

    const Store = store;
    const newUser = { username: "test_user_2", password: "123" };
    await Store.dispatch(createNewUser(newUser));
    expect(postSpy).toBeCalled();
  });
});
