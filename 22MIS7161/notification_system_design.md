# Notification System Design

## 1. Overview

A scalable notification system that delivers messages across multiple channels (email, push, SMS, in-app) with support for scheduling, prioritization, and delivery tracking.

## 2. Requirements

### Functional Requirements
- Send notifications via multiple channels (email, push, SMS, in-app)
- Schedule notifications for future delivery
- Support notification templates
- Track delivery status and read receipts
- Allow users to manage notification preferences
- Support batch notifications

### Non-Functional Requirements
- High availability (99.9% uptime)
- Low latency (<500ms for in-app, <5s for push)
- Scalable to millions of users
- At-least-once delivery guarantee
- Audit logging for compliance

## 3. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API Gateway                                     │
│                     (Rate Limiting, Auth, Routing)                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
            │ Notification │ │    User      │ │   Template   │
            │   Service    │ │   Service    │ │   Service    │
            └──────────────┘ └──────────────┘ └──────────────┘
                    │               │               │
                    └───────────────┼───────────────┘
                                    ▼
                    ┌───────────────────────────────┐
                    │       Message Queue           │
                    │    (Kafka / RabbitMQ)         │
                    └───────────────────────────────┘
                                    │
        ┌───────────────┬───────────┼───────────┬───────────────┐
        ▼               ▼           ▼           ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Email Worker │ │ Push Worker  │ │ SMS Worker   │ │ In-App Worker│
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
        │               │               │               │
        ▼               ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   SendGrid   │ │    FCM /     │ │   Twilio     │ │  WebSocket   │
│     SMTP     │ │    APNS      │ │              │ │   Server     │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

## 4. Component Design

### 4.1 API Gateway
- Authentication via JWT
- Rate limiting per user/IP
- Request validation
- Load balancing across service instances

### 4.2 Notification Service
Responsibilities:
- Receive notification requests
- Validate payload and user preferences
- Apply templates if specified
- Enqueue to appropriate channel queue
- Handle scheduling via delayed queue

Key Operations:
```
POST /notifications          - Create notification
GET  /notifications/:id      - Get notification status
POST /notifications/batch    - Bulk create
DELETE /notifications/:id    - Cancel scheduled notification
```

### 4.3 User Service
Responsibilities:
- Manage user profiles
- Store notification preferences per channel
- Handle opt-in/opt-out
- Device token management for push

### 4.4 Template Service
Responsibilities:
- CRUD for notification templates
- Variable substitution
- Localization support
- A/B testing variants

### 4.5 Channel Workers
Each worker type handles delivery for its channel:

**Email Worker:**
- Connects to SendGrid/SMTP
- Handles bounces and complaints
- Retry logic with exponential backoff

**Push Worker:**
- FCM for Android, APNS for iOS
- Token refresh handling
- Batch sending for efficiency

**SMS Worker:**
- Twilio/provider integration
- Phone number validation
- Cost tracking

**In-App Worker:**
- WebSocket broadcast
- Fallback to polling
- Real-time delivery confirmation

## 5. Data Model

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### User Preferences Table
```sql
CREATE TABLE user_preferences (
  user_id UUID REFERENCES users(id),
  channel VARCHAR(20),
  enabled BOOLEAN DEFAULT true,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  PRIMARY KEY (user_id, channel)
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50),
  channel VARCHAR(20),
  title VARCHAR(255),
  body TEXT,
  status VARCHAR(20),
  scheduled_at TIMESTAMP,
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_at) 
  WHERE status = 'scheduled';
```

### Templates Table
```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY,
  name VARCHAR(100),
  channel VARCHAR(20),
  subject VARCHAR(255),
  body TEXT,
  variables JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 6. Message Queue Design

### Queue Structure
- `notifications.email` - Email delivery queue
- `notifications.push` - Push notification queue
- `notifications.sms` - SMS delivery queue
- `notifications.inapp` - In-app notification queue
- `notifications.scheduled` - Delayed delivery queue
- `notifications.dlq` - Dead letter queue for failures

### Message Format
```json
{
  "id": "uuid",
  "userId": "uuid",
  "channel": "email",
  "title": "Subject",
  "body": "Content",
  "metadata": {},
  "attempts": 0,
  "maxRetries": 3,
  "createdAt": "timestamp"
}
```

## 7. Scalability Considerations

### Horizontal Scaling
- Stateless services behind load balancer
- Worker pools scale based on queue depth
- Database read replicas for queries

### Caching Strategy
- Redis for user preferences (TTL: 5min)
- Template cache in memory (TTL: 1min)
- Rate limit counters in Redis

### Database Scaling
- Partition notifications by date
- Archive old notifications to cold storage
- Use connection pooling

## 8. Reliability & Fault Tolerance

### Retry Strategy
```
Attempt 1: Immediate
Attempt 2: 1 minute delay
Attempt 3: 5 minute delay
Attempt 4: 30 minute delay
Then: Move to DLQ
```

### Circuit Breaker
- Monitor provider failures
- Open circuit after 5 consecutive failures
- Half-open after 1 minute
- Close after 3 successful requests

### Dead Letter Queue
- Failed messages after max retries
- Manual investigation queue
- Alerting on DLQ depth

## 9. Monitoring & Observability

### Metrics
- Notifications sent/min by channel
- Delivery success rate
- Average delivery latency
- Queue depth
- Error rate by provider

### Logging
- Structured JSON logs
- Correlation IDs for tracing
- PII redaction

### Alerts
- Delivery rate drop >10%
- Queue depth >10k
- Provider error rate >5%
- DLQ depth >100

## 10. Security

### Data Protection
- Encrypt PII at rest (AES-256)
- TLS 1.3 for transit
- Mask sensitive data in logs

### Access Control
- Service-to-service auth via mTLS
- API key rotation every 90 days
- Principle of least privilege

### Compliance
- GDPR: Right to deletion
- Audit logs for 7 years
- Data residency compliance

## 11. Tech Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| API Gateway | Kong / AWS API Gateway | Built-in rate limiting, auth |
| Services | Node.js / Go | High throughput, low latency |
| Message Queue | Kafka | Durability, replay capability |
| Primary DB | PostgreSQL | ACID, JSONB support |
| Cache | Redis | Low latency, pub/sub |
| WebSocket | Socket.io / ws | Real-time in-app |
| Email | SendGrid | Deliverability, analytics |
| Push | Firebase / OneSignal | Cross-platform |
| SMS | Twilio | Global coverage |
| Monitoring | Prometheus + Grafana | Industry standard |
| Logging | ELK Stack | Centralized logging |

## 12. API Specification

### Create Notification
```
POST /api/v1/notifications
Authorization: Bearer <token>

{
  "userId": "uuid",
  "type": "transactional",
  "channels": ["email", "push"],
  "templateId": "uuid",
  "variables": {
    "name": "John",
    "orderNumber": "12345"
  },
  "scheduledAt": "2024-03-15T10:00:00Z"
}

Response: 201 Created
{
  "id": "uuid",
  "status": "scheduled",
  "scheduledAt": "2024-03-15T10:00:00Z"
}
```

### Get Notification Status
```
GET /api/v1/notifications/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "uuid",
  "status": "delivered",
  "sentAt": "2024-03-15T10:00:01Z",
  "deliveredAt": "2024-03-15T10:00:05Z",
  "channels": {
    "email": "delivered",
    "push": "delivered"
  }
}
```

## 13. Deployment Strategy

### Infrastructure
- Kubernetes for container orchestration
- Multi-AZ deployment for HA
- Auto-scaling based on queue depth and CPU

### CI/CD Pipeline
1. Code commit → Run tests
2. Build Docker image
3. Deploy to staging
4. Integration tests
5. Canary deployment (10%)
6. Full rollout if metrics healthy

### Rollback
- Keep previous 3 versions
- Instant rollback via K8s
- Feature flags for gradual rollout

## 14. Cost Optimization

- Batch SMS messages where possible
- Use push over SMS when available
- Archive notifications >90 days to S3
- Reserved instances for base load
- Spot instances for workers

## 15. Future Enhancements

1. **Rich Media Support** - Images, buttons in push
2. **Analytics Dashboard** - Open rates, click tracking
3. **A/B Testing** - Template optimization
4. **ML-based Timing** - Optimal send time prediction
5. **Multi-tenant Support** - SaaS offering
