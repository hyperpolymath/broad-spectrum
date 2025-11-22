// a11y.ts - Accessibility checking binding

export type WcagLevel = "A" | "AA" | "AAA";

export interface AccessibilityIssue {
  rule: string;
  level: WcagLevel;
  message: string;
  element?: string;
  selector?: string;
  impact: string;
}

export interface AccessibilityResult {
  score: number;
  violations: AccessibilityIssue[];
  warnings: AccessibilityIssue[];
  passes: number;
  incomplete: number;
  wcagLevel: WcagLevel;
}

export async function checkAccessibility(
  html: string,
  url: string,
): Promise<AccessibilityResult> {
  const violations: AccessibilityIssue[] = [];
  const warnings: AccessibilityIssue[] = [];
  let passes = 0;

  // Check for alt text on images
  const imgMatches = html.matchAll(/<img[^>]*>/gi);
  for (const match of imgMatches) {
    const imgTag = match[0];
    if (!imgTag.includes("alt=")) {
      violations.push({
        rule: "image-alt",
        level: "A",
        message: "Image missing alt attribute",
        element: imgTag.substring(0, 100),
        impact: "critical",
      });
    } else {
      passes++;
    }
  }

  // Check for lang attribute
  if (!html.match(/<html[^>]*lang=/i)) {
    violations.push({
      rule: "html-has-lang",
      level: "A",
      message: "HTML element must have a lang attribute",
      impact: "serious",
    });
  } else {
    passes++;
  }

  // Check for page title
  if (!html.match(/<title[^>]*>/i)) {
    violations.push({
      rule: "document-title",
      level: "A",
      message: "Document must have a title element",
      impact: "serious",
    });
  } else {
    passes++;
  }

  // Check for viewport meta tag
  if (!html.match(/<meta[^>]*name=["']viewport["'][^>]*>/i)) {
    warnings.push({
      rule: "meta-viewport",
      level: "AA",
      message: "Viewport meta tag missing for mobile responsiveness",
      impact: "moderate",
    });
  } else {
    passes++;
  }

  // Check for proper heading hierarchy
  const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
  if (h1Count === 0) {
    violations.push({
      rule: "page-has-heading-one",
      level: "AA",
      message: "Page must have at least one h1 heading",
      impact: "moderate",
    });
  } else if (h1Count > 1) {
    warnings.push({
      rule: "page-has-heading-one",
      level: "AA",
      message: "Page should have only one h1 heading",
      impact: "minor",
    });
  } else {
    passes++;
  }

  // Check for form labels
  const inputMatches = html.matchAll(/<input[^>]*type=["'](?!hidden)[^"']*["'][^>]*>/gi);
  for (const match of inputMatches) {
    const inputTag = match[0];
    const idMatch = inputTag.match(/id=["']([^"']+)["']/);
    if (idMatch) {
      const id = idMatch[1];
      const hasLabel = html.includes(`for="${id}"`);
      if (!hasLabel && !inputTag.includes("aria-label=")) {
        violations.push({
          rule: "label",
          level: "A",
          message: `Form input with id="${id}" is missing a label`,
          element: inputTag.substring(0, 100),
          impact: "critical",
        });
      } else {
        passes++;
      }
    }
  }

  // Check for color contrast (simplified - would need actual rendering)
  const hasColorStyles = html.includes("color:") || html.includes("background");
  if (hasColorStyles) {
    warnings.push({
      rule: "color-contrast",
      level: "AA",
      message: "Manual check required: Ensure text has sufficient color contrast",
      impact: "serious",
    });
  }

  // Check for link text
  const linkMatches = html.matchAll(/<a[^>]*href=["'][^"']+["'][^>]*>([^<]*)<\/a>/gi);
  for (const match of linkMatches) {
    const linkText = match[1].trim();
    if (!linkText || linkText.length < 2) {
      violations.push({
        rule: "link-name",
        level: "A",
        message: "Links must have discernible text",
        element: match[0].substring(0, 100),
        impact: "serious",
      });
    } else {
      passes++;
    }
  }

  // Calculate score
  const totalChecks = violations.length + warnings.length + passes;
  const criticalCount = violations.filter((v) => v.impact === "critical").length;
  const seriousCount = violations.filter((v) => v.impact === "serious").length;

  const score = Math.max(
    0,
    100 - (criticalCount * 10) - (seriousCount * 5) - (warnings.length * 2),
  );

  return {
    score,
    violations,
    warnings,
    passes,
    incomplete: 0,
    wcagLevel: "AA",
  };
}
