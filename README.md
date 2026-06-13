# FinEdge Tracker API

Personal finance and expense tracker REST API built with Node.js, Express, TypeScript, and MongoDB.

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express 5
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT
- **Docs**: Swagger / OpenAPI 3.0
- **Testing**: Jest + Supertest + mongodb-memory-server

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas URI (or local MongoDB)

### Setup

```bash
npm install
```

Create a `.env` file in the root:

```env
PORT=3000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
```

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot-reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled app |
| `npm test` | Run test suite |

## API Reference

Interactive docs are available at `http://localhost:3000/api-docs` when the server is running.

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users` | Register a new user |
| POST | `/login` | Login and receive JWT |

### Transactions

| Method | Endpoint | Description |
|---|---|---|
| POST | `/transactions` | Create a transaction |
| GET | `/transactions` | Get all transactions |
| GET | `/transactions/:id` | Get transaction by ID |
| PATCH | `/transactions/:id` | Update a transaction |
| DELETE | `/transactions/:id` | Delete a transaction |

#### Transaction body

```json
{
  "type": "income" | "expense",
  "category": "string",
  "amount": 100.00,
  "date": "2024-01-15"
}
```

| GET | `/transactions/filter` | Filter by category and/or date range |
| GET | `/transactions/trends` | Monthly income, expense, and balance trends |

### Budget

| Method | Endpoint | Description |
|---|---|---|
| POST | `/budgets` | Create a monthly budget |
| GET | `/budgets` | Get all budgets |
| GET | `/budgets/:id` | Get a budget by ID |
| PATCH | `/budgets/:id` | Update a budget |
| DELETE | `/budgets/:id` | Delete a budget |

### Summary

| Method | Endpoint | Description |
|---|---|---|
| GET | `/summary` | Total income, expense, and balance |

## Running Tests

```bash
npm test
```

Tests use an in-memory MongoDB instance — no external database required.
