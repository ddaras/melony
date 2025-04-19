import React from "react";

export class UIBuilder {
  protected _key?: string;
  protected _className = "";
  protected _children: React.ReactNode[] = [];
  protected _element: string | React.ComponentType<any> = "div";
  protected _style?: React.CSSProperties;
  protected _props: Record<string, any> = {};

  constructor(element: string | React.ComponentType<any>) {
    this._element = element;
  }

  key(key: string) {
    this._key = key;
    return this;
  }

  className(name: string) {
    this._className = name;
    return this;
  }

  child(node: React.ReactNode | UIBuilder) {
    if (node instanceof UIBuilder) {
      this._children.push(node.build());
    } else {
      this._children.push(node);
    }
    return this;
  }

  children(nodes: (React.ReactNode | UIBuilder)[]) {
    nodes.forEach((node) => this.child(node));
    return this;
  }

  style(style: React.CSSProperties) {
    this._style = style;
    return this;
  }

  prop(key: string, value: any) {
    this._props[key] = value;
    return this;
  }

  build(): React.ReactElement {
    const Element = this._element as any;

    const randomKey = Math.random();

    return (
      <Element
        key={this._key || randomKey}
        className={this._className}
        style={this._style}
        {...this._props}
      >
        {this._children.map((child, index) => (
          <React.Fragment key={index}>{child}</React.Fragment>
        ))}
      </Element>
    );
  }

  // Auto-build functionality
  toString() {
    return this.build();
  }

  valueOf() {
    return this.build();
  }

  // Make the builder directly renderable in React
  [Symbol.iterator]() {
    return [this.build()][Symbol.iterator]();
  }

  // Make the builder work with React's spread operator
  [Symbol.toPrimitive]() {
    return this.build();
  }

  // Make the builder work with React's rendering system
  [Symbol.toStringTag]() {
    return "ReactElement";
  }

  // Add proper JSX handling
  [Symbol.for("react.element")]() {
    return this.build();
  }
}
