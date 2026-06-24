# ShopNow - Full Stack E-Commerce Application

A complete MERN stack e-commerce application with product catalog, cart, checkout, order tracking, and full admin panel.

## Tech Stack
- **Frontend:** React 18 + Vite + React Router v6
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Atlas)
- **Auth:** JWT (JSON Web Tokens)
- **Styling:** Custom CSS with CSS Variables

## Features

### User
- Product catalog with search, filter by category, pagination
- Product detail page with reviews
- Add to cart, update quantity, remove items
- Checkout with shipping address & payment method selection
- Order history and order detail tracking
- User profile management

### Admin
- Dashboard with revenue, orders, users, low-stock alerts
- Full product CRUD (create, edit, delete, feature)
- Order management with status updates
- User management (delete, promote/demote admin)

---

## Local Setup

### 1. Clone / Extract the project
```bash
cd shopnow
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env
# Edit .env and add your MongoDB URI and JWT secret
npm install
```

### 3. Setup Frontend
```bash
cd ../frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm install
```

### 4. Seed the Database
```bash
cd ../backend
node seed.js
```
This creates:
- Admin: `admin@shopnow.com` / `admin123`
- User: `user@shopnow.com` / `user123`
- 8 sample products

### 5. Run Both Servers (in separate terminals)
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

App runs at: http://localhost:5173

---

## Deployment Guide

### Step 1 — MongoDB Atlas Setup
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Create free account
2. Create a new **free M0 cluster**
3. Under **Database Access** → Add user (username + password)
4. Under **Network Access** → Add IP `0.0.0.0/0` (allow all, for deployment)
5. Click **Connect** → **Drivers** → Copy the connection string
6. Replace `<password>` with your DB user's password in the string

### Step 2 — Deploy Backend on Render
1. Go to [render.com](https://render.com) → Sign in with GitHub
2. Push your project to GitHub first:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/shopnow.git
   git push -u origin main
   ```
3. On Render → **New** → **Web Service**
4. Connect your GitHub repo
5. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** Node
6. Add **Environment Variables:**
   ```
   MONGO_URI       = your_mongodb_atlas_connection_string
   JWT_SECRET      = any_random_long_string_here
   CLIENT_URL      = https://your-frontend.vercel.app
   NODE_ENV        = production
   PORT            = 5000
   ```
7. Click **Create Web Service** → Wait for deploy (~2 min)
8. Copy your Render URL: `https://shopnow-backend.onrender.com`

### Step 3 — Deploy Frontend on Vercel
1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. **New Project** → Import your repo
3. Settings:
   - **Root Directory:** `frontend`
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add **Environment Variable:**
   ```
   VITE_API_URL = https://shopnow-backend.onrender.com/api
   ```
5. Click **Deploy** → Wait ~1 min
6. Your app is live at `https://shopnow-xyz.vercel.app`

### Step 4 — Update CORS on Backend
After you have the Vercel URL, go back to Render → Environment Variables:
```
CLIENT_URL = https://your-actual-vercel-url.vercel.app
```
Render will auto-redeploy.

### Step 5 — Seed Production Database (Optional)
Run seed locally with your production MongoDB URI:
```bash
cd backend
MONGO_URI="your_atlas_uri" node seed.js
```

---

## API Endpoints Summary

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | - | Register user |
| POST | /api/auth/login | - | Login |
| GET | /api/auth/profile | User | Get profile |
| GET | /api/products | - | List products |
| GET | /api/products/:id | - | Product detail |
| POST | /api/products | Admin | Create product |
| PUT | /api/products/:id | Admin | Update product |
| DELETE | /api/products/:id | Admin | Delete product |
| GET | /api/cart | User | Get cart |
| POST | /api/cart/add | User | Add to cart |
| POST | /api/orders | User | Place order |
| GET | /api/orders/myorders | User | My orders |
| GET | /api/orders | Admin | All orders |
| PUT | /api/orders/:id/status | Admin | Update status |
| GET | /api/admin/dashboard | Admin | Dashboard stats |
| GET | /api/admin/users | Admin | All users |

---

## Project Structure
```
shopnow/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── cartController.js
│   │   └── adminController.js
│   ├── middleware/authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Cart.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── cartRoutes.js
│   │   └── adminRoutes.js
│   ├── seed.js
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── admin/AdminLayout.jsx
    │   │   ├── layout/Navbar.jsx + Footer.jsx
    │   │   └── products/ProductCard.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── pages/
    │   │   ├── admin/ (Dashboard, Products, Orders, Users, ProductForm)
    │   │   ├── Home.jsx
    │   │   ├── ProductsPage.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── CheckoutPage.jsx
    │   │   ├── OrdersPage.jsx
    │   │   ├── OrderDetail.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   └── RegisterPage.jsx
    │   ├── utils/api.js
    │   ├── App.jsx
    │   └── main.jsx
    └── vite.config.js
```
