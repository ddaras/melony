import React from "react";
import { UIBuilder } from "./base";
import { RootLayout, MelonyProvider, Stack, Spacer } from "@melony/ui";

export class RootBuilder extends UIBuilder {
  private _appName?: string;
  private _navigate?: (path: string) => void;
  private _shouldRenderHtml?: boolean;

  constructor() {
    super(RootLayout);
  }

  appName(appName: string) {
    this._appName = appName;
    return this;
  }

  navigate(navigate: (path: string) => void) {
    this._navigate = navigate;
    return this;
  }

  shouldRenderHtml() {
    this._shouldRenderHtml = true;
    return this;
  }

  build() {
    if (!this._appName) {
      throw new Error("appName is required for RootBuilder");
    }

    return (
      <RootLayout
        shouldRenderHtml={this._shouldRenderHtml}
        className={this._className}
      >
        <MelonyProvider appName={this._appName} navigate={this._navigate}>
          {this._children}
        </MelonyProvider>
      </RootLayout>
    );
  }
}

export class VStackBuilder extends UIBuilder {
  constructor() {
    super(Stack);
  }
}

export class HStackBuilder extends UIBuilder {
  constructor() {
    super(Stack);
    this._props.direction = "row";
  }
}

export class SpacerBuilder extends UIBuilder {
  constructor() {
    super(Spacer);
  }
}

export const root = () => {
  return new RootBuilder();
};

export const vstack = () => {
  return new VStackBuilder();
};

export const hstack = () => {
  return new HStackBuilder();
};

export const spacer = () => {
  return new SpacerBuilder();
};
