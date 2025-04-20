import { form, formTextField, button, vstack } from "melony";

export const addPersonForm = ({
  mutate,
  isPending: isLoading,
}: {
  mutate: any;
  isPending: boolean;
}) => {
  return vstack(
    [
      form(
        [
          formTextField("name"),
          button("Add Person", {
            isLoading,
            onClick: () => {
              mutate({ name: "John Doe" });
            },
          }),
        ],
        {
          onSubmit: (data) => {
            mutate(data);
          },
        }
      ),
    ],
    {
      className: "w-full p-4 mb-2",
    }
  );
};
