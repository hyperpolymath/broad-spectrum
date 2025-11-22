// seo_test.ts - Tests for SEO analysis

import { assertEquals, assert } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { analyzeSEO } from "../src/bindings/seoParser.ts";

Deno.test("analyzeSEO - extracts title", async () => {
  const html = `
    <html>
      <head><title>Test Page Title</title></head>
      <body></body>
    </html>
  `;

  const result = await analyzeSEO(html, "https://example.com");
  assertEquals(result.title, "Test Page Title");
});

Deno.test("analyzeSEO - extracts meta description", async () => {
  const html = `
    <html>
      <head>
        <meta name="description" content="This is a test description">
      </head>
      <body></body>
    </html>
  `;

  const result = await analyzeSEO(html, "https://example.com");
  assertEquals(result.description, "This is a test description");
});

Deno.test("analyzeSEO - extracts Open Graph tags", async () => {
  const html = `
    <html>
      <head>
        <meta property="og:title" content="OG Title">
        <meta property="og:description" content="OG Description">
      </head>
      <body></body>
    </html>
  `;

  const result = await analyzeSEO(html, "https://example.com");
  assertEquals(result.ogTags["title"], "OG Title");
  assertEquals(result.ogTags["description"], "OG Description");
});

Deno.test("analyzeSEO - counts headings", async () => {
  const html = `
    <html>
      <body>
        <h1>Main Heading</h1>
        <h2>Subheading 1</h2>
        <h2>Subheading 2</h2>
        <h3>Sub-subheading</h3>
      </body>
    </html>
  `;

  const result = await analyzeSEO(html, "https://example.com");
  assertEquals(result.headings.h1.length, 1);
  assertEquals(result.headings.h2.length, 2);
  assertEquals(result.headings.h3.length, 1);
});

Deno.test("analyzeSEO - counts images with alt text", async () => {
  const html = `
    <html>
      <body>
        <img src="1.jpg" alt="Image 1">
        <img src="2.jpg" alt="Image 2">
        <img src="3.jpg">
      </body>
    </html>
  `;

  const result = await analyzeSEO(html, "https://example.com");
  assertEquals(result.images, 3);
  assertEquals(result.imagesWithAlt, 2);
});

Deno.test("analyzeSEO - counts word count", async () => {
  const html = `
    <html>
      <body>
        <p>This is a test paragraph with some words.</p>
        <p>Another paragraph here.</p>
      </body>
    </html>
  `;

  const result = await analyzeSEO(html, "https://example.com");
  assert(result.wordCount > 0, "Should count words in content");
  assert(result.wordCount >= 10, "Should count at least 10 words");
});
