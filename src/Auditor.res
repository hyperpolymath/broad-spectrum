// Auditor.res - Main orchestrator for website audits

@genType
type auditOptions = {
  config: Config.t,
  checkLinks: bool,
  checkAccessibility: bool,
  checkPerformance: bool,
  checkSEO: bool,
}

@genType
let defaultOptions: auditOptions = {
  config: Config.default,
  checkLinks: true,
  checkAccessibility: true,
  checkPerformance: true,
  checkSEO: true,
}

@genType
let auditWebsite = async (url: string, options: auditOptions): result<Report.auditReport, string> => {
  let startTime = Date.now()

  // Validate URL
  if !UrlParser.isValid(url) {
    Error(`Invalid URL: ${url}`)
  } else {
    try {
      // Fetch the main page
      let response = await Fetcher.fetchWithRetry(url, options.config, 0)

      switch response {
      | Error(err) => {
          let errorMsg = switch err {
          | NetworkError(msg) => `Network error: ${msg}`
          | TimeoutError => "Request timeout"
          | InvalidUrl(msg) => `Invalid URL: ${msg}`
          | HttpError(code, msg) => `HTTP ${Int.toString(code)}: ${msg}`
          }
          Error(errorMsg)
        }
      | Ok(response) => {
          // Check if it's HTML content
          if !Fetcher.isHtmlContent(response) {
            Error("URL does not return HTML content")
          } else {
            let html = response.body

            // Run all checks in parallel
            let linkCheckPromise = if options.checkLinks {
              let links = UrlParser.extractLinks(html, url)
              LinkChecker.checkLinks(links, url, options.config)->Promise.thenResolve(result => Some(result))
            } else {
              Promise.resolve(None)
            }

            let accessibilityPromise = if options.checkAccessibility && options.config.checkAccessibility {
              Accessibility.check(html, url)->Promise.thenResolve(result => Some(result))
            } else {
              Promise.resolve(None)
            }

            let performancePromise = if options.checkPerformance && options.config.checkPerformance {
              Performance.analyze(html, url)->Promise.thenResolve(result => Some(result))
            } else {
              Promise.resolve(None)
            }

            let seoPromise = if options.checkSEO && options.config.checkSEO {
              SEO.analyze(html, url)->Promise.thenResolve(result => Some(result))
            } else {
              Promise.resolve(None)
            }

            // Wait for all checks to complete
            let (linkCheck, accessibility, performance, seo) = await Promise.all4((
              linkCheckPromise,
              accessibilityPromise,
              performancePromise,
              seoPromise,
            ))

            let endTime = Date.now()
            let executionTime = endTime -. startTime

            // Create report
            let report = Report.create(
              url,
              linkCheck,
              accessibility,
              performance,
              seo,
              executionTime,
            )

            Ok(report)
          }
        }
      }
    } catch {
    | Exn.Error(obj) =>
        Error(`Unexpected error: ${obj->Exn.message->Option.getOr("Unknown error")}`)
    | _ => Error("Unexpected error: Unknown")
    }
  }
}

@genType
let auditMultiple = async (urls: array<string>, options: auditOptions): array<result<Report.auditReport, string>> => {
  let results = []

  for i in 0 to Array.length(urls) - 1 {
    switch urls->Array.get(i) {
    | Some(url) => {
        if options.config.verbose {
          Console.log(`Auditing ${Int.toString(i + 1)}/${Int.toString(Array.length(urls))}: ${url}`)
        }

        let result = await auditWebsite(url, options)
        Array.push(results, result)->ignore
      }
    | None => ()
    }

    // Small delay between requests to be polite
    if i < Array.length(urls) - 1 {
      let _ = await Promise.make((resolve, _reject) => {
        let _ = setTimeout(() => resolve(), 500)
      })
    }
  }

  results
}

@genType
let makeOptions = (
  ~config=Config.default,
  ~checkLinks=true,
  ~checkAccessibility=true,
  ~checkPerformance=true,
  ~checkSEO=true,
  (),
): auditOptions => {
  {
    config,
    checkLinks,
    checkAccessibility,
    checkPerformance,
    checkSEO,
  }
}

@genType
let printReport = async (report: Report.auditReport, format: Config.reportFormat): unit => {
  let formatted = await Report.format(report, format)
  Console.log(formatted)
}

@genType
let printResults = async (
  results: array<result<Report.auditReport, string>>,
  format: Config.reportFormat,
): unit => {
  for i in 0 to Array.length(results) - 1 {
    switch results->Array.get(i) {
    | Some(result) => {
        switch result {
        | Ok(report) => {
            await printReport(report, format)
          }
        | Error(err) => {
            Console.error(`Error: ${err}`)
          }
        }

        // Add separator between multiple reports
        if i < Array.length(results) - 1 {
          Console.log("\n" ++ String.repeat("=", 80) ++ "\n")
        }
      }
    | None => ()
    }
  }
}
