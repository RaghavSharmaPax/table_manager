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

  // beforeEach(() => {
  //   appSelectorMock = jest
  //     .spyOn(reduxHooks, "useAppSelector")
  //     .mockImplementation(() => store.getState);
  // });

  // afterEach(() => {
  //   appSelectorMock.mockRestore();
  // });

  test("add user input table name", async () => {
    render(
      <MockParent>
        <UserInput />
      </MockParent>
    );

    const TableNameInput = await screen.findByTestId("test_input_tableInput");
    fireEvent.change(TableNameInput, { target: { value: "first table" } });

    expect((TableNameInput as HTMLInputElement).value).toBe("first table");
  });

  test("select user initialized with empty val", async () => {
    const tableNameMock = jest
      .spyOn(reduxHooks, "useAppSelector")
      .mockImplementationOnce(() => store.getState().form.data.tableName)
      .mockImplementationOnce(() => store.getState().user);
    render(
      <MockParent>
        <UserInput />
      </MockParent>
    );
    expect(tableNameMock).toHaveBeenCalled();

    const Store = store;
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

    await Store.dispatch(getUserTables());

    expect(getSpy).toBeCalled();

    const UserOptions = await screen.findAllByTestId("test_option");

    expect(UserOptions).toHaveLength(1);
    expect((UserOptions[0] as HTMLOptionElement).value).toBe("");
  });
});
