import { requireSupabase } from "../lib/supabase";

export type StorageBucket = "videos" | "photos" | "audios" | "thumbnails";

export interface UploadResult {
  ok: boolean;
  path?: string;
  error?: string;
}

const MAX_BUCKET_SIZES: Record<StorageBucket, number> = {
  videos: 45 * 1024 * 1024,
  photos: 10 * 1024 * 1024,
  audios: 45 * 1024 * 1024,
  thumbnails: 2 * 1024 * 1024
};

const ALLOWED_MIME: Record<StorageBucket, string[]> = {
  videos: [
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-matroska",
    "video/x-msvideo",
    "video/avi",
    "video/mpeg",
    "video/ogg",
    "video/3gpp",
    "video/x-m4v"
  ],
  photos: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/heic",
    "image/heif",
    "image/bmp",
    "image/tiff",
    "image/avif"
  ],
  audios: [
    "audio/mpeg",
    "audio/mp4",
    "audio/wav",
    "audio/x-wav",
    "audio/ogg",
    "audio/webm",
    "audio/aac",
    "audio/x-m4a",
    "audio/m4a",
    "audio/flac",
    "audio/x-flac"
  ],
  thumbnails: ["image/jpeg", "image/png", "image/webp", "image/gif"]
};

const EXTENSION_MAP: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "video/x-matroska": "mkv",
  "video/x-msvideo": "avi",
  "video/avi": "avi",
  "video/mpeg": "mpeg",
  "video/ogg": "ogv",
  "video/3gpp": "3gp",
  "video/x-m4v": "m4v",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/heic": "heic",
  "image/heif": "heif",
  "image/bmp": "bmp",
  "image/tiff": "tiff",
  "image/avif": "avif",
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/ogg": "ogg",
  "audio/webm": "weba",
  "audio/aac": "aac",
  "audio/x-m4a": "m4a",
  "audio/m4a": "m4a",
  "audio/flac": "flac",
  "audio/x-flac": "flac"
};

function extensionFor(mime: string, fileName: string): string {
  if (EXTENSION_MAP[mime]) return EXTENSION_MAP[mime];
  const dotIndex = fileName.lastIndexOf(".");
  if (dotIndex > 0 && dotIndex < fileName.length - 1) {
    const ext = fileName.slice(dotIndex + 1).toLowerCase();
    if (/^[a-z0-9]{2,5}$/.test(ext)) return ext;
  }
  return "bin";
}

function inferMimeFromName(fileName: string): string {
  const ext = fileName.slice(fileName.lastIndexOf(".") + 1).toLowerCase();
  const map: Record<string, string> = {
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
    mkv: "video/x-matroska",
    avi: "video/x-msvideo",
    mpeg: "video/mpeg",
    mpg: "video/mpeg",
    ogv: "video/ogg",
    "3gp": "video/3gpp",
    m4v: "video/x-m4v",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    heic: "image/heic",
    heif: "image/heif",
    bmp: "image/bmp",
    tiff: "image/tiff",
    avif: "image/avif",
    mp3: "audio/mpeg",
    m4a: "audio/mp4",
    wav: "audio/wav",
    ogg: "audio/ogg",
    weba: "audio/webm",
    aac: "audio/aac",
    flac: "audio/flac"
  };
  return map[ext] ?? "";
}

export function validateFile(bucket: StorageBucket, file: File): string | null {
  const effectiveMime = file.type || inferMimeFromName(file.name);

  if (!effectiveMime) {
    return `Nao foi possivel identificar o tipo do ficheiro. Tenta converter para mp4, jpg ou mp3.`;
  }

  if (!ALLOWED_MIME[bucket].includes(effectiveMime)) {
    return `Tipo de ficheiro nao permitido: ${effectiveMime}. Tenta mp4, jpg ou mp3.`;
  }

  if (file.size > MAX_BUCKET_SIZES[bucket]) {
    const maxMb = Math.round(MAX_BUCKET_SIZES[bucket] / 1024 / 1024);
    const actualMb = (file.size / 1024 / 1024).toFixed(1);
    return `Ficheiro demasiado grande (${actualMb} MB). Maximo ${maxMb} MB. Comprime ou escolhe outro.`;
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
  const effectiveMime = file.type || inferMimeFromName(file.name);
  const ext = extensionFor(effectiveMime, file.name);
  const path = `${uuid}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: effectiveMime || "application/octet-stream",
    upsert: false
  });

  if (error) {
    return { ok: false, error: error.message };
  }
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
