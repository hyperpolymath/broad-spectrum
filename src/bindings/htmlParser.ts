// htmlParser.ts - HTML parsing and performance analysis binding

export interface ResourceTiming {
  url: string;
  resourceType: string;
  size: number;
  transferSize: number;
  duration: number;
}

export interface PerformanceMetrics {
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
  timeToInteractive?: number;
  domContentLoaded: number;
  loadComplete: number;
  totalPageSize: number;
  totalTransferSize: number;
  resourceCount: number;
  resources: ResourceTiming[];
  score: number;
}

export async function analyzePerformance(
  html: string,
  url: string,
): Promise<PerformanceMetrics> {
  // Since we're analyzing static HTML, we'll estimate some metrics
  // In a real browser environment, these would come from the Performance API

  const resources: ResourceTiming[] = [];
  let totalSize = html.length;
  let totalTransferSize = html.length;

  // Extract script tags
  const scriptMatches = html.matchAll(/<script[^>]*src=["']([^"']+)["'][^>]*>/gi);
  for (const match of scriptMatches) {
    resources.push({
      url: match[1],
      resourceType: "script",
      size: 50000, // Estimated
      transferSize: 20000, // Estimated (compressed)
      duration: 150,
    });
    totalSize += 50000;
    totalTransferSize += 20000;
  }

  // Extract stylesheet links
  const linkMatches = html.matchAll(/<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi);
  for (const match of linkMatches) {
    resources.push({
      url: match[1],
      resourceType: "stylesheet",
      size: 30000,
      transferSize: 10000,
      duration: 100,
    });
    totalSize += 30000;
    totalTransferSize += 10000;
  }

  // Extract images
  const imgMatches = html.matchAll(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi);
  for (const match of imgMatches) {
    resources.push({
      url: match[1],
      resourceType: "image",
      size: 150000,
      transferSize: 150000,
      duration: 200,
    });
    totalSize += 150000;
    totalTransferSize += 150000;
  }

  // Estimate metrics based on page size and resources
  const resourceCount = resources.length;
  const estimatedLoadTime = 500 + (resourceCount * 50) + (totalSize / 50000);

  return {
    firstContentfulPaint: 800 + (totalSize / 100000),
    largestContentfulPaint: 1200 + (totalSize / 50000),
    cumulativeLayoutShift: 0.05 + (resourceCount * 0.01),
    timeToInteractive: estimatedLoadTime * 1.5,
    domContentLoaded: estimatedLoadTime * 0.7,
    loadComplete: estimatedLoadTime,
    totalPageSize: totalSize,
    totalTransferSize: totalTransferSize,
    resourceCount,
    resources,
    score: Math.max(0, 100 - (totalSize / 100000)),
  };
}

export function parseHtml(html: string): {
  title?: string;
  metaTags: Array<{ name: string; content: string }>;
  headings: Record<string, string[]>;
} {
  const metaTags: Array<{ name: string; content: string }> = [];
  const headings: Record<string, string[]> = {
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
  };

  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : undefined;

  // Extract meta tags
  const metaMatches = html.matchAll(/<meta[^>]*name=["']([^"']+)["'][^>]*content=["']([^"']+)["'][^>]*>/gi);
  for (const match of metaMatches) {
    metaTags.push({ name: match[1], content: match[2] });
  }

  // Extract headings
  for (let level = 1; level <= 6; level++) {
    const tag = `h${level}`;
    const regex = new RegExp(`<${tag}[^>]*>([^<]+)<\/${tag}>`, "gi");
    const matches = html.matchAll(regex);
    for (const match of matches) {
      headings[tag].push(match[1].trim());
    }
  }

  return { title, metaTags, headings };
}

export function extractLinksFromHtml(html: string, baseUrl: string): string[] {
  const links: string[] = [];
  const seen = new Set<string>();

  // Extract href attributes
  const hrefMatches = html.matchAll(/href=["']([^"']+)["']/gi);
  for (const match of hrefMatches) {
    const url = match[1].trim();
    if (
      url &&
      !url.startsWith("javascript:") &&
      !url.startsWith("mailto:") &&
      !url.startsWith("tel:") &&
      !url.startsWith("#") &&
      !seen.has(url)
    ) {
      links.push(url);
      seen.add(url);
    }
  }

  // Extract src attributes
  const srcMatches = html.matchAll(/src=["']([^"']+)["']/gi);
  for (const match of srcMatches) {
    const url = match[1].trim();
    if (url && !seen.has(url)) {
      links.push(url);
      seen.add(url);
    }
  }

  // Make URLs absolute
  return links.map((url) => {
    try {
      if (url.startsWith("https://") || url.startsWith("https://")) {
        return url;
      }
      const base = new URL(baseUrl);
      if (url.startsWith("/")) {
        return `${base.origin}${url}`;
      }
      const basePath = base.pathname;
      const lastSlash = basePath.lastIndexOf("/");
      const dir = basePath.substring(0, lastSlash + 1);
      return `${base.origin}${dir}${url}`;
    } catch {
      return url;
    }
  }).filter((url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  });
}
