import { ui } from "@melony/ui-kit";

export const threadUI = ui.thread({
  placeholder: "Ask me anything about your system or projects...",
  welcomeTitle: "OpenBot System Agent",
  welcomeMessage: "I'm your global system assistant. I have access to your file system and shell. How can I help you today?",
  suggestions: [
    "What is in my current directory?",
    "Check system status",
    "Who am I?",
  ]
});