// Accessibility.res - WCAG compliance checks

@genType
type wcagLevel = A | AA | AAA

@genType
type accessibilityIssue = {
  rule: string,
  level: wcagLevel,
  message: string,
  element: option<string>,
  selector: option<string>,
  impact: string, // "critical", "serious", "moderate", "minor"
}

@genType
type accessibilityResult = {
  score: float, // 0-100
  violations: array<accessibilityIssue>,
  warnings: array<accessibilityIssue>,
  passes: int,
  incomplete: int,
  wcagLevel: wcagLevel,
}

// External binding to accessibility checker (via TypeScript)
@module("./bindings/a11y.ts")
external checkAccessibility: (string, string) => promise<accessibilityResult> = "checkAccessibility"

@genType
let check = async (html: string, url: string): accessibilityResult => {
  await checkAccessibility(html, url)
}

@genType
let levelToString = (level: wcagLevel): string => {
  switch level {
  | A => "A"
  | AA => "AA"
  | AAA => "AAA"
  }
}

@genType
let levelFromString = (str: string): option<wcagLevel> => {
  switch String.toUpperCase(str) {
  | "A" => Some(A)
  | "AA" => Some(AA)
  | "AAA" => Some(AAA)
  | _ => None
  }
}

@genType
let filterByLevel = (issues: array<accessibilityIssue>, level: wcagLevel): array<accessibilityIssue> => {
  issues->Array.filter(issue => {
    switch (issue.level, level) {
    | (A, A) => true
    | (A, AA) => true
    | (A, AAA) => true
    | (AA, AA) => true
    | (AA, AAA) => true
    | (AAA, AAA) => true
    | _ => false
    }
  })
}

@genType
let filterByCritical = (issues: array<accessibilityIssue>): array<accessibilityIssue> => {
  issues->Array.filter(issue => issue.impact === "critical" || issue.impact === "serious")
}

@genType
let calculateScore = (result: accessibilityResult): float => {
  let criticalViolations = result.violations->Array.filter(v => v.impact === "critical")->Array.length
  let seriousViolations = result.violations->Array.filter(v => v.impact === "serious")->Array.length
  let moderateViolations = result.violations->Array.filter(v => v.impact === "moderate")->Array.length
  let minorViolations = result.violations->Array.filter(v => v.impact === "minor")->Array.length

  let totalChecks = Float.fromInt(result.passes + Array.length(result.violations) + result.incomplete)

  if totalChecks === 0.0 {
    100.0
  } else {
    let deductions =
      Float.fromInt(criticalViolations) *. 10.0 +.
      Float.fromInt(seriousViolations) *. 5.0 +.
      Float.fromInt(moderateViolations) *. 2.0 +.
      Float.fromInt(minorViolations) *. 0.5

    let score = 100.0 -. deductions
    if score < 0.0 {
      0.0
    } else {
      score
    }
  }
}

@genType
let groupByRule = (issues: array<accessibilityIssue>): Dict.t<array<accessibilityIssue>> => {
  let grouped = Dict.make()

  issues->Array.forEach(issue => {
    let existing = Dict.get(grouped, issue.rule)->Option.getOr([])
    Array.push(existing, issue)->ignore
    Dict.set(grouped, issue.rule, existing)
  })

  grouped
}

@genType
let getSummary = (result: accessibilityResult): string => {
  let criticalCount = filterByCritical(result.violations)->Array.length
  let score = calculateScore(result)

  `Accessibility Score: ${Float.toString(score)}/100 | ` ++
  `Violations: ${Int.toString(Array.length(result.violations))} ` ++
  `(${Int.toString(criticalCount)} critical) | ` ++
  `WCAG Level: ${levelToString(result.wcagLevel)}`
}
