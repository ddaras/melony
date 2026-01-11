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
            name: "handle",
            label: "handle",
            defaultValue: values?.handle,
          }),
          ui.upload({
            label: "logo",
            mode: "replace",
            initialFiles: values?.logo
              ? [{ name: values.logo, url: values.logo }]
              : [],
            onUploadAction: (data) => ({
              role: "system",
              type: "upload-logo",
              nextAction: { action: "uploadFileAction", params: data },
            }),
          }),
          ui.spacer({}),
          ui.colorPicker({
            name: "colorBgPrimary",
            label: "colorBgPrimary",
            defaultValue: values?.colorBgPrimary,
          }),
          ui.colorPicker({
            name: "colorBgSecondary",
            label: "colorBgSecondary",
            defaultValue: values?.colorBgSecondary,
          }),
          ui.colorPicker({
            name: "colorAccent1",
            label: "colorAccent1",
            defaultValue: values?.colorAccent1,
          }),
          ui.colorPicker({
            name: "colorAccent2",
            label: "colorAccent2",
            defaultValue: values?.colorAccent2,
          }),
          ui.colorPicker({
            name: "colorTextPrimary",
            label: "colorTextPrimary",
            defaultValue: values?.colorTextPrimary,
          }),
          ui.colorPicker({
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
