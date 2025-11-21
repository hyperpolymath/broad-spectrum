# CLAUDE.md

This file contains instructions and context for Claude Code when working on this project.

## Project Overview

**Repository:** Hyperpolymath/broad-spectrum

This is a general-purpose project repository that can accommodate a variety of implementations and use cases.

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

## Project Structure

As this is a new repository, the structure will evolve based on project needs. Common patterns to follow:

- Keep configuration files at the root level
- Organize source code in a dedicated directory (`src/`, `lib/`, etc.)
- Place tests alongside code or in a dedicated `tests/` or `__tests__/` directory
- Store documentation in `docs/` if extensive
- Keep build artifacts and dependencies out of version control

## Common Tasks

### Setting Up Development Environment

```bash
# Clone the repository
git clone <repository-url>
cd broad-spectrum

# Install dependencies (once technology stack is established)
# npm install / pip install -r requirements.txt / etc.
```

### Running Tests

```bash
# Add test commands as they become relevant
# npm test / pytest / go test / etc.
```

### Building the Project

```bash
# Add build commands as they become relevant
# npm run build / make / cargo build / etc.
```

## Technology Stack

To be determined based on project requirements. Update this section as technologies are added.

## Dependencies

Track major dependencies here as they are added to the project.

## Notes for Claude Code

- Always check for existing patterns and conventions in the codebase before adding new code
- When in doubt, prefer clarity and simplicity over cleverness
- Ask for clarification if requirements are ambiguous
- Consider backwards compatibility when making changes
- Think about error handling and edge cases
- Use the TodoWrite tool to plan and track multi-step tasks

## Resources

- [Project Repository](https://github.com/Hyperpolymath/broad-spectrum)

---

*This file should be updated as the project evolves to reflect current practices, architecture decisions, and project-specific guidelines.*
