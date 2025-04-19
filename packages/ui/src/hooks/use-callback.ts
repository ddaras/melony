import { useMelony } from "@/components/melony-provider";
import { useModal } from "@/components/modal-provider";

export const useCallback = () => {
  const { navigate } = useMelony();
  const modal = useModal();

  return { navigate, ...modal };
};
