import { UIBuilder } from "./base";
import { Loader, Progress, toast as toastUI } from "@melony/ui";

export class LoaderBuilder extends UIBuilder {
  constructor() {
    super(Loader);
  }
}

export class ProgressBuilder extends UIBuilder {
  constructor(value?: number) {
    super(Progress);
    if (value !== undefined) {
      this._props.value = value;
    }
  }

  value(value: number) {
    this._props.value = value;
    return this;
  }
}

export class ToastBuilder {
  private _message: string = "";

  constructor(message?: string) {
    if (message) {
      this._message = message;
    }
  }

  message(message: string) {
    this._message = message;
    return this;
  }

  success() {
    toastUI.success(this._message);
  }

  error() {
    toastUI.error(this._message);
  }

  warning() {
    toastUI.warning(this._message);
  }

  info() {
    toastUI.info(this._message);
  }
}

export const loader = () => {
  return new LoaderBuilder();
};

export const progress = (value: number) => {
  return new ProgressBuilder(value);
};

export const toast = (message?: string) => {
  return new ToastBuilder(message);
}; 