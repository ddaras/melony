import { CallbackConfig } from "@/lib/types/actions";
import { Button } from "./ui/button";
import { useCallback } from "@/hooks/use-callback";

export type PrimaryButtonProps = {
  label: string;
  onClick: (config: CallbackConfig) => void;
  className?: string;
};

export const PrimaryButton = ({
  label,
  onClick,
  className,
}: PrimaryButtonProps) => {
  const callback = useCallback();

  return (
    <Button className={className} onClick={() => onClick({ ...callback })}>
      {label}
    </Button>
  );
};
