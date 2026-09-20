export function splitWords(text: string): string[] {
  if (!text) return [];
  return text.trim().split(/\s+/);
}

export function splitChars(text: string): string[] {
  if (!text) return [];
  return text.split('');
}
