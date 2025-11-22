// LinkChecker.res - Broken link detection and validation

@genType
type linkStatus = {
  url: string,
  status: int,
  statusText: string,
  \"external": bool, // Escaped because "external" is reserved keyword
  broken: bool,
  redirectUrl: option<string>,
  responseTime: float,
  errorMessage: option<string>,
}

@genType
type linkCheckResult = {
  checkedLinks: array<linkStatus>,
  totalLinks: int,
  brokenLinks: int,
  externalLinks: int,
  redirects: int,
  averageResponseTime: float,
}

@genType
let checkLink = async (url: string, baseUrl: string, config: Config.t): linkStatus => {
  let isExternal = !UrlParser.isSameDomain(url, baseUrl)

  // Skip external links if configured
  if isExternal && !config.followExternal {
    {
      url,
      status: 0,
      statusText: "Skipped (external)",
      \"external": isExternal,
      broken: false,
      redirectUrl: None,
      responseTime: 0.0,
      errorMessage: None,
    }
  } else {
    let startTime = Date.now()
    let result = await Fetcher.fetchWithRetry(url, config, 0)
    let endTime = Date.now()
    let responseTime = endTime -. startTime

    switch result {
    | Ok(response) => {
        let broken = !Fetcher.isSuccessStatus(response.status)
        let redirectUrl = if response.redirected {
          Some(response.finalUrl)
        } else {
          None
        }

        {
          url,
          status: response.status,
          statusText: response.statusText,
          \"external": isExternal,
          broken,
          redirectUrl,
          responseTime,
          errorMessage: if broken {
            Some(`HTTP ${Int.toString(response.status)}`)
          } else {
            None
          },
        }
      }
    | Error(err) => {
        let errorMsg = switch err {
        | NetworkError(msg) => msg
        | TimeoutError => "Request timeout"
        | InvalidUrl(msg) => `Invalid URL: ${msg}`
        | HttpError(code, msg) => `HTTP ${Int.toString(code)}: ${msg}`
        }

        {
          url,
          status: 0,
          statusText: "Error",
          \"external": isExternal,
          broken: true,
          redirectUrl: None,
          responseTime,
          errorMessage: Some(errorMsg),
        }
      }
    }
  }
}

@genType
let checkLinks = async (urls: array<string>, baseUrl: string, config: Config.t): linkCheckResult => {
  // Remove duplicates
  let uniqueUrls = {
    let seen = Dict.make()
    let unique = []
    urls->Array.forEach(url => {
      switch Dict.get(seen, url) {
      | None => {
          Array.push(unique, url)->ignore
          Dict.set(seen, url, true)
        }
      | Some(_) => ()
      }
    })
    unique
  }

  // Process links in batches for concurrency control
  let batchSize = config.maxConcurrency
  let results = []

  for i in 0 to (Array.length(uniqueUrls) - 1) / batchSize {
    let start = i * batchSize
    let endCalc = (i + 1) * batchSize
    let end = if endCalc < Array.length(uniqueUrls) {
      endCalc
    } else {
      Array.length(uniqueUrls)
    }
    let batch = Array.slice(uniqueUrls, ~start, ~end)

    let batchResults = await Promise.all(
      batch->Array.map(url => checkLink(url, baseUrl, config))
    )

    batchResults->Array.forEach(result => {
      Array.push(results, result)->ignore
    })
  }

  // Calculate statistics
  let brokenCount = results->Array.reduce(0, (acc, link) => {
    if link.broken { acc + 1 } else { acc }
  })

  let externalCount = results->Array.reduce(0, (acc, link) => {
    if link.\"external" { acc + 1 } else { acc }
  })

  let redirectCount = results->Array.reduce(0, (acc, link) => {
    switch link.redirectUrl {
    | Some(_) => acc + 1
    | None => acc
    }
  })

  let totalResponseTime = results->Array.reduce(0.0, (acc, link) => {
    acc +. link.responseTime
  })

  let avgResponseTime = if Array.length(results) > 0 {
    totalResponseTime /. Float.fromInt(Array.length(results))
  } else {
    0.0
  }

  {
    checkedLinks: results,
    totalLinks: Array.length(uniqueUrls),
    brokenLinks: brokenCount,
    externalLinks: externalCount,
    redirects: redirectCount,
    averageResponseTime: avgResponseTime,
  }
}
