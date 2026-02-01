import { InitEvent } from "../types.js";

/**
 * Initial application layout handler
 */
export async function* initHandler(event: InitEvent) {
  console.log(`[InitHandler] Initializing app for platform: ${event.data.platform}`);

  const thredUI = {
    type: "thread",
    props: {
      placeholder: "Ask me anything about your system or projects...",
      welcomeTitle: "OpenBot System Agent",
      welcomeMessage: "I'm your global system assistant. I have access to your file system and shell. How can I help you today?",
      suggestions: [
        "What is in my current directory?",
        "Check system status",
        "Who am I?",
      ]
    },
  };

  const navigationUI = {
    type: "list",
    props: {
      gap: "sm",
      padding: "sm",
    },
    children: [
      {
        type: "listItem",
        props: {
          onClickAction: {
            type: "client:navigate",
            data: {
              path: "/some-url",
            }
          },
        },
        children: [
          {
            type: "icon",
            props: {
              name: "🏠"
            }
          }
        ]
      },
      {
        type: "listItem",
        props: {
          onClickAction: {
            type: "client:navigate",
            data: {
              path: "/some-other-url",
            }
          },
        },
        children: [
          {
            type: "icon",
            props: {
              name: "⚙️"
            }
          }
        ]
      }
    ]
  };

  const browserMonitorUI = {
    type: "card",
    props: {
      title: "Browser Manager",
      subtitle: "Manage open tabs & memory",
      padding: "sm",
      width: "300px",
    },
    children: [
      {
        type: "col",
        props: { gap: "sm" },
        children: [
          {
            type: "text",
            props: {
              value: "Status: Persistent session active",
              size: "xs",
              color: "muted"
            }
          },
          {
            type: "row",
            props: { gap: "xs", justify: "end" },
            children: [
              {
                type: "button",
                props: {
                  label: "Refresh",
                  size: "xs",
                  variant: "outline",
                  onClickAction: {
                    type: "browser:poll_state", // Sends this event to the server
                  }
                }
              },
              {
                type: "button",
                props: {
                  label: "Clean Junk",
                  size: "xs",
                  variant: "danger",
                  onClickAction: {
                    type: "browser:cleanup", // Sends this event to the server
                  }
                }
              }
            ]
          }
        ]
      }
    ]
  };

  const layoutUI = {
    type: "box",
    props: {
      padding: "none",
      radius: "md",
      shadow: "sm",
      height: "full",
    },
    children: [
      thredUI,
      {
        type: "float",
        props: {
          position: "top-left"
        },
        children: [
          navigationUI
        ]
      },
      // {
      //   type: "float",
      //   props: { position: "top-right", margin: "md" }, // Add it to the top right
      //   children: [browserMonitorUI]
      // }
    ]
  };

  yield {
    type: "ui",
    data: layoutUI
  } as any;
}
