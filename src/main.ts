#!/usr/bin/env -S deno run --allow-net --allow-read --allow-env
// main.ts - CLI entry point for Website Auditor

import { parseArgs } from "@std/cli/parse-args";
import * as Auditor from "../lib/es6/src/Auditor.js";
import * as Config from "../lib/es6/src/Config.js";

const VERSION = "1.0.0";

function printHelp(): void {
  console.log(`
Website Auditor v${VERSION}
A comprehensive CLI tool for website auditing

USAGE:
  deno task audit [OPTIONS]

OPTIONS:
  --url <url>              URL to audit (required unless --file is provided)
  --file <path>            Path to file containing URLs (one per line)
  --format <format>        Report format: console, json, html, markdown (default: console)
  --max-depth <n>          Maximum crawl depth (default: 3)
  --follow-external        Follow external links (default: false)
  --timeout <ms>           Request timeout in milliseconds (default: 30000)
  --user-agent <string>    Custom user agent (default: BroadSpectrum-Auditor/1.0)
  --no-accessibility       Skip accessibility checks
  --no-performance         Skip performance checks
  --no-seo                 Skip SEO checks
  --max-concurrency <n>    Maximum concurrent requests (default: 10)
  --retry-attempts <n>     Number of retry attempts (default: 3)
  --retry-delay <ms>       Delay between retries in milliseconds (default: 1000)
  --verbose                Enable verbose output
  --version                Show version
  --help                   Show this help message

EXAMPLES:
  # Audit a single URL
  deno task audit --url https://example.com

  # Audit with JSON output
  deno task audit --url https://example.com --format json

  # Audit multiple URLs from a file
  deno task audit --file urls.txt

  # Audit with custom settings
  deno task audit --url https://example.com --max-depth 5 --follow-external

  # Save HTML report to file
  deno task audit --url https://example.com --format html > report.html
  `);
}

function printVersion(): void {
  console.log(`Website Auditor v${VERSION}`);
}

async function readUrlsFromFile(filePath: string): Promise<string[]> {
  try {
    const content = await Deno.readTextFile(filePath);
    return content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("#"));
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    Deno.exit(1);
  }
}

async function main(): Promise<void> {
  const args = parseArgs(Deno.args, {
    string: [
      "url",
      "file",
      "format",
      "user-agent",
      "max-depth",
      "timeout",
      "max-concurrency",
      "retry-attempts",
      "retry-delay",
    ],
    boolean: [
      "help",
      "version",
      "follow-external",
      "no-accessibility",
      "no-performance",
      "no-seo",
      "verbose",
    ],
    default: {
      format: "console",
      "max-depth": "3",
      timeout: "30000",
      "user-agent": "BroadSpectrum-Auditor/1.0",
      "max-concurrency": "10",
      "retry-attempts": "3",
      "retry-delay": "1000",
    },
  });

  if (args.help) {
    printHelp();
    Deno.exit(0);
  }

  if (args.version) {
    printVersion();
    Deno.exit(0);
  }

  // Get URLs to audit
  let urls: string[] = [];

  if (args.url) {
    urls = [args.url];
  } else if (args.file) {
    urls = await readUrlsFromFile(args.file);
  } else {
    console.error("Error: Either --url or --file must be provided");
    console.error("Use --help for usage information");
    Deno.exit(1);
  }

  if (urls.length === 0) {
    console.error("Error: No URLs to audit");
    Deno.exit(1);
  }

  // Parse report format
  const formatOption = Config.formatFromString(args.format);
  if (!formatOption) {
    console.error(`Error: Invalid format "${args.format}". Use: console, json, html, or markdown`);
    Deno.exit(1);
  }

  // Build configuration
  const config = Config.make(
    parseInt(args["max-depth"], 10),
    args["follow-external"] || false,
    parseInt(args.timeout, 10),
    args["user-agent"],
    !args["no-accessibility"],
    !args["no-performance"],
    !args["no-seo"],
    formatOption,
    args.verbose || false,
    parseInt(args["max-concurrency"], 10),
    parseInt(args["retry-attempts"], 10),
    parseInt(args["retry-delay"], 10),
    undefined, // unit parameter for optional args
  );

  // Build audit options
  const options = Auditor.makeOptions(
    config,
    true, // checkLinks
    !args["no-accessibility"],
    !args["no-performance"],
    !args["no-seo"],
    undefined,
  );

  // Run audits
  if (args.verbose) {
    console.error(`Auditing ${urls.length} URL(s)...`);
  }

  const results = await Auditor.auditMultiple(urls, options);

  // Print results
  await Auditor.printResults(results, formatOption);

  // Exit with error code if any audits failed
  const hasErrors = results.some((result) => result.TAG === "Error");
  Deno.exit(hasErrors ? 1 : 0);
}

if (import.meta.main) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    Deno.exit(1);
  });
}
