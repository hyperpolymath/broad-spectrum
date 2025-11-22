// Fetcher.res - HTTP request handling with retry logic

@genType
type httpMethod = GET | POST | HEAD

@genType
type httpResponse = {
  status: int,
  statusText: string,
  headers: Dict.t<string>,
  body: string,
  redirected: bool,
  finalUrl: string,
  timing: float, // milliseconds
}

@genType
type fetchError =
  | NetworkError(string)
  | TimeoutError
  | InvalidUrl(string)
  | HttpError(int, string)

// External binding to Deno fetch (via TypeScript)
@module("./bindings/fetcher.ts")
external fetchUrl: (string, int, string, string) => promise<result<httpResponse, fetchError>> = "fetchUrl"

@module("./bindings/fetcher.ts")
external fetchHead: (string, int, string) => promise<result<httpResponse, fetchError>> = "fetchHead"

@genType
let fetch = async (url: string, config: Config.t): result<httpResponse, fetchError> => {
  await fetchUrl(url, config.timeout, config.userAgent, "GET")
}

@genType
let fetchWithMethod = async (
  url: string,
  method: httpMethod,
  config: Config.t,
): result<httpResponse, fetchError> => {
  let methodStr = switch method {
  | GET => "GET"
  | POST => "POST"
  | HEAD => "HEAD"
  }

  if method === HEAD {
    await fetchHead(url, config.timeout, config.userAgent)
  } else {
    await fetchUrl(url, config.timeout, config.userAgent, methodStr)
  }
}

@genType
let rec fetchWithRetry = async (
  url: string,
  config: Config.t,
  attempt: int,
): result<httpResponse, fetchError> => {
  let result = await fetch(url, config)

  switch result {
  | Ok(_) => result
  | Error(_err) => {
      if attempt < config.retryAttempts {
        // Wait before retry
        let delay = config.retryDelay * (attempt + 1)
        let _ = await Promise.make((resolve, _reject) => {
          let _ = setTimeout(() => resolve(), delay)
        })
        await fetchWithRetry(url, config, attempt + 1)
      } else {
        result
      }
    }
  }
}

@genType
let isSuccessStatus = (status: int): bool => {
  status >= 200 && status < 300
}

@genType
let isRedirectStatus = (status: int): bool => {
  status >= 300 && status < 400
}

@genType
let isClientErrorStatus = (status: int): bool => {
  status >= 400 && status < 500
}

@genType
let isServerErrorStatus = (status: int): bool => {
  status >= 500 && status < 600
}

@genType
let getContentType = (response: httpResponse): option<string> => {
  Dict.get(response.headers, "content-type")
}

@genType
let isHtmlContent = (response: httpResponse): bool => {
  switch getContentType(response) {
  | Some(contentType) => String.includes(contentType, "text/html")
  | None => false
  }
}
