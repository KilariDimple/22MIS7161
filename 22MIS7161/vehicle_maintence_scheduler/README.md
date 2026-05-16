# Vehicle Maintenance Scheduler API

REST API for managing vehicle maintenance schedules.

## Setup

```bash
pnpm install
pnpm dev
```

## API Endpoints

### Vehicles

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/vehicles | Get all vehicles |
| GET | /api/vehicles/:id | Get vehicle by ID |
| POST | /api/vehicles | Create vehicle |
| PUT | /api/vehicles/:id | Update vehicle |
| DELETE | /api/vehicles/:id | Delete vehicle |

### Vehicle Maintenance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/vehicles/:vehicleId/maintenance | Get vehicle's maintenance records |

### Maintenance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/maintenance | Get all maintenance records |
| GET | /api/maintenance/:id | Get maintenance by ID |
| POST | /api/maintenance | Schedule maintenance |
| PUT | /api/maintenance/:id | Update maintenance |
| DELETE | /api/maintenance/:id | Delete maintenance |
| POST | /api/maintenance/:id/complete | Mark maintenance complete |

## Data Models

### Vehicle
```json
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2022,
  "licensePlate": "ABC123",
  "ownerId": "user123"
}
```

### Maintenance
```json
{
  "vehicleId": "vehicle-uuid",
  "type": "oil_change",
  "description": "Regular oil change",
  "scheduledDate": "2024-03-15",
  "cost": 50,
  "notes": "Use synthetic oil"
}
```

### Maintenance Types
- oil_change
- tire_rotation
- brake_inspection
- fluid_check
- filter_replacement
- battery_check
- general_service
- repair

### Maintenance Status
- scheduled
- in_progress
- completed
- cancelled

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
