# CLAUDE.md

This file contains instructions and context for Claude Code when working on this project.

## Project Overview

**Repository:** Hyperpolymath/broad-spectrum
**Project:** Website Auditor

A standalone CLI website auditor that performs comprehensive security, accessibility, performance, and SEO audits. This is a complete rebuild of the zotero-voyant-export Firefox/Zotero add-on into a modern, high-performance command-line tool.

**Key Features:**
- Broken link detection and validation
- Accessibility auditing (WCAG compliance)
- Performance metrics collection
- SEO issue identification
- Multiple report formats (console, JSON, HTML, markdown)

## Development Guidelines

### Code Quality Standards

- Write clean, maintainable, and well-documented code
- Follow language-specific best practices and conventions
- Include comprehensive comments for complex logic
- Ensure code is properly formatted and linted before committing

### Security

- Never commit sensitive information (API keys, passwords, tokens) to the repository
- Use environment variables for configuration
- Follow OWASP security best practices
- Validate and sanitize all inputs
- Be mindful of common vulnerabilities (XSS, SQL injection, command injection, etc.)

### Testing

- Write tests for new functionality
- Ensure existing tests pass before committing
- Aim for good test coverage of critical paths
- Include both unit tests and integration tests where appropriate

### Git Workflow

- Write clear, descriptive commit messages
- Keep commits focused and atomic
- Follow conventional commit format when possible (feat:, fix:, docs:, etc.)
- Always work on feature branches (prefixed with `claude/`)
- Push changes to the designated branch

### Documentation

- Keep documentation up to date with code changes
- Document public APIs and interfaces
- Include usage examples where helpful
- Update README.md when adding new features or changing functionality

## Technology Stack

**Core Technologies:**
- **ReScript**: Type-safe functional language compiling to JavaScript
- **Deno**: Secure TypeScript/JavaScript runtime (no Node.js)
- **WASM**: WebAssembly for high-performance URL parsing
- **Ada URL Parser**: WHATWG-compliant URL parsing via npm + WASM

**Build Pipeline:**
- ReScript compiler (`rescript`) → JavaScript modules
- GenType for TypeScript FFI bindings
- Deno for runtime execution (no bundler needed)

## Project Structure

```
broad-spectrum/
├── src/                    # ReScript source files
│   ├── Auditor.res        # Main entry point
│   ├── Config.res         # Shared configuration types
│   ├── LinkChecker.res    # Broken link detection
│   ├── UrlParser.res      # URL parsing logic
│   ├── Fetcher.res        # HTTP request handling
│   ├── Accessibility.res  # WCAG compliance checks
│   ├── Performance.res    # Performance metrics
│   ├── SEO.res           # SEO analysis
│   ├── Report.res        # Report generation
│   ├── main.ts           # CLI entry point (TypeScript)
│   └── bindings/         # TypeScript/Deno FFI bindings
│       ├── ada.ts        # Ada URL parser binding
│       ├── fetcher.ts    # HTTP fetch binding
│       ├── htmlParser.ts # HTML parsing binding
│       ├── a11y.ts       # Accessibility tools binding
│       ├── seoParser.ts  # SEO analysis binding
│       └── report.ts     # Report formatting binding
├── lib/                   # Compiled JavaScript output
├── tests/                # Test files
├── rescript.json         # ReScript build configuration
├── deno.json            # Deno task definitions
└── package.json         # npm dependencies (Ada parser)
```

## Common Tasks

### Setting Up Development Environment

```bash
# Clone the repository
git clone <repository-url>
cd broad-spectrum

# Install npm dependencies (Ada URL parser)
npm install

# Install Deno (if not already installed)
curl -fsSL https://deno.land/install.sh | sh

# Install ReScript compiler
npm install -g rescript
```

### Building the Project

```bash
# Compile ReScript to JavaScript
npm run build
# OR
rescript build

# Watch mode for development
rescript build -w
```

### Running the Auditor

```bash
# Audit a single website
deno task audit --url https://example.com

# Audit with specific format
deno task audit --url https://example.com --format json

# Audit multiple URLs from a file
deno task audit --file urls.txt

# Show help
deno task audit --help
```

### Running Tests

```bash
# Run all tests
deno test

# Run specific test file
deno test tests/link_checker_test.ts

# Run tests with coverage
deno test --coverage
```

## Architecture Decisions & Rationale

**ReScript over TypeScript:**
- Type safety at compile time (catches errors before runtime)
- Functional patterns prevent entire classes of bugs
- Excellent type inference reduces boilerplate
- Immutable-by-default data structures

**Separate Config Module:**
- Solves circular dependency between `Auditor.res` ↔ `LinkChecker.res`
- Shared configuration types accessible to all modules
- Single source of truth for configuration schema

**Deno over Node.js:**
- Secure by default (explicit permissions required)
- Built-in TypeScript support (no transpilation needed)
- No node_modules bloat
- Modern ES modules only
- Better developer experience

**Ada URL Parser:**
- Fast WHATWG-compliant URL parsing
- WASM performance (faster than JavaScript implementations)
- Battle-tested C++ codebase
- Available via npm for easy integration

**GenType for FFI:**
- Seamless TypeScript interop from ReScript
- Type-safe foreign function interface
- Auto-generated TypeScript definitions

## ReScript Technical Gotchas

**Critical Syntax Differences:**

1. **String.repeat parameter order:**
   ```rescript
   // CORRECT
   Js.String.repeat(count: int, str: string)

   // INCORRECT (common mistake)
   Js.String.repeat(string, int)
   ```

2. **Array operations:**
   ```rescript
   // Prefer Js.Array2.push for better type clarity
   Js.Array2.push(array, item)

   // Avoid Js.Array.push (less clear types)
   ```

3. **For loops require explicit indices:**
   ```rescript
   // No "for item in array" syntax
   // Must use index-based loops or Belt/Js.Array2 functions
   for i in 0 to Js.Array2.length(items) - 1 {
     let item = items[i]
   }
   ```

4. **Reserved keywords:**
   ```rescript
   // "external" is reserved in ReScript
   // Use string escaping for type fields
   type linkStatus = {
     \"external": bool  // Escaped reserved keyword
   }
   ```

5. **Module compilation order:**
   - Config.res must compile before Auditor.res and LinkChecker.res
   - Circular dependencies will cause compilation failures
   - Check `rescript.json` for proper source ordering

6. **GenType annotations:**
   ```rescript
   // Export functions for TypeScript with @genType
   @genType
   let auditWebsite = (url: string, config: Config.t) => { ... }
   ```

## Current Status & Next Steps

**Completed:**
- All 8 ReScript modules implemented and compiling
- 6 TypeScript/Deno bindings created
- CLI interface with argument parsing
- Build system configured (npm + ReScript → Deno)
- Documentation (README) written

**Immediate Next Steps:**

1. **Test compilation:**
   ```bash
   npm install && npm run build
   ```

2. **Test runtime execution:**
   ```bash
   deno task audit --url https://example.com
   ```

3. **Fix runtime issues:**
   - Verify Ada URL parser imports/deno.lock
   - Validate TypeScript bindings interface correctly with ReScript
   - Check GenType output matches expected types

4. **Add test suite:**
   - Unit tests for each module
   - Integration tests for full audit flow
   - Test report generation in all formats

5. **Performance benchmarking:**
   - Compare WASM URL parsing vs pure JS
   - Measure audit speed on real websites
   - Optimize bottlenecks

## Notes for Claude Code

- Always check existing ReScript patterns before adding new code
- Respect the functional programming paradigm (immutability, pure functions)
- Use Belt or Js.Array2 for array operations (avoid Js.Array)
- When in doubt about ReScript syntax, check the official docs
- GenType is your friend for TypeScript interop
- Module compilation order matters - Config first, then consumers
- Deno permissions are explicit - don't forget `--allow-net`, `--allow-read`
- Use the TodoWrite tool to plan and track multi-step tasks
- **CRITICAL:** Do NOT confuse this project with Cicada (separate Elixir security platform)

## Resources

- [Project Repository](https://github.com/Hyperpolymath/broad-spectrum)
- [ReScript Documentation](https://rescript-lang.org/docs/manual/latest)
- [Deno Documentation](https://deno.land/manual)
- [Ada URL Parser](https://github.com/ada-url/ada)

---

*This file should be updated as the project evolves to reflect current practices, architecture decisions, and project-specific guidelines.*
