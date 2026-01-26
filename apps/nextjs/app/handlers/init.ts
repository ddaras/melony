import { InitEvent } from "../agents/types";
import { UIContract, UINode } from "@melony/ui-kit";

/**
 * Initial application layout handler
 */
export async function* initAppHandler(event: InitEvent) {
  console.log(`[InitHandler] Initializing app for platform: ${event.data.platform}`);

  const thredUI: UINode<"thread"> = {
    type: "thread",
    props: {
      placeholder: "I'm hungry...",
      welcomeTitle: "Hello, Foodie!",
      welcomeMessage: "I'm your Melony assistant. How can I help you satisfy your cravings today?",
      suggestions: [
        "What's on the menu?",
        "Show me some healthy options",
        "How do I place an order?",
        "Do you have any specials today?"
      ]
    },
  };

  const navigationUI: UINode<"list"> = {
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
              name: "IconHome"
            }
          } as UINode<"icon">
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
              name: "IconSettings"
            }
          } as UINode<"icon">
        ]
      }
    ]
  };

  const layoutUI: UINode<"box"> = {
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
        } as UIContract["float"],
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
