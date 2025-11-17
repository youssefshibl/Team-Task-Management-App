# Backend Unit Testing Guide

This document provides information about unit testing in the backend.

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:cov
```

This will:
- Run all unit tests
- Generate coverage reports
- Display coverage summary in terminal
- Create coverage files in `coverage/` directory
- **Fail if coverage thresholds are not met**

### Generate HTML Coverage Report
```bash
npm run test:cov:html
```

Opens `coverage/lcov-report/index.html` in your browser for detailed coverage.

### Generate Coverage Report Only (No Threshold Check)
```bash
npm run test:cov:only
```

Generates coverage report without failing on threshold violations.

### Generate Text Coverage Summary
```bash
npm run test:cov:report
```

Displays text-based coverage summary in terminal.

## Test Coverage

### Current Coverage Thresholds

The project has minimum coverage thresholds:
- **Branches**: 50%
- **Functions**: 45%
- **Lines**: 47%
- **Statements**: 50%

### Coverage by Module

#### ✅ Fully Covered (100%)
- `PasswordService` - Password hashing and comparison
- `AuthJwtService` - JWT token generation and verification
- `UserValidator` - User existence validation
- `TaskResponseMapper` - Task response transformation
- `AppController` & `AppService` - Basic app endpoints

#### ⚠️ Partially Covered
- `TaskService` - 68.65% statements, 48.38% branches
- `TaskController` - 91.52% statements, 65.38% branches

#### ❌ Not Covered
- `AuthController` - Authentication endpoints
- `AuthGuard` - Authentication guard
- `HttpExceptionFilter` - Exception handling
- `BaseRepository` - Repository base class
- `WinstonConfig` - Logging configuration

## Test Files

### Existing Test Files
- `src/lib/services/password.service.spec.ts` - Password service tests
- `src/lib/services/jwt.service.spec.ts` - JWT service tests
- `src/lib/utils/user-validator.spec.ts` - User validator tests
- `src/lib/utils/task-response.mapper.spec.ts` - Task mapper tests
- `src/modules/task/task.service.spec.ts` - Task service tests
- `src/modules/task/task.controller.spec.ts` - Task controller tests
- `src/app.controller.spec.ts` - App controller tests

### Test Statistics
- **Total Test Suites**: 7
- **Total Tests**: 50
- **All Tests Passing**: ✅

## Writing New Tests

### Test Structure
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { YourService } from './your.service';

describe('YourService', () => {
  let service: YourService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YourService],
    }).compile();

    service = module.get<YourService>(YourService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('methodName', () => {
    it('should do something', async () => {
      // Test implementation
    });
  });
});
```

### Mocking Dependencies
```typescript
const mockDependency = {
  methodName: jest.fn(),
};

const module: TestingModule = await Test.createTestingModule({
  providers: [
    YourService,
    {
      provide: DependencyService,
      useValue: mockDependency,
    },
  ],
}).compile();
```

## Coverage Reports

### HTML Report
The HTML coverage report provides:
- Line-by-line coverage highlighting
- Branch coverage visualization
- Function coverage details
- File-by-file breakdown

**Location**: `coverage/lcov-report/index.html`

### LCOV Format
For CI/CD integration:
- **Location**: `coverage/lcov.info`
- Compatible with: Codecov, Coveralls, SonarQube

### JSON Format
For programmatic access:
- **Location**: `coverage/coverage-final.json`

## Improving Coverage

To improve test coverage:

1. **Identify gaps**: Run `npm run test:cov:html` and review uncovered lines
2. **Add tests for**:
   - Error handling paths
   - Edge cases
   - Boundary conditions
   - Different input scenarios
3. **Focus on**:
   - Controllers (currently 91% - good)
   - Services (currently 69% - needs improvement)
   - Guards and Filters (currently 0% - not tested)

## Best Practices

1. **Test isolation**: Each test should be independent
2. **Mock external dependencies**: Don't hit real databases or APIs
3. **Test edge cases**: Empty inputs, null values, errors
4. **Use descriptive test names**: "should return error when user not found"
5. **Clean up**: Use `afterEach()` to clear mocks
6. **Arrange-Act-Assert**: Structure tests clearly

## CI/CD Integration

For continuous integration, add to your pipeline:

```yaml
- name: Run tests with coverage
  run: npm run test:cov

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

## Next Steps

To reach higher coverage:
1. Add tests for `AuthController`
2. Add tests for `AuthGuard`
3. Add tests for `HttpExceptionFilter`
4. Add more edge case tests for `TaskService`
5. Add integration tests for critical flows

