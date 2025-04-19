import { Button } from "./ui/button";

export type GhostButtonProps = {
  label: string;
  onClick?: () => void;
  className?: string;
  preventDefault?: boolean;
};

export const GhostButton = ({
  label,
  onClick,
  className,
  preventDefault = false,
}: GhostButtonProps) => {
  return (
    <Button
      variant="ghost"
      className={className}
      onClick={preventDefault ? (e) => e.preventDefault() : onClick}
    >
      {label}
    </Button>
  );
};
