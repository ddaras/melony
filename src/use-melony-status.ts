import { useMelony } from "./melony-provider";

export const useMelonyStatus = () => {
  const { status } = useMelony();
  return status;
};
