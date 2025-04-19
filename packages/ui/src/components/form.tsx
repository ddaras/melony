import React from "react";
import { Form as FormComponent } from "./ui/form";
import { useForm } from "react-hook-form";
// import { useVariables } from "./variables-context";

export const Form = ({
  children,
  onSubmit,
  defaultValues,
}: {
  children: React.ReactNode;
  onSubmit: (data: any) => Promise<any>;
  defaultValues?: Record<string, string>;
}) => {
  // const { resolveTemplate } = useVariables();

  const resolvedDefaultValues = Object.entries(defaultValues || {}).reduce(
    (acc, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>
  );

  const form = useForm({
    defaultValues: resolvedDefaultValues,
  });

  return (
    <FormComponent {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onSubmit(data))}
        className="space-y-4"
      >
        {Array.isArray(children)
          ? children.map((child, index) => (
              <React.Fragment key={index}>{child}</React.Fragment>
            ))
          : children}
      </form>
    </FormComponent>
  );
};
