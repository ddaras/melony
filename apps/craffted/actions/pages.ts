"use server";

import { createClient } from "@/lib/supabase/server";
import { Page } from "@/schemas/page";

export async function getPages(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("project_id", projectId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getPage(pageId: string): Promise<Page> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("id", pageId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
