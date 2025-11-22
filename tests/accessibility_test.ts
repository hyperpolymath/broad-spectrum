// accessibility_test.ts - Tests for accessibility checking

import { assertEquals, assert } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { checkAccessibility } from "../src/bindings/a11y.ts";

Deno.test("checkAccessibility - detects missing alt attributes", async () => {
  const html = `
    <html lang="en">
      <head><title>Test Page</title></head>
      <body>
        <img src="test.jpg">
        <img src="test2.jpg" alt="Description">
      </body>
    </html>
  `;

  const result = await checkAccessibility(html, "https://example.com");

  const altViolations = result.violations.filter(v => v.rule === "image-alt");
  assertEquals(altViolations.length, 1, "Should detect one missing alt attribute");
});

Deno.test("checkAccessibility - detects missing lang attribute", async () => {
  const html = `
    <html>
      <head><title>Test Page</title></head>
      <body><p>Content</p></body>
    </html>
  `;

  const result = await checkAccessibility(html, "https://example.com");

  const langViolations = result.violations.filter(v => v.rule === "html-has-lang");
  assertEquals(langViolations.length, 1, "Should detect missing lang attribute");
});

Deno.test("checkAccessibility - detects missing page title", async () => {
  const html = `
    <html lang="en">
      <head></head>
      <body><p>Content</p></body>
    </html>
  `;

  const result = await checkAccessibility(html, "https://example.com");

  const titleViolations = result.violations.filter(v => v.rule === "document-title");
  assertEquals(titleViolations.length, 1, "Should detect missing title");
});

Deno.test("checkAccessibility - perfect page scores well", async () => {
  const html = `
    <html lang="en">
      <head>
        <title>Perfect Page</title>
        <meta name="viewport" content="width=device-width">
      </head>
      <body>
        <h1>Main Heading</h1>
        <img src="test.jpg" alt="Description">
        <a href="/page">Link Text</a>
      </body>
    </html>
  `;

  const result = await checkAccessibility(html, "https://example.com");

  assert(result.score >= 90, "Perfect page should score at least 90");
  assertEquals(result.violations.length, 0, "Perfect page should have no violations");
});
