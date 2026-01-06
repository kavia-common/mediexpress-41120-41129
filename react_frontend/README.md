# MedExpress (React Frontend)

A lightweight, client-side React app (no backend) for browsing medicines, managing a cart, and tracking an order with a mocked timeline.

## Theme

This UI follows the **Ocean Professional** theme:

- Primary: `#2563EB`
- Secondary/Success: `#F59E0B`
- Error: `#EF4444`
- Background: `#f9fafb`
- Surface: `#ffffff`
- Text: `#111827`

The theme is applied via CSS variables and component classes in:

- `src/App.css`

## Features

- Modern homepage with:
  - Top navigation bar (logo, search bar, Login, Cart)
  - Featured medicines section
- Product listing page with:
  - Search by name
  - Availability filter (All / In Stock / Limited / Out of Stock)
  - Grid of product cards (image, name, price, add-to-cart)
- Global cart drawer/sidebar:
  - Add / remove items
  - Update quantity
  - Subtotal calculation
- Order tracking page:
  - Input for order ID
  - Mocked status timeline: Placed → Packed → Out for Delivery → Delivered

## Routes

- `/` — Home
- `/products` — Products listing
- `/track` — Order tracking
- Cart is a drawer accessible from the **Cart** button in the navbar.

## Mock Data

Update products in:

- `src/data/medicines.js`

Each product uses:

- `id`, `name`, `description`, `imageUrl`, `price`, `availability`, `featured`

## Running

From `react_frontend/`:

```bash
npm start
```

Open http://localhost:3000

## Notes

- Environment variables exist in `.env` (CRA style `REACT_APP_*`), but the app does not require them for core UI.
- Login/Checkout are mocked with alerts only (no backend).
