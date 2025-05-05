import { form, button, hstack, formDateField, card } from "melony";
import { pointFormField } from "./point-form-field";

export const searchForm = ({
  isPending,
  mutate,
}: {
  isPending: boolean;
  mutate: (data: any) => void;
}) => {
  return card({
    children: [
      form({
        onSubmit: (data) => {
          mutate(data);
        },
        children: [
          hstack({
            className: "gap-8",
            children: [
              pointFormField({
                name: "from",
                label: "From",
              }),
              pointFormField({
                name: "to",
                label: "To",
              }),
            ],
          }),
          hstack({
            className: "gap-8",
            children: [
              formDateField({
                name: "date",
                className: "w-1/2",
              }),
              formDateField({
                name: "arrival",
                className: "w-1/2",
              }),
            ],
          }),
          button({
            label: "Search",
            isLoading: isPending,
            submit: true,
          }),
        ],
      }),
    ],
  });
};
