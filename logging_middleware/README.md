# Logging Middleware

Reusable logging package for backend/frontend applications.

## Features

- Token caching (refreshes only when expired)
- Input validation (stack, level, package)
- Retry logic (3 attempts with exponential backoff)
- Timeout handling (5s)
- Graceful failure (never crashes main app)

## Installation

```bash
pnpm install
```

## Usage

```typescript
import { Log } from './logging-middleware';

// Async - returns LogRes or null
const result = await Log('backend', 'error', 'handler', 'POST /api/vehicles failed');

// Fire-and-forget
LogSync('backend', 'info', 'service', 'User created successfully');
```

## API

### Log(stack, level, package, message)

| Param | Type | Values |
|-------|------|--------|
| stack | string | `backend`, `frontend` |
| level | string | `debug`, `info`, `warn`, `error`, `fatal` |
| package | string | See below |
| message | string | Descriptive log message |

### Backend Packages
`cache`, `controller`, `cron_job`, `db`, `domain`, `handler`, `repository`, `route`, `service`, `auth`, `config`, `middleware`, `utils`

### Frontend Packages
`api`, `component`, `hook`, `page`, `state`, `style`, `auth`, `config`, `middleware`, `utils`

## Testing

```bash
pnpm test
```

## Environment Variables

Create a `.env` file:

```
EMAIL=your@email.com
NAME=your name
ROLL_NO=your_roll_no
ACCESS_CODE=your_access_code
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
API_BASE=http://4.224.186.213/evaluation-service
```
