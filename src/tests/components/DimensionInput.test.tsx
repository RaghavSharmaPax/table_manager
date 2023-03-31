import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import DimensionInput from "../../components/TableManager/DimensionInput";
import MockParent from "../mock components/MockParent";

describe("Testing Dimesnion Input component", () => {
  test("update row and col value value", async () => {
    render(
      <MockParent>
        <DimensionInput />
      </MockParent>
    );

    const DimensionInputs = screen.getAllByTestId("test_input");
    expect(DimensionInputs).toHaveLength(2);

    fireEvent.change(DimensionInputs[0], { target: { value: 3 } });
    fireEvent.change(DimensionInputs[1], { target: { value: 3 } });

    expect((DimensionInputs[0] as HTMLInputElement).value).toBe("3");
    expect((DimensionInputs[1] as HTMLInputElement).value).toBe("3");
  });
});
