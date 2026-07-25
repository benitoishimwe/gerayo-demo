# Gerayo – App Flow

## 4.1 User Journey

1. User opens app
   → sees search form + map (default view)

2. User fills origin/destination (or selects province to auto‑fill destination)
   → optional: filters by agency, sets date/time
   → clicks "Search"

3. Results appear in left panel (desktop) / below map (mobile)
   → map updates with route line

4. User clicks "Select seats" on a result card
   → Seat modal opens

5. User selects seats from the grid
   → confirms → seat modal closes

6. Payment modal opens
   → shows total and wallet balance

7. User chooses payment method:
   a. Wallet (if balance sufficient) → payment success immediately
   b. MoMo or Airtel → PIN entry (mock) → success after 1.5s

8. Ticket is generated and displayed
   → stored in localStorage
   → user can download or email (mock)

9. User can later view all tickets from the header "Tickets" button
   → each ticket shows QR and details, even offline

## 4.2 Edge Cases

- No results → show "No routes found" message.
- Insufficient wallet balance → payment option disabled, "Refill" button opens top‑up.
- No seat selected → alert and prevent confirmation.
- Missing origin/destination → search button does nothing or shows warning.

## 4.3 State Transitions

- `search` → `results` → `seatSelection` → `payment` → `ticket` → `viewTickets`
- Wallet top‑up can be triggered from header or payment modal.
