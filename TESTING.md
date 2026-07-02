# 🧪 Testing Guide

## Backend Testing

### Unit Tests

```typescript
// Example: Testing auth service
import { authService } from '../../src/services/authService';

describe('AuthService', () => {
  describe('register', () => {
    it('should create a new user', async () => {
      const user = await authService.register(
        'test@example.com',
        'Test',
        'User',
        'SecurePass123!'
      );
      expect(user.email).toBe('test@example.com');
    });

    it('should reject duplicate email', async () => {
      await expect(
        authService.register(
          'existing@example.com',
          'Test',
          'User',
          'SecurePass123!'
        )
      ).rejects.toThrow('Email already registered');
    });
  });
});
```

### Integration Tests

```typescript
// Example: Testing election API
import request from 'supertest';
import app from '../../src/app';

describe('Election API', () => {
  let token: string;

  beforeAll(async () => {
    // Login and get token
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'SecurePass123!'
      });
    token = response.body.data.accessToken;
  });

  it('should create election', async () => {
    const response = await request(app)
      .post('/api/elections')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Election',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('id');
  });
});
```

### Running Tests

```bash
# Run all tests
npm run test

# Run specific test file
npm run test auth.test.ts

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Frontend Testing

### Component Tests

```typescript
// Example: Testing Button component
import { render, screen } from '@testing-library/react';
import { Button } from '../../src/components/Button';

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should be disabled when isLoading is true', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Hook Tests

```typescript
// Example: Testing useAuth hook
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../../src/hooks/useAuth';

describe('useAuth Hook', () => {
  it('should initialize with no user', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
```

### Running Frontend Tests

```bash
# Run tests
npm run test

# Watch mode
npm run test -- --watch

# Coverage
npm run test:coverage
```

## E2E Testing (Playwright)

```typescript
// Example: E2E test for login flow
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.click('text=Login');
  
  await page.fill('input[type="email"]', 'voter1@example.com');
  await page.fill('input[type="password"]', 'SecurePass123!');
  await page.click('button:has-text("Login")');
  
  await page.waitForURL('**/dashboard');
  expect(page.url()).toContain('dashboard');
});
```

## Load Testing

### Using Artillery

```yaml
# load-test.yml
config:
  target: "http://localhost:5000"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warmup"
    - duration: 120
      arrivalRate: 50
      name: "Ramp-up"
    - duration: 60
      arrivalRate: 100
      name: "Sustained load"
scenarios:
  - name: "Login"
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "voter1@example.com"
            password: "SecurePass123!"
```

```bash
# Run load test
artillery run load-test.yml
```

## Security Testing

### SQL Injection

```bash
# Test for SQL injection vulnerability
curl -X GET 'http://localhost:5000/api/elections?id=1; DROP TABLE elections;--'
```

### XSS Testing

```bash
# Test for XSS vulnerability
curl -X POST 'http://localhost:5000/api/elections' \
  -H 'Content-Type: application/json' \
  -d '{"title": "<script>alert(1)</script>"}'
```

### CSRF Protection

```typescript
// Verify CSRF token handling
test('should reject requests without CSRF token', async () => {
  const response = await request(app)
    .post('/api/elections')
    .send({ title: 'Test' });
  
  expect(response.status).toBe(403);
});
```

## Performance Testing

```bash
# Lighthouse CLI
lighthouse https://votingsystem.com --view

# WebPageTest
wpt test https://votingsystem.com --median
```

## Test Coverage Goals

- **Backend**: 70%+ coverage
- **Frontend**: 60%+ coverage
- **Critical paths**: 90%+ coverage

## Continuous Integration

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 18
      - run: npm install
      - run: npm run lint
      - run: npm run test
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v2
```
