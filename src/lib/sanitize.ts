/**
 * Lightweight server-side HTML sanitizer to protect against XSS in article rich text.
 */

export function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml) return "";

  let cleaned = rawHtml;

  // 1. Remove dangerous script and style tags and contents
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
  cleaned = cleaned.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "");
  cleaned = cleaned.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "");
  cleaned = cleaned.replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, "");

  // 2. Remove inline event handlers (e.g. onclick, onerror, onload)
  cleaned = cleaned.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");

  // 3. Remove javascript: pseudo-protocol in href/src
  cleaned = cleaned.replace(/(href|src)\s*=\s*["']?\s*javascript:[^"'>]*/gi, "");

  // 4. Remove data: URI in script-capable contexts
  cleaned = cleaned.replace(/(href|src)\s*=\s*["']?\s*data:text\/html[^"'>]*/gi, "");

  return cleaned.trim();
}
