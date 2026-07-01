## Live Demo
- **Frontend:** https://shopnow-navy.vercel.app
- **Backend API:** https://shopnow-0nag.onrender.com


# ShopNow - Full Stack E-Commerce Application

A complete MERN stack e-commerce application with product catalog, cart, checkout, order tracking, and full admin panel.


## 📸 Screenshots

### Home Page
![Home](screenshots/home.png)

### Products
![Products](screenshots/products.png)

### Admin Dashboard
![Admin](screenshots/admin.png)


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

 
## 🚀 Local Setup
 
### 1. Clone the repository
```bash
git clone https://github.com/Shubham5533/shopnow.git
cd shopnow
```
 
### 2. Setup Backend
```bash
cd backend
cp .env.example .env
# Add your MongoDB URI and JWT secret in .env
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
### 5. Run Both Servers
```bash
# Terminal 1 - Backend
cd backend && npm run dev
 
# Terminal 2 - Frontend
cd frontend && npm run dev
```
 
App runs at: http://localhost:5173
 
---
 
## 🔑 Demo Credentials
 
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shopnow.com | admin123 |
| User | user@shopnow.com | user123 |
 
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

 
## 👨‍💻 Author
 
**Shubham**
- GitHub: [@Shubham5533](https://github.com/Shubham5533)
- Live: [shopnow-navy.vercel.app](https://shopnow-navy.vercel.app)
