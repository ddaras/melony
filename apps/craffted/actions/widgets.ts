"use server";

import { createClient } from "@/lib/supabase/server";
import { Widget } from "@/schemas/widgets";

export async function getWidgets(pageId: string): Promise<Widget[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("widgets")
    .select("*")
    .order("order", { ascending: true })
    .eq("page_id", pageId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
