import { MelonyPlugin } from "melony";

export interface AuthPluginOptions<TUser = any> {
  /**
   * Function to retrieve the current user.
   * This can be a sync or async function.
   */
  getUser: (context: any) => TUser | Promise<TUser>;
}

/**
 * Auth Plugin for Melony.
 * Automatically injects the authenticated user into the Melony state.
 */
export const authPlugin = <TState = any, TUser = any>(
  options: AuthPluginOptions<TUser>
): MelonyPlugin<TState & { user?: TUser }, any> => (builder) => {
  const { getUser } = options;

  // Inject user into state before any event is handled
  builder.on("*", async function* (event, context) {
    // If user is already in state, skip
    if ((context.state as any).user) return;

    try {
      const user = await getUser(context);
      if (user) {
        (context.state as any).user = user;
      }
    } catch (error) {
      console.error("[AuthPlugin] Failed to retrieve user:", error);
    }
  });
};
