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
import { UserTableType, UserType } from "../../utils/TableManager/utils";

const defState = {
  user: {} as UserType,
  isAuthenticated: false,
  userTables: [] as UserTableType[],
  loading: false,
  error: "",
};

describe("Test auth", () => {
  test("authenticate user action", async () => {
    const postSpy = jest.spyOn(axios, "post").mockResolvedValueOnce({
      data: {
        _id: "641d4894607b974657e51356",
        username: "test_user_1",
        password: "U2FsdGVkX1+p5/dPDmKcVuKPWIMpkRhA1y6MXtA1pfU=",
        dimensions: {
          rows: 2,
          cols: 2,
          _id: "641d889f521c0da1e8e40f34",
        },
        table: [["abcd", ""]],
        __v: 0,
      },
    });
    const Store = store;
    const userData = { username: "test_user_1", password: "123" };
    await Store.dispatch(authenticateUser(userData));
    expect(postSpy).toBeCalledWith("/authenticate", userData);

    expect(Store.getState().user.user).toEqual({
      _id: "641d4894607b974657e51356",
      username: "test_user_1",
      password: "U2FsdGVkX1+p5/dPDmKcVuKPWIMpkRhA1y6MXtA1pfU=",
      dimensions: {
        rows: 2,
        cols: 2,
        _id: "641d889f521c0da1e8e40f34",
      },
      table: [["abcd", ""]],
      __v: 0,
    });
  });
});

describe("Testing user reducer", () => {
  test("initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual(defState);
  });

  test("getting user tables from server", async () => {
    const getSpy = jest.spyOn(axios, "get").mockResolvedValueOnce({
      data: {
        _id: "6422cca1d6daa09f0552b25f",
        tables: [
          {
            _id: "6422ccc5d6daa09f0552b264",
            tableName: "first table",
          },
        ],
      },
    });

    const Store = store;
    await Store.dispatch(getUserTables());
    expect(getSpy).toBeCalled();
    const state = Store.getState().user;

    expect(state.userTables).toEqual([
      {
        _id: "6422ccc5d6daa09f0552b264",
        tableName: "first table",
      },
    ]);
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
    expect(postSpy).toBeCalledWith("/create_user", newUser);
  });
});
