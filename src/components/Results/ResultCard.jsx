import agencies from '../../data/agencies.json'
import seatMaps from '../../data/seatMaps.json'
import { useLanguage } from '../../i18n/LanguageContext'

function formatDuration(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? `${h}h${m ? ` ${m}m` : ''}` : `${m}m`
}

function addMinutes(time, mins) {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + mins
  const wrapped = ((total % (24 * 60)) + 24 * 60) % (24 * 60)
  const hh = Math.floor(wrapped / 60)
  const mm = wrapped % 60
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

export function ResultCard({ route, onSelectSeats, isActive, onFocus, onHoverStart, onHoverEnd, onOpenDetail }) {
  const { t } = useLanguage()
  const agency = agencies.find((a) => a.id === route.agencyId)
  const bus = seatMaps[route.busType]
  const arrivalTime = addMinutes(route.departureTime, route.durationMins)

  return (
    <div
      onClick={() => {
        onFocus()
        onOpenDetail?.(route)
      }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className={`rounded-2xl border p-4 cursor-pointer transition ${
        isActive ? 'border-gerayo-from bg-gerayo-card' : 'border-gerayo-border bg-gerayo-card/60 hover:border-gerayo-muted'
      }`}
    >
      <div className="grid grid-cols-3 items-center">
        <div className="text-[11px] font-medium uppercase tracking-wide text-gerayo-muted">{t('results.departs')}</div>
        <div className="text-center text-[11px] font-medium uppercase tracking-wide text-gerayo-muted">{t('results.time')}</div>
        <div className="text-right text-[11px] font-medium uppercase tracking-wide text-gerayo-muted">{t('results.arrives')}</div>
      </div>

      <div className="mt-1 grid grid-cols-3 items-center">
        <div className="text-2xl font-bold text-white">{route.departureTime}</div>

        <div className="flex flex-col items-center px-2">
          <div className="flex w-full items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-gerayo-from" />
            <span className="h-px flex-1 bg-gerayo-border" />
            <span className="h-1.5 w-1.5 rounded-full bg-gerayo-to" />
          </div>
          <div className="mt-1 whitespace-nowrap text-[11px] text-gerayo-muted">{formatDuration(route.durationMins)}</div>
        </div>

        <div className="text-right text-2xl font-bold text-white">{arrivalTime}</div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-gerayo-muted">
            <path
              d="M4 16V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8M4 16a2 2 0 0 0 2 2h1m-3-2h18m-18 0v2m18-2a2 2 0 0 1-2 2h-1m3-2v2M8 18v1m8-1v1M6 12h12"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className="rounded-md px-2 py-0.5 text-xs font-bold text-white"
            style={{ background: agency?.color }}
          >
            {agency?.name}
          </span>
          {agency?.verifiedSince && (
            <span className="rounded-full bg-gerayo-bg border border-gerayo-border px-2 py-0.5 text-[10px] font-medium text-gerayo-muted">
              {t('results.verifiedSince', { year: agency.verifiedSince })}
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onSelectSeats(route)
          }}
          className="rounded-full bg-gerayo-from px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
        >
          {t('results.buyTicket', { price: route.price.toLocaleString() })}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="rounded-full bg-gerayo-bg border border-gerayo-border px-2 py-0.5 text-[11px] text-gerayo-muted">
          {bus?.label}
        </span>
        {bus?.amenities.map((a) => (
          <span key={a} className="rounded-full bg-gerayo-bg border border-gerayo-border px-2 py-0.5 text-[11px] text-gerayo-muted">
            {a}
          </span>
        ))}
        {agency?.courier && (
          <span className="rounded-full bg-gerayo-bg border border-gerayo-border px-2 py-0.5 text-[11px] text-gerayo-muted">
            {t('results.parcelAvailable')}
          </span>
        )}
        {agency?.whatsapp && (
          <a
            href={`https://wa.me/${agency.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="ml-auto rounded-full border border-gerayo-border px-2 py-0.5 text-[11px] font-medium text-gerayo-muted hover:text-white hover:border-gerayo-muted"
          >
            {t('results.whatsapp')}
          </a>
        )}
      </div>
    </div>
  )
}
