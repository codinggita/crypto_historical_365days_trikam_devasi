# 🪙 Crypto Market Analytics API

A production-ready **Node.js + Express + MongoDB** REST API for cryptocurrency market analytics.
Built as a Full Stack College Assignment (2026) by **Trikam Devasi**.

---

## 📖 API Documentation

Access the interactive API documentation at:
👉 **[Live API Documentation](https://trikamdevasi-s-team.docs.buildwithfern.com)**

---

## 📁 Folder Structure

```
crypto-analytics-api/
├── server.js               # Entry point
├── .env                    # Environment variables
├── .env.example            # Env variable template
├── package.json
├── config/
│   └── db.js               # MongoDB connection
├── models/
│   ├── Coin.js             # Crypto data schema
│   └── User.js             # User auth schema
├── controllers/
│   ├── coinController.js
│   ├── analyticsController.js
│   ├── statsController.js
│   ├── authController.js
│   └── adminController.js
├── services/
│   ├── coinService.js      # Business logic for coins
│   ├── analyticsService.js
│   ├── statsService.js
│   └── authService.js
├── routes/
│   ├── coinRoutes.js
│   ├── analyticsRoutes.js
│   ├── statsRoutes.js
│   ├── authRoutes.js
│   ├── jwtRoutes.js
│   ├── adminRoutes.js
│   ├── searchRoutes.js
│   ├── filterRoutes.js
│   └── middlewareRoutes.js
├── middlewares/
│   ├── auth.js             # JWT protect + adminOnly
│   ├── logger.js           # Request logging
│   ├── errorHandler.js     # Global error handler
│   ├── validate.js         # Input validation
│   └── rateLimiter.js      # Rate limiting
├── utils/
│   ├── apiResponse.js      # Standardized responses
│   ├── asyncHandler.js     # Async error wrapper
│   ├── pagination.js       # Reusable pagination
│   └── filterBuilder.js    # Dynamic filter builder
└── scripts/
    └── seed.js             # Database seeder
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/crypto-analytics-api.git
cd crypto-analytics-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/crypto_analytics
JWT_SECRET=your_super_secure_jwt_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
```

### 4. Seed the Database
```bash
npm run seed
```
> This imports all 33,364 records from the JSON dataset into MongoDB.

### 5. Start the Server
```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `jsonwebtoken` | JWT authentication |
| `bcryptjs` | Password hashing |
| `cors` | Cross-origin requests |
| `dotenv` | Environment variables |
| `express-rate-limit` | API rate limiting |
| `nodemon` | Dev auto-restart |

---

## 🗄️ Dataset

- **Source:** JSON dataset (33,364 records)
- **Coins:** 100 unique cryptocurrencies
- **Date Range:** 2024-12-04 → 2025-12-03
- **Months Covered:** 13 months

### Schema Fields

| Field | Type | Description |
|---|---|---|
| `coin_id` | String | Unique coin identifier (e.g. `bitcoin`) |
| `coin_name` | String | Display name (e.g. `Bitcoin`) |
| `symbol` | String | Trading symbol (e.g. `BTC`) |
| `market_cap_rank` | Number | Market cap ranking |
| `timestamp` | Date | Full datetime |
| `date` | String | `YYYY-MM-DD` format |
| `price` | Number | Price in USD |
| `market_cap` | Number | Market capitalization |
| `volume` | Number | 24h trading volume |
| `daily_return` | Number | Daily return % |
| `price_ma7` | Number | 7-day moving average |
| `price_ma30` | Number | 30-day moving average |
| `volatility_7d` | Number | 7-day volatility % |
| `cumulative_return` | Number | Cumulative return % |
| `month` | String | `YYYY-MM` format |

---

## 🔗 API Endpoints Overview

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication
All protected routes require:
```
Authorization: Bearer <your_jwt_token>
```

---

### 🔐 Auth Routes (`/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | ❌ | Register new user |
| POST | `/auth/login` | ❌ | Login user |
| POST | `/auth/logout` | ✅ | Logout user |
| GET | `/auth/profile` | ✅ | Get profile |
| PATCH | `/auth/profile` | ✅ | Update profile |
| DELETE | `/auth/profile` | ✅ | Delete profile |
| POST | `/auth/forgot-password` | ❌ | Request password reset |
| POST | `/auth/reset-password` | ❌ | Reset password |
| POST | `/auth/change-password` | ✅ | Change password |
| POST | `/auth/verify-email` | ✅ | Verify email |

---

### 🪙 Coin Routes (`/coins`)

#### Basic CRUD

| Method | Endpoint | Description |
|---|---|---|
| GET | `/coins` | Fetch all coins (paginated) |
| GET | `/coins/:id` | Fetch single coin by ID |
| POST | `/coins` | Add new coin record |
| PUT | `/coins/:id` | Replace coin record |
| PATCH | `/coins/:id` | Update specific fields |
| DELETE | `/coins/:id` | Soft delete coin record |
| GET | `/coins/exists/:id` | Check if coin exists |
| POST | `/coins/bulk-create` | Insert multiple coins |
| PATCH | `/coins/bulk-update` | Update multiple coins |
| DELETE | `/coins/bulk-delete` | Delete multiple coins |

#### Coin Information

| Method | Endpoint | Description |
|---|---|---|
| GET | `/coins/name/:coinName` | Fetch by coin name |
| GET | `/coins/symbol/:symbol` | Fetch by trading symbol |
| GET | `/coins/rank/:rank` | Fetch by market cap rank |
| GET | `/coins/month/:month` | Fetch records by month |
| GET | `/coins/date/:date` | Fetch records by date |
| GET | `/coins/latest` | Latest market records |
| GET | `/coins/history/:coinId` | Full coin history |
| GET | `/coins/top-market-cap` | Highest market cap coins |
| GET | `/coins/top-volume` | Top traded coins |
| GET | `/coins/top-gainers` | Top gaining coins |
| GET | `/coins/top-losers` | Top losing coins |
| GET | `/coins/trending` | Trending coins |

#### Analytics per Coin

| Method | Endpoint | Description |
|---|---|---|
| GET | `/coins/performance/:coinId` | Performance analytics |
| GET | `/coins/volatility/:coinId` | Volatility analytics |
| GET | `/coins/market-cap/:coinId` | Market cap details |
| GET | `/coins/volume/:coinId` | Volume details |
| GET | `/coins/returns/:coinId` | Returns analytics |
| GET | `/coins/price/:coinId` | Current price |
| GET | `/coins/compare/:coin1/:coin2` | Compare 2 coins |
| GET | `/coins/compare/:coin1/:coin2/:coin3` | Compare 3 coins |
| GET | `/coins/history/:coinId/:month` | Historical monthly data |

---

### 🔍 Query Parameters

```
GET /coins?page=1&limit=10          → Pagination
GET /coins?sort=price               → Sort by field
GET /coins?minPrice=100&maxPrice=500 → Price range filter
GET /coins?symbol=BTC               → Filter by symbol
GET /coins?month=2024-12            → Filter by month
GET /coins?month=2024-12&sort=price → Combine filter + sort
```

**Sortable fields:** `price`, `volume`, `marketCap`, `rank`, `dailyReturn`, `volatility`, `cumulativeReturn`, `timestamp`, `month`, `name`

---

### 📊 Analytics Routes (`/analytics`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/analytics/price/highest` | Highest priced coin |
| GET | `/analytics/price/lowest` | Lowest priced coin |
| GET | `/analytics/price/average` | Average market price |
| GET | `/analytics/price/history/:coinId` | Price history |
| GET | `/analytics/price/trend` | Market trend |
| GET | `/analytics/price/growth` | Price growth analysis |
| GET | `/analytics/price/drop` | Price drop analysis |
| GET | `/analytics/volume/highest` | Highest traded |
| GET | `/analytics/volume/lowest` | Lowest traded |
| GET | `/analytics/volume/average` | Average volume |
| GET | `/analytics/volume/spike` | Volume spikes |
| GET | `/analytics/returns/top` | Top return coins |
| GET | `/analytics/returns/negative` | Negative return coins |
| GET | `/analytics/returns/cumulative` | Cumulative returns |
| GET | `/analytics/volatility/high` | High volatility coins |

---

### 📈 Stats Routes (`/stats`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/stats/market-cap` | Total market cap |
| GET | `/stats/average-price` | Average price |
| GET | `/stats/average-volume` | Average volume |
| GET | `/stats/highest-market-cap` | Highest market cap coin |
| GET | `/stats/highest-volume` | Highest volume coin |
| GET | `/stats/top-gainers` | Top gainers |
| GET | `/stats/top-losers` | Top losers |
| GET | `/stats/monthly-analysis` | Monthly trends |
| GET | `/stats/coin-count` | Unique coin count |
| GET | `/stats/rank-distribution` | Rank distribution |
| GET | `/stats/price-distribution` | Price distribution |
| GET | `/stats/volatility-distribution` | Volatility distribution |
| GET | `/stats/market-summary` | Overall market summary |
| GET | `/stats/daily-analysis` | Daily analytics |
| GET | `/stats/yearly-analysis` | Yearly analytics |

---

### 🔎 Search Routes (`/search`)

```
GET /search/coins?q=bitcoin     → Search by name
GET /search/coins?q=btc         → Search by symbol
GET /search/coins?q=aave        → Search by coin_id
```

Supports pagination: `?q=bitcoin&page=1&limit=10`

---

### 🔧 Filter Routes (`/coins/filter`)

```
GET /coins/filter/high-price
GET /coins/filter/low-price
GET /coins/filter/high-volume
GET /coins/filter/low-volume
GET /coins/filter/high-market-cap
GET /coins/filter/low-market-cap
GET /coins/filter/high-volatility
GET /coins/filter/low-volatility
GET /coins/filter/high-return
GET /coins/filter/negative-return
GET /coins/filter/bullish
GET /coins/filter/bearish
GET /coins/filter/profitable
GET /coins/filter/loss-making
GET /coins/filter/missing-values
```

---

### 🔑 JWT Routes (`/jwt`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/jwt/profile` | ✅ | JWT protected profile |
| GET | `/jwt/dashboard` | ✅ | JWT protected dashboard |
| POST | `/jwt/generate-token` | ❌ | Generate JWT token |
| POST | `/jwt/verify-token` | ❌ | Verify JWT token |
| GET | `/jwt/admin` | ✅ Admin | Admin only route |
| GET | `/jwt/private-stats` | ✅ | Private analytics |
| POST | `/jwt/refresh-token` | ❌ | Refresh token |
| DELETE | `/jwt/revoke-token` | ✅ | Revoke token |

---

### 🛡️ Admin Routes (`/admin`)

> Requires JWT token + `admin` role

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/coins` | All coins (admin view) |
| GET | `/admin/stats` | Admin analytics dashboard |
| GET | `/admin/users` | All users list |

---

### 🚀 Advanced Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/coins/random` | Random coin record |
| GET | `/coins/recommendations` | Smart coin recommendations |
| GET | `/coins/market-status` | Bullish/Bearish status |
| GET | `/coins/performance/top-monthly` | Top monthly performers |
| GET | `/coins/performance/top-yearly` | Top yearly performers |
| GET | `/coins/alerts/high-volatility` | High volatility alerts |
| GET | `/coins/alerts/market-drop` | Market drop alerts |
| GET | `/coins/system/health` | API health check |
| GET | `/coins/system/version` | API version info |
| GET | `/coins/system/config` | Public config |

---

## 📋 API Response Format

All API responses follow a consistent structure:

**Success:**
```json
{
  "success": true,
  "message": "Coins fetched successfully",
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 33364,
    "totalPages": 3337,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Coin not found",
  "errors": ["Validation details if any"]
}
```

---

## 🔒 Authentication Flow

```
1. POST /auth/register  → Get accessToken + refreshToken
2. Use accessToken in Authorization header
3. POST /jwt/refresh-token → Get new tokens when expired
4. POST /auth/logout → Invalidate tokens
```

---

## 🏗️ Architecture

This project follows **MVC Architecture**:

```
Request → Router → Middleware → Controller → Service → Model → MongoDB
                                    ↓
                              Response (apiResponse utils)
```

- **Routes** — Define endpoints, attach middleware
- **Controllers** — Handle `req`/`res`, call services
- **Services** — Business logic, MongoDB queries
- **Models** — Mongoose schemas
- **Middlewares** — Auth, logging, validation, error handling, rate limiting
- **Utils** — Shared helpers (pagination, filters, responses)

---

## ⚡ Features Implemented

### Core (Mandatory)
- ✅ Full CRUD operations with bulk support
- ✅ MongoDB schema design with indexes
- ✅ Advanced querying (filter, sort, search, pagination)
- ✅ JWT authentication system
- ✅ Middleware system (auth, logger, error handler, validator)
- ✅ Aggregation pipelines (monthly, yearly, trend analysis)
- ✅ MVC architecture
- ✅ Global error handling
- ✅ CORS enabled
- ✅ Full dataset seeded into MongoDB

### Good to Have (Implemented)
- ✅ API Response Standardization
- ✅ Request Logging Middleware
- ✅ Centralized Async Error Handler (`asyncHandler`)
- ✅ Custom Data Validation Layer
- ✅ Soft Delete Feature (`isDeleted: true`)
- ✅ Timestamp Tracking (`createdAt`, `updatedAt`)
- ✅ Basic Rate Limiting
- ✅ Advanced Search using Regex
- ✅ Database Seeding Script
- ✅ Reusable Pagination Utility
- ✅ Dynamic Filter Builder
- ✅ Role-Based Access Control (admin/user)
- ✅ API Versioning (`/api/v1`)
- ✅ Health Check API
- ✅ Password Hashing with bcrypt
- ✅ JWT Token Expiry Handling
- ✅ Environment-based Configuration

---

## 🧪 Testing with Postman

1. Import the Postman collection (exported from project)
2. Set environment variable: `base_url = http://localhost:5000/api/v1`
3. Register a user → copy the `accessToken`
4. Set `Authorization: Bearer {{token}}` in collection headers
5. Run requests

### Quick Test Flow
```
POST /auth/register    → Register
POST /auth/login       → Login & get token
GET  /coins?page=1&limit=10  → Fetch coins
GET  /stats/market-summary   → Market overview
GET  /analytics/price/trend  → Price trends
```

---

## 🗃️ MongoDB Collections

| Collection | Documents | Description |
|---|---|---|
| `coins` | 33,364 | All cryptocurrency market records |
| `users` | Dynamic | Registered user accounts |

---

## 📊 Aggregation Pipelines Used

- Monthly market trend analysis
- Yearly performance aggregation
- Price growth/drop calculations
- Volume spike detection
- Rank distribution grouping
- Price & volatility distribution buckets
- Market summary (bullish/bearish count)
- Coin comparison across multiple metrics

---

## 🌐 CORS Configuration

```javascript
// Allows all origins in development
// Configure specific origins for production
app.use(cors());
```

---

## 🚦 Rate Limiting

| Route | Limit |
|---|---|
| General (`/coins`) | 100 req/min |
| Auth (`/auth/login`, `/auth/register`) | 10 req/15min |
| Admin routes | 20 req/min |
| Export routes | 5 req/min |

---

## 📅 Project Timeline

- **Backend Phase:** 13 May 2026 – 28 May 2026
- **Dataset:** 100 coins, 13 months, 33,364 records
- **Total Endpoints:** 100+ REST APIs

---

## 👨‍💻 Author

**Trikam Devasi**
Full Stack Developer | Swaminarayan University
GitHub: [@trikamdevasi](https://github.com/trikamdevasi)

---

## 📄 License

MIT License — Free to use for educational purposes.
