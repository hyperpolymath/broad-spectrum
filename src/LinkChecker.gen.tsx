/* TypeScript file generated from LinkChecker.res by genType. */

/* eslint-disable */
/* tslint:disable */

import * as LinkCheckerJS from './LinkChecker.js';

import type {t as Config_t} from './Config.gen';

export type linkStatus = {
  readonly url: string; 
  readonly status: number; 
  readonly statusText: string; 
  readonly external: boolean; 
  readonly broken: boolean; 
  readonly redirectUrl: (undefined | string); 
  readonly responseTime: number; 
  readonly errorMessage: (undefined | string)
};

export type linkCheckResult = {
  readonly checkedLinks: linkStatus[]; 
  readonly totalLinks: number; 
  readonly brokenLinks: number; 
  readonly externalLinks: number; 
  readonly redirects: number; 
  readonly averageResponseTime: number
};

export const checkLink: (url:string, baseUrl:string, config:Config_t) => Promise<linkStatus> = LinkCheckerJS.checkLink as any;

export const checkLinks: (urls:string[], baseUrl:string, config:Config_t) => Promise<linkCheckResult> = LinkCheckerJS.checkLinks as any;
