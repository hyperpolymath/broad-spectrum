// fetcher.ts - HTTP fetcher binding for ReScript

export interface HttpResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  redirected: boolean;
  finalUrl: string;
  timing: number;
}

export type FetchError =
  | { TAG: "NetworkError"; _0: string }
  | { TAG: "TimeoutError" }
  | { TAG: "InvalidUrl"; _0: string }
  | { TAG: "HttpError"; _0: number; _1: string };

export async function fetchUrl(
  url: string,
  timeout: number,
  userAgent: string,
  method: string,
): Promise<{ TAG: "Ok"; _0: HttpResponse } | { TAG: "Error"; _0: FetchError }> {
  const startTime = performance.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method,
      headers: {
        "User-Agent": userAgent,
      },
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeoutId);

    const endTime = performance.now();
    const timing = endTime - startTime;

    // Convert headers to plain object
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    const body = await response.text();

    const httpResponse: HttpResponse = {
      status: response.status,
      statusText: response.statusText,
      headers,
      body,
      redirected: response.redirected,
      finalUrl: response.url,
      timing,
    };

    return { TAG: "Ok", _0: httpResponse };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return { TAG: "Error", _0: { TAG: "TimeoutError" } };
      }
      if (error.message.includes("DNS") || error.message.includes("network")) {
        return { TAG: "Error", _0: { TAG: "NetworkError", _0: error.message } };
      }
      return { TAG: "Error", _0: { TAG: "NetworkError", _0: error.message } };
    }
    return {
      TAG: "Error",
      _0: { TAG: "NetworkError", _0: "Unknown network error" },
    };
  }
}

export async function fetchHead(
  url: string,
  timeout: number,
  userAgent: string,
): Promise<{ TAG: "Ok"; _0: HttpResponse } | { TAG: "Error"; _0: FetchError }> {
  const startTime = performance.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: "HEAD",
      headers: {
        "User-Agent": userAgent,
      },
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeoutId);

    const endTime = performance.now();
    const timing = endTime - startTime;

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    const httpResponse: HttpResponse = {
      status: response.status,
      statusText: response.statusText,
      headers,
      body: "",
      redirected: response.redirected,
      finalUrl: response.url,
      timing,
    };

    return { TAG: "Ok", _0: httpResponse };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return { TAG: "Error", _0: { TAG: "TimeoutError" } };
      }
      return { TAG: "Error", _0: { TAG: "NetworkError", _0: error.message } };
    }
    return {
      TAG: "Error",
      _0: { TAG: "NetworkError", _0: "Unknown network error" },
    };
  }
}
