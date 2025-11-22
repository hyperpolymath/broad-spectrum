/* TypeScript file generated from Config.res by genType. */

/* eslint-disable */
/* tslint:disable */

import * as ConfigJS from './Config.js';

export type reportFormat = "Console" | "JSON" | "HTML" | "Markdown";

export type t = {
  readonly maxDepth: number; 
  readonly followExternal: boolean; 
  readonly timeout: number; 
  readonly userAgent: string; 
  readonly checkAccessibility: boolean; 
  readonly checkPerformance: boolean; 
  readonly checkSEO: boolean; 
  readonly reportFormat: reportFormat; 
  readonly verbose: boolean; 
  readonly maxConcurrency: number; 
  readonly retryAttempts: number; 
  readonly retryDelay: number
};

export const $$default: t = ConfigJS.default as any;

export default $$default;

export const make: (maxDepth:(undefined | number), followExternal:(undefined | boolean), timeout:(undefined | number), userAgent:(undefined | string), checkAccessibility:(undefined | boolean), checkPerformance:(undefined | boolean), checkSEO:(undefined | boolean), reportFormat:(undefined | reportFormat), verbose:(undefined | boolean), maxConcurrency:(undefined | number), retryAttempts:(undefined | number), retryDelay:(undefined | number), param:void) => t = ConfigJS.make as any;

export const formatToString: (format:reportFormat) => string = ConfigJS.formatToString as any;

export const formatFromString: (str:string) => (undefined | reportFormat) = ConfigJS.formatFromString as any;
