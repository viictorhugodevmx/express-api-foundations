# Express API Foundations

REST API built with Node.js, Express and TypeScript.

This project demonstrates the core foundations of a professional Express API:

- Health check endpoint
- Products CRUD
- Query filters
- Pagination
- Sorting
- Product statistics endpoint
- Centralized error handling
- Not found middleware
- Controllers
- Services
- Validators
- Shared HTTP parsers
- Manual smoke test script

## Tech Stack

- Node.js
- Express
- TypeScript
- Helmet
- CORS
- Morgan
- ts-node-dev

## Project Structure

```txt
src
├── app.ts
├── server.ts
├── modules
│   └── products
│       ├── product.controller.ts
│       ├── product.data.ts
│       ├── product.routes.ts
│       ├── product.service.ts
│       ├── product.types.ts
│       └── product.validators.ts
└── shared
    ├── errors
    │   └── app-error.ts
    ├── http
    │   └── request-parsers.ts
    ├── middlewares
    │   ├── error.middleware.ts
    │   └── not-found.middleware.ts
    └── utils
        └── async-handler.ts
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

The API runs on:

```txt
http://localhost:3001
```

Build project:

```bash
npm run build
```

Run production build:

```bash
npm start
```

Run smoke test:

```bash
npm run smoke:test
```

## Available Scripts

```bash
npm run dev
```

Starts the API in development mode with reload.

```bash
npm run build
```

Compiles TypeScript into `dist`.

```bash
npm start
```

Runs the compiled API from `dist`.

```bash
npm run smoke:test
```

Runs a manual smoke test against the local API.

## API Endpoints

### Health

```http
GET /api/health
```

Example:

```bash
curl -s http://localhost:3001/api/health | jq
```

Response:

```json
{
  "status": "ok",
  "app": "express-api-foundations",
  "timestamp": "2026-01-01T10:00:00.000Z"
}
```

## Products

### List products

```http
GET /api/products
```

Example:

```bash
curl -s http://localhost:3001/api/products | jq
```

Response includes:

```txt
total
page
limit
totalPages
hasNextPage
hasPreviousPage
sortBy
direction
items
filters
```

### List products with filters

```http
GET /api/products?category=accessories&active=true
```

Example:

```bash
curl -s "http://localhost:3001/api/products?category=accessories&active=true" | jq
```

Supported filters:

```txt
category
active
```

`active` only accepts:

```txt
true
false
```

### List products with pagination

```http
GET /api/products?page=1&limit=2
```

Example:

```bash
curl -s "http://localhost:3001/api/products?page=1&limit=2" | jq
```

### List products with sorting

```http
GET /api/products?sortBy=price&direction=desc
```

Example:

```bash
curl -s "http://localhost:3001/api/products?sortBy=price&direction=desc" | jq
```

Supported `sortBy` values:

```txt
name
category
price
stock
createdAt
```

Supported `direction` values:

```txt
asc
desc
```

### Combined query example

```http
GET /api/products?category=accessories&page=1&limit=1&sortBy=price&direction=desc
```

Example:

```bash
curl -s "http://localhost:3001/api/products?category=accessories&page=1&limit=1&sortBy=price&direction=desc" | jq
```

### Get product by id

```http
GET /api/products/:id
```

Example:

```bash
curl -s http://localhost:3001/api/products/prod_001 | jq
```

### Create product

```http
POST /api/products
```

Example:

```bash
curl -s -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Stand",
    "category": "accessories",
    "price": 899,
    "stock": 15
  }' | jq
```

Required body:

```json
{
  "name": "Laptop Stand",
  "category": "accessories",
  "price": 899,
  "stock": 15
}
```

### Update product

```http
PATCH /api/products/:id
```

Example:

```bash
curl -s -X PATCH http://localhost:3001/api/products/prod_001 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mechanical Keyboard Pro",
    "price": 1499,
    "stock": 10
  }' | jq
```

Accepted body fields:

```json
{
  "name": "Mechanical Keyboard Pro",
  "category": "accessories",
  "price": 1499,
  "stock": 10,
  "active": false
}
```

All fields are optional, but at least one field is required.

### Delete product

```http
DELETE /api/products/:id
```

Example:

```bash
curl -s -X DELETE http://localhost:3001/api/products/prod_003 | jq
```

### Product stats summary

```http
GET /api/products/stats/summary
```

Example:

```bash
curl -s http://localhost:3001/api/products/stats/summary | jq
```

Response includes:

```txt
totalProducts
activeProducts
inactiveProducts
totalStock
totalInventoryValue
categories
```

## Error Examples

### Product not found

```bash
curl -s http://localhost:3001/api/products/prod_999 | jq
```

Response:

```json
{
  "message": "Product not found"
}
```

### Invalid sortBy

```bash
curl -s "http://localhost:3001/api/products?sortBy=rating" | jq
```

Response:

```json
{
  "message": "Invalid sortBy. Use: name, category, price, stock or createdAt"
}
```

### Invalid route

```bash
curl -s http://localhost:3001/api/no-existe | jq
```

Response:

```json
{
  "message": "Route not found",
  "path": "/api/no-existe"
}
```

## Architecture Notes

The project follows a simple modular structure:

```txt
routes      -> URL definitions and HTTP verbs
controller  -> request parsing and response handling
validators  -> module-specific request validation
service     -> business logic
data        -> in-memory data source
types       -> TypeScript contracts
shared      -> reusable infrastructure
```

## Current Data Source

This API currently uses in-memory data from:

```txt
src/modules/products/product.data.ts
```

Data resets every time the server restarts.

## Smoke Test

Run the API first:

```bash
npm run dev
```

Then, in another terminal:

```bash
npm run smoke:test
```

The smoke test validates:

- Health check
- Products list
- Filters, pagination and sorting
- Stats summary
- Get by id
- Create product
- Patch product
- Delete product
- Not found route
- Validation error

## Status

Express API foundations completed as a clean TypeScript backend base.
