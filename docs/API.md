# Doomsday AI API Documentation

This API allows interaction with the Global Risk Clock backend system.

## Authentication
Authentication is required for Admin endpoints.
Header: `x-admin-key: <YOUR_ADMIN_KEY>` (Set in .env as `ADMIN_API_KEY`)

## Public Endpoints

### Get Current Clock State
**GET** `/api/clock/current`

Returns the current seconds to midnight and status.

```json
{
  "_id": "...",
  "secondsToMidnight": 90,
  "reasonChange": "Initial System Setup",
  "status": "Elevated",
  "confidence": "High",
  "timestamp": "2024-05-20T10:00:00.000Z"
}
```

### Get Clock History
**GET** `/api/clock/history`

Returns the last 20 clock states.

### Get Latest Explanation
**GET** `/api/clock/explanation/latest`

Returns the most recent AI explanation for the clock's position.

## Admin Endpoints (Require `x-admin-key`)

### Ingest Risk Data
**POST** `/api/risk/ingest`

Submit a new risk signal for AI evaluation.

**Body:**
```json
{
  "category": "Climate",   // "Nuclear", "Climate", "AI", "Biosecurity", "Geopolitical"
  "severity": 85,          // 0-100
  "confidence": 0.9,       // 0-1
  "source": "IPCC Report",
  "description": "New data suggests rapid acceleration of polar ice melt."
}
```

### Trigger AI Evaluation
**POST** `/api/ai/evaluate`

Triggers the AI to read unprocessed risks and make a decision on the clock.

**Response:**
```json
{
  "success": true,
  "result": {
    "decision": "forward",
    "deltaSeconds": 10,
    "explanation": "Due to critical new climate data...",
    ...
  }
}
```

### Reset Clock
**POST** `/api/clock/reset`

Resets the clock to the initial state (90 seconds to midnight).

### View Audit Logs
**GET** `/api/logs`

Returns a list of system actions (Ingest, Update, etc.).
