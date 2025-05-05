import { form, formTextField, button, vstack } from "melony";

export const addPersonForm = ({
  mutate,
  isPending: isLoading,
}: {
  mutate: any;
  isPending: boolean;
}) => {
  return vstack({
    className: "w-full p-4",
    children: [
      form({
        onSubmit: (data) => {
          mutate(data);
        },
        children: [
          formTextField({
            name: "name",
          }),
          button({
            label: "Add Person",
            isLoading,
            onClick: () => {
              mutate({ name: "John Doe" });
            },
          }),
        ],
      }),
    ],
  });
};
