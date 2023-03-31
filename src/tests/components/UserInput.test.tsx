import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import UserInput from "../../components/TableManager/UserInput";
import store from "../../redux";
import * as reduxHooks from "../../redux/hooks";
import { getUserTables } from "../../redux/userReducer/actions";
import MockParent from "../mock components/MockParent";

describe("user input tests", () => {
  let appSelectorMock: any;

  beforeEach(() => {
    appSelectorMock = jest
      .spyOn(reduxHooks, "useAppSelector")
      .mockImplementation(() => store.getState);
  });

  afterEach(() => {
    appSelectorMock.mockRestore();
  });

  test("add user input", async () => {
    render(
      <MockParent>
        <UserInput />
      </MockParent>
    );
    // });
    expect(appSelectorMock).toHaveBeenCalled();
    const UsernameInput = await screen.findByTestId("test_input");
    fireEvent.change(UsernameInput, { target: { value: "rag" } });
    expect((UsernameInput as HTMLInputElement).value).toBe("rag");
  });

  test("select user initialized with empty val", async () => {
    render(
      <MockParent>
        <UserInput />
      </MockParent>
    );

    const Store = store;
    const getSpy = jest.spyOn(axios, "get").mockRejectedValueOnce({
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

    await Store.dispatch(getUserTables());

    expect(getSpy).toBeCalled();

    const UserOptions = await screen.findAllByTestId("test_option");

    expect(UserOptions).toHaveLength(1);
    expect((UserOptions[0] as HTMLOptionElement).value).toBe("");
  });
});
