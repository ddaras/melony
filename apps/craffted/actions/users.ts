"use server";

import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";

export async function createOrGetUser(user: User) {
  const supabase = await createClient();

  // Check if user already exists
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 is "no rows returned"
    throw new Error(fetchError.message);
  }

  if (existingUser) {
    return existingUser;
  }

  // Create new user if doesn't exist
  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert([
      {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url,
      },
    ])
    .select()
    .single();

  if (insertError) {
    throw new Error(insertError.message);
  }

  return newUser;
}
