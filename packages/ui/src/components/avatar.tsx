import {
  Avatar as ShadcnAvatar,
  AvatarImage,
  AvatarFallback,
} from "./ui/avatar";

export function Avatar({
  src,
  name,
  className,
}: {
  src: string;
  name?: string;
  className?: string;
}) {
  return (
    <ShadcnAvatar className={className}>
      <AvatarImage src={src} alt="User avatar" />
      <AvatarFallback>
        {name ? name.charAt(0).toUpperCase() : "U"}
      </AvatarFallback>
    </ShadcnAvatar>
  );
}
