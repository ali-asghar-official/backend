# Backend (Express + Mongoose)

Quick setup and useful scripts for local development.

Prerequisites
- Node.js 18+ (or the version you use)
- MongoDB running locally or reachable via `MONGO_URI`

Environment
- Copy `.env.example` to `.env` and fill values (or set env vars in your shell)

Important env vars
- MONGO_URI - MongoDB connection string (defaults to `mongodb://127.0.0.1:27017/userInfo`)
- JWT_SECRET - secret used to sign/verify JWTs
- PORT - server port (default 5000)

Scripts
- npm run dev  # starts nodemon (development)
- npm start    # starts node (production)
- node scripts/listProducts.js  # quick diagnostics: prints product count + samples

Notes
- Product `category` field is a reference to `Category` (ObjectId). When adding products via the `/product/add` endpoint, the server attempts to resolve a category by title and store its ObjectId. If not found, it stores the provided value as-is to remain backwards compatible.
- Endpoints are mounted in two ways for backward compatibility:
  - `/product/*` and `/api/products/*`
  - `/category/*` and `/api/categories/*`
  - `/brand/*` and `/api/brands/*`
  - `/todo/*` and `/api/todos/*`
  - `/image/...` and `/api/files/...`

If something still returns empty, run `node scripts/listProducts.js` to verify the DB contents and connection.
