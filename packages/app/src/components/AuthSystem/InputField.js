import { PasswordInput, Input, InputWrapper } from "@mantine/core";
import React from "react";
import { mantineDefaultProps } from "../../appConstants";

const InputField = ({ type, onChange, title, name, required, ...rest }) => {
  const field =
    type === "password" ? (
      <PasswordInput
        {...mantineDefaultProps}
        {...rest}
        onChange={(e) => onChange({ value: e.currentTarget.value })}
      />
    ) : (
      <Input
        {...mantineDefaultProps}
        {...rest}
        onChange={(e) => onChange({ value: e.currentTarget.value })}
      />
    );

  return title ? (
    <InputWrapper {...mantineDefaultProps} required={required} label={title}>
      {field}
    </InputWrapper>
  ) : (
    field
  );
};

export default InputField;
