import { useContext } from "react";
import { ConversationContext } from "../components/ConversationProvider";

export const useConversation = () => {
  const ctx = useContext(ConversationContext);

  if (!ctx)
    throw new Error("useConversation must be used inside ConversationProvider");

  return ctx;
};
