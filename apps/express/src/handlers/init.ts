import { InitEvent } from "../types.js";

/**
 * Initial application layout handler
 */
export async function* initHandler(event: InitEvent) {
  console.log(`[InitHandler] Initializing app for platform: ${event.data.platform}`);

  const thredUI = {
    type: "thread",
    props: {
      placeholder: "Ask me anything...",
      welcomeTitle: "Hello, Foodie!",
      welcomeMessage: "I'm your Melony assistant. How can I help you satisfy your cravings today?",
      suggestions: [
        "What's your name?",
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

  const layoutUI = {
    type: "box",
    props: {
      padding: "md",
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
      }
    ]
  };

  yield {
    type: "ui",
    data: layoutUI
  } as any;
}
