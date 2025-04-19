import { cn } from "@/lib/utils";

export type RichTextProps = {
  content: string;
  className?: string;
};

export const RichText = ({ content, className }: RichTextProps) => {
  return (
    <div
      className={cn("prose dark:prose-invert w-full max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
