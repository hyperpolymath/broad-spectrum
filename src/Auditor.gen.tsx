/* TypeScript file generated from Auditor.res by genType. */

/* eslint-disable */
/* tslint:disable */

import * as AuditorJS from './Auditor.js';

import type {auditReport as Report_auditReport} from './Report.gen';

import type {reportFormat as Config_reportFormat} from './Config.gen';

import type {t as Config_t} from './Config.gen';

export type auditOptions = {
  readonly config: Config_t; 
  readonly checkLinks: boolean; 
  readonly checkAccessibility: boolean; 
  readonly checkPerformance: boolean; 
  readonly checkSEO: boolean
};

export const defaultOptions: auditOptions = AuditorJS.defaultOptions as any;

export const auditWebsite: (url:string, options:auditOptions) => Promise<
    { TAG: "Ok"; _0: Report_auditReport }
  | { TAG: "Error"; _0: string }> = AuditorJS.auditWebsite as any;

export const auditMultiple: (urls:string[], options:auditOptions) => Promise<Array<
    { TAG: "Ok"; _0: Report_auditReport }
  | { TAG: "Error"; _0: string }>> = AuditorJS.auditMultiple as any;

export const makeOptions: (config:(undefined | Config_t), checkLinks:(undefined | boolean), checkAccessibility:(undefined | boolean), checkPerformance:(undefined | boolean), checkSEO:(undefined | boolean), _6:void) => auditOptions = AuditorJS.makeOptions as any;

export const printReport: (report:Report_auditReport, format:Config_reportFormat) => Promise<void> = AuditorJS.printReport as any;

export const printResults: (results:Array<
    { TAG: "Ok"; _0: Report_auditReport }
  | { TAG: "Error"; _0: string }>, format:Config_reportFormat) => Promise<void> = AuditorJS.printResults as any;
