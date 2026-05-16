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
GET-http://localhost:3003/health
<img width="1299" height="1078" alt="image" src="https://github.com/user-attachments/assets/a50796f5-8c21-4c47-924c-cc34c8015b6c" />


POST-http://localhost:3003/api/users
<img width="1288" height="953" alt="Screenshot 2026-05-16 175723" src="https://github.com/user-attachments/assets/47c84cf8-76b8-4a65-beac-504a4b8ef185" />

GET-http://localhost:3003/api/users
<img width="1342" height="1060" alt="Screenshot 2026-05-16 175852" src="https://github.com/user-attachments/assets/a17a03f6-4594-4c96-893b-40a0c43d5042" />

GET:http://localhost:3003/api/notifications
<img width="1294" height="1009" alt="Screenshot 2026-05-16 180047" src="https://github.com/user-attachments/assets/0ec91217-f2f4-4421-8ed9-34c9235657ec" />



GET-http://localhost:3003/api/notifications/pending
<img width="1219" height="1019" alt="Screenshot 2026-05-16 180322" src="https://github.com/user-attachments/assets/cd88dbef-c539-4284-987a-2c7ce673359b" />


GET-http://localhost:3001/health
<img width="1290" height="981" alt="Screenshot 2026-05-16 180508" src="https://github.com/user-attachments/assets/ecc77452-eec7-40e5-8d7c-fa44d0a5f250" />

POST:http://localhost:3001/api/vehicles
<img width="1280" height="1045" alt="Screenshot 2026-05-16 180602" src="https://github.com/user-attachments/assets/11df8e2f-95e2-4aef-b072-92c74e3fd574" />

get:http://localhost:3001/api/vehicles
<img width="1246" height="999" alt="Screenshot 2026-05-16 180645" src="https://github.com/user-attachments/assets/3de58d4d-b084-422d-a879-23120750fa08" />

put:http://localhost:3001/api/vehicles/1
<img width="1376" height="1119" alt="Screenshot 2026-05-16 180735" src="https://github.com/user-attachments/assets/f8806b14-7625-483a-9250-dca2ce8fc9a7" />

delete:ut:http://localhost:3001/api/vehicles/1
<img width="1397" height="1080" alt="Screenshot 2026-05-16 180814" src="https://github.com/user-attachments/assets/f4d7f053-ae6b-474c-b77f-8ce70eef620d" />



