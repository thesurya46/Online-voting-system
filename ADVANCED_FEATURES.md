# 📚 Advanced Features Guide

## Analytics & Reporting

### Real-Time Election Statistics

**Endpoint**: `GET /api/analytics/election/:electionId/stats`

```typescript
// Returns comprehensive election statistics
{
  "electionId": "...",
  "electionTitle": "Annual Election 2024",
  "totalVoters": 100,
  "votedVoters": 75,
  "voterTurnout": 75.5,
  "positions": [
    {
      "positionId": "...",
      "positionTitle": "President",
      "candidates": [
        {
          "candidateId": "...",
          "candidateName": "Alice",
          "votes": 45,
          "percentage": 60
        }
      ]
    }
  ]
}
```

### Generate Reports

**PDF Export**: `GET /api/analytics/election/:electionId/report/pdf`
**CSV Export**: `GET /api/analytics/election/:electionId/report/csv`

### Activity Logging

**Endpoint**: `GET /api/analytics/user/activity-log?limit=50`

Track all user actions:
- Login/Logout
- Vote cast
- Election creation
- Results view

## Bulk Import

### Import Voters from CSV

**Endpoint**: `POST /api/import/voters`

```bash
curl -X POST http://localhost:5000/api/import/voters \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{
    "electionId": "election-id",
    "voters": [
      {"email": "voter1@example.com", "firstName": "John", "lastName": "Doe"},
      {"email": "voter2@example.com", "firstName": "Jane", "lastName": "Smith"}
    ]
  }'
```

**Response**:
```json
{
  "successful": 2,
  "failed": 0,
  "errors": []
}
```

## Notification System

### Email Notifications

```typescript
// Automatic notifications sent for:
- Election start
- Election end
- Vote confirmation
- Result announcement
```

### SMS Notifications (Twilio)

```typescript
// Optional SMS notifications for time-sensitive alerts
// Configure TWILIO_* environment variables
```

## System Features

### Request Logging
- All API requests logged with timestamp, method, path, status, duration
- Slow request detection (>1000ms)
- Error request tracking

### Enhanced Security Headers
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

### CORS Configuration
- Configurable origins
- Credentials support
- Pre-flight request handling

### Health Checks
- `GET /health` - System status
- `GET /api/version` - API version info
- Database connection verification
- Redis connection verification

## Performance Optimization

### Caching Strategy
```typescript
// React Query caching
- Election data: 5 minutes
- User data: 10 minutes
- Vote results: Real-time
```

### Database Optimization
- Indexed queries
- Pagination support
- Connection pooling
- Query optimization

## Monitoring & Observability

### Built-in Logging
```typescript
import { logger } from '@/utils/logger';

logger.info('User logged in', { userId });
logger.error('Database error', error);
logger.warn('Slow query detected', { duration });
```

### Error Tracking (Sentry Integration Ready)
```typescript
// Configure SENTRY_DSN in .env
// All errors automatically tracked
```

## Dashboard Features

### Admin Dashboard
- System statistics
- User management
- Activity monitoring
- Quick actions

### Analytics Dashboard
- Vote distribution charts
- Voter turnout metrics
- Real-time result updates
- Export capabilities

## API Documentation

### Swagger UI
Access at `http://localhost:5000/api/docs`

Features:
- Interactive API explorer
- Request/response examples
- Authentication testing
- Parameter documentation
