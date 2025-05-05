import { searchPointsClientAction } from "@/lib/client-actions/points";
import { formComboboxField, mutation } from "melony";

export const pointFormField = ({
  name,
  label,
}: {
  name: string;
  label: string;
}) => {
  return mutation({
    action: searchPointsClientAction,
    render: ({ data, isPending, mutate }) => {
      const points = Array.isArray(data)
        ? data
        : [
            {
              point_name: "Kiev",
              point_id: "6",
            },
            {
              point_name: "Lviv",
              point_id: "7",
            },
          ];

      return formComboboxField({
        name: name,
        label: label,
        options: points.map((point: any) => ({
          label: point.point_name,
          value: point.point_id,
        })),
        isLoading: isPending,
        onSearch: (value) => {
          mutate({
            value,
          });
        },
        className: "w-1/2",
      });
    },
  });
};
