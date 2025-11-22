// seoParser.ts - SEO analysis binding

export interface MetaTag {
  name: string;
  content: string;
}

export interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTags: Record<string, string>;
  twitterTags: Record<string, string>;
  metaTags: MetaTag[];
  headings: Record<string, string[]>;
  images: number;
  imagesWithAlt: number;
  links: number;
  internalLinks: number;
  externalLinks: number;
  wordCount: number;
  lang?: string;
  viewport?: string;
  robots?: string;
  structuredData: boolean;
}

export async function analyzeSEO(html: string, url: string): Promise<SeoData> {
  const metaTags: MetaTag[] = [];
  const ogTags: Record<string, string> = {};
  const twitterTags: Record<string, string> = {};
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

  // Extract meta description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  const description = descMatch ? descMatch[1] : undefined;

  // Extract keywords
  const keywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  const keywords = keywordsMatch ? keywordsMatch[1] : undefined;

  // Extract canonical URL
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
  const canonical = canonicalMatch ? canonicalMatch[1] : undefined;

  // Extract viewport
  const viewportMatch = html.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  const viewport = viewportMatch ? viewportMatch[1] : undefined;

  // Extract robots
  const robotsMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  const robots = robotsMatch ? robotsMatch[1] : undefined;

  // Extract lang
  const langMatch = html.match(/<html[^>]*lang=["']([^"']+)["'][^>]*>/i);
  const lang = langMatch ? langMatch[1] : undefined;

  // Extract all meta tags
  const metaMatches = html.matchAll(/<meta[^>]*name=["']([^"']+)["'][^>]*content=["']([^"']+)["'][^>]*>/gi);
  for (const match of metaMatches) {
    metaTags.push({ name: match[1], content: match[2] });
  }

  // Extract Open Graph tags
  const ogMatches = html.matchAll(/<meta[^>]*property=["']og:([^"']+)["'][^>]*content=["']([^"']+)["'][^>]*>/gi);
  for (const match of ogMatches) {
    ogTags[match[1]] = match[2];
  }

  // Extract Twitter Card tags
  const twitterMatches = html.matchAll(/<meta[^>]*name=["']twitter:([^"']+)["'][^>]*content=["']([^"']+)["'][^>]*>/gi);
  for (const match of twitterMatches) {
    twitterTags[match[1]] = match[2];
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

  // Count images and alt text
  const imgMatches = html.matchAll(/<img[^>]*>/gi);
  let images = 0;
  let imagesWithAlt = 0;
  for (const match of imgMatches) {
    images++;
    if (match[0].includes("alt=")) {
      imagesWithAlt++;
    }
  }

  // Count links
  const linkMatches = html.matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>/gi);
  let links = 0;
  let internalLinks = 0;
  let externalLinks = 0;

  const urlObj = new URL(url);
  const hostname = urlObj.hostname;

  for (const match of linkMatches) {
    links++;
    const href = match[1];
    if (href.startsWith("http")) {
      try {
        const linkUrl = new URL(href);
        if (linkUrl.hostname === hostname) {
          internalLinks++;
        } else {
          externalLinks++;
        }
      } catch {
        // Invalid URL, skip
      }
    } else {
      internalLinks++;
    }
  }

  // Count words in body
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyText = bodyMatch ? bodyMatch[1] : html;
  const textContent = bodyText.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = textContent.split(/\s+/).filter((word) => word.length > 0).length;

  // Check for structured data
  const structuredData = html.includes("application/ld+json") ||
    html.includes("schema.org");

  return {
    title,
    description,
    keywords,
    canonical,
    ogTags,
    twitterTags,
    metaTags,
    headings,
    images,
    imagesWithAlt,
    links,
    internalLinks,
    externalLinks,
    wordCount,
    lang,
    viewport,
    robots,
    structuredData,
  };
}
