import { MelonyPlugin, Event } from "melony";

export interface ApprovalRequestData {
  action: string;
  params: any;
  message?: string;
}

export interface ApprovalResponseData {
  approved: boolean;
  action: string;
  params: any;
}

/**
 * Approval Plugin for Melony.
 * Standardizes Human-In-The-Loop workflows by providing a way to request and handle user approvals.
 */
export const approvalPlugin = (): MelonyPlugin<any, any> => (builder) => {
  // Handle the response from the user
  builder.on("approval:response", async function* (event, { runtime }) {
    const { approved, action, params } = event.data as ApprovalResponseData;
    
    if (approved) {
      // If approved, trigger the original event
      yield { type: action, data: params } as any;
    } else {
      // If denied, yield a text event informing the user
      yield {
        type: "text",
        data: { content: `Action "${action}" was cancelled by the user.` },
      };
    }
  });
};

/**
 * Helper to create an approval request event.
 */
export const requestApproval = (data: ApprovalRequestData): Event<ApprovalRequestData> => ({
  type: "approval:request",
  data,
});
