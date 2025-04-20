import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";

export const ModalButton = ({
  children,
  title,
  description,
  label,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
  label: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{label}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
