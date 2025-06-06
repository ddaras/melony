import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { createOrGetUser } from "@/actions/users";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && session?.user) {
      try {
        // Create or get user in the users table
        await createOrGetUser(session.user);
        return NextResponse.redirect(requestUrl.origin);
      } catch (error) {
        console.error("Error creating/getting user:", error);
        return NextResponse.redirect(`${requestUrl.origin}/auth-error`);
      }
    }
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(`${requestUrl.origin}/auth-error`);
}
