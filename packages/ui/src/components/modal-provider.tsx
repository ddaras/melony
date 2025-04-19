"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export interface Modal {
  id?: string;
  title: string;
  description?: string;
  content: React.ReactNode;
}

interface ModalContextType {
  modals: Modal[];
  openModal: (config: Modal) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}

const ModalContext = React.createContext<ModalContextType | undefined>(
  undefined
);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modals, setModals] = React.useState<Modal[]>([]);

  const openModal = React.useCallback(
    ({
      id,
      title,
      description,
      content,
    }: {
      id?: string;
      title: string;
      description?: string;
      content: React.ReactNode;
    }) => {
      const finalId = id || Math.random().toString(36).substring(2, 9);
      setModals((prev) => [
        ...prev,
        { id: finalId, title, description, content },
      ]);
      return finalId;
    },
    []
  );

  const closeModal = React.useCallback((id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  }, []);

  const closeAllModals = React.useCallback(() => {
    setModals([]);
  }, []);

  const value = React.useMemo(
    () => ({
      modals,
      openModal,
      closeModal,
      closeAllModals,
    }),
    [modals, openModal, closeModal, closeAllModals]
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      {modals.map((modal) => (
        <Dialog
          key={modal.id}
          open={!!modal.id}
          onOpenChange={() => closeModal(modal?.id || "")}
        >
          <DialogContent className="lg:max-w-[98vw] overflow-y-scroll max-h-[98vh]">
            <DialogHeader className="sticky top-0 bg-background">
              <DialogTitle>{modal.title}</DialogTitle>
              {modal.description && (
                <DialogDescription>{modal.description}</DialogDescription>
              )}
            </DialogHeader>

            {modal.content}
          </DialogContent>
        </Dialog>
      ))}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = React.useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
