// FetcherImpl.res - Pure ReScript HTTP fetch implementation
// Replaces bindings/fetcher.ts

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
  timing: float,
}

@genType
type fetchError =
  | NetworkError(string)
  | TimeoutError
  | InvalidUrl(string)
  | HttpError(int, string)

// Internal helper to convert error to fetchError type
let convertError = (error: exn): fetchError => {
  switch error {
  | Exn.Error(obj) => {
      let msg = Exn.message(obj)->Option.getOr("Unknown network error")
      if String.includes(msg, "AbortError") {
        TimeoutError
      } else {
        NetworkError(msg)
      }
    }
  | _ => NetworkError("Unknown network error")
  }
}

@genType
let fetchUrl = async (
  url: string,
  timeout: int,
  userAgent: string,
  method: string,
): result<httpResponse, fetchError> => {
  let startTime = DenoBindings.now()

  try {
    let controller = DenoBindings.makeAbortController()
    let timeoutId = DenoBindings.setTimeout(() => {
      DenoBindings.abort(controller)
    }, timeout)

    let headers = Dict.make()
    Dict.set(headers, "User-Agent", userAgent)

    let response = await DenoBindings.fetch(url, {
      method,
      headers,
      signal: Some(controller.signal),
    })

    DenoBindings.clearTimeout(timeoutId)

    let endTime = DenoBindings.now()
    let timing = endTime -. startTime

    // Convert headers to Dict
    let headerDict: Dict.t<string> = Dict.make()
    DenoBindings.headersForEach(DenoBindings.responseHeaders(response), (value, key) => {
      Dict.set(headerDict, String.toLowerCase(key), value)
    })

    let body = if method !== "HEAD" {
      await DenoBindings.text(response)
    } else {
      ""
    }

    Ok({
      status: response.status,
      statusText: response.statusText,
      headers: headerDict,
      body,
      redirected: response.redirected,
      finalUrl: response.url,
      timing,
    })
  } catch {
  | exn => Error(convertError(exn))
  }
}

@genType
let fetchHead = async (
  url: string,
  timeout: int,
  userAgent: string,
): result<httpResponse, fetchError> => {
  await fetchUrl(url, timeout, userAgent, "HEAD")
}

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
        let delay = config.retryDelay * (attempt + 1)
        let _ = await Promise.make((resolve, _reject) => {
          let _ = DenoBindings.setTimeout(() => resolve(), delay)
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
