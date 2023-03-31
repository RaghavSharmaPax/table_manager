import React, { useState } from "react";
import Button from "../Button";
import Input from "../Input/Input";

import "./styles.css";

const CredentialForm = ({
  onFormSubmit,
}: {
  onFormSubmit: (userData: typeof formState) => void;
}) => {
  const [formState, setFormState] = useState({
    username: "",
    password: "",
  });

  const onFormChange = (value: string, field: string) => {
    switch (field) {
      case "username":
        setFormState((prevState) => ({ ...prevState, username: value }));
        break;
      case "password":
        setFormState((prevState) => ({ ...prevState, password: value }));
        break;
      default:
        throw new Error("Unknown field found");
    }
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    onFormSubmit({ ...formState });
  };

  return (
    <form className="credential_form">
      <div className="credential_form__fields">
        <Input
          type="text"
          name="username"
          label="Username"
          value={formState.username}
          onChange={(e) => onFormChange(e.target.value, "username")}
        />
        <Input
          type="password"
          name="password"
          label="Password"
          value={formState.password}
          onChange={(e: any) => onFormChange(e.target.value, "password")}
        />
      </div>
      <Button type="submit" text="Submit" onClick={onSubmit} />
    </form>
  );
};

export default CredentialForm;
