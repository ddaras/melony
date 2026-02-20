import * as elements from "./elements";
import { MelonyComponents } from "@melony/ui-kit";
import * as themeProvider from "./providers/theme-provider";

// The elements object matches UIContract keys for use with MelonyUIProvider
export const shadcnElements: Partial<MelonyComponents> = {
  button: elements.Button,
  row: elements.Row,
  col: elements.Col,
  text: elements.Text,
  heading: elements.Heading,
  input: elements.Input,
  hidden: elements.Hidden,
  textarea: elements.Textarea,
  select: elements.Select,
  checkbox: elements.Checkbox,
  radioGroup: elements.RadioGroup,
  colorPicker: elements.ColorPicker,
  spacer: elements.Spacer,
  divider: elements.Divider,
  box: elements.Box,
  float: elements.Float,
  image: elements.Image,
  video: elements.Video,
  icon: elements.Icon,
  form: elements.Form,
  label: elements.Label,
  upload: elements.Upload
};

export const ThemeProvider = themeProvider.ThemeProvider;
export const useTheme = themeProvider.useTheme;
