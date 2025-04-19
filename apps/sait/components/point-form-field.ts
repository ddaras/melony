import { getMockPointsClientAction } from "@/lib/client-actions/mock-points";
import { getPointsClientAction } from "@/lib/client-actions/points";
import { formComboboxField, mutation } from "melony";

export const pointFormField = ({
  name,
  label,
}: {
  name: string;
  label: string;
}) => {
  return mutation(
    ({ data, isPending, mutate }) =>
      formComboboxField(name, {
        name: name,
        label: label,
        options: data?.map((point: any) => ({
          label: point.point_name,
          value: point.point_id,
        })),
        isLoading: isPending,
        onSearch: (value) => {
          console.log("value", value);

          mutate({
            value,
          });
        },
        className: "w-1/2",
      }),
    {
      action: getMockPointsClientAction,
    }
  );
};
