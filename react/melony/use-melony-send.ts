import { useMelony } from "./melony-provider";

export const useMelonySend = () => {
  const { send } = useMelony();
  return send;
};
