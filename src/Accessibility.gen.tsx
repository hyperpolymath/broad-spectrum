/* TypeScript file generated from Accessibility.res by genType. */

/* eslint-disable */
/* tslint:disable */

import * as AccessibilityJS from './Accessibility.js';

import type {t as Dict_t} from './Dict.gen';

export type wcagLevel = "A" | "AA" | "AAA";

export type accessibilityIssue = {
  readonly rule: string; 
  readonly level: wcagLevel; 
  readonly message: string; 
  readonly element: (undefined | string); 
  readonly selector: (undefined | string); 
  readonly impact: string
};

export type accessibilityResult = {
  readonly score: number; 
  readonly violations: accessibilityIssue[]; 
  readonly warnings: accessibilityIssue[]; 
  readonly passes: number; 
  readonly incomplete: number; 
  readonly wcagLevel: wcagLevel
};

export const check: (html:string, url:string) => Promise<accessibilityResult> = AccessibilityJS.check as any;

export const levelToString: (level:wcagLevel) => string = AccessibilityJS.levelToString as any;

export const levelFromString: (str:string) => (undefined | wcagLevel) = AccessibilityJS.levelFromString as any;

export const filterByLevel: (issues:accessibilityIssue[], level:wcagLevel) => accessibilityIssue[] = AccessibilityJS.filterByLevel as any;

export const filterByCritical: (issues:accessibilityIssue[]) => accessibilityIssue[] = AccessibilityJS.filterByCritical as any;

export const calculateScore: (result:accessibilityResult) => number = AccessibilityJS.calculateScore as any;

export const groupByRule: (issues:accessibilityIssue[]) => Dict_t<accessibilityIssue[]> = AccessibilityJS.groupByRule as any;

export const getSummary: (result:accessibilityResult) => string = AccessibilityJS.getSummary as any;
