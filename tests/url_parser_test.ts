// url_parser_test.ts - Tests for URL parsing functionality

import { assertEquals, assert } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { parseUrl, isValidUrl, normalizeUrl } from "../src/bindings/ada.ts";

Deno.test("parseUrl - valid HTTP URL", () => {
  const result = parseUrl("https://example.com/path?query=value#hash");

  assert(result !== undefined, "Should parse valid URL");
  assertEquals(result?.protocol, "https:");
  assertEquals(result?.hostname, "example.com");
  assertEquals(result?.pathname, "/path");
  assertEquals(result?.search, "?query=value");
  assertEquals(result?.hash, "#hash");
});

Deno.test("parseUrl - invalid URL returns undefined", () => {
  const result = parseUrl("not-a-valid-url");
  assertEquals(result, undefined, "Should return undefined for invalid URL");
});

Deno.test("isValidUrl - validates HTTP URLs", () => {
  assert(isValidUrl("https://example.com"), "Should validate HTTPS URL");
  assert(isValidUrl("https://example.org"), "Should validate HTTP URL");
  assert(!isValidUrl("ftp://example.com"), "Should reject FTP URL");
  assert(!isValidUrl("not-a-url"), "Should reject invalid URL");
});

Deno.test("normalizeUrl - removes trailing slash", () => {
  const result = normalizeUrl("https://example.com/path/");
  assertEquals(result, "https://example.com/path", "Should remove trailing slash");
});

Deno.test("normalizeUrl - sorts query parameters", () => {
  const result = normalizeUrl("https://example.com?z=1&a=2&m=3");
  assertEquals(result, "https://example.com?a=2&m=3&z=1", "Should sort query params");
});

Deno.test("normalizeUrl - preserves root path", () => {
  const result = normalizeUrl("https://example.com/");
  assertEquals(result, "https://example.com/", "Should preserve root slash");
});
