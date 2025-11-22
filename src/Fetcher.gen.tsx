/* TypeScript file generated from Fetcher.res by genType. */

/* eslint-disable */
/* tslint:disable */

import * as FetcherJS from './Fetcher.js';

import type {t as Config_t} from './Config.gen';

import type {t as Dict_t} from './Dict.gen';

export type httpMethod = "GET" | "POST" | "HEAD";

export type httpResponse = {
  readonly status: number; 
  readonly statusText: string; 
  readonly headers: Dict_t<string>; 
  readonly body: string; 
  readonly redirected: boolean; 
  readonly finalUrl: string; 
  readonly timing: number
};

export type fetchError = 
    "TimeoutError"
  | { TAG: "NetworkError"; _0: string }
  | { TAG: "InvalidUrl"; _0: string }
  | { TAG: "HttpError"; _0: number; _1: string };

export const fetch: (url:string, config:Config_t) => Promise<
    { TAG: "Ok"; _0: httpResponse }
  | { TAG: "Error"; _0: fetchError }> = FetcherJS.fetch as any;

export const fetchWithMethod: (url:string, method:httpMethod, config:Config_t) => Promise<
    { TAG: "Ok"; _0: httpResponse }
  | { TAG: "Error"; _0: fetchError }> = FetcherJS.fetchWithMethod as any;

export const fetchWithRetry: (url:string, config:Config_t, attempt:number) => Promise<
    { TAG: "Ok"; _0: httpResponse }
  | { TAG: "Error"; _0: fetchError }> = FetcherJS.fetchWithRetry as any;

export const isSuccessStatus: (status:number) => boolean = FetcherJS.isSuccessStatus as any;

export const isRedirectStatus: (status:number) => boolean = FetcherJS.isRedirectStatus as any;

export const isClientErrorStatus: (status:number) => boolean = FetcherJS.isClientErrorStatus as any;

export const isServerErrorStatus: (status:number) => boolean = FetcherJS.isServerErrorStatus as any;

export const getContentType: (response:httpResponse) => (undefined | string) = FetcherJS.getContentType as any;

export const isHtmlContent: (response:httpResponse) => boolean = FetcherJS.isHtmlContent as any;
