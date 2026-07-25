import { useLanguage } from '../../i18n/LanguageContext'

export function PassengerList({ selectedSeats, passengers, onChangeName }) {
  const { t } = useLanguage()
  if (selectedSeats.length === 0) {
    return (
      <div className="gerayo-fade-up flex flex-col items-center gap-2 rounded-xl border border-dashed border-gerayo-border py-10 text-center text-sm text-gerayo-muted">
        <span className="text-2xl">🪑</span>
        {t('seat.selectSeatPrompt')}
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-gerayo-muted">{t('seat.passengerLabel')}</div>
      {selectedSeats.map((seatId, idx) => (
        <div
          key={seatId}
          style={{ animationDelay: `${idx * 40}ms` }}
          className="gerayo-fade-up flex items-center gap-3 rounded-xl bg-gerayo-card border border-gerayo-border px-3 py-2.5"
        >
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gerayo-from/15 text-gerayo-from text-xs font-bold">
            {seatId.replace('S', '')}
          </span>
          <input
            value={passengers[seatId] || ''}
            onChange={(e) => onChangeName(seatId, e.target.value)}
            placeholder={t('seat.passengerNamePlaceholder', { seat: seatId.replace('S', '') })}
            className="w-full bg-transparent text-sm text-gerayo-text outline-none placeholder:text-gerayo-muted"
          />
        </div>
      ))}
    </div>
  )
}
