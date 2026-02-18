## Playset BD

Playset BD is a small online shop for kids toys.  
The project is built as:

- A **customer‑facing storefront** (`frontend/`) where visitors can browse products, view details, add to cart, and place cash‑on‑delivery orders.
- An **admin panel** (`admin/`) for managing products, customers, and orders.
- A **backend API** (`backend/`) that exposes REST endpoints for both the storefront and the admin app.

The goal is to keep the experience simple: browse builds, view photos and descriptions, and place an order with minimal friction.

---

## Features

- **Responsive storefront**
  - Home page with hero slider and curated sections for **New Arrivals** and **Featured Products**
  - Browse page with search, category filters, and “New / Featured” toggles
  - Product detail page with multiple images, optional videos, and rich Markdown descriptions
  - Cart and checkout flow with **Cash on Delivery** (COD)

- **Product browsing**
  - Filter products by category (Mini bricks, Lego, Puzzle, etc.)
  - Search by name or description
  - Highlight new and featured items

- **Shopping cart**
  - Add a product with selected quantity to cart
  - Adjust quantity from the cart (increment / decrement)
  - Remove items and clear the cart
  - Cart is stored on the client (local storage) so it survives page reloads

- **Checkout / Orders**
  - Simple checkout form (phone, name, address, optional email and notes)
  - Orders are submitted to the backend API with:
    - Customer snapshot
    - Product IDs, names, and quantities
    - Total price and order status
  - Admin can later manage and process these orders

- **Admin panel**
  - Login‑protected dashboard
  - Manage products: create, edit, delete, set stock, prices, category, and flags (new / featured)
  - View and manage customer list
  - View and update orders

---

## Project Structure

```text
playsetbd/
  admin/       # React admin dashboard (Vite)
  backend/     # Express API server, used by frontend and admin
  frontend/    # Customer‑facing storefront (Vite + React)
  README.md    # This file
```

### Frontend (`frontend/`)

Tech stack:

- React + Vite
- React Router for routing
- Tailwind‑style utility classes for layout and styling
- Framer Motion for small animations
- React Markdown + remark‑gfm for rich product descriptions

Key screens:

- `Home.jsx`
  - Hero slider with banner images
  - New Arrivals and Featured grids, powered by `/api/products` with appropriate filters
  - Testimonial section and footer with contact and social links

- `Browse.jsx`
  - Search by keyword
  - Category chips (Mini bricks, Lego, Puzzle, etc.)
  - “New” and “Featured” toggles
  - Uses the shared `ProductCard` component for each item

- `ProductDetail.jsx`
  - Resolves a product by ID from the URL
  - Shows main image and thumbnails; no cropping (images use `object-contain`)
  - Renders Markdown description (headings, lists, tables, links, code blocks)
  - Optional product videos
  - Quantity selector, “Buy now” (instant COD) and “Add to Cart” actions

- `Cart.jsx`
  - Shows items persisted in local storage (`utils/cart.js`)
  - Quantity controls per item
  - Displays total price
  - Checkout side panel for entering customer info and placing COD order

Shared components:

- `Navbar.jsx` – global navigation
- `HeroSlider.jsx` – homepage hero banner
- `ProductCard.jsx` – used in Home and Browse to render product tiles

### Admin (`admin/`)

- Separate Vite + React app for management.
- Typical flows:
  - Login with admin credentials.
  - CRUD operations on products (including images, pricing, stock, category, new/featured flags).
  - View paginated customers and orders.
  - Update order status.

### Backend (`backend/`)

- Node.js + Express server
- REST API endpoints under `/api/...` used by both `frontend` and `admin`
- Main concepts:
  - **Products** – name, prices (actual + offer), images, videos, category, flags (isNewProduct, isFeatured), stock
  - **Customers** – phone, name, address, optional extra info and email
  - **Orders** – associated customer snapshot, line items, quantity, total price, status
  - **Admins** – login credentials for admin panel

Authentication:

- Admin login via `/api/admin/login` returns a JWT.
- Protected admin routes use middleware to validate the JWT.

---

## Getting Started

### Prerequisites

- Node.js (LTS)
- npm

### Frontend (storefront)

```bash
cd frontend
npm install
npm run dev
```

This starts the storefront on the local Vite dev server (default: http://localhost:5173).

### Admin

```bash
cd admin
npm install
npm run dev
```

This starts the admin dashboard on its own Vite dev server (port is shown in the console).

### Backend API

```bash
cd backend
npm install
npm run dev
```

This starts the Express API server (default: http://localhost:3000, depending on your configuration).

The frontend apps expect the API to be reachable under `/api/...`. You can configure proxy settings in the Vite configs or adjust the API base URL in `frontend/src/api/client.js` and `admin/src/api/client.js`.

---

## Core API Concepts

> These are high‑level; see `backend/routes` for exact request/response formats.

- **Products**
  - `GET /api/products` – list products with search, category, and filter options
  - `GET /api/products/:id` – (implicit via frontend; backend resolves product by ID)
  - `POST /api/products` – create (admin only)
  - `PUT /api/products/:id` – update (admin only)
  - `DELETE /api/products/:id` – delete (admin only)

- **Customers**
  - `GET /api/customers` – list customers (admin only)
  - `GET /api/customers/by-phone/:phone` – find customer by phone

- **Orders**
  - `GET /api/orders` – list orders (admin only)
  - `POST /api/orders` – create a new order from the storefront or product detail page
  - `PUT /api/orders/:id` – update order (status, etc., admin only)
  - `DELETE /api/orders/:id` – delete order (admin only)

- **Admin**
  - `POST /api/admin/login` – login and receive JWT for admin panel

---

## Data Model Overview

- **Product**
  - `name` – product name
  - `imageUrls` – array of URLs for product images
  - `videoUrls` – (optional) array of URLs for product videos
  - `description` – Markdown text rendered on the product detail page
  - `actualPrice` / `offerPrice`
  - `stock` – available quantity
  - `category` – category label (e.g., Mini bricks, Lego, Puzzle)
  - `isNewProduct` – mark as “New”
  - `isFeatured` – mark as “Featured”

- **Customer**
  - `phone`, `name`, `address`
  - `additionalInfo`, `email` (optional)

- **Order**
  - `customer` – snapshot of customer data at order time
  - `productIds`, `productNames`, `quantities`
  - `priceTotal`
  - `status` – e.g., `ordered`, `ready_to_deliver`, `delivered`

- **Admin**
  - `username`
  - `passwordHash`

---

## Styling and UX Notes

- Layout uses utility classes (Tailwind‑style) directly in JSX.
- Product cards and images:
  - Grids on Home/Browse use fixed‑height cards to keep rows aligned.
  - Images are displayed with `object-contain` so the full picture is visible without cropping.
- Animations:
  - Framer Motion is used for subtle hover and modal transitions.

---

## Development Notes

- Linting:
  - Frontend/admin: `npm run lint` inside each app directory.
- Build:
  - Frontend/admin: `npm run build`.
- You can adapt the backend to different persistence (e.g., MongoDB, SQL, or a serverless DB) as long as the REST shape is preserved for the frontend.

---

## License

This project is currently private for Playset BD.  
If you plan to open‑source it later, you can add an explicit license here.
