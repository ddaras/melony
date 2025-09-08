import { useContext } from "react";
import { FlowContext } from "../providers/FlowProvider";

export const useFlow = () => {
  const ctx = useContext(FlowContext);
  if (!ctx) throw new Error("useFlow must be used inside FlowProvider");
  return ctx;
};
