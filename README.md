# Finance — Finance Dashboard

A full-stack finance dashboard application with role-based access control, built with **React** (frontend) and **Java Spring Boot** (backend).

---

## Live Demo

It is not an Mobile Responsive URL right now
> Live Website URL: `https://finance-frontend-zeta-umber.vercel.app` 

## Local Machine URL
> Backend API: `http://localhost:9090`
> Frontend App: `http://localhost:5173`
> Swagger Docs: `http://localhost:9090/swagger-ui/index.html`

---

## Project Overview

FinanceOS is a production-ready finance management system that allows different users to interact with financial records based on their role. It features JWT authentication, role-based access control, financial records management, and dashboard analytics.

---

## Repository Structure

```
finanace_dashboard/
├── finanace_backend/          # Spring Boot REST API
│   ├── src/
│   ├── pom.xml
├── finance-frontend/         # React Frontend
│   ├── src/
│   ├── package.json
│   └── README.md
└── README.md                  # This file
```

---

## Tech Stack

### Backend
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.5-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![JWT](https://img.shields.io/badge/JWT-Auth-purple)

### Frontend
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Vite](https://img.shields.io/badge/Vite-6.0.5-yellow)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.17-cyan)
![Recharts](https://img.shields.io/badge/Recharts-2.15.0-red)

---

## Features

### Authentication & Security
- JWT token-based authentication
- Role-based access control (ADMIN, ANALYST, VIEWER)
- BCrypt password encryption
- Stateless API design

### Financial Records
- Full CRUD operations on transactions
- Income and Expense tracking
- Soft delete (data never permanently lost)
- Filter by type, category, and date range
- Pagination support

### Dashboard Analytics
- Total income, expenses, net balance
- Monthly trends chart
- Category-wise breakdown
- Recent transactions

### User Management (Admin)
- Create and manage users
- Assign roles
- Toggle user active/inactive status

---

## Role Permissions

| Feature | VIEWER | ANALYST | ADMIN |
|---|---|---|---|
| View Dashboard | ✅ | ✅ | ✅ |
| View Transactions | ✅ | ✅ | ✅ |
| Create/Update Transactions | ❌ | ✅ | ✅ |
| Delete Transactions | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |

---

## Quick Start

### 1. Start the Backend

```bash
# Navigate to backend
cd finanace_backend

# Create MySQL database
mysql -u root -p -e "CREATE DATABASE finance_db;"

# Configure environment
# Create .env file with your DB credentials

# Run
mvn clean spring-boot:run
```

Backend runs on `http://localhost:9090`

### 2. Start the Frontend

```bash
# Navigate to frontend
cd finance-dashboard

# Install dependencies
npm install

# Configure environment
# Create .env file with VITE_API_BASE_URL=http://localhost:9090

# Run
npm run dev
```

Frontend runs on `http://localhost:5173`

### 3. Login

| Role | Username | Password |
|---|---|---|
| Admin | admin1 | admin123 |
| Viewer | viewer1 | viewer123 |

---

## API Documentation

Swagger UI is available at:
```
http://localhost:9090/swagger-ui/index.html
```

Key endpoints:

```
POST   /api/auth/register        Register new user
POST   /api/auth/login           Login and get JWT

GET    /api/transactions         Get all transactions (paginated)
POST   /api/transactions         Create transaction
PUT    /api/transactions/{id}    Update transaction
DELETE /api/transactions/{id}    Soft delete transaction

GET    /api/dashboard/summary    Full dashboard summary
GET    /api/dashboard/income     Total income
GET    /api/dashboard/expenses   Total expenses
GET    /api/dashboard/balance    Net balance

GET    /api/users                Get all users (Admin)
PUT    /api/users/{id}/role      Update user role (Admin)
```

---

### Dashboard
- Overview cards showing total income, expenses, and net balance
- Monthly trends area chart
- Category breakdown pie chart
- Recent transactions table

### Transactions
- Paginated transactions table
- Filter by type, category, and date range
- Add/Edit/Delete transactions based on role

### Users (Admin)
- User management table
- Role assignment
- Status toggle

---

## Environment Setup

### Backend `.env`
```
DB_URL=jdbc:mysql://localhost:3306/finance_db
DB_USERNAME=root
DB_PASSWORD=your_password
SERVER_PORT=9090
JWT_SECRET=your_secret_key_32_chars_minimum
JWT_EXPIRATION=86400000
```

### Frontend `.env`
```
VITE_API_BASE_URL=http://localhost:9090
VITE_APP_NAME=FinanceOS
VITE_TOKEN_KEY=fin_token
VITE_USERNAME_KEY=fin_username
VITE_ROLE_KEY=fin_role
```

> ⚠️ Both `.env` files are in `.gitignore` and never committed to GitHub

---

## Author

**Karan Jha**
- GitHub: [karanjha000](https://github.com/karanjha000)
- Email: karanjhax12@gmail.com
- LinkedIn: [Karan Jha](https://linkedin.com/in/karan-jha-k99999)

---

## License

This project is built for educational and assignment purposes.