# Gerayo – Technical Requirements Document (TRD)

## 2.1 Architecture

- **Frontend only**: React + Vite single‑page application.
- **State management**: React hooks (`useState`, `useEffect`, custom hooks like `useLocalStorage`, `useWallet`).
- **Data storage**: `localStorage` for tickets and wallet balance.
- **Map**: Leaflet with OpenStreetMap tiles; route coordinates are hard‑coded mock data.
- **QR Code**: `qrcode.react` library.
- **Styling**: TailwindCSS with a blue/white theme.
- **Build tool**: Vite for fast development and optimized production bundle.

## 2.2 Technology Stack

| Component | Technology              | Version    |
| --------- | ----------------------- | ---------- |
| Framework | React                   | 18.2.0     |
| Bundler   | Vite                    | 5.0.8      |
| CSS       | TailwindCSS             | 3.3.6      |
| Map       | Leaflet (react‑leaflet) | 4.2.1      |
| QR Code   | qrcode.react            | 3.1.0      |
| Linting   | ESLint                  | (optional) |
| Hosting   | Vercel (for deployment) | –          |

## 2.3 Folder Structure

src/
components/
Layout/ – LeftPanel, MapPanel, ResultsList, ResultCard
Search/ – SearchForm, ProvinceSelector, AgencyDropdown
SeatModal/ – SeatModal, SeatGrid, SeatLegend, SeatPreferenceTabs
Payment/ – PaymentModal, PaymentOptions, PinEntry
Ticket/ – TicketViewer, TicketCard, TicketList
Wallet/ – WalletTopUpModal
common/ – Modal, Button (optional)
hooks/ – useLocalStorage, useWallet, useSearch
data/ – agencies.json, provinces.json, routes.json, seatMaps.json
utils/ – formatters, ticketHelpers
styles/ – index.css
App.jsx, main.jsx

## 2.4 Data Models

### Agencies

```json
{ "id": "string", "name": "string", "color": "string", "logo": "string" }

Provinces

{ "id": "string", "name": "string", "towns": ["string"] }

Routes

{
  "id": "string",
  "agencyId": "string",
  "origin": "string",
  "destination": "string",
  "departure": "string",
  "duration": "string",
  "price": "number",
  "stops": ["string"],
  "busType": "string",
  "amenities": ["string"]
}

Seat Maps

{
  "busTypeId": {
    "rows": "number",
    "cols": "number",
    "taken": ["number"],
    "vip": ["number"],
    "label": "string"
  }
}

Ticket (localStorage)

{
  "id": "string",
  "routeId": "string",
  "origin": "string",
  "destination": "string",
  "departure": "string",
  "date": "string",
  "seats": ["number"],
  "price": "number",
  "passenger": "string",
  "agency": "string",
  "busType": "string",
  "amenities": ["string"],
  "issuedAt": "string",
  "qrData": "string"
}

Wallet
Stored as a single number gerayo_wallet_balance (default 2.70).

2.5 APIs (Mocked)
No real APIs; all data is local. Direct imports from data/ suffice.

2.6 Responsive Breakpoints
Desktop: lg (≥ 1024px) – left panel 40%, right map 60%.

Mobile: < 1024px – search at top, map banner (200px), results below.

```
