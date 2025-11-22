/* TypeScript file generated from SEO.res by genType. */

/* eslint-disable */
/* tslint:disable */

import * as SEOJS from './SEO.js';

import type {t as Dict_t} from './Dict.gen';

export type metaTag = { readonly name: string; readonly content: string };

export type seoIssue = {
  readonly severity: string; 
  readonly message: string; 
  readonly element: (undefined | string)
};

export type seoData = {
  readonly title: (undefined | string); 
  readonly description: (undefined | string); 
  readonly keywords: (undefined | string); 
  readonly canonical: (undefined | string); 
  readonly ogTags: Dict_t<string>; 
  readonly twitterTags: Dict_t<string>; 
  readonly metaTags: metaTag[]; 
  readonly headings: Dict_t<string[]>; 
  readonly images: number; 
  readonly imagesWithAlt: number; 
  readonly links: number; 
  readonly internalLinks: number; 
  readonly externalLinks: number; 
  readonly wordCount: number; 
  readonly lang: (undefined | string); 
  readonly viewport: (undefined | string); 
  readonly robots: (undefined | string); 
  readonly structuredData: boolean
};

export type seoResult = {
  readonly data: seoData; 
  readonly issues: seoIssue[]; 
  readonly score: number
};

export const analyze: (html:string, url:string) => Promise<seoResult> = SEOJS.analyze as any;

export const filterIssuesBySeverity: (issues:seoIssue[], severity:string) => seoIssue[] = SEOJS.filterIssuesBySeverity as any;

export const getIssueCount: (issues:seoIssue[]) => Dict_t<number> = SEOJS.getIssueCount as any;
