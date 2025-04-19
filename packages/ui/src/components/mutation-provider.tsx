import { createContext, useContext } from "react";
import { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { CallbackConfig } from "../lib/types/actions";
import { useCallback } from "@/hooks/use-callback";

const MutationContext = createContext<UseMutationResult<any, any, any> | null>(
  null
);

export const useMutationContext = () => {
  const context = useContext(MutationContext);
  if (!context) {
    throw new Error(
      "useMutationContext must be used within a MutationProvider"
    );
  }
  return context;
};

export const MutationProvider = ({
  name,
  children,
  action,
  onSuccess,
  onError,
}: {
  name?: string;
  children: React.ReactNode;
  action?: (data: any) => Promise<any>;
  onSuccess?: (config: CallbackConfig) => void;
  onError?: (config: CallbackConfig) => void;
}) => {
  const callback = useCallback();

  const mutation = useMutation({
    mutationKey: [name],
    mutationFn: action,
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess({ data, ...callback });
      }
    },
    onError: (error) => {
      if (onError) {
        onError({ error, ...callback });
      }
    },
  });

  const value = {
    ...mutation,
  };

  return (
    <MutationContext.Provider value={value}>
      {children}
    </MutationContext.Provider>
  );
};
