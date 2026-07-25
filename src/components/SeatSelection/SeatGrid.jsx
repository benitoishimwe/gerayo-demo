function seatColors(state) {
  switch (state) {
    case 'taken':
      return { fill: '#4b5563', ring: 'border-gerayo-taken', text: 'text-gray-500', glyph: '#6b7280' }
    case 'selected':
      return { fill: '#22c55e', ring: 'border-gerayo-from', text: 'text-black', glyph: '#0d0d0d' }
    case 'vip':
      return { fill: 'transparent', ring: 'border-gerayo-vip', text: 'text-gerayo-vip', glyph: '#f59e0b' }
    default:
      return { fill: 'transparent', ring: 'border-gerayo-border', text: 'text-gerayo-text', glyph: '#9ca3af' }
  }
}

function SeatIcon({ state }) {
  const { fill, glyph } = seatColors(state)
  const taken = state === 'taken'
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d="M6 11V6.5A2.5 2.5 0 0 1 8.5 4h7A2.5 2.5 0 0 1 18 6.5V11"
        stroke={taken ? glyph : state === 'available' ? glyph : glyph}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill={fill === 'transparent' ? 'none' : fill}
        opacity={taken ? 0.6 : 1}
      />
      <path
        d="M4.5 11h15a1 1 0 0 1 1 1.15l-.65 4.35a1.5 1.5 0 0 1-1.48 1.28H5.63a1.5 1.5 0 0 1-1.48-1.28L3.5 12.15A1 1 0 0 1 4.5 11Z"
        stroke={glyph}
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill={fill === 'transparent' ? 'none' : fill}
        fillOpacity={fill === 'transparent' ? 0 : 0.9}
      />
      <path d="M6.5 19.5v1.3M17.5 19.5v1.3" stroke={glyph} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function seatButtonClasses(state) {
  switch (state) {
    case 'taken':
      return 'bg-gerayo-card/40 border-gerayo-border cursor-not-allowed opacity-50'
    case 'selected':
      return 'bg-gerayo-from border-gerayo-from shadow-[0_0_0_3px_rgba(34,197,94,0.18)] gerayo-seat-selected'
    case 'vip':
      return 'bg-gerayo-vip/10 border-gerayo-vip hover:bg-gerayo-vip/20'
    default:
      return 'bg-gerayo-card border-gerayo-border hover:border-gerayo-from hover:bg-gerayo-from/10'
  }
}

export function SeatGrid({ rows, takenSeats, vipSeats, selectedSeats, onToggle }) {
  return (
    <div className="space-y-2">
      {rows.map((row, i) => (
        <div key={i} className="flex items-center justify-center gap-2">
          {row.map((cell, j) => {
            if (cell.spacer) {
              return (
                <div key={j} className="w-8 flex-shrink-0 text-center text-[9px] tracking-wide text-gerayo-muted">
                  {cell.label}
                </div>
              )
            }
            const isTaken = takenSeats.includes(cell.seatId)
            const isSelected = selectedSeats.includes(cell.seatId)
            const isVip = vipSeats.includes(cell.seatId)
            const state = isTaken ? 'taken' : isSelected ? 'selected' : isVip ? 'vip' : 'available'
            return (
              <button
                key={cell.seatId}
                disabled={isTaken}
                onClick={() => onToggle(cell.seatId)}
                title={`Seat ${cell.seatId.replace('S', '')}`}
                className={`flex h-11 w-11 flex-shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl border transition-all duration-150 active:scale-95 ${seatButtonClasses(
                  state
                )}`}
              >
                <SeatIcon state={state} />
                <span className={`text-[9px] font-semibold leading-none ${state === 'selected' ? 'text-black' : 'text-gerayo-muted'}`}>
                  {cell.seatId.replace('S', '')}
                </span>
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
