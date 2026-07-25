---

### 📄 `UI_UX.md`

```markdown
# Gerayo – UI/UX Design

## 3.1 Visual Style

- **Color Palette**:
  - Primary: `#2563eb` (blue‑600)
  - Secondary: `#1e40af` (blue‑800)
  - Background: `#f8fafc`
  - Card background: white with subtle shadow.
  - Text: gray‑800, gray‑600, gray‑400.
- **Typography**: Inter (Google Font), sizes 12–18px, headings bold.
- **Icons**: Emojis or simple SVG (emojis for speed).
- **Layout**: Clean, minimal, with generous spacing.

## 3.2 Key Screens

### 3.2.1 Search (Desktop)

- Left panel: logo + search form (inputs, date/time, province dropdown, agency dropdown, search button).
- Right panel: map (centered on Rwanda) with default markers.

### 3.2.2 Results (Desktop)

- Left panel: same search form (collapsed or still visible) + list of result cards.
- Each card: agency logo, departure, duration, price, amenities, "Select seats" button.
- Map updates with route polyline.

### 3.2.3 Seat Selection Modal

- Overlay with semi‑transparent background.
- Bus info (origin → destination, departure, duration, bus type).
- Tabs: "From Layout" (visual grid) and "By Type" (preferences).
- Grid of numbered seats with colors.
- Legend.
- "Confirm Booking" and "Cancel" buttons.
- On confirm → close modal → open Payment modal.

### 3.2.4 Payment Modal

- Show total price and wallet balance.
- Payment options: Wallet (if sufficient), MTN MoMo, Airtel Money.
- Promo code input.
- If wallet insufficient, show "Refill" button opening top‑up modal.
- After selecting MoMo/Airtel → PIN entry (4 digits).
- Success screen (spinner then checkmark).

### 3.2.5 Wallet Top‑up Modal

- Preset amounts (1000, 2000, 5000, 10000 RWF) and custom input.
- "Top Up" button → balance updates, modal closes.

### 3.2.6 Ticket View

- QR code centered.
- Trip details (from/to, date, time, seats, price, agency, bus type, amenities).
- "Download Ticket" (uses `window.print()` for simplicity) and "Send to Email" (prompt).
- Stored tickets accessible via header "Tickets" button.

### 3.2.7 Mobile

- Same elements but stacked vertically.
- Map is a banner (approx 200px) above results.

## 3.3 Interaction Feedback

- Button hover states (opacity/color change).
- Loading spinner on payment submission (simulated).
- Success/error alerts using `alert()` or simple inline messages.
- Modals with close (✕) buttons.
```
