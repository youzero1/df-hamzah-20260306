# df — E-commerce Pricing & Discount Calculator

A fully functional calculator web app built with Next.js, TypeScript, TypeORM, and SQLite.

## Features

- **Basic Calculator**: Standard arithmetic operations
- **Tax Calculator**: Compute price with tax
- **Discount Calculator**: Apply percentage discounts
- **Margin Calculator**: Calculate profit margin percentage
- **Markup Calculator**: Compute selling price from cost + markup %
- **History Panel**: All calculations saved to SQLite, viewable in a side panel

## Running Locally

```bash
cd df
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Running with Docker

```bash
cd df
docker-compose up --build
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_PATH` | `./data/calculator.db` | Path to SQLite DB file |
| `NEXT_PUBLIC_APP_NAME` | `df` | App name |
| `TAX_RATE_DEFAULT` | `0.08` | Default tax rate (8%) |

## API Routes

| Method | Path | Description |
|---|---|---|
| GET | `/api/calculations` | Get calculation history |
| POST | `/api/calculations` | Save a calculation |
| DELETE | `/api/calculations` | Clear all history |
