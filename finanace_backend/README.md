# Finance Backend API

A production-ready backend system for a finance dashboard built with Java Spring Boot.

## Tech Stack
- Java 17
- Spring Boot
- Spring Security + JWT
- Spring Data JPA
- MySQL
- Lombok
- Maven

## Features
- JWT Authentication
- Role Based Access Control (Admin, Analyst, Viewer)
- Financial Records Management (CRUD)
- Dashboard Summary APIs
- Input Validation & Error Handling

## Roles & Permissions

| Action | Admin | Analyst | Viewer |
|---|---|---|---|
| Register/Login | ✅ | ✅ | ✅ |
| View transactions | ✅ | ✅ | ✅ |
| Create/Update transactions | ✅ | ✅ | ❌ |
| Delete transactions | ✅ | ❌ | ❌ |
| View dashboard | ✅ | ✅ | ✅ |
| Manage users | ✅ | ❌ | ❌ |

## Setup

1. Clone the repository
2. Create MySQL database: `CREATE DATABASE finance_db;`
3. Update `application.properties` with your MySQL credentials
4. Run: `mvn spring-boot:run`
5. API runs on `http://localhost:9090`

## API Endpoints

### Auth
| Method | URL | Description |
|---|---|---|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login and get JWT token |

### Transactions
| Method | URL | Description |
|---|---|---|
| POST | /api/transactions | Create transaction |
| GET | /api/transactions | Get all transactions |
| GET | /api/transactions/{id} | Get by ID |
| PUT | /api/transactions/{id} | Update transaction |
| DELETE | /api/transactions/{id} | Delete transaction |
| GET | /api/transactions/filter/type?type= | Filter by type |
| GET | /api/transactions/filter/category?category= | Filter by category |
| GET | /api/transactions/filter/date?start=&end= | Filter by date range |

### Dashboard
| Method | URL | Description |
|---|---|---|
| GET | /api/dashboard/summary | Full summary |
| GET | /api/dashboard/income | Total income |
| GET | /api/dashboard/expenses | Total expenses |
| GET | /api/dashboard/balance | Net balance |
| GET | /api/dashboard/trends/monthly | Monthly trends |
| GET | /api/dashboard/trends/category | Category wise totals |

### Users (Admin only)
| Method | URL | Description |
|---|---|---|
| GET | /api/users | Get all users |
| GET | /api/users/{id} | Get user by ID |
| PUT | /api/users/{id}/role | Update user role |
| PUT | /api/users/{id}/toggle-status | Toggle active status |
| DELETE | /api/users/{id} | Delete user |

## Assumptions
- All protected routes require Bearer JWT token in Authorization header
- Admin role has full access
- Analyst can view and create/update but not delete
- Viewer has read-only access
- Passwords are encrypted using BCrypt