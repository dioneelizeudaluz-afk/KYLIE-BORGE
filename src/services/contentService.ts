import { requireSupabase } from "../lib/supabase";
import type { Database } from "../types/database";

export type ContentType = "video" | "photo" | "audio";
export type Content = Database["public"]["Tables"]["contents"]["Row"];
export type Plan = Database["public"]["Tables"]["plans"]["Row"];

export interface CreateContentInput {
  title: string;
  description: string | null;
  content_type: ContentType;
  storage_path: string;
  thumbnail_path: string | null;
  required_plan_id: string | null;
  published: boolean;
}

export async function listContents(): Promise<Content[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("contents")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createContent(input: CreateContentInput): Promise<Content> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("contents")
    .insert(input)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Nao foi possivel criar conteudo");
  return data;
}

export interface UpdateContentInput {
  title?: string;
  description?: string | null;
  published?: boolean;
  required_plan_id?: string | null;
}

export async function updateContent(id: string, input: UpdateContentInput): Promise<Content> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("contents")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Conteudo nao encontrado");
  return data;
}

export async function deleteContent(id: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from("contents").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
