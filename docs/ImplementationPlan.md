# Gerayo – Implementation Plan

## 6.1 Milestones

| Milestone                | Duration | Description                                                                                    |
| ------------------------ | -------- | ---------------------------------------------------------------------------------------------- |
| M1 – Setup               | 0.5 day  | Initialize Vite + React, Tailwind, install dependencies, folder structure.                     |
| M2 – Data & Hooks        | 1 day    | Create mock JSON data, hooks (useLocalStorage, useWallet).                                     |
| M3 – Core UI Components  | 2 days   | Build layout (LeftPanel, MapPanel, ResultsList), SearchForm, ProvinceSelector, AgencyDropdown. |
| M4 – Seat Selection      | 1.5 days | SeatModal, SeatGrid, SeatLegend, SeatPreferenceTabs.                                           |
| M5 – Payment & Wallet    | 1.5 days | PaymentModal, PinEntry, WalletTopUpModal, integrate with App state.                            |
| M6 – Ticket & Offline    | 1 day    | TicketViewer, TicketCard, TicketList, QR generation, localStorage saving.                      |
| M7 – Responsive & Polish | 1 day    | Mobile styles, smooth transitions, edge cases, testing.                                        |
| M8 – Deployment          | 0.5 day  | Push to GitHub, deploy to Vercel, test live URL.                                               |

**Total estimated effort**: ~8 working days (full‑time) for a solo developer.

## 6.2 Development Phases

- **Phase 1 (Days 1–3)**: Setup, data, core UI, search, results, map.
- **Phase 2 (Days 4–5)**: Seat selection and payment.
- **Phase 3 (Days 6–7)**: Wallet, tickets, offline storage.
- **Phase 4 (Day 8)**: Polish, mobile responsiveness, deployment.

## 6.3 Testing Strategy

- **Manual testing** of all user flows (search → select seats → pay → view ticket).
- **Edge cases**: No results, insufficient balance, no seat selected, invalid PIN.
- **Cross‑browser**: Chrome, Firefox, Safari (latest versions).
- **Responsive**: Test on desktop (1920×1080, 1366×768) and mobile emulation (360×800).
- **Offline**: Disable network and verify tickets still render from localStorage.

## 6.4 Deliverables

- Complete source code (GitHub repository).
- Live Vercel deployment URL.
- README with setup, usage, and demo instructions.
- Screenshots/video of the flow (optional).
