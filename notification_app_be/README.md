# Notification App Backend

REST API for a notification system.

## Setup

```bash
pnpm install
pnpm dev
```

## API Endpoints

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | Get all users |
| GET | /api/users/:id | Get user by ID |
| POST | /api/users | Create user |
| PUT | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user |
| GET | /api/users/:id/notifications | Get user's notifications |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/notifications | Get all notifications |
| GET | /api/notifications/pending | Get pending notifications |
| GET | /api/notifications/:id | Get notification by ID |
| POST | /api/notifications | Create notification |
| PUT | /api/notifications/:id | Update notification |
| DELETE | /api/notifications/:id | Delete notification |
| POST | /api/notifications/:id/send | Send notification |
| POST | /api/notifications/:id/read | Mark as read |

## Data Models

### User
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "preferences": {
    "email": true,
    "push": true,
    "sms": false
  }
}
```

### Notification
```json
{
  "userId": "user-uuid",
  "type": "alert",
  "channel": "email",
  "title": "New Alert",
  "body": "You have a new notification",
  "scheduledAt": "2024-03-15T10:00:00Z",
  "metadata": {}
}
```

### Notification Types
- alert
- reminder
- promotion
- system
- transactional

### Notification Channels
- email
- push
- sms
- in_app

### Notification Status
- pending
- scheduled
- sent
- delivered
- read
- failed

## Architecture

```
src/
├── config/       # Environment config
├── types/        # TypeScript types
├── repository/   # Data layer (in-memory)
├── services/     # Business logic
├── controllers/  # HTTP handlers
├── routes/       # Route definitions
├── middleware/   # Express middleware
└── utils/        # Logging utility
```
