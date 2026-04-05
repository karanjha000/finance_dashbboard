# Finance Backend API — Project Journey

## 1. Project Overview
A production-ready REST API backend for a finance dashboard system built as an assignment.

**Goals:**
- Build a secure backend with role-based access control
- Manage financial records with full CRUD operations
- Provide dashboard analytics APIs
- Demonstrate clean architecture and proper API design

**Scope:**
- User management with 3 roles (Admin, Analyst, Viewer)
- Financial transaction management
- Dashboard summary and analytics
- JWT-based authentication

---

## 2. Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Java | 17 | Core language |
| Spring Boot | 4.0.5 | Backend framework |
| Spring Security | Latest | Authentication & Authorization |
| Spring Data JPA | Latest | Database ORM |
| Hibernate | 7.2.7 | JPA implementation |
| MySQL | 5.5.5 | Database |
| JWT (jjwt) | 0.11.5 | Token-based auth |
| Lombok | Latest | Boilerplate reduction |
| Maven | 3.9.9 | Build tool |

---

## 3. Setup and Installation

### Prerequisites
- Java 17+
- Maven 3.9+
- MySQL (via XAMPP or standalone)
- Postman (for API testing)

### Steps
```bash
# 1. Clone the repository
git clone https://github.com/yourusername/finance-backend.git

# 2. Create the database
mysql -u root -p
CREATE DATABASE finance_db;

# 3. Configure application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/finance_db
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=9090

# 4. Run the application
mvn clean spring-boot:run

# 5. Skip tests during build if needed
mvn clean install -DskipTests
```

---

## 4. Architecture and Design

### Directory Structure
```
com.finance.backend/
├── controller/     # HTTP request handlers (API layer)
├── service/        # Business logic layer
├── repository/     # Database access layer
├── model/          # JPA entities (DB tables)
├── dto/            # Data Transfer Objects
├── security/       # JWT + Spring Security config
├── enums/          # Role, TransactionType
└── exception/      # Global error handling
```

### Data Flow
```
Request → JwtAuthenticationFilter → SecurityConfig
       → Controller → Service → Repository → Database
```

### Core Components

| Component | Responsibility |
|---|---|
| JwtUtil | Generate and validate JWT tokens |
| JwtAuthenticationFilter | Intercept requests and validate tokens |
| SecurityConfig | Define route permissions |
| GlobalExceptionHandler | Catch and format all errors |
| DashboardService | Aggregate financial analytics |

### Database Schema
```
users
  - id, username, password, email, role, active, createdAt

transactions
  - id, amount, type, category, date, notes, created_by (FK), createdAt
```

---

## 5. Milestones and Timeline

| Phase | What was built |
|---|---|
| Day 1 | Project setup, models, repositories, DTOs, security |
| Day 2 | Services, controllers, exception handler |
| Day 3 | Testing, bug fixes, documentation |

### Key Design Decisions
- Used **JWT** over sessions for stateless, scalable auth
- Used **DTOs** to separate API layer from DB layer
- Used **@PreAuthorize** for method-level role enforcement
- Used **BigDecimal** instead of double for financial amounts
- Used **layered architecture** for clean separation of concerns

---

## 6. Key Challenges and Errors

### Error 1: MySQL8Dialect not found
```
Unable to resolve name [org.hibernate.dialect.MySQL8Dialect]
```
**Cause:** Hibernate 6+ removed MySQL8Dialect
**Fix:** Removed the dialect property from application.properties — Hibernate auto-detects it now

---

### Error 2: JWT curly quotes
```
';' expected at line 14
```
**Cause:** Copy-pasting introduced smart quotes " " instead of straight quotes " "
**Fix:** Manually retyped the SECRET string in JwtUtil.java

---

### Error 3: Lombok not working
```
Cannot resolve symbol 'Data'
```
**Cause:** Annotation processing was disabled in IntelliJ
**Fix:** Enabled annotation processing in Settings → Build → Compiler → Annotation Processors

---

### Error 4: MySQL Communications Failure
```
Communications link failure
```
**Cause:** MySQL server was not running
**Fix:** Started MySQL from XAMPP Control Panel

---

### Error 5: Ambiguous mapping
```
Cannot map 'userController' method deleteUser to {GET [/api/users/{id}]}
```
**Cause:** deleteUser had @GetMapping instead of @DeleteMapping
**Fix:** Changed annotation to @DeleteMapping

---

### Error 6: Invalid mapping pattern
```
Invalid mapping pattern: /{id/role}
```
**Cause:** Missing closing } — written as /{id/role} instead of /{id}/role
**Fix:** Corrected to @PutMapping("/{id}/role")

---

### Error 7: Password exposed in response
**Cause:** getRecentTransactions() returned raw Transaction entities with full User object
**Fix:** Mapped to TransactionResponse DTO before returning — never expose raw entities!

---

### Error 8: Data truncated for role column
```
Data truncated for column 'role'
```
**Cause:** MySQL column was created before VIEWER was added to enum
**Fix:** Ran ALTER TABLE users MODIFY COLUMN role VARCHAR(20);

---

### Error 9: Property typo
```
No property 'cratedById' found for type 'Transaction'
```
**Cause:** Typo in repository method — cratedById instead of createdById
**Fix:** Corrected method name in TransactionRepository

---

## 7. Solutions and Lessons Learned

| Lesson | Detail |
|---|---|
| Always use DTOs | Never expose entities directly — passwords can leak! |
| BigDecimal for money | double has precision issues — 0.1 + 0.2 ≠ 0.3 |
| Skip tests during dev | Use -DskipTests when DB isn't configured for tests |
| Force recompile | Use mvn clean compile spring-boot:run if changes aren't picked up |
| Smart quotes break Java | Always type secret strings manually, don't copy-paste |
| Enum values are strict | MySQL column must support all enum values — use VARCHAR |
| Method naming matters | Spring Data JPA generates SQL from method names — typos cause errors |

---

## 8. Build and Run Instructions

```bash
# Development
mvn clean spring-boot:run

# Build without tests
mvn clean install -DskipTests

# Force recompile and run
mvn clean compile spring-boot:run

# Run tests (requires MySQL running)
mvn test
```

---

## 9. Testing Strategy

All APIs tested manually via Postman.

### Test Cases

| Test | Method | URL | Expected |
|---|---|---|---|
| Register user | POST | /api/auth/register | 200 OK |
| Login | POST | /api/auth/login | 200 + JWT token |
| Create transaction | POST | /api/transactions | 200 OK |
| Get all transactions | GET | /api/transactions | 200 + list |
| Filter by type | GET | /api/transactions/filter/type?type=INCOME | 200 + filtered list |
| Filter by category | GET | /api/transactions/filter/category?category=Salary | 200 + filtered list |
| Filter by date | GET | /api/transactions/filter/date?start=&end= | 200 + filtered list |
| Dashboard summary | GET | /api/dashboard/summary | 200 + analytics |
| Toggle user status | PUT | /api/users/1/toggle-status | 200 OK |
| RBAC — Viewer blocked | POST | /api/transactions (viewer token) | 400 Access Denied |

### Access Control Verification
- ✅ VIEWER cannot create/update/delete transactions
- ✅ VIEWER cannot access user management
- ✅ ADMIN has full access
- ✅ Unauthenticated requests are rejected

---

## 10. Known Issues and Future Work

### Known Issues
- Tests in FinanceBackendApplicationTests fail without a live DB connection
- Token expiry is 24 hours — no refresh token mechanism yet

### Future Improvements
- Add refresh token support
- Add pagination for transaction lists
- Add Swagger/OpenAPI documentation
- Write unit tests with MockMvc
- Add Docker support
- Deploy to cloud (Railway/Render)

---

## 11. Documentation and Onboarding Notes

### Adding New Features
1. Add model in `model/`
2. Add repository in `repository/`
3. Add DTOs in `dto/`
4. Add service in `service/`
5. Add controller in `controller/`
6. Add role check with `@PreAuthorize`

### Adding New Roles
1. Add to `Role.java` enum
2. Run `ALTER TABLE users MODIFY COLUMN role VARCHAR(20);` in MySQL
3. Update `@PreAuthorize` annotations in controllers
4. Update `SecurityConfig` if needed

### Environment Variables to Change
- `spring.datasource.password` — your MySQL password
- `server.port` — default is 9090
- `JwtUtil.SECRET` — change for production!
- `JwtUtil.EXPIRATION` — token validity in ms
