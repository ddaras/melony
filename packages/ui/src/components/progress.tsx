import { Progress as ProgressPrimitive } from "./ui/progress";

export const Progress = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  return <ProgressPrimitive value={value} className={className} />;
};
