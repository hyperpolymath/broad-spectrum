// Main.res - CLI entry point for Website Auditor
// Pure ReScript replacement for main.ts

let version = "1.0.0"

let printHelp = () => {
  DenoBindings.consoleLog(`
Website Auditor v${version}
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
  deno task audit --url https://example.com
  deno task audit --url https://example.com --format json
  deno task audit --file urls.txt
  deno task audit --url https://example.com --format html > report.html
`)
}

let printVersion = () => {
  DenoBindings.consoleLog(`Website Auditor v${version}`)
}

// Simple argument parser
type parsedArgs = {
  url: option<string>,
  file: option<string>,
  format: string,
  maxDepth: int,
  followExternal: bool,
  timeout: int,
  userAgent: string,
  noAccessibility: bool,
  noPerformance: bool,
  noSeo: bool,
  maxConcurrency: int,
  retryAttempts: int,
  retryDelay: int,
  verbose: bool,
  help: bool,
  version: bool,
}

let parseArgs = (args: array<string>): parsedArgs => {
  let url = ref(None)
  let file = ref(None)
  let format = ref("console")
  let maxDepth = ref(3)
  let followExternal = ref(false)
  let timeout = ref(30000)
  let userAgent = ref("BroadSpectrum-Auditor/1.0")
  let noAccessibility = ref(false)
  let noPerformance = ref(false)
  let noSeo = ref(false)
  let maxConcurrency = ref(10)
  let retryAttempts = ref(3)
  let retryDelay = ref(1000)
  let verbose = ref(false)
  let help = ref(false)
  let versionFlag = ref(false)

  let i = ref(0)
  while i.contents < Array.length(args) {
    let arg = args->Array.get(i.contents)->Option.getOr("")
    switch arg {
    | "--help" | "-h" => help := true
    | "--version" | "-v" => versionFlag := true
    | "--verbose" => verbose := true
    | "--follow-external" => followExternal := true
    | "--no-accessibility" => noAccessibility := true
    | "--no-performance" => noPerformance := true
    | "--no-seo" => noSeo := true
    | "--url" => {
        i := i.contents + 1
        url := args->Array.get(i.contents)
      }
    | "--file" => {
        i := i.contents + 1
        file := args->Array.get(i.contents)
      }
    | "--format" => {
        i := i.contents + 1
        format := args->Array.get(i.contents)->Option.getOr("console")
      }
    | "--max-depth" => {
        i := i.contents + 1
        maxDepth := args->Array.get(i.contents)->Option.flatMap(Int.fromString)->Option.getOr(3)
      }
    | "--timeout" => {
        i := i.contents + 1
        timeout := args->Array.get(i.contents)->Option.flatMap(Int.fromString)->Option.getOr(30000)
      }
    | "--user-agent" => {
        i := i.contents + 1
        userAgent := args->Array.get(i.contents)->Option.getOr("BroadSpectrum-Auditor/1.0")
      }
    | "--max-concurrency" => {
        i := i.contents + 1
        maxConcurrency := args->Array.get(i.contents)->Option.flatMap(Int.fromString)->Option.getOr(10)
      }
    | "--retry-attempts" => {
        i := i.contents + 1
        retryAttempts := args->Array.get(i.contents)->Option.flatMap(Int.fromString)->Option.getOr(3)
      }
    | "--retry-delay" => {
        i := i.contents + 1
        retryDelay := args->Array.get(i.contents)->Option.flatMap(Int.fromString)->Option.getOr(1000)
      }
    | _ => ()
    }
    i := i.contents + 1
  }

  {
    url: url.contents,
    file: file.contents,
    format: format.contents,
    maxDepth: maxDepth.contents,
    followExternal: followExternal.contents,
    timeout: timeout.contents,
    userAgent: userAgent.contents,
    noAccessibility: noAccessibility.contents,
    noPerformance: noPerformance.contents,
    noSeo: noSeo.contents,
    maxConcurrency: maxConcurrency.contents,
    retryAttempts: retryAttempts.contents,
    retryDelay: retryDelay.contents,
    verbose: verbose.contents,
    help: help.contents,
    version: versionFlag.contents,
  }
}

let readUrlsFromFile = async (filePath: string): array<string> => {
  try {
    let content = await DenoBindings.readTextFile(filePath)
    content
      ->String.split("\n")
      ->Array.map(String.trim)
      ->Array.filter(line => String.length(line) > 0 && !String.startsWith(line, "#"))
  } catch {
  | exn => {
      let msg = switch exn {
      | Exn.Error(obj) => Exn.message(obj)->Option.getOr("Unknown error")
      | _ => "Unknown error"
      }
      DenoBindings.consoleError(`Error reading file ${filePath}: ${msg}`)
      DenoBindings.exit(1)
      []
    }
  }
}

let main = async () => {
  let args = parseArgs(DenoBindings.args)

  if args.help {
    printHelp()
    DenoBindings.exit(0)
  }

  if args.version {
    printVersion()
    DenoBindings.exit(0)
  }

  // Get URLs to audit
  let urls = if args.url->Option.isSome {
    [args.url->Option.getExn]
  } else if args.file->Option.isSome {
    await readUrlsFromFile(args.file->Option.getExn)
  } else {
    DenoBindings.consoleError("Error: Either --url or --file must be provided")
    DenoBindings.consoleError("Use --help for usage information")
    DenoBindings.exit(1)
    []
  }

  if Array.length(urls) === 0 {
    DenoBindings.consoleError("Error: No URLs to audit")
    DenoBindings.exit(1)
  }

  // Parse report format
  let formatOption = Config.formatFromString(args.format)
  if formatOption->Option.isNone {
    DenoBindings.consoleError(`Error: Invalid format "${args.format}". Use: console, json, html, or markdown`)
    DenoBindings.exit(1)
  }

  // Build configuration
  let config = Config.make(
    ~maxDepth=args.maxDepth,
    ~followExternal=args.followExternal,
    ~timeout=args.timeout,
    ~userAgent=args.userAgent,
    ~checkAccessibility=!args.noAccessibility,
    ~checkPerformance=!args.noPerformance,
    ~checkSEO=!args.noSeo,
    ~reportFormat=formatOption->Option.getExn,
    ~verbose=args.verbose,
    ~maxConcurrency=args.maxConcurrency,
    ~retryAttempts=args.retryAttempts,
    ~retryDelay=args.retryDelay,
    (),
  )

  // Build audit options
  let options = Auditor.makeOptions(
    ~config,
    ~checkLinks=true,
    ~checkAccessibility=!args.noAccessibility,
    ~checkPerformance=!args.noPerformance,
    ~checkSEO=!args.noSeo,
    (),
  )

  // Run audits
  if args.verbose {
    DenoBindings.consoleError(`Auditing ${Int.toString(Array.length(urls))} URL(s)...`)
  }

  let results = await Auditor.auditMultiple(urls, options)

  // Print results
  await Auditor.printResults(results, formatOption->Option.getExn)

  // Exit with error code if any audits failed
  let hasErrors = results->Array.some(result => {
    switch result {
    | Error(_) => true
    | Ok(_) => false
    }
  })
  DenoBindings.exit(if hasErrors { 1 } else { 0 })
}

// Entry point
let _ = main()->Promise.catch(error => {
  DenoBindings.consoleError("Fatal error:")
  DenoBindings.consoleError(%raw(`String(error)`))
  DenoBindings.exit(1)
  Promise.resolve()
})
