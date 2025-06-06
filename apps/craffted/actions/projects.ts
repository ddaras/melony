"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "./auth";
import { Project } from "@/schemas/projects";

export async function getProjects() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Project[];
}

export async function getProject(id: string) {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Project;
}

export async function createProject(title: string) {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("projects")
    .insert([{ title, user_id: user.id }])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Project;
}

export async function updateProject(id: string, title: string) {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("projects")
    .update({ title })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Project;
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
