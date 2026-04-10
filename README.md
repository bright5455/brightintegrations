# Genderize API Integration

A NestJS REST API that integrates with the [Genderize.io](https://genderize.io) API to classify names by gender.

## Live URL

```
https://brightintegrations-production.up.railway.app
```

## Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **HTTP Client:** Axios (`@nestjs/axios`)
- **Package Manager:** pnpm
- **Deployment:** Railway

## Endpoint

### GET /api/classify

Classifies a name by gender using the Genderize.io API.

**Query Parameters**

| Parameter | Type   | Required | Description        |
|-----------|--------|----------|--------------------|
| name      | string | Yes      | The name to classify |

**Success Response — 200 OK**

```json
{
  "status": "success",
  "data": {
    "name": "john",
    "gender": "male",
    "probability": 0.99,
    "sample_size": 1234,
    "is_confident": true,
    "processed_at": "2026-04-10T12:00:00.000Z"
  }
}
```

**Error Responses**

| Status | Reason |
|--------|--------|
| 400    | Missing or empty name parameter |
| 422    | name is not a string |
| 502    | Upstream or server failure |

All errors follow this structure:

```json
{ "status": "error", "message": "<error message>" }
```

**Edge Case — No prediction available**

If Genderize returns `gender: null` or `count: 0`, the response is:

```json
{ "status": "error", "message": "No prediction available for the provided name" }
```

## Processing Rules

- `sample_size` is renamed from `count` in the raw Genderize response
- `is_confident` is `true` only when `probability >= 0.7` AND `sample_size >= 100`
- `processed_at` is generated fresh on every request in UTC ISO 8601 format

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
pnpm install
```

### Running locally

```bash
# development
pnpm run start:dev

# production
pnpm run build
pnpm run start:prod
```

### Test the endpoint

```bash
# Happy path
curl "http://localhost:3000/api/classify?name=john"

# Missing name — 400
curl "http://localhost:3000/api/classify"

# Empty name — 400
curl "http://localhost:3000/api/classify?name="

# Non-string — 422
curl "http://localhost:3000/api/classify?name[]=john"

# Unknown name — no prediction available
curl "http://localhost:3000/api/classify?name=xyzxyzxyzabc"
```

## Environment Variables

| Variable | Description              | Default |
|----------|--------------------------|---------|
| PORT     | Port the server listens on | 3000  |

## Project Structure

```
src/
  app.controller.ts   # Request validation and routing
  app.service.ts      # Genderize API integration and data processing
  app.module.ts       # Module definition
  main.ts             # App bootstrap with CORS
```