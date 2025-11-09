# JWT Authentication API 🔐

A secure authentication system with access and refresh token implementation using Node.js, Express, TypeScript, and PostgreSQL.

**🌐 Live Demo:** [https://jwt-auth-system-hoqs.onrender.com](https://jwt-auth-system-hoqs.onrender.com)

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

## ✨ Features

- 🔒 Secure password hashing with bcrypt
- 🎫 Access token (15 min) + Refresh token (7 days)
- 🍪 Cookie-based authentication (httpOnly, secure)
- 🛡️ Protected routes with middleware
- 📝 TypeScript for type safety
- 🗄️ PostgreSQL with Prisma ORM

## 🚀 Tech Stack

- Node.js, Express.js, TypeScript
- PostgreSQL, Prisma ORM
- JWT, bcrypt, cookie-parser

## 📋 Prerequisites

- Node.js (v16+)
- PostgreSQL

## ⚙️ Installation

1. Clone the repository
```bash
git clone https://github.com/dvlprkaushik/jwt-auth-system
cd jwt-auth-system
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```env
# 🌐 SERVER CONFIG
PORT=3000
NODE_ENV=development

# 🧩 DATABASE (PostgreSQL)
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/jwt_auth_db?sslmode=require"

# 🔐 JWT SECRETS
ACCESS_SECRET="your-access-token-secret-min-32-chars"
REFRESH_SECRET="your-refresh-token-secret-min-32-chars"
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# 🧂 BCRYPT CONFIG
BCRYPT_SALT_ROUNDS=Number_of_salt_rounds (e.g., 10)

# 🧭 BASE URL
BASE_URL=http://localhost:3000

```

4. Setup database
```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Run the server
```bash
npm run dev
```

Server runs on `http://localhost:3000`

## 📚 API Endpoints

### Health Check

**Server Status**
```http
GET /

Response:
{
  "success": true,
  "message": "Server is running 🚀"
}
```

**Server Info**
```http
GET /info

Response:
{
  "name": "jwt-auth-api",
  "version": "1.0.0",
  "description": "JWT Authentication API with access and refresh tokens",
  "author": "Kaushik Das"
}
```

### Public Routes

**Register User**
```http
POST /api/v1/auth/register
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Login**
```http
POST /api/v1/auth/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Refresh Access Token**
```http
POST /api/v1/auth/refresh

Response:
{
  "success": true,
  "message": "Access token refreshed"
}
```

### Protected Routes

**Get Profile**
```http
GET /api/v1/auth/profile

Response:
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-11-09T10:30:00.000Z"
  }
}
```

**Logout**
```http
POST /api/v1/auth/logout

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

## 🗂️ Project Structure
```
jwt-auth-api/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   │   └── auth.controller.ts
│   ├── db/
│   │   └── (database files)
│   ├── env/
│   │   └── env.ts
│   ├── middleware/
│   │   └── auth.middleware.ts
│   ├── routes/
│   │   └── v1/
│   │       ├── auth.routes.ts
│   │       └── index.routes.ts
│   ├── types/
│   │   ├── env.d.ts
│   │   └── express.d.ts
│   └── index.ts
├── .env
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

## 🔑 Authentication Flow
```
1. Register → Password hashed with bcrypt
2. Login → Get access token (15m) + refresh token (7d)
3. Access protected routes → Uses access token
4. Token expires → Call /refresh for new access token
5. Logout → Tokens cleared
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT tokens with expiration
- HttpOnly cookies (XSS protection)
- Secure flag for production
- SameSite strict (CSRF protection)
- Refresh tokens stored in database

## 📦 Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production build
npm run migrate  # Run Prisma migrations
```

## 🧪 Testing

Use Postman or any API client:
1. Register a new user
2. Login (cookies set automatically)
3. Access protected routes
4. Test token refresh
5. Logout

## 📄 License

MIT

## 👤 Author

**Kaushik Das**

---

⭐ If you found this helpful, please give it a star!
