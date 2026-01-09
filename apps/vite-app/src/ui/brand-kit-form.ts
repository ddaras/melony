import { ui } from "melony";

export const brandKitUI = (values: any) =>
  ui.col({
    children: [
      ui.form({
        onSubmitAction: (data) => ({
          role: "system", // we dont need to act like user role in chat UI. TODO: we have to re-think this behaviour
          type: "update-brand-kit",
          nextAction: {
            action: "updateBrandKitAction",
            params: data,
          },
        }),
        children: [
          ui.input({
            name: "title",
            label: "title",
            defaultValue: values?.title || "",
          }),
          ui.input({
            name: "tagline",
            label: "tagline",
            defaultValue: values?.tagline,
          }),
          ui.input({
            name: "logo",
            label: "logo",
            defaultValue: values?.logo,
          }),
          ui.spacer({}),
          ui.input({
            name: "colorBgPrimary",
            label: "colorBgPrimary",
            defaultValue: values?.colorBgPrimary,
          }),
          ui.input({
            name: "colorBgSecondary",
            label: "colorBgSecondary",
            defaultValue: values?.colorBgSecondary,
          }),
          ui.input({
            name: "colorAccent1",
            label: "colorAccent1",
            defaultValue: values?.colorAccent1,
          }),
          ui.input({
            name: "colorAccent2",
            label: "colorAccent2",
            defaultValue: values?.colorAccent2,
          }),
          ui.input({
            name: "colorTextPrimary",
            label: "colorTextPrimary",
            defaultValue: values?.colorTextPrimary,
          }),
          ui.input({
            name: "colorTextSecondary",
            label: "colorTextSecondary",
            defaultValue: values?.colorTextSecondary,
          }),
          ui.button({
            type: "submit",
            label: "Save",
          }),
        ],
      }),
    ],
  });
