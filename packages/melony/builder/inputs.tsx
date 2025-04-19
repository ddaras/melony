import React from "react";
import { UIBuilder } from "./base";
import {
  Form,
  SubmitButton,
  TextFormField,
  PasswordFormField,
  ComboboxFormField,
  DateFormField,
} from "@melony/ui";

export class FormBuilder extends UIBuilder {
  private _onSubmit?: (data: any) => Promise<any>;

  constructor() {
    super(Form);
    this._props.defaultValues = {};
  }

  onSubmit(onSubmit: (data: any) => Promise<any>) {
    this._onSubmit = onSubmit;
    return this;
  }

  build() {
    if (!this._onSubmit) {
      throw new Error("onSubmit is required for FormBuilder");
    }

    const key = Math.random().toString();
    const onSubmit = this._onSubmit;

    return (
      <Form
        key={this._key || key}
        defaultValues={this._props.defaultValues}
        onSubmit={onSubmit}
      >
        {this._children.map((child, index) => (
          <React.Fragment key={key + index}>{child}</React.Fragment>
        ))}
      </Form>
    );
  }
}

export class SubmitButtonBuilder extends UIBuilder {
  constructor(label?: string) {
    super(SubmitButton);
    this._props = {
      label: label || "Submit",
    };
  }

  label(label: string) {
    this._props.label = label;
    return this;
  }

  isSubmitting(isSubmitting: boolean) {
    this._props.isSubmitting = isSubmitting;
    return this;
  }
}

export class FormTextInputBuilder extends UIBuilder {
  constructor(name: string, label?: string) {
    super(TextFormField);
    if (label) {
      this._props.field = { type: "text", label, name };
    }
  }

  label(label: string) {
    if (!this._props.field) {
      this._props.field = { type: "text" };
    }
    this._props.field.label = label;
    return this;
  }

  name(name: string) {
    if (!this._props.field) {
      this._props.field = { type: "text" };
    }
    this._props.field.name = name;
    return this;
  }
}

export class FormPasswordInputBuilder extends UIBuilder {
  constructor(label?: string, name?: string) {
    super(PasswordFormField);
    if (label && name) {
      this._props.field = { type: "password", label, name };
    }
  }

  label(label: string) {
    if (!this._props.field) {
      this._props.field = { type: "password" };
    }
    this._props.field.label = label;
    return this;
  }

  name(name: string) {
    if (!this._props.field) {
      this._props.field = { type: "password" };
    }
    this._props.field.name = name;
    return this;
  }
}

export class FormComboboxInputBuilder extends UIBuilder {
  constructor(name: string, label?: string) {
    super(ComboboxFormField);
    if (label) {
      this._props.field = { type: "combobox", label, name };
    }
    this._props.field.name = name;
  }

  onSearch(onSearch: (value: string) => void) {
    this._props.onSearch = onSearch;
    return this;
  }

  options(options: any[]) {
    this._props.field.config = {
      ...this._props.field.config,
      options,
    };
    return this;
  }

  isLoading(isLoading: boolean) {
    this._props.isLoading = isLoading;
    return this;
  }
}

export class FormDateInputBuilder extends UIBuilder {
  constructor(name: string, label?: string) {
    super(DateFormField);
    if (label) {
      this._props.field = { type: "date", label, name };
    }
    this._props.field.name = name;
  }
}

export const form = () => {
  return new FormBuilder();
};

export const submitButton = (label?: string) => {
  return new SubmitButtonBuilder(label);
};

export const formTextInput = (name: string, label?: string) => {
  return new FormTextInputBuilder(name, label);
};

export const formPasswordInput = (label: string, name: string) => {
  return new FormPasswordInputBuilder(label, name);
};

export const formComboboxInput = (name: string, label?: string) => {
  return new FormComboboxInputBuilder(name, label);
};

export const formDateInput = (name: string, label?: string) => {
  return new FormDateInputBuilder(name, label);
};
