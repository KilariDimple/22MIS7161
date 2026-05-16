# Backend Assessment - 22MIS7161

Backend REST API assessment demonstrating Node.js + Express + TypeScript development.

## Repository Structure

```
22MIS7161/
├── logging_middleware/      # Reusable logging package
├── vehicle_maintence_scheduler/  # Vehicle maintenance REST API
├── notification_app_be/     # Notification system REST API
├── notification_system_design.md  # System design document
└── README.md
```

## Tech Stack

- Node.js + Express
- TypeScript
- pnpm

## Setup

Each project has its own README with setup instructions.

```bash
cd <project_folder>
pnpm install
pnpm dev
```
## output
GET-http://localhost:3003/health
![alt text](image-5.png)
POST-http://localhost:3003/api/users
![alt text](image-6.png)
GET-http://localhost:3003/api/users
![alt text](image-7.png)
GET:http://localhost:3003/api/notifications
![alt text](image-8.png)
POST-http://localhost:3003/api/notifications
GET-http://localhost:3003/api/notifications/pending
![alt text](image-9.png)
GET-http://localhost:3001/health
![alt text](image-10.png)
POST:http://localhost:3001/api/vehicles
![alt text](image-11.png)
get:http://localhost:3001/api/vehicles
![alt text](image-12.png)
put:http://localhost:3001/api/vehicles/1
![alt text](image-13.png)
delete:ut:http://localhost:3001/api/vehicles/1
![alt text](image-14.png)
