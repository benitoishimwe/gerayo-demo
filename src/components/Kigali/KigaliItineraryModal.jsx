import { useEffect, useRef, useState } from 'react'
import agencies from '../../data/agencies.json'
import { toTimeString, findStopById, getItineraryStopPositions } from '../../utils/kigaliJourney'
import { MapPanel } from '../Layout/MapPanel'
import { useLanguage } from '../../i18n/LanguageContext'

const PEEK = 28

function nowMinutes() {
  const d = new Date()
  return d.getHours() * 60 + d.getMinutes()
}

function stopTimeAt(leg, idx) {
  const totalStops = leg.stopsBetween.length + 1
  const totalMins = leg.alightAt - leg.boardAt
  return leg.boardAt + Math.round((totalMins * (idx + 1)) / totalStops)
}

function WalkIcon({ className = 'h-3.5 w-3.5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="5" r="2" fill="currentColor" />
      <path d="M12 8v5l-3 7M12 13l4 2 2 6M9 13l-3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function BusBadge({ leg }) {
  const agency = agencies.find((a) => a.id === leg.line.agencyId)
  return (
    <span
      className="flex h-6 items-center gap-1 rounded-md px-1.5 text-[11px] font-bold text-white"
      style={{ background: agency?.color }}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
        <rect x="3" y="5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 12h18M7 17v2M17 17v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      {leg.line.code}
    </span>
  )
}

export function KigaliItineraryModal({ itinerary, onClose, onBuy }) {
  const { t } = useLanguage()
  const [expandedLeg, setExpandedLeg] = useState(null)
  const scrollRef = useRef(null)

  const busLegs = itinerary.legs.filter((l) => l.kind === 'bus')
  const originStop = busLegs[0].boardStop
  const destStop = busLegs[busLegs.length - 1].alightStop
  const kigaliRoute = getItineraryStopPositions(itinerary)

  const minutesUntil = Math.max(0, Math.round(itinerary.departAt - nowMinutes()))

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
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
            <h2 className="text-sm font-medium text-gerayo-muted">{t('kigaliSearch.journeyDetails')}</h2>
          </div>
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex items-center gap-1.5">
              {itinerary.legs.map((leg, i) =>
                leg.kind === 'bus' ? (
                  <BusBadge key={i} leg={leg} />
                ) : (
                  <span key={i} className="flex h-6 w-6 items-center justify-center rounded-full border border-gerayo-border text-gerayo-muted">
                    <WalkIcon className="h-3 w-3" />
                  </span>
                )
              )}
            </div>
            <div className="text-xs text-gerayo-muted">{t('kigaliSearch.duration', { mins: itinerary.durationMins })}</div>
          </div>
          <div className="px-4 pb-3">
            <div className="text-2xl font-bold text-white">
              {t('kigaliSearch.minutesWord', { mins: minutesUntil })}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-gerayo-muted">
              {itinerary.legs.map((leg, i) =>
                leg.kind === 'walk' ? (
                  <span key={i} className="flex items-center gap-1">
                    <WalkIcon className="h-3 w-3" />
                    {leg.mins} min
                  </span>
                ) : (
                  <span key={i} className="flex items-center gap-1 font-semibold" style={{ color: agencies.find((a) => a.id === leg.line.agencyId)?.color }}>
                    {toTimeString(leg.boardAt)}
                    <span className="text-gerayo-muted">·</span>
                    {leg.alightAt - leg.boardAt} min
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="jd-scroll absolute inset-0 md:relative flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden md:block md:overflow-y-auto md:snap-none"
        >
          <div className="relative h-full w-[calc(100%-28px)] flex-none snap-start md:hidden">
            <MapPanel kigaliMode kigaliRoute={kigaliRoute} className="h-full w-full" />
          </div>
          <div className="jd-scroll h-full w-[calc(100%-28px)] flex-none snap-start overflow-y-auto p-5 pt-52 pb-5 md:w-auto md:overflow-visible md:snap-none md:pt-5">
          <div className="relative">
            {itinerary.legs.map((leg, i) => {
              if (leg.kind === 'walk') {
                return (
                  <div key={i} className="relative flex items-start gap-3 pb-4">
                    <div className="relative z-10 flex h-6 w-6 flex-none items-center justify-center rounded-full border border-gerayo-border bg-gerayo-panel text-gerayo-muted">
                      <WalkIcon />
                    </div>
                    <div className="pt-0.5 text-sm text-gerayo-muted">{t('kigaliSearch.walkLeg', { mins: leg.mins })}</div>
                  </div>
                )
              }

              const agency = agencies.find((a) => a.id === leg.line.agencyId)
              const color = agency?.color || '#22c55e'
              const isOpen = expandedLeg === i
              const isLastLeg = i === itinerary.legs.length - 1

              return (
                <div key={i}>
                  <div className="relative flex items-start gap-3">
                    <div className="relative z-10 flex flex-col items-center self-stretch">
                      <span className="h-2.5 w-2.5 flex-none rounded-full border-2 border-white" style={{ background: color }} />
                      <span className="w-0.5 flex-1" style={{ background: color }} />
                    </div>
                    <div className="flex-1 pb-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gerayo-muted">{toTimeString(leg.boardAt)}</span>
                        <span className="font-semibold text-white">{leg.boardStop.name}</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <BusBadge leg={leg} />
                        <span className="text-xs text-gerayo-muted">{t('kigaliSearch.towards', { stop: leg.alightStop.name })}</span>
                        <span className="text-xs text-gerayo-muted">· {leg.alightAt - leg.boardAt} min</span>
                      </div>
                      {leg.line.frequencyMins && (
                        <div className="mt-1 text-xs text-gerayo-muted">
                          {t('kigaliSearch.everyMins', { mins: leg.line.frequencyMins })}
                        </div>
                      )}

                      {leg.stopsBetween.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setExpandedLeg(isOpen ? null : i)}
                          className="mt-2 flex w-full items-center justify-between rounded-lg bg-gerayo-bg border border-gerayo-border px-3 py-1.5 text-xs text-gerayo-muted"
                        >
                          {t('kigaliSearch.stopCount', { count: leg.stopsBetween.length })}
                          <span>{isOpen ? '▲' : '▼'}</span>
                        </button>
                      )}
                      {isOpen && (
                        <div className="relative mt-2 space-y-2 py-1 pl-1">
                          {leg.stopsBetween.map((stopId, idx) => {
                            const stop = findStopById(stopId)
                            return (
                              <div key={stopId} className="relative z-10 flex items-center gap-2 text-xs text-gerayo-muted">
                                <span className="flex h-4 w-4 flex-none items-center justify-center rounded-full text-[10px] font-semibold text-white" style={{ background: color }}>
                                  {idx + 1}
                                </span>
                                <span className="tabular-nums">{toTimeString(stopTimeAt(leg, idx))}</span>
                                <span>{stop?.name}</span>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative flex items-start gap-3">
                    <div className="relative z-10 flex flex-col items-center self-stretch">
                      <span className="h-2.5 w-2.5 flex-none rounded-full border-2 border-white" style={{ background: color }} />
                      {!isLastLeg && <span className="w-0.5 flex-1 bg-gerayo-border" style={{ minHeight: '12px' }} />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gerayo-muted">{toTimeString(leg.alightAt)}</span>
                        <span className="font-semibold text-white">{leg.alightStop.name}</span>
                      </div>
                      {!isLastLeg && itinerary.legs[i + 1]?.kind === 'walk' && (
                        <div className="mt-1 text-xs text-gerayo-muted">{t('kigaliSearch.waitForTransfer')}</div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-2 text-xs text-gerayo-muted">
            {originStop.name} → {destStop.name}
          </div>
          </div>
        </div>

        <div className="absolute md:relative bottom-0 inset-x-0 z-20 flex justify-end md:border-t md:border-gerayo-border bg-gradient-to-t from-black/70 to-transparent md:bg-none md:bg-gerayo-panel p-3">
          <button
            onClick={() => onBuy(itinerary)}
            className="rounded-full bg-gerayo-from px-4 py-2 text-xs font-semibold text-black shadow-lg transition hover:brightness-110"
          >
            {t('kigaliSearch.buyTicket', { price: itinerary.fare.toLocaleString() })}
          </button>
        </div>
      </div>
    </div>
  )
}
