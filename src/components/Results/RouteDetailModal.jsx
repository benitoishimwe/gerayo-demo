import { useEffect, useRef, useState } from 'react'
import agencies from '../../data/agencies.json'
import seatMaps from '../../data/seatMaps.json'
import { MapPanel } from '../Layout/MapPanel'
import { ParcelModal } from '../Parcel/ParcelModal'
import { useLanguage } from '../../i18n/LanguageContext'

const PEEK = 28

function formatDuration(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`
}

function addMinutes(time, mins) {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + mins
  const wrapped = ((total % (24 * 60)) + 24 * 60) % (24 * 60)
  const hh = Math.floor(wrapped / 60)
  const mm = wrapped % 60
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

export function RouteDetailModal({ route, onClose, onSelectSeats }) {
  const { t } = useLanguage()
  const agency = agencies.find((a) => a.id === route.agencyId)
  const bus = seatMaps[route.busType]
  const arrivalTime = addMinutes(route.departureTime, route.durationMins)
  const scrollRef = useRef(null)
  const [showParcel, setShowParcel] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    // Panes are each (100% - PEEK) wide and laid out back to back, so resting
    // partway into the details pane naturally leaves a PEEK-wide sliver of the
    // map pane visible on the left; swiping left snaps to the full map pane,
    // which then leaves a sliver of the details pane peeking on the right.
    // Wait a frame so layout (and scroll-snap) has settled before we offset it.
    const raf = requestAnimationFrame(() => {
      el.scrollLeft = Math.max(el.clientWidth - 2 * PEEK, 0)
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="fixed inset-0 z-[2000] flex items-end md:items-stretch justify-start bg-black/70 md:bg-transparent md:pointer-events-none">
      <div className="jd-scroll pointer-events-auto relative flex w-full flex-col overflow-hidden bg-gerayo-panel border border-gerayo-border h-[100dvh] max-h-[100dvh] rounded-none md:m-4 md:max-h-[calc(100%-2rem)] md:h-[calc(100%-2rem)] md:w-[420px] md:rounded-2xl xl:mb-0 xl:max-h-[calc(100%-279px)] xl:h-[calc(100%-279px)]">
        <div className="absolute md:sticky top-0 inset-x-0 md:inset-x-auto z-20 bg-gerayo-panel md:border-b md:border-gerayo-border">
          <div className="flex items-center gap-2 px-4 py-3">
            <button
              onClick={onClose}
              aria-label={t('common.back')}
              className="-ml-1.5 h-8 w-8 rounded-full flex items-center justify-center text-gerayo-text hover:bg-gerayo-card transition"
            >
              ←
            </button>
            <h2 className="text-sm font-medium text-gerayo-muted">{t('results.routeDetails')}</h2>
          </div>

          <div className="px-3 pb-3 md:hidden">
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-1">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-gerayo-muted">
                  <span className="h-2 w-2 flex-none rounded-full bg-gerayo-from" />
                  <span className="truncate">{t('results.departs')}</span>
                </div>
                <div className="mt-1 text-xl font-bold leading-none text-white whitespace-nowrap">{route.departureTime}</div>
              </div>
              <div className="flex flex-col items-center px-1 min-w-0">
                <div className="flex w-full items-center gap-1">
                  <span className="h-1.5 w-1.5 flex-none rounded-full bg-gerayo-from" />
                  <span className="h-px flex-1 bg-gerayo-border" />
                  <span className="h-1.5 w-1.5 flex-none rounded-full border border-gerayo-to bg-gerayo-panel" />
                </div>
                <div className="mt-1 whitespace-nowrap text-[10px] text-gerayo-muted">
                  {formatDuration(route.durationMins)}
                </div>
              </div>
              <div className="min-w-0 text-right">
                <div className="flex items-center justify-end gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-gerayo-muted">
                  <span className="h-2 w-2 flex-none rounded-full border border-gerayo-to bg-gerayo-panel" />
                  <span className="truncate">{t('results.arrives')}</span>
                </div>
                <div className="mt-1 text-xl font-bold leading-none text-white whitespace-nowrap">{arrivalTime}</div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-gerayo-muted">
                <path
                  d="M4 16V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8M4 16a2 2 0 0 0 2 2h1m-3-2h18m-18 0v2m18-2a2 2 0 0 1-2 2h-1m3-2v2M8 18v1m8-1v1M6 12h12"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="rounded-md px-2 py-0.5 text-xs font-bold text-white" style={{ background: agency?.color }}>
                {agency?.name}
              </span>
            </div>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="jd-scroll absolute inset-0 md:relative flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden md:block md:overflow-y-auto md:snap-none"
        >
          <div className="relative h-full w-[calc(100%-28px)] flex-none snap-start md:hidden">
            <MapPanel selectedRoute={route} className="h-full w-full" />
          </div>
          <div className="h-full w-[calc(100%-28px)] flex-none snap-start overflow-y-auto bg-gerayo-panel p-5 pt-40 pb-20 md:w-auto md:overflow-visible md:snap-none md:bg-transparent md:pt-5 md:pb-5">
          <div className="hidden md:block">
            <div className="grid grid-cols-3 items-center">
              <div className="text-[11px] font-medium uppercase tracking-wide text-gerayo-muted">{t('results.departs')}</div>
              <div className="text-center text-[11px] font-medium uppercase tracking-wide text-gerayo-muted">{t('results.time')}</div>
              <div className="text-right text-[11px] font-medium uppercase tracking-wide text-gerayo-muted">{t('results.arrives')}</div>
            </div>

            <div className="mt-1 grid grid-cols-3 items-center">
              <div className="text-3xl font-bold text-white">{route.departureTime}</div>
              <div className="flex flex-col items-center px-2">
                <div className="flex w-full items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-gerayo-from" />
                  <span className="h-px flex-1 bg-gerayo-border" />
                  <span className="h-1.5 w-1.5 rounded-full bg-gerayo-to" />
                </div>
                <div className="mt-1 whitespace-nowrap text-[11px] text-gerayo-muted">{formatDuration(route.durationMins)}</div>
              </div>
              <div className="text-right text-3xl font-bold text-white">{arrivalTime}</div>
            </div>
          </div>

          <div className="mt-3 hidden items-center gap-2 md:flex">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-gerayo-muted">
              <path
                d="M4 16V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8M4 16a2 2 0 0 0 2 2h1m-3-2h18m-18 0v2m18-2a2 2 0 0 1-2 2h-1m3-2v2M8 18v1m8-1v1M6 12h12"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="rounded-md px-2 py-0.5 text-xs font-bold text-white" style={{ background: agency?.color }}>
              {agency?.name}
            </span>
            {agency?.verifiedSince && (
              <span className="rounded-full bg-gerayo-bg border border-gerayo-border px-2 py-0.5 text-[11px] font-medium text-gerayo-muted">
                {t('results.verifiedSince', { year: agency.verifiedSince })}
              </span>
            )}
          </div>

          <div className="mt-6 border-t border-gerayo-border pt-5">
            <div className="flex gap-3">
              <div className="relative flex flex-col items-center pt-1.5" style={{ width: '1.5rem' }}>
                <span className="h-2.5 w-2.5 flex-none rounded-full bg-gerayo-from" />
                <span className="my-1 w-px flex-1 bg-gerayo-border" style={{ minHeight: '3.5rem' }} />
                <span className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gerayo-border bg-gerayo-panel shadow">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-gerayo-from">
                    <path
                      d="M4 16V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8M4 16a2 2 0 0 0 2 2h1m-3-2h18m-18 0v2m18-2a2 2 0 0 1-2 2h-1m3-2v2M8 18v1m8-1v1M6 12h12"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="h-2.5 w-2.5 flex-none rounded-full border-2 border-gerayo-to bg-gerayo-panel" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between pb-6">
                  <div>
                    <div className="text-xs text-gerayo-muted">{route.departureTime}</div>
                    <div className="text-base font-semibold text-white">{route.origin}</div>
                    <div className="mt-0.5 text-xs text-gerayo-muted">{t('results.departure', { busLabel: bus?.label })}</div>
                  </div>
                  <div className="mt-1 rounded-full bg-gerayo-bg border border-gerayo-border px-2 py-0.5 text-[11px] font-medium text-gerayo-muted">
                    {formatDuration(route.durationMins)}
                  </div>
                </div>
                {route.viaStops?.length > 0 && (
                  <div className="space-y-2 pb-6">
                    {route.viaStops.map((stop) => (
                      <div key={stop} className="flex items-center gap-2 text-xs text-gerayo-muted">
                        <span className="h-1.5 w-1.5 flex-none rounded-full border border-gerayo-muted" />
                        {t('results.viaStop', { stop })}
                      </div>
                    ))}
                  </div>
                )}
                <div>
                  <div className="text-xs text-gerayo-muted">{arrivalTime}</div>
                  <div className="text-base font-semibold text-white">{route.destination}</div>
                  <div className="mt-0.5 text-xs text-gerayo-muted">{t('results.arrival')}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {bus?.amenities.map((a) => (
              <span key={a} className="rounded-full bg-gerayo-bg border border-gerayo-border px-2 py-0.5 text-[11px] text-gerayo-muted">
                {a}
              </span>
            ))}
          </div>

          {(agency?.whatsapp || agency?.phone) && (
            <div className="mt-5 flex gap-2">
              {agency?.phone && (
                <a
                  href={`tel:${agency.phone}`}
                  className="flex-1 rounded-full border border-gerayo-border px-3 py-2 text-center text-xs font-semibold text-gerayo-text hover:border-gerayo-muted"
                >
                  {t('results.call')}
                </a>
              )}
              {agency?.whatsapp && (
                <a
                  href={`https://wa.me/${agency.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-full border border-gerayo-border px-3 py-2 text-center text-xs font-semibold text-gerayo-text hover:border-gerayo-muted"
                >
                  {t('results.whatsapp')}
                </a>
              )}
            </div>
          )}

          {agency?.courier && (
            <button
              onClick={() => setShowParcel(true)}
              className="mt-3 w-full rounded-full border border-dashed border-gerayo-border px-3 py-2 text-xs font-semibold text-gerayo-muted hover:border-gerayo-muted hover:text-white"
            >
              {t('parcel.sendOnThisBus')}
            </button>
          )}

          <div className="mt-6 text-center text-[11px] text-gerayo-muted">
            {t('results.confirmNote')}
          </div>
          </div>
        </div>

        <div className="absolute md:relative bottom-0 inset-x-0 z-20 flex justify-end md:border-t md:border-gerayo-border bg-gradient-to-t from-black/70 to-transparent md:bg-none md:bg-gerayo-panel p-3">
          <button
            onClick={() => onSelectSeats(route)}
            className="rounded-full bg-gerayo-from px-4 py-2 text-xs font-semibold text-black shadow-lg transition hover:brightness-110"
          >
            {t('results.buyTicket', { price: route.price.toLocaleString() })}
          </button>
        </div>
      </div>

      {showParcel && <ParcelModal route={route} agency={agency} onClose={() => setShowParcel(false)} />}
    </div>
  )
}
