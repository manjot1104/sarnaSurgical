# Sarna Surgical

Premium surgical machine parts e-commerce website with full order management and admin panel.

## Quick Start

```bash
npm install
npm run dev
```

This starts both:
- **Frontend** → http://localhost:5173
- **Backend API** → http://localhost:3001

## Admin Panel

- URL: http://localhost:5173/admin
- Default password: `sarna2024` (change via `ADMIN_PASSWORD` env var)

## Order Flow

| Step | Who | Status |
|------|-----|--------|
| 1 | Customer places order | `placed` |
| 2 | Admin confirms (optional) | `confirmed` |
| 3 | Admin dispatches with tracking | `dispatched` |
| 4 | Customer confirms receipt | `received` → `completed` |

## Customer Features

- Browse machines by specialty (Neuro, ENT, Cardiac, etc.)
- Add parts to cart with quantity controls
- Place orders with shipping details
- Track orders at `/track` using order number + email
- View order history at `/my-orders`
- Confirm receipt when order is dispatched

## Admin Features

- Dashboard with revenue & order stats
- View/filter/search all orders
- Confirm, dispatch, or cancel orders
- Add courier name & tracking number on dispatch
- Full order timeline & customer details

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order |
| GET | `/api/orders/track/:orderNumber` | Track order |
| GET | `/api/orders/:id` | Get order by ID |
| PATCH | `/api/orders/:id/receive` | Customer confirms receipt |
| GET | `/api/orders` | List orders (admin) |
| PATCH | `/api/orders/:id/status` | Update status (admin) |
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/stats` | Dashboard stats |

## Production

```bash
npm run build
ADMIN_PASSWORD=your-secure-password npm start
```

Serve the `dist/` folder statically alongside the Express API for production deployment.
