/* TypeScript file generated from Performance.res by genType. */

/* eslint-disable */
/* tslint:disable */

import * as PerformanceJS from './Performance.js';

import type {t as Dict_t} from './Dict.gen';

export type resourceTiming = {
  readonly url: string; 
  readonly resourceType: string; 
  readonly size: number; 
  readonly transferSize: number; 
  readonly duration: number
};

export type performanceMetrics = {
  readonly firstContentfulPaint: (undefined | number); 
  readonly largestContentfulPaint: (undefined | number); 
  readonly cumulativeLayoutShift: (undefined | number); 
  readonly firstInputDelay: (undefined | number); 
  readonly timeToInteractive: (undefined | number); 
  readonly domContentLoaded: number; 
  readonly loadComplete: number; 
  readonly totalPageSize: number; 
  readonly totalTransferSize: number; 
  readonly resourceCount: number; 
  readonly resources: resourceTiming[]; 
  readonly score: number
};

export type performanceResult = {
  readonly metrics: performanceMetrics; 
  readonly suggestions: string[]; 
  readonly warnings: string[]
};

export const analyze: (html:string, url:string) => Promise<performanceResult> = PerformanceJS.analyze as any;

export const calculateScore: (metrics:performanceMetrics) => number = PerformanceJS.calculateScore as any;

export const getResourcesByType: (metrics:performanceMetrics) => Dict_t<resourceTiming[]> = PerformanceJS.getResourcesByType as any;

export const getTotalSizeByType: (metrics:performanceMetrics) => Dict_t<number> = PerformanceJS.getTotalSizeByType as any;

export const formatBytes: (bytes:number) => string = PerformanceJS.formatBytes as any;
