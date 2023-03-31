import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import CredentialForm from "../../components/core/CredentialsForm";

test("enter form details", () => {
  let userdata;
  render(
    <CredentialForm
      onFormSubmit={function (userData: {
        username: string;
        password: string;
      }): void {
        userdata = userData;
      }}
    />
  );

  const [usernameInput, passwordInput] = screen.getAllByTestId("test_input");
  const SubmitButton = screen.getByTestId("test_button");

  fireEvent.change(usernameInput, { target: { value: "rag" } });
  fireEvent.change(passwordInput, { target: { value: "123" } });

  expect((usernameInput as HTMLInputElement).value).toBe("rag");
  expect((passwordInput as HTMLInputElement).value).toBe("123");

  fireEvent.click(SubmitButton);
  expect(userdata).toEqual({ username: "rag", password: "123" });
});
