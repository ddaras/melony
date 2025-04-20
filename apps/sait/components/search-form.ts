import { form, button, hstack, formDateField } from "melony";
import { pointFormField } from "./point-form-field";

export const searchForm = ({
  isPending,
  mutate,
}: {
  isPending: boolean;
  mutate: (data: any) => void;
}) => {
  return form(
    [
      hstack(
        [
          pointFormField({
            name: "fromId",
            label: "From",
          }),
          pointFormField({
            name: "toId",
            label: "To",
          }),
        ],
        { className: "gap-8" }
      ),
      hstack(
        [
          formDateField("departure", {
            className: "w-1/2",
          }),
          formDateField("arrival", {
            className: "w-1/2",
          }),
        ],
        {
          className: "gap-8",
        }
      ),
      button("Search", {
        isLoading: isPending,
        submit: true,
      }),
    ],
    {
      onSubmit: (data) => {
        console.log("data", data);

        mutate(data);
      },
    }
  );
};
