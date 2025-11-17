# Test Coverage Report

This document explains how to generate and view test coverage reports for the backend.

## Running Tests with Coverage

### Generate Coverage Report
```bash
npm run test:cov
```

This will:
- Run all unit tests
- Generate coverage reports in multiple formats
- Display coverage summary in the terminal
- Create coverage files in the `coverage/` directory

### Generate HTML Coverage Report
```bash
npm run test:cov:html
```

This generates an HTML report that you can open in your browser:
- Open `coverage/index.html` in your browser for a detailed, interactive coverage report

### Generate Text Coverage Report
```bash
npm run test:cov:report
```

This displays a text-based coverage summary in the terminal.

## Coverage Thresholds

The project has minimum coverage thresholds set:
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

If coverage falls below these thresholds, the test run will fail.

## Coverage Reports Location

All coverage reports are generated in the `coverage/` directory:
- `coverage/lcov-report/index.html` - HTML report (open in browser)
- `coverage/lcov.info` - LCOV format (for CI/CD tools)
- `coverage/coverage-final.json` - JSON format (for programmatic access)

## Viewing HTML Report

1. Run `npm run test:cov:html`
2. Open `coverage/lcov-report/index.html` in your browser
3. Navigate through files to see line-by-line coverage

## Files Excluded from Coverage

The following files are excluded from coverage calculations:
- `*.spec.ts` - Test files themselves
- `*.interface.ts` - TypeScript interfaces
- `*.dto.ts` - Data Transfer Objects
- `*.entity.ts` - Database entities
- `*.enum.ts` - Enumerations
- `main.ts` - Application entry point
- `seed.ts` - Database seeder entry point
- `*.seeder.ts` - Database seeders
- `*.module.ts` - NestJS modules

## Continuous Integration

For CI/CD pipelines, use:
```bash
npm run test:cov
```

The LCOV format (`coverage/lcov.info`) can be uploaded to coverage services like:
- Codecov
- Coveralls
- SonarQube

## Improving Coverage

To improve test coverage:
1. Run `npm run test:cov` to see current coverage
2. Check the HTML report to identify uncovered lines
3. Write additional tests for uncovered code paths
4. Focus on edge cases and error handling

