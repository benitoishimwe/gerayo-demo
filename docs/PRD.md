# Gerayo – Product Requirements Document (PRD)

## 1.1 Product Vision

**Gerayo** is a web-based booking and navigation platform for inter‑province bus travel in Rwanda. It allows users to search routes, view bus options, select seats, pay (mock), and receive an offline‑accessible ticket – all in a Jakdojade‑inspired interface. The goal is to demonstrate a scalable, investor‑ready product that can later integrate real payment, live schedules, and operator partnerships.

## 1.2 Target Users

- **Primary**: Local travelers (Rwandans) booking inter‑city buses.
- **Secondary**: Tourists exploring Rwanda.
- **Investors**: To showcase the platform’s potential.

## 1.3 Key User Stories

| ID    | User Story                                                                                                              |
| ----- | ----------------------------------------------------------------------------------------------------------------------- |
| US‑01 | As a user, I want to search for buses between two locations (origin/destination) so that I can find available trips.    |
| US‑02 | As a user, I want to filter results by bus agency (e.g., Volcano Express) so that I can choose my preferred operator.   |
| US‑03 | As a user, I want to see bus options with departure time, duration, price, and amenities so that I can compare.         |
| US‑04 | As a user, I want to view the route on a map with markers so that I understand the journey.                             |
| US‑05 | As a user, I want to select specific seats from a visual seat map (bus layout) so that I can choose my preferred spot.  |
| US‑06 | As a user, I want to pay using MTN MoMo, Airtel Money, or my Gerayo wallet (mock) so that I can complete the booking.   |
| US‑07 | As a user, I want to receive a ticket with a QR code that works offline so that I can board even without internet.      |
| US‑08 | As a user, I want to view all my purchased tickets offline so that I can access them anytime.                           |
| US‑09 | As a user, I want to top up my Gerayo wallet (mock) so that I can pay for tickets using the wallet balance.             |
| US‑10 | As a user, I want to see province‑based suggestions when selecting a destination so that I can easily find major towns. |

## 1.4 Functional Requirements (High‑Level)

- **Search**: Text inputs for origin/destination, date/time, agency filter, province selector.
- **Results**: List of matching routes; each shows agency, departure, duration, stops, price, amenities, and a "Select seats" button.
- **Map**: Interactive map (Leaflet) with route polyline and start/end markers.
- **Seat Selection**: Modal with visual seat grid (4 columns, rows vary by bus type), color legend (available/taken/selected/VIP), and confirmation.
- **Payment**: Modal with wallet balance, payment options (wallet, MoMo, Airtel, promo code), PIN entry mock, success screen.
- **Ticket**: QR code, trip details, download (print), send to email (prompt), stored in localStorage.
- **Wallet**: Balance shown in header, top‑up modal with preset amounts, deduction on wallet payment.
- **Province Selector**: Dropdown showing provinces; clicking a town auto‑fills destination.
- **Responsive**: Desktop (left panel + right map) and mobile (search + map banner + results below).

## 1.5 Non‑Functional Requirements

- **Performance**: Load under 2s on a typical connection.
- **Offline**: Tickets accessible without internet.
- **Usability**: Clear visual hierarchy, consistent with Jakdojade style.
- **Demo‑ready**: All data is static/mocked, no real backend or payments.

## 1.6 Scope (In/Out)

- **In**: All features described above.
- **Out**: Real payment, real‑time bus tracking, user authentication, admin panel, operator dashboards.
