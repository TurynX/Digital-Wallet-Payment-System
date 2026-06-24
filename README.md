## 🗺️ API Endpoints

### Authentication

- `POST /auth/register` - Registers a new user and automatically creates an empty wallet (`balance: 0`).
- `POST /auth/login` - Validates credentials and returns a JWT `accessToken`.

### Wallet

- `GET /wallets/me` - Retrieves the authenticated user's current wallet balance (in cents) and currency.

### Transfers

- `POST /transfers` - Safely transfers funds between wallets using ACID transactions and idempotency checks.
- `GET /transfers/history` - Fetches the complete paginated statement (including `COMPLETED` and `FAILED` transactions).

---

## 🛠️ Tech Stack

- **Framework:** [NestJS](https://nestjs.com/) (TypeScript)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://prisma.io/)
- **Validation:** `class-validator` & `class-transformer`
- **Testing:** Jest (Unit & E2E)

---

## ⚙️ How to Run the Project

### 1. Clone the repository

```bash
git clone [https://github.com/Turynx/digital-wallet-api.git](https://github.com/your-username/digital-wallet-api.git)
cd digital-wallet-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Environment Variables

Create a .env file in the root directory and configure your PostgreSQL database connection:

```bash
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
JWT_SECRET="super-secret-key-change-this-in-production"
```

### 4. Run Database Migrations

Generate and apply Prisma migrations to set up your database schema:

```bash
npx prisma migrate dev --name init
```

### 5. Start the Application

```bash
# development mode
npm run start:dev

# production mode

npm run start:prod

🧪 Testing Idempotency in Insomnia/Postman

To test the network failure protection and duplicate charge prevention:

Create a POST /transfers request.

In the Headers tab, add:

Key: X-Idempotency-Key

Value: any-unique-uuid-string-123

Click Send. The transaction will process normally (201 Created).

Click Send again immediately without changing the header value.

The API will intercept the request, prevent a second charge from happening.
```
