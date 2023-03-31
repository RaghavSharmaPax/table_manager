import "@testing-library/jest-dom";
import { fireEvent, render, screen, within } from "@testing-library/react";
import CustomTable from "../../components/TableManager/CustomTable";
import DimensionInput from "../../components/TableManager/DimensionInput";
import MockParent from "../mock components/MockParent";

describe("Testing custom table", () => {
  test("initialState of table", async () => {
    render(
      <MockParent>
        <CustomTable />
      </MockParent>
    );

    const TableInputs = within(
      screen.getByTestId("test_table")
    ).queryAllByTestId("test_input");

    expect(TableInputs).toHaveLength(0);
  });

  test("change in table cells with change in rows and cols", async () => {
    render(
      <MockParent>
        <DimensionInput />
        <CustomTable />
      </MockParent>
    );

    const [RowInput, ColInput] = screen.getAllByTestId(
      "test_input"
    ) as HTMLInputElement[];

    expect(RowInput.value).toBe("0");
    expect(ColInput.value).toBe("0");

    const Table = screen.getByTestId("test_table");
    let TableInputs = within(Table).queryAllByTestId("test_input");

    expect(TableInputs).toHaveLength(0);

    fireEvent.change(RowInput, { target: { value: 2 } });
    fireEvent.change(ColInput, { target: { value: 2 } });

    expect(RowInput.value).toBe("2");
    expect(ColInput.value).toBe("2");

    TableInputs = within(Table).queryAllByTestId("test_input");
    expect(TableInputs).toHaveLength(4);
  });
});
