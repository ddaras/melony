import { ui } from "@melony/ui-kit";

export const threadUI = ui.box({
  width: "full",
  height: "full",
}, [ui.thread({
  placeholder: "Ask me anything about your system or projects...",
  welcomeTitle: "OpenBot",
  welcomeMessage: "Hey there! I'm your trusty system sidekick with superpowers over your files and terminal. Let's make some magic happen!",
  suggestions: [
    "What is in my current directory?",
    "Check system status",
    "Who am I?",
  ]
})]);