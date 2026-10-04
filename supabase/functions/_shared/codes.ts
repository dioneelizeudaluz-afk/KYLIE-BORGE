const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const GROUPS = 3;
const GROUP_SIZE = 4;
const TOTAL = GROUPS * GROUP_SIZE;

export function generateRawCode(): string {
  const bytes = new Uint8Array(TOTAL);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < TOTAL; i += 1) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

export function formatCode(raw: string): string {
  const parts: string[] = [];
  for (let i = 0; i < raw.length; i += GROUP_SIZE) {
    parts.push(raw.slice(i, i + GROUP_SIZE));
  }
  return parts.join("-");
}

export function generateFormattedCode(): string {
  return formatCode(generateRawCode());
}

export function normalizeCode(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "");
}
