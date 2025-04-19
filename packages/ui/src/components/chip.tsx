import { Badge } from "@/components/ui/badge";

export type ChipProps = {
  label: string;
  variant?: "default" | "outline";
  className?: string;
};

export const Chip = ({ label, variant = "default", className }: ChipProps) => {
  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
};
