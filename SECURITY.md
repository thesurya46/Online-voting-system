# 🔐 Security Best Practices

## Authentication & Authorization

### JWT Token Strategy

```typescript
// Access Token (Short-lived, in-memory)
- Expiry: 15 minutes
- Storage: Memory/Redux/Zustand
- Risk: XSS attack exposure

// Refresh Token (Long-lived, HTTP-only cookie)
- Expiry: 7 days
- Storage: HTTP-only, Secure, SameSite
- Risk: CSRF attack (mitigated by SameSite)
```

### Role-Based Access Control

```typescript
// Three roles with hierarchical permissions
SUPER_ADMIN:
  - Manage all elections
  - Manage all users
  - System configuration
  - View audit logs

ELECTION_ADMIN:
  - Manage own elections
  - Create positions and candidates
  - View election results
  - Manage voters for own elections

VOTER:
  - View active elections
  - Cast votes
  - View own vote history
```

## Input Validation

```typescript
// Use Zod for schema validation
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Minimum 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
  firstName: z.string().min(2),
  lastName: z.string().min(2)
});

// Always validate on both frontend and backend
const { data, error } = registerSchema.safeParse(input);
```

## Password Security

```typescript
import bcrypt from 'bcryptjs';

// Hash password with salt rounds = 12
const hashedPassword = await bcrypt.hash(password, 12);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);

// Never store plain passwords
// Never log passwords
// Use HTTPS for transmission
```

## SQL Injection Prevention

```typescript
// ❌ VULNERABLE - Never do this
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ SAFE - Use Prisma parameterized queries
const user = await prisma.user.findUnique({
  where: { email }
});

// ✅ SAFE - Use prepared statements
const user = await db.query(
  'SELECT * FROM users WHERE email = ?',
  [email]
);
```

## XSS Prevention

```typescript
// ❌ VULNERABLE - Never use dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ SAFE - React escapes by default
<div>{userInput}</div>

// ✅ SAFE - Use libraries for sanitization
import DOMPurify from 'dompurify';
const cleanHtml = DOMPurify.sanitize(userInput);
```

## CSRF Protection

```typescript
// Express middleware
import csrf from 'csurf';

const csrfProtection = csrf({ cookie: false });
app.use(csrfProtection);

// Include CSRF token in forms/requests
const token = req.csrfToken();
```

## Rate Limiting

```typescript
// Implement per-route rate limiting
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, try again later'
});

app.post('/api/auth/login', loginLimiter, login);
```

## HTTPS & SSL

```typescript
// Force HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  }
  next();
});

// Set security headers
import helmet from 'helmet';
app.use(helmet());
```

## Environment Variables

```bash
# ❌ NEVER commit .env file
# ✅ DO commit .env.example with dummy values

# Sensitive variables
JWT_ACCESS_SECRET=super_secret_key_min_32_chars
JWT_REFRESH_SECRET=super_secret_key_min_32_chars
DATABASE_URL=postgresql://user:password@host/db
SMTP_PASS=your_email_app_password

# Load from environment
require('dotenv').config();
const secret = process.env.JWT_ACCESS_SECRET;
```

## Dependency Security

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Keep dependencies updated
npm outdated
npm update

# Verify package integrity
npm install --audit
```

## Audit Logging

```typescript
// Log all sensitive actions
await prisma.auditLog.create({
  data: {
    action: 'USER_LOGIN',
    entity: 'User',
    entityId: user.id,
    userId: user.id,
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  }
});
```

## Data Protection

```typescript
// Encrypt sensitive data
import crypto from 'crypto';

function encryptVote(vote: string, key: string): string {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(vote, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Hash sensitive fields
const hashedEmail = crypto.createHash('sha256').update(email).digest('hex');
```

## Security Checklist

- [ ] HTTPS enforced
- [ ] JWT tokens properly configured
- [ ] Password hashing with bcrypt (12 rounds)
- [ ] Input validation on all endpoints
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] SQL injection prevention (Prisma)
- [ ] XSS prevention (React escaping)
- [ ] CSRF protection enabled
- [ ] Audit logging implemented
- [ ] Dependencies audited for vulnerabilities
- [ ] Sensitive data not logged
- [ ] Error messages don't leak information
- [ ] Security headers set (Helmet)
- [ ] Database backups configured
- [ ] Regular security updates scheduled
