// UrlParser.res - URL parsing and validation using Ada parser

@genType
type parsedUrl = {
  href: string,
  protocol: string,
  hostname: string,
  pathname: string,
  search: string,
  hash: string,
  origin: string,
}

@genType
type urlType = Internal | External | Relative | Invalid

// External binding to Ada URL parser (via TypeScript)
@module("./bindings/ada.ts")
external parseUrl: string => option<parsedUrl> = "parseUrl"

@module("./bindings/ada.ts")
external isValidUrl: string => bool = "isValidUrl"

@module("./bindings/ada.ts")
external normalizeUrl: string => string = "normalizeUrl"

@genType
let parse = (url: string): option<parsedUrl> => {
  parseUrl(url)
}

@genType
let isValid = (url: string): bool => {
  isValidUrl(url)
}

@genType
let normalize = (url: string): string => {
  normalizeUrl(url)
}

@genType
let getUrlType = (url: string, baseUrl: string): urlType => {
  switch parse(url) {
  | None => Invalid
  | Some(parsed) => {
      switch parse(baseUrl) {
      | None => Invalid
      | Some(baseParsed) => {
          if parsed.hostname === baseParsed.hostname {
            Internal
          } else if parsed.protocol === "http:" || parsed.protocol === "https:" {
            External
          } else {
            Invalid
          }
        }
      }
    }
  }
}

@genType
let makeAbsolute = (url: string, baseUrl: string): option<string> => {
  // Handle already absolute URLs
  if String.startsWith(url, "http://") || String.startsWith(url, "https://") {
    Some(url)
  } else {
    switch parse(baseUrl) {
    | None => None
    | Some(base) => {
        let absoluteUrl = if String.startsWith(url, "/") {
          // Absolute path
          base.origin ++ url
        } else if String.startsWith(url, "#") {
          // Hash fragment
          base.origin ++ base.pathname ++ url
        } else if String.startsWith(url, "?") {
          // Query string
          base.origin ++ base.pathname ++ url
        } else {
          // Relative path
          let basePath = base.pathname
          let lastSlash = String.lastIndexOf(basePath, "/")
          let dir = String.substring(basePath, ~start=0, ~end=lastSlash + 1)
          base.origin ++ dir ++ url
        }
        Some(absoluteUrl)
      }
    }
  }
}

@genType
let isSameDomain = (url1: string, url2: string): bool => {
  switch (parse(url1), parse(url2)) {
  | (Some(parsed1), Some(parsed2)) => parsed1.hostname === parsed2.hostname
  | _ => false
  }
}

// External binding for regex extraction
@module("./bindings/htmlParser.ts")
external extractLinksFromHtml: (string, string) => array<string> = "extractLinksFromHtml"

@genType
let extractLinks = (html: string, baseUrl: string): array<string> => {
  // Use TypeScript binding for link extraction
  extractLinksFromHtml(html, baseUrl)
}
