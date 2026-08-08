import agencies from '../../data/agencies.json'
import { toTimeString } from '../../utils/kigaliJourney'
import { useLanguage } from '../../i18n/LanguageContext'

function busLegs(itinerary) {
  return itinerary.legs.filter((leg) => leg.kind === 'bus')
}

export function KigaliResultCard({ itinerary, isActive, onOpenDetail, onBuy, onPreview }) {
  const { t } = useLanguage()
  const legs = busLegs(itinerary)
  const minutesUntil = Math.max(0, itinerary.departAt - (new Date().getHours() * 60 + new Date().getMinutes()))

  return (
    <div
      onClick={() => onOpenDetail(itinerary)}
      onMouseEnter={() => onPreview?.(itinerary)}
      onMouseLeave={() => onPreview?.(null)}
      className={`rounded-2xl border p-4 cursor-pointer transition ${
        isActive ? 'border-gerayo-from bg-gerayo-card' : 'border-gerayo-border bg-gerayo-card/60 hover:border-gerayo-muted'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-white">{toTimeString(itinerary.departAt)}</div>
          <div className="text-xs text-gerayo-muted">{t('kigaliSearch.departsIn', { minutes: minutesUntil })}</div>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            itinerary.type === 'direct' ? 'bg-gerayo-from/15 text-gerayo-from' : 'bg-sky-500/15 text-sky-400'
          }`}
        >
          {itinerary.type === 'direct' ? t('kigaliSearch.direct') : t('kigaliSearch.transfer')}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {legs.map((leg, i) => {
          const agency = agencies.find((a) => a.id === leg.line.agencyId)
          return (
            <span key={i} className="flex items-center gap-1">
              <span
                className="rounded-md px-2 py-0.5 text-xs font-bold text-white"
                style={{ background: agency?.color }}
              >
                {leg.line.code}
              </span>
              {i < legs.length - 1 && <span className="text-gerayo-muted">→</span>}
            </span>
          )
        })}
        <span className="ml-auto text-xs text-gerayo-muted">{t('kigaliSearch.duration', { mins: itinerary.durationMins })}</span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="text-xs text-gerayo-muted">
          {legs.map((leg) => leg.line.stops.length - 1).reduce((a, b) => a + b, 0) > 0
            ? t('kigaliSearch.stopCount', { count: legs.reduce((sum, leg) => sum + leg.stopsBetween.length + 1, 0) })
            : null}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onBuy(itinerary)
          }}
          className="rounded-full bg-gerayo-from px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
        >
          {t('kigaliSearch.buyTicket', { price: itinerary.fare.toLocaleString() })}
        </button>
      </div>
    </div>
  )
}
