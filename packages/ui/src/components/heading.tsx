import { cn } from "@/lib/utils";

export const Heading = ({
  level,
  content,
  className,
}: {
  level: number;
  content: string;
  className?: string;
}) => {
  return (
    <h1
      className={cn(`text-2xl font-bold`, className, {
        "text-2xl": level === 1,
        "text-3xl": level === 2,
        "text-4xl": level === 3,
        "text-5xl": level === 4,
      })}
    >
      {content}
    </h1>
  );
};
