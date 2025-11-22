/* TypeScript file generated from UrlParser.res by genType. */

/* eslint-disable */
/* tslint:disable */

import * as UrlParserJS from './UrlParser.js';

export type parsedUrl = {
  readonly href: string; 
  readonly protocol: string; 
  readonly hostname: string; 
  readonly pathname: string; 
  readonly search: string; 
  readonly hash: string; 
  readonly origin: string
};

export type urlType = 
    "Internal"
  | "External"
  | "Relative"
  | "Invalid";

export const parse: (url:string) => (undefined | parsedUrl) = UrlParserJS.parse as any;

export const isValid: (url:string) => boolean = UrlParserJS.isValid as any;

export const normalize: (url:string) => string = UrlParserJS.normalize as any;

export const getUrlType: (url:string, baseUrl:string) => urlType = UrlParserJS.getUrlType as any;

export const makeAbsolute: (url:string, baseUrl:string) => (undefined | string) = UrlParserJS.makeAbsolute as any;

export const isSameDomain: (url1:string, url2:string) => boolean = UrlParserJS.isSameDomain as any;

export const extractLinks: (html:string, baseUrl:string) => string[] = UrlParserJS.extractLinks as any;
