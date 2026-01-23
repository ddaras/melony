'use client';

import React from "react";
import { MelonyComponents } from "@melony/ui-kit/client";
import * as Elements from "./elements";

export const melonyUIImplementation: Partial<MelonyComponents> = {
  card: Elements.Card,
  button: Elements.Button,
  row: Elements.Row,
  col: Elements.Col,
  text: Elements.Text,
  heading: Elements.Heading,
  badge: Elements.Badge,
  input: Elements.Input,
  hidden: Elements.Hidden,
  textarea: Elements.Textarea,
  select: Elements.Select,
  checkbox: Elements.Checkbox,
  radioGroup: Elements.RadioGroup,
  colorPicker: Elements.ColorPicker,
  spacer: Elements.Spacer,
  divider: Elements.Divider,
  box: Elements.Box,
  float: Elements.Float,
  image: Elements.Image,
  video: Elements.Video,
  icon: Elements.Icon,
  list: Elements.List,
  listItem: Elements.ListItem,
  form: Elements.Form,
  chart: Elements.Chart,
  label: Elements.Label,
  upload: Elements.Upload,
  dropdown: Elements.Dropdown,
};
