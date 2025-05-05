import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { useState } from "react";

export const ModalButton = ({
  content,
  title,
  description,
  label,
}: {
  content: ({ close }: { close: () => void }) => React.ReactNode;
  title: string;
  description?: string;
  label: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{label}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {content({ close: () => setIsOpen(false) })}
      </DialogContent>
    </Dialog>
  );
};
