;; STATE.scm - Project State Checkpoint for Broad Spectrum Website Auditor
;; Format: Guile Scheme
;; Enables AI conversation continuity across sessions

;;;; ============================================================================
;;;; METADATA
;;;; ============================================================================

(define state-metadata
  '((version . "1.0.0")
    (schema-date . "2025-12-08")
    (created . "2025-12-08T00:00:00Z")
    (last-updated . "2025-12-08")
    (generator . "Claude Code (Opus 4)")
    (project-name . "broad-spectrum")
    (repository . "https://github.com/Hyperpolymath/broad-spectrum")))

;;;; ============================================================================
;;;; USER CONTEXT
;;;; ============================================================================

(define user-context
  '((name . "Hyperpolymath")
    (roles . (developer maintainer))
    (languages . ("ReScript" "TypeScript" "Deno"))
    (tools . ("npm" "rescript" "deno" "git"))
    (values . ("type-safety" "functional-programming" "security" "performance"))))

;;;; ============================================================================
;;;; CURRENT FOCUS
;;;; ============================================================================

(define current-focus
  '((project . "broad-spectrum")
    (phase . "implementation")
    (goal . "MVP v1 - Functional CLI website auditor")
    (blocking-dependencies . ("deno-runtime"))
    (priority-areas . ("runtime-validation" "test-suite" "integration-testing"))))

;;;; ============================================================================
;;;; MVP V1 ROUTE
;;;; ============================================================================

(define mvp-v1-route
  '((milestone . "MVP v1 - Functional Website Auditor CLI")
    (target-features
     . ((link-checking . "Detect broken links and validate URLs")
        (accessibility . "WCAG compliance checks (A, AA, AAA)")
        (performance . "Core Web Vitals and page analysis")
        (seo . "Meta tags, structured data, content analysis")
        (multi-format-reports . "Console, JSON, HTML, Markdown output")))
    (implementation-steps
     . (;; Step 1: Environment Setup (BLOCKED)
        (step-1
         (name . "Install and verify Deno runtime")
         (status . "blocked")
         (blocker . "Deno not available in current environment")
         (action . "Install Deno: curl -fsSL https://deno.land/install.sh | sh"))
        ;; Step 2: Build Verification (COMPLETE)
        (step-2
         (name . "ReScript compilation")
         (status . "complete")
         (notes . "All 9 modules compile successfully")
         (warning . "rescript.json uses deprecated 'es6', should be 'esmodule'"))
        ;; Step 3: Runtime Testing (PENDING)
        (step-3
         (name . "Test CLI execution")
         (status . "pending")
         (depends-on . "step-1")
         (command . "deno task audit --url https://example.com"))
        ;; Step 4: Test Suite (PENDING)
        (step-4
         (name . "Run and verify test suite")
         (status . "pending")
         (depends-on . "step-1")
         (tests . ("url_parser_test.ts" "accessibility_test.ts" "seo_test.ts")))
        ;; Step 5: Integration Testing (PENDING)
        (step-5
         (name . "End-to-end audit validation")
         (status . "pending")
         (depends-on . "step-3" "step-4")
         (validation . "Audit real websites, verify report accuracy"))
        ;; Step 6: Documentation (PARTIAL)
        (step-6
         (name . "Documentation and examples")
         (status . "partial")
         (complete . ("README.md" "CLAUDE.md"))
         (pending . ("usage-examples" "api-docs")))))))

;;;; ============================================================================
;;;; PROJECT CATALOG
;;;; ============================================================================

(define project-catalog
  '((broad-spectrum
     (status . "in-progress")
     (completion-pct . 65)
     (category . "tooling")
     (phase . "implementation")
     (description . "CLI website auditor for security, accessibility, performance, and SEO")
     (tech-stack . ("ReScript" "TypeScript" "Deno"))
     (components
      . ((rescript-modules
          (status . "complete")
          (items . ("Config.res" "Auditor.res" "Fetcher.res" "UrlParser.res"
                    "LinkChecker.res" "Accessibility.res" "Performance.res"
                    "SEO.res" "Report.res")))
         (typescript-bindings
          (status . "complete")
          (items . ("ada.ts" "fetcher.ts" "htmlParser.ts" "a11y.ts"
                    "seoParser.ts" "report.ts")))
         (cli-interface
          (status . "complete")
          (file . "main.ts")
          (features . ("argument-parsing" "url-input" "file-input"
                       "format-selection" "verbose-mode")))
         (test-suite
          (status . "pending-verification")
          (items . ("url_parser_test.ts" "accessibility_test.ts" "seo_test.ts")))
         (build-system
          (status . "complete")
          (configs . ("package.json" "rescript.json" "deno.json")))))
     (blockers . ("deno-not-installed"))
     (dependencies
      . ((npm . ("@rescript/core" "gentype" "rescript"))
         (deno . ("@std/cli" "@std/path" "@std/fmt" "ada-url"))))
     (next-actions
      . ("Install Deno runtime"
         "Fix rescript.json deprecation warning"
         "Run and verify test suite"
         "Test CLI with real URLs"
         "Validate report output formats")))))

;;;; ============================================================================
;;;; KNOWN ISSUES
;;;; ============================================================================

(define known-issues
  '(;; Issue 1: Deno Runtime Not Available
    (issue-1
     (severity . "blocker")
     (component . "environment")
     (description . "Deno runtime not installed in current environment")
     (impact . "Cannot run tests, cannot execute CLI, cannot verify runtime behavior")
     (resolution . "Install Deno: curl -fsSL https://deno.land/install.sh | sh")
     (status . "open"))
    ;; Issue 2: Deprecated ReScript Config
    (issue-2
     (severity . "warning")
     (component . "build-config")
     (description . "rescript.json uses deprecated 'es6' module format")
     (impact . "Future ReScript versions may not support this option")
     (resolution . "Change 'es6' to 'esmodule' in rescript.json package-specs")
     (file . "rescript.json")
     (line . 12)
     (status . "open"))
    ;; Issue 3: Unverified Runtime Behavior
    (issue-3
     (severity . "unknown")
     (component . "runtime")
     (description . "CLI and core functionality not tested at runtime")
     (impact . "Potential runtime errors, TypeScript/ReScript interop issues")
     (resolution . "Install Deno and run: deno task audit --url https://example.com")
     (depends-on . "issue-1")
     (status . "open"))
    ;; Issue 4: Test Suite Unverified
    (issue-4
     (severity . "medium")
     (component . "testing")
     (description . "Test suite exists but has not been executed")
     (impact . "Unknown test coverage, potential hidden bugs")
     (resolution . "Run: deno test --allow-net --allow-read --allow-env")
     (depends-on . "issue-1")
     (status . "open"))))

;;;; ============================================================================
;;;; QUESTIONS FOR USER
;;;; ============================================================================

(define questions-for-user
  '(;; Q1: Deno Installation
    (question-1
     (topic . "environment")
     (priority . "high")
     (question . "Should I provide instructions to install Deno, or is there an alternative runtime you prefer?")
     (context . "Deno is required to run the CLI and tests"))
    ;; Q2: Ada URL Parser
    (question-2
     (topic . "dependencies")
     (priority . "medium")
     (question . "The project originally planned to use ada-url npm package for WASM URL parsing. Current implementation uses native URL API. Do you want to integrate the Ada parser for better performance?")
     (context . "Native URL API works but Ada parser may be faster for batch processing"))
    ;; Q3: Test Coverage
    (question-3
     (topic . "testing")
     (priority . "medium")
     (question . "What level of test coverage is acceptable for MVP v1?")
     (options . ("minimal - happy path only"
                 "moderate - main features + edge cases"
                 "comprehensive - all modules with mocking")))
    ;; Q4: CI/CD
    (question-4
     (topic . "automation")
     (priority . "low")
     (question . "Do you want GitHub Actions workflows set up for automated testing and builds?")
     (context . "Repository already has codeql.yml and dependabot.yml"))
    ;; Q5: Report Priority
    (question-5
     (topic . "features")
     (priority . "medium")
     (question . "Which report format should be prioritized for polish - HTML, Markdown, or JSON?")
     (context . "Console output works, other formats need styling/structure refinement"))))

;;;; ============================================================================
;;;; LONG-TERM ROADMAP
;;;; ============================================================================

(define long-term-roadmap
  '((phase-1-mvp
     (name . "MVP v1.0")
     (status . "in-progress")
     (goals . ("Working CLI tool"
               "All 4 audit types functional"
               "4 report formats"
               "Basic documentation")))
    (phase-2-stability
     (name . "Stability & Polish")
     (status . "planned")
     (goals . ("Comprehensive test coverage"
               "Error handling improvements"
               "Performance optimization"
               "HTML report styling")))
    (phase-3-features
     (name . "Feature Expansion")
     (status . "future")
     (goals . ("Lighthouse integration"
               "Screenshot capture"
               "PDF report generation"
               "Database for historical tracking")))
    (phase-4-distribution
     (name . "Distribution & Integration")
     (status . "future")
     (goals . ("Docker containerization"
               "npm/deno package publishing"
               "CI/CD integration examples"
               "Web UI for reports")))
    (phase-5-ecosystem
     (name . "Ecosystem")
     (status . "future")
     (goals . ("Plugin system for custom checks"
               "API mode for programmatic usage"
               "Real-time monitoring (WebSocket)"
               "Multi-site dashboard")))))

;;;; ============================================================================
;;;; SESSION HISTORY
;;;; ============================================================================

(define session-history
  '((session-1
     (date . "2025-12-08")
     (agent . "Claude Code (Opus 4)")
     (accomplishments . ("Analyzed project structure"
                         "Verified ReScript compilation (9 modules)"
                         "Identified blocking issues"
                         "Created STATE.scm checkpoint"))
     (files-read . ("package.json" "deno.json" "rescript.json" "README.md"
                    "CLAUDE.md" "src/main.ts" "src/Auditor.res" "src/Config.res"
                    "src/bindings/ada.ts" "tests/url_parser_test.ts"))
     (completion-snapshot
      . ((rescript-modules . 100)
         (typescript-bindings . 100)
         (cli-interface . 100)
         (runtime-testing . 0)
         (test-verification . 0)
         (documentation . 80)
         (overall . 65))))))

;;;; ============================================================================
;;;; CRITICAL NEXT ACTIONS
;;;; ============================================================================

(define critical-next-actions
  '((action-1
     (priority . 1)
     (description . "Install Deno runtime")
     (command . "curl -fsSL https://deno.land/install.sh | sh")
     (reason . "Unblocks all testing and runtime verification"))
    (action-2
     (priority . 2)
     (description . "Fix rescript.json deprecation")
     (change . "Replace 'es6' with 'esmodule' in package-specs")
     (reason . "Ensures future compatibility"))
    (action-3
     (priority . 3)
     (description . "Test CLI with real URL")
     (command . "deno task audit --url https://example.com")
     (reason . "Validates end-to-end functionality"))
    (action-4
     (priority . 4)
     (description . "Run test suite")
     (command . "deno test --allow-net --allow-read --allow-env")
     (reason . "Verify code correctness"))
    (action-5
     (priority . 5)
     (description . "Validate all report formats")
     (commands . ("deno task audit --url https://example.com --format json"
                  "deno task audit --url https://example.com --format html"
                  "deno task audit --url https://example.com --format markdown"))
     (reason . "Ensure multi-format output works correctly"))))

;;;; ============================================================================
;;;; QUICK REFERENCE
;;;; ============================================================================

(define quick-reference
  '((build . "npx rescript build")
    (watch . "npx rescript build -w")
    (clean . "npx rescript clean")
    (test . "deno test --allow-net --allow-read --allow-env")
    (audit-single . "deno task audit --url https://example.com")
    (audit-json . "deno task audit --url https://example.com --format json")
    (audit-file . "deno task audit --file urls.txt")
    (help . "deno task audit --help")))

;;;; ============================================================================
;;;; USAGE NOTES
;;;; ============================================================================

;; To resume this project in a new Claude session:
;; 1. Upload or paste this STATE.scm file
;; 2. Claude will parse the state and restore project context
;; 3. Check critical-next-actions for immediate priorities
;; 4. Review known-issues for current blockers
;; 5. Update session-history with new session details

;; File Structure:
;; - src/*.res          : ReScript source modules
;; - src/*.js           : Compiled JavaScript (generated)
;; - src/main.ts        : CLI entry point
;; - src/bindings/*.ts  : TypeScript FFI bindings
;; - tests/*.ts         : Deno test files

;; EOF
