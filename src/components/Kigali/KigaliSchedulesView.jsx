import { useEffect, useMemo, useState } from 'react'
import lines from '../../data/kigaliLines.json'
import agencies from '../../data/agencies.json'
import { findStopById, getLineStopPositions } from '../../utils/kigaliJourney'
import { useLanguage } from '../../i18n/LanguageContext'
import { MapPanel } from '../Layout/MapPanel'
import { DraggableSheet } from '../Layout/DraggableSheet'

const DAY_TYPES = ['weekday', 'saturday', 'sunday']

function agencyOf(id) {
  return agencies.find((a) => a.id === id)
}

export function KigaliSchedulesView({ onPreviewLine, onDetailOpenChange }) {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [openLineId, setOpenLineId] = useState(null)
  const [dayType, setDayType] = useState('weekday')
  const [tab, setTab] = useState('stops')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return lines
    return lines.filter(
      (l) =>
        l.code.toLowerCase().includes(q) ||
        l.stops.some((id) => findStopById(id)?.name.toLowerCase().includes(q)),
    )
  }, [query])

  const openLine = openLineId ? lines.find((l) => l.id === openLineId) : null

  useEffect(() => {
    onPreviewLine?.(openLine)
    if (!openLine) return
    return () => onPreviewLine?.(null)
  }, [openLine])

  useEffect(() => {
    onDetailOpenChange?.(!!openLine)
    return () => onDetailOpenChange?.(false)
  }, [openLine])

  if (openLine) {
    const agency = agencyOf(openLine.agencyId)
    const firstStop = findStopById(openLine.stops[0])
    const lastStop = findStopById(openLine.stops[openLine.stops.length - 1])

    const detailContent = (
      <>
        <button
          type="button"
          onClick={() => setOpenLineId(null)}
          className="mb-4 hidden items-center gap-1.5 text-sm text-gerayo-muted hover:text-white transition md:flex"
        >
          ← {t('common.back')}
        </button>

        <div className="mb-1 flex items-center gap-2">
          <span className="rounded-md px-2 py-0.5 text-xs font-bold text-white" style={{ background: agency?.color }}>
            {openLine.code}
          </span>
          <span className="text-sm font-semibold text-white">
            {firstStop?.name} → {lastStop?.name}
          </span>
        </div>
        <div className="mb-4 text-xs text-gerayo-muted">{agency?.name} · {openLine.fare.toLocaleString()} RWF</div>

        <div className="mb-4 flex gap-2 border-b border-gerayo-border">
          {[
            { key: 'stops', label: t('kigaliSchedules.tabs.stops') },
            { key: 'schedules', label: t('kigaliSchedules.tabs.schedules') },
          ].map((tabDef) => (
            <button
              key={tabDef.key}
              type="button"
              onClick={() => setTab(tabDef.key)}
              className={`px-3 pb-2 text-sm font-medium transition border-b-2 -mb-px ${
                tab === tabDef.key
                  ? 'border-gerayo-from text-white'
                  : 'border-transparent text-gerayo-muted hover:text-white'
              }`}
            >
              {tabDef.label}
            </button>
          ))}
        </div>

        {tab === 'stops' && (
          <div className="space-y-1.5">
            {openLine.stops.map((stopId, i) => (
              <div key={stopId} className="flex items-center gap-2 text-xs text-gerayo-muted">
                <span className="h-1.5 w-1.5 flex-none rounded-full border border-gerayo-muted" />
                {i + 1}. {findStopById(stopId)?.name}
              </div>
            ))}
          </div>
        )}

        {tab === 'schedules' && (
          <>
            <div className="mb-3 flex gap-2">
              {DAY_TYPES.map((dt) => (
                <button
                  key={dt}
                  type="button"
                  onClick={() => setDayType(dt)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    dayType === dt ? 'bg-gerayo-from text-black' : 'bg-gerayo-bg border border-gerayo-border text-gerayo-muted'
                  }`}
                >
                  {t(`kigaliSchedules.dayTypes.${dt}`)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {(openLine.schedule[dayType] || []).map((time) => (
                <div
                  key={time}
                  className="rounded-lg border border-gerayo-border bg-gerayo-bg py-2 text-center text-xs font-medium text-white"
                >
                  {time}
                </div>
              ))}
            </div>
          </>
        )}
      </>
    )

    return (
      <div className="jd-scroll flex-1 overflow-y-auto md:p-4">
        <DraggableSheet
          className="md:hidden"
          mapContent={
            <>
              <MapPanel kigaliMode kigaliRoute={getLineStopPositions(openLine)} className="h-full w-full" />
              <button
                type="button"
                onClick={() => setOpenLineId(null)}
                aria-label={t('common.back')}
                className="absolute left-3 top-3 z-[1100] flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900/90 text-white shadow-lg backdrop-blur"
              >
                ←
              </button>
            </>
          }
        >
          <div className="p-4 pt-0">{detailContent}</div>
        </DraggableSheet>

        <div className="hidden md:block">{detailContent}</div>
      </div>
    )
  }

  return (
    <div className="jd-scroll flex-1 overflow-y-auto p-4">
      <div className="relative mb-4">
        <svg viewBox="0 0 24 24" fill="none" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gerayo-muted">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('kigaliSchedules.searchPlaceholder')}
          className="w-full rounded-xl border border-gerayo-border bg-gerayo-card/60 py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-gerayo-from"
        />
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
        {filtered.map((line) => (
          <button
            key={line.id}
            type="button"
            onClick={() => {
              setOpenLineId(line.id)
              setTab('stops')
            }}
            className="rounded-lg border border-gerayo-border py-2.5 text-center text-xs font-semibold text-white transition hover:border-gerayo-from hover:bg-gerayo-card/60"
          >
            {line.code}
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-10 text-center text-sm text-gerayo-muted">{t('search.noResultsFound')}</div>
        )}
      </div>
    </div>
  )
}
