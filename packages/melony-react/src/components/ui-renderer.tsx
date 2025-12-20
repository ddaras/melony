import React from "react";
import type { UINode } from "@melony/core";
import * as Elements from "./elements";

export interface UIRendererProps {
  node: UINode;
}

/**
 * Maps UINode types to refined React elements aligned with shadcn.
 * UI is built via elements always starting with a card element as a root.
 * Children are always rendered elements, never raw strings.
 */
export function UIRenderer({ node }: UIRendererProps) {
  const { type, props, children } = node;

  // Map node type to element component
  const typeMap: Record<string, React.FC<any>> = {
    card: Elements.Card,
    button: Elements.Button,
    row: Elements.Row,
    col: Elements.Col,
    text: Elements.Text,
    heading: Elements.Heading,
    badge: Elements.Badge,
    input: Elements.Input,
    textarea: Elements.Textarea,
    select: Elements.Select,
    checkbox: Elements.Checkbox,
    radioGroup: Elements.RadioGroup,
    spacer: Elements.Spacer,
    divider: Elements.Divider,
    box: Elements.Box,
    image: Elements.Image,
    icon: Elements.Icon,
    list: Elements.List,
    listItem: Elements.ListItem,
    form: Elements.Form,
    chart: Elements.Chart,
    label: Elements.Label,
  };

  const Component = typeMap[type];

  if (!Component) {
    return (
      <div className="text-destructive italic text-sm p-2 border border-dashed rounded border-destructive/50 bg-destructive/5">
        [Unknown component: {type}]
      </div>
    );
  }

  // Recursively render children
  // These will be passed as React.ReactNode to the components
  const renderedChildren = children?.map((child, i) => (
    <UIRenderer key={i} node={child} />
  ));

  const componentProps = { ...props };

  return <Component {...componentProps}>{renderedChildren}</Component>;
}
