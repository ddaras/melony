import React from "react";
import { UIBuilder } from "./base";
import {
  QueryProvider,
  QueryConsumer,
  MutationProvider,
  MutationConsumer,
  CallbackConfig,
  MutationContainer,
} from "@melony/ui";

export class QueryBuilder extends UIBuilder {
  private _action?: (params: any) => Promise<any>;
  private _render?: (query: any) => React.ReactNode | UIBuilder;

  constructor() {
    super("div");
  }

  action(action: (params: any) => Promise<any>) {
    this._action = action;
    return this;
  }

  render(render: (query: any) => React.ReactNode | UIBuilder) {
    this._render = render;
    return this;
  }

  build() {
    if (!this._action || !this._render) {
      throw new Error("Action and render are required for QueryBuilder");
    }

    const key = this._key || `query-${this._action.name}`;

    const action = this._action;
    const render = this._render;

    return (
      <QueryProvider
        key={key}
        name={this._key || `action-${this._action.name}`}
        action={action}
      >
        <QueryConsumer
          render={(query) => {
            const result = render!(query);
            if (result instanceof UIBuilder) {
              return result.build();
            }
            return result;
          }}
        />
      </QueryProvider>
    );
  }
}

export class MutationBuilder extends UIBuilder {
  private _action?: (params: any) => Promise<any>;
  private _render?: (mutation: any) => React.ReactNode | UIBuilder;
  private _onSuccess?: (config: CallbackConfig) => void;
  private _onError?: (config: CallbackConfig) => void;

  constructor() {
    super("div");
  }

  action(action: (params: any) => Promise<any>) {
    this._action = action;
    return this;
  }

  render(render: (mutation: any) => React.ReactNode | UIBuilder) {
    this._render = render;
    return this;
  }

  onSuccess(onSuccess: (config: CallbackConfig) => void) {
    this._onSuccess = onSuccess;
    return this;
  }

  onError(onError: (config: CallbackConfig) => void) {
    this._onError = onError;
    return this;
  }

  build() {
    if (!this._action || !this._render) {
      throw new Error("Action and render are required for MutationBuilder");
    }

    const key = this._key || Math.random().toString();

    const action = this._action;
    const render = this._render;
    const onSuccess = this._onSuccess;
    const onError = this._onError;

    return (
      <MutationProvider
        key={`${key}-provider`}
        name={key}
        action={action}
        onSuccess={onSuccess}
        onError={onError}
      >
        <MutationConsumer
          key={`${key}-consumer`}
          render={(mutation) => {
            const result = render!(mutation);
            if (result instanceof UIBuilder) {
              return result.build();
            }

            return result;
          }}
        />
      </MutationProvider>
    );
  }
}

export class MutationContainerBuilder extends UIBuilder {
  private _action?: (params: any) => Promise<any>;

  constructor() {
    super("div");
  }

  action(action: (params: any) => Promise<any>) {
    this._action = action;
    return this;
  }

  build() {
    if (!this._action) {
      throw new Error("Action is required for MutationContainerBuilder");
    }

    return (
      <MutationContainer action={this._action}>
        {(mutation) => {
          return React.Children.map(this._children, (child) => {
            if (child instanceof UIBuilder) {
              return child.build();
            }
            return child;
          });
        }}
      </MutationContainer>
    );
  }
}

export const query = () => {
  return new QueryBuilder();
};

export const mutation = () => {
  return new MutationBuilder();
};

export const mutationContainer = () => {
  return new MutationContainerBuilder();
};
