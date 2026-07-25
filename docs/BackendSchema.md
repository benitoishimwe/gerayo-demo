# Gerayo – Backend Schema (for future integration)

## 5.1 Database Entities (PostgreSQL/MySQL)

### Users

| Field          | Type          | Description     |
| -------------- | ------------- | --------------- |
| id             | UUID          | Primary key     |
| name           | string        | Full name       |
| email          | string        | Unique          |
| phone          | string        | Unique          |
| password_hash  | string        | bcrypt          |
| wallet_balance | decimal(10,2) | Current balance |
| created_at     | timestamp     |                 |

### Agencies

| Field    | Type    | Description            |
| -------- | ------- | ---------------------- |
| id       | UUID    | Primary key            |
| name     | string  | Agency name            |
| logo_url | string  | URL to logo image      |
| color    | string  | Hex color for branding |
| active   | boolean |                        |

### Buses

| Field        | Type    | Description                        |
| ------------ | ------- | ---------------------------------- |
| id           | UUID    | Primary key                        |
| agency_id    | UUID    | Foreign key to agencies            |
| bus_type     | string  | e.g., coaster_30, hyundai_45       |
| plate_number | string  |                                    |
| seat_count   | integer | Total seats                        |
| seat_map     | json    | Rows, cols, layout, VIP seats etc. |

### Routes

| Field          | Type             | Description                |
| -------------- | ---------------- | -------------------------- |
| id             | UUID             | Primary key                |
| origin         | string           | City name                  |
| destination    | string           | City name                  |
| departure_time | time             | HH:mm                      |
| duration       | interval         | Travel time                |
| base_price     | decimal(10,2)    | Price in RWF               |
| bus_id         | UUID             | Foreign key to buses       |
| active         | boolean          |                            |
| stops          | array of strings | List of intermediate stops |

### Schedules (real‑time trips)

| Field           | Type    | Description                        |
| --------------- | ------- | ---------------------------------- |
| id              | UUID    | Primary key                        |
| route_id        | UUID    | Foreign key to routes              |
| date            | date    | Specific date                      |
| available_seats | integer | Current available seats (computed) |
| cancelled       | boolean |                                    |

### Bookings

| Field             | Type              | Description                             |
| ----------------- | ----------------- | --------------------------------------- |
| id                | UUID              | Primary key                             |
| user_id           | UUID              | Foreign key to users                    |
| schedule_id       | UUID              | Foreign key to schedules                |
| seats             | array of integers | Selected seat numbers                   |
| total_price       | decimal(10,2)     |                                         |
| status            | enum              | pending, paid, cancelled, expired       |
| payment_method    | enum              | wallet, momo, airtel, card              |
| payment_reference | string            | Transaction ID from provider            |
| created_at        | timestamp         |                                         |
| expires_at        | timestamp         | Seat hold expiry (5 min after creation) |

### Tickets (can be derived from bookings)

| Field      | Type      | Description             |
| ---------- | --------- | ----------------------- |
| id         | UUID      | Primary key             |
| booking_id | UUID      | Foreign key to bookings |
| qr_code    | text      | Encoded ticket data     |
| issued_at  | timestamp |                         |
| used       | boolean   |                         |

### Wallet Transactions

| Field      | Type          | Description                                 |
| ---------- | ------------- | ------------------------------------------- |
| id         | UUID          | Primary key                                 |
| user_id    | UUID          | Foreign key to users                        |
| amount     | decimal(10,2) | Positive for top‑up, negative for deduction |
| type       | enum          | topup, payment, refund                      |
| reference  | string        | Booking ID or top‑up ID                     |
| created_at | timestamp     |                                             |

## 5.2 API Endpoints (REST)

| Endpoint                    | Method | Description                                          |
| --------------------------- | ------ | ---------------------------------------------------- |
| `/api/routes/search`        | GET    | Search routes by origin, destination, date, agencies |
| `/api/schedules/{id}/seats` | GET    | Get current seat availability for a schedule         |
| `/api/bookings/reserve`     | POST   | Hold seats (5 min expiry)                            |
| `/api/bookings/confirm`     | POST   | Confirm booking and process payment                  |
| `/api/wallet/balance`       | GET    | Get user balance                                     |
| `/api/wallet/topup`         | POST   | Add funds (mock)                                     |
| `/api/tickets/{id}`         | GET    | Retrieve ticket details                              |
