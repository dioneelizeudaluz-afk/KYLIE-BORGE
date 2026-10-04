import { requireSupabase } from "../lib/supabase";

export type StorageBucket = "videos" | "photos" | "audios" | "thumbnails";

export interface UploadResult {
  ok: boolean;
  path?: string;
  error?: string;
}

const MAX_BUCKET_SIZES: Record<StorageBucket, number> = {
  videos: 50 * 1024 * 1024,
  photos: 10 * 1024 * 1024,
  audios: 50 * 1024 * 1024,
  thumbnails: 2 * 1024 * 1024
};

const ALLOWED_MIME: Record<StorageBucket, string[]> = {
  videos: ["video/mp4", "video/webm", "video/quicktime"],
  photos: ["image/jpeg", "image/png", "image/webp"],
  audios: ["audio/mpeg", "audio/mp4", "audio/wav", "audio/ogg"],
  thumbnails: ["image/jpeg", "image/png", "image/webp"]
};

function extensionFor(mime: string): string {
  if (mime === "video/mp4") return "mp4";
  if (mime === "video/webm") return "webm";
  if (mime === "video/quicktime") return "mov";
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "audio/mpeg") return "mp3";
  if (mime === "audio/mp4") return "m4a";
  if (mime === "audio/wav") return "wav";
  if (mime === "audio/ogg") return "ogg";
  return "bin";
}

export function validateFile(bucket: StorageBucket, file: File): string | null {
  if (!ALLOWED_MIME[bucket].includes(file.type)) {
    return `Tipo de ficheiro nao permitido: ${file.type || "desconhecido"}`;
  }
  if (file.size > MAX_BUCKET_SIZES[bucket]) {
    const maxMb = Math.round(MAX_BUCKET_SIZES[bucket] / 1024 / 1024);
    return `Ficheiro demasiado grande (max ${maxMb} MB)`;
  }
  return null;
}

export async function uploadToBucket(
  bucket: StorageBucket,
  file: File
): Promise<UploadResult> {
  const validationError = validateFile(bucket, file);
  if (validationError) return { ok: false, error: validationError };

  const supabase = requireSupabase();
  const uuid = crypto.randomUUID();
  const ext = extensionFor(file.type);
  const path = `${uuid}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, path };
}

export async function removeFromBucket(bucket: StorageBucket, path: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error(error.message);
}

export async function createSignedUrl(
  bucket: StorageBucket,
  path: string,
  expiresInSeconds = 3600
): Promise<string | null> {
  const supabase = requireSupabase();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds);
  if (error || !data) return null;
  return data.signedUrl;
}
