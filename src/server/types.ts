export type Action = {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  requiresConfirmation?: boolean;
  run: (parameters: Record<string, any>) => Promise<UIResponse>;
};

export type UIResponse =
  | {
      type: "inline";
      component: string; // matches key in RootProvider.components
      props?: Record<string, any>;
    }
  | {
      type: "canvas";
      component: string;
      props?: Record<string, any>;
    }
  | {
      type: "message"; // plain text response
      content: string;
    };
