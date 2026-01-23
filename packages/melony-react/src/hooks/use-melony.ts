import { useContext } from "react";
import { MelonyContext, MelonyContextValue } from "../providers/melony-provider";

export const useMelony = (): MelonyContextValue => {
  const context = useContext(MelonyContext);
  if (context === undefined) {
    throw new Error("useMelony must be used within a MelonyProvider");
  }

  return context;
};
