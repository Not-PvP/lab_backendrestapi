# E-Commerce & Logistics Backend REST API

A Node.js/TypeScript backend REST API built with **Express**, **PostgreSQL**, and **node-postgres (`pg`)**.

This project was developed for the **Hands-On Activity: E-Commerce & Logistics Backend REST API**. It implements RESTful CRUD operations for customers, products, orders, order items, vendors, and supplies.

The project uses **raw, parameterized SQL queries** through `pool.query()` and does not use an ORM or query builder.

---

## Tech Stack

- **Language:** TypeScript
- **Server Framework:** Express
- **Database Driver:** node-postgres (`pg`)
- **Database:** PostgreSQL

---

## Features

- RESTful API endpoints
- Customer CRUD operations
- Product management and category filtering
- Order creation and deletion
- Order item management
- Vendor listing
- Supply and inventory management
- PostgreSQL database integration
- Parameterized SQL queries
- Basic HTTP error handling
- Foreign key and duplicate key error handling
- No ORM or query builder
- No multi-table JOIN queries

---

## Prerequisites

Before running the project, make sure you have:

- Node.js v18 or later
- npm
- PostgreSQL
- DBeaver or another PostgreSQL client
- Git

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Not-PvP/lab_backendrestapi.git
cd lab_backendrestapi
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

Create a PostgreSQL database (e.g. `ecommerce_logistics`), then run the setup script provided in the activity spec against it. This creates the following tables and seeds them with sample data:

- `customer`
- `orders`
- `product`
- `order_item`
- `vendor`
- `supplies`

You can run the script through `psql`, DBeaver, or any Postgres client — just make sure it executes as a full script (foreign keys mean tables must be created in order before data is inserted).

### 4. Configure environment variables

Create a `.env` file in the project root with the following:

```
PORT=3000
PGHOST=localhost
PGPORT=5432
PGUSER=your_postgres_username
PGPASSWORD=your_postgres_password
PGDATABASE=ecommerce_logistics
```

Replace the values with your local PostgreSQL credentials.

### 5. Run the server

```bash
npm run dev
```

The server starts on `http://localhost:3000` (or whichever `PORT` you set). All endpoints are prefixed with `/api/v1`.

You can verify it's running by visiting:

```
http://localhost:3000/api/v1/health
```

which should return `{"status":"ok"}`.

## Project Structure

```
src/
  db.ts                   # PostgreSQL connection pool (pg.Pool)
  server.ts                # Express app entry point, mounts all routers
  types.ts                 # TypeScript interfaces for each table
  routes/
    customers.ts            # /api/v1/customers
    products.ts              # /api/v1/products
    orders.ts                 # /api/v1/orders
    order_items.ts             # /api/v1/order-items
    vendors.ts                  # /api/v1/vendors
    supplies.ts                  # /api/v1/supplies
```

## API Endpoints

### Customers (`/api/v1/customers`)
| Method | Path | Description |
|---|---|---|
| GET | `/` | List all customers |
| GET | `/:id` | Get a single customer |
| POST | `/` | Create a customer |
| PUT | `/:id` | Update a customer's city/membership_level |
| DELETE | `/:id` | Delete a customer |

### Products (`/api/v1/products`)
| Method | Path | Description |
|---|---|---|
| GET | `/` | List all products (supports `?category=` filter) |
| GET | `/:id` | Get a single product |
| POST | `/` | Create a product |
| PATCH | `/:id/price` | Update a product's unit_price |

### Orders (`/api/v1/orders`)
| Method | Path | Description |
|---|---|---|
| GET | `/` | List all orders |
| GET | `/customer/:customerId` | List orders for a specific customer |
| POST | `/` | Create an order |
| DELETE | `/:id` | Delete an order |

### Order Items (`/api/v1/order-items`)
| Method | Path | Description |
|---|---|---|
| GET | `/:orderId` | List line items for a specific order |
| POST | `/` | Add a line item to an order |

### Vendors (`/api/v1/vendors`)
| Method | Path | Description |
|---|---|---|
| GET | `/` | List all vendors |

### Supplies (`/api/v1/supplies`)
| Method | Path | Description |
|---|---|---|
| GET | `/vendor/:vendorId` | List stock supplied by a specific vendor |
| PUT | `/:vendorId/:productId` | Update stock quantity for a vendor/product pair |

## Error Handling

Every route wraps its database call in a `try/catch` block and returns appropriate HTTP status codes:

- `400 Bad Request` — missing required fields, or a Postgres constraint violation (duplicate primary key `23505`, foreign key violation `23503`)
- `404 Not Found` — requested resource doesn't exist
- `500 Internal Server Error` — unexpected server/database failure

All queries use parameterized values (`$1`, `$2`, ...) to prevent SQL injection — no raw string interpolation is used anywhere in the codebase.

## Constraints

This project follows the requirements of the Hands-On Activity:

- No ORM is used.
- No query builder is used.
- All database operations use raw SQL.
- All user-provided values are passed using parameterized queries ($1, $2, etc.).
- No multi-table JOIN queries are used.
- Related data is retrieved using single-table queries and WHERE conditions.
- Database operations are handled using pg.Pool.
- Route handlers use try/catch blocks for database error handling.

## Repository

GitHub Repository:
https://github.com/Not-PvP/lab_backendrestapi

## Authors

- Mark Angelo L. Florencio
- Niño Kriebel C. Olmo