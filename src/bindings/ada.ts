// ada.ts - URL parser binding for ReScript (using native URL API)

export interface ParsedUrl {
  href: string;
  protocol: string;
  hostname: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
}

export function parseUrl(urlString: string): ParsedUrl | undefined {
  try {
    const parsed = new URL(urlString);

    return {
      href: parsed.href,
      protocol: parsed.protocol,
      hostname: parsed.hostname,
      pathname: parsed.pathname,
      search: parsed.search,
      hash: parsed.hash,
      origin: parsed.origin,
    };
  } catch (_error) {
    return undefined;
  }
}

export function isValidUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (_error) {
    return false;
  }
}

export function normalizeUrl(urlString: string): string {
  try {
    const parsed = new URL(urlString);

    // Remove trailing slash from pathname (except for root)
    let pathname = parsed.pathname;
    if (pathname.length > 1 && pathname.endsWith("/")) {
      pathname = pathname.slice(0, -1);
    }

    // Sort query parameters
    const searchParams = new URLSearchParams(parsed.search);
    const sortedParams = new URLSearchParams([...searchParams.entries()].sort());
    const search = sortedParams.toString();

    // Reconstruct URL without fragment
    const normalized = parsed.origin + pathname + (search ? `?${search}` : "");

    return normalized;
  } catch (_error) {
    return urlString;
  }
}
