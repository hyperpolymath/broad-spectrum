/* TypeScript file generated from Report.res by genType. */

/* eslint-disable */
/* tslint:disable */

import * as ReportJS from './Report.js';

import type {accessibilityResult as Accessibility_accessibilityResult} from './Accessibility.gen';

import type {linkCheckResult as LinkChecker_linkCheckResult} from './LinkChecker.gen';

import type {performanceResult as Performance_performanceResult} from './Performance.gen';

import type {reportFormat as Config_reportFormat} from './Config.gen';

import type {seoResult as SEO_seoResult} from './SEO.gen';

export type auditReport = {
  readonly url: string; 
  readonly timestamp: string; 
  readonly linkCheck: (undefined | LinkChecker_linkCheckResult); 
  readonly accessibility: (undefined | Accessibility_accessibilityResult); 
  readonly performance: (undefined | Performance_performanceResult); 
  readonly seo: (undefined | SEO_seoResult); 
  readonly overallScore: number; 
  readonly executionTime: number
};

export const calculateOverallScore: (linkCheck:(undefined | LinkChecker_linkCheckResult), accessibility:(undefined | Accessibility_accessibilityResult), performance:(undefined | Performance_performanceResult), seo:(undefined | SEO_seoResult)) => number = ReportJS.calculateOverallScore as any;

export const create: (url:string, linkCheck:(undefined | LinkChecker_linkCheckResult), accessibility:(undefined | Accessibility_accessibilityResult), performance:(undefined | Performance_performanceResult), seo:(undefined | SEO_seoResult), executionTime:number) => auditReport = ReportJS.create as any;

export const formatConsole: (report:auditReport) => string = ReportJS.formatConsole as any;

export const format: (report:auditReport, format:Config_reportFormat) => Promise<string> = ReportJS.format as any;
