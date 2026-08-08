import { useMemo, useState } from 'react'
import routes from '../../data/routes.json'
import agencies from '../../data/agencies.json'
import { useLanguage } from '../../i18n/LanguageContext'
import { RouteStopCombobox } from './RouteStopCombobox'
import { abbreviateTown } from '../../data/townAbbreviations'
import { MapPanel } from '../Layout/MapPanel'
import { DraggableSheet } from '../Layout/DraggableSheet'

function agencyOf(id) {
  return agencies.find((a) => a.id === id)
}

export function SchedulesView({ onPreviewRoute, onOpenDetail }) {
  const { t } = useLanguage()
  const [selectedKey, setSelectedKey] = useState(null)
  const [fromValue, setFromValue] = useState('')
  const [toValue, setToValue] = useState('')

  const origins = useMemo(() => [...new Set(routes.map((r) => r.origin))].sort(), [])
  const destinations = useMemo(() => [...new Set(routes.map((r) => r.destination))].sort(), [])

  const allGroups = useMemo(() => {
    const map = new Map()
    for (const r of routes) {
      const key = `${r.origin} → ${r.destination}`
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(r)
    }
    const list = Array.from(map.entries()).map(([key, list]) => ({
      key,
      origin: list[0].origin,
      destination: list[0].destination,
      hasHorizon: list.some((r) => r.agencyId === 'horizon'),
      stops: list.find((r) => r.stops?.length)?.stops || null,
      routes: list.slice().sort((a, b) => a.departureTime.localeCompare(b.departureTime)),
    }))
    list.sort((a, b) => (b.hasHorizon ? 1 : 0) - (a.hasHorizon ? 1 : 0))
    return list
  }, [])

  const groups = useMemo(() => {
    let list = allGroups
    if (fromValue) list = list.filter((g) => g.origin === fromValue)
    if (toValue) list = list.filter((g) => g.destination === toValue)
    return list
  }, [allGroups, fromValue, toValue])

  const selectedGroup = useMemo(() => allGroups.find((g) => g.key === selectedKey) || null, [allGroups, selectedKey])

  function swapValues() {
    setFromValue(toValue)
    setToValue(fromValue)
  }

  function openGroup(g) {
    const [origin, destination] = g.key.split(' → ')
    const stops = g.stops || [origin, destination]
    setSelectedKey(g.key)
    onPreviewRoute?.({ origin, destination, stops })
  }

  function closeGroup() {
    setSelectedKey(null)
    onPreviewRoute?.(null)
  }

  if (selectedGroup) {
    const [origin, destination] = selectedGroup.key.split(' → ')
    const stops = selectedGroup.stops || [origin, destination]
    const detailContent = (
      <>
        <button
          type="button"
          onClick={closeGroup}
          className="mb-4 hidden items-center gap-2 text-sm text-gerayo-muted hover:text-white md:flex"
        >
          <span aria-hidden="true">←</span>
          {t('schedules.backToRoutes') || 'Back'}
        </button>

        <div className="mb-4">
          <div className="text-lg font-semibold text-white">{selectedGroup.key}</div>
          {selectedGroup.hasHorizon && (
            <span className="mt-2 inline-block rounded-full bg-gerayo-bg border border-gerayo-border px-2 py-0.5 text-[10px] font-medium text-gerayo-muted">
              {t('schedules.officialTimes')}
            </span>
          )}
        </div>

        <div className="mb-5 space-y-1.5">
          {stops.map((stop, i) => (
            <div key={`${stop}-${i}`} className="flex items-center gap-2 text-xs text-gerayo-muted">
              <span className="h-1.5 w-1.5 flex-none rounded-full border border-gerayo-muted" />
              {i + 1}. {stop}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {selectedGroup.routes.map((r) => {
            const agency = agencyOf(r.agencyId)
            return (
              <button
                type="button"
                key={r.id}
                onClick={() => onOpenDetail?.(r)}
                className="flex w-full items-center justify-between gap-2 rounded-lg px-1 py-1 text-sm text-left transition hover:bg-gerayo-border/60"
              >
                <span className="w-14 flex-none font-semibold text-white">{r.departureTime}</span>
                <span
                  className="min-w-0 flex-1 truncate rounded-md px-2 py-0.5 text-center text-xs font-bold text-white"
                  style={{ background: agency?.color }}
                >
                  {agency?.name}
                </span>
                <span className="w-20 flex-none text-right text-gerayo-muted">{r.price.toLocaleString()} RWF</span>
              </button>
            )
          })}
        </div>
      </>
    )

    return (
      <div className="jd-scroll flex-1 overflow-y-auto md:p-4">
        <DraggableSheet
          className="md:hidden"
          mapContent={
            <>
              <MapPanel selectedRoute={{ origin, destination, stops }} className="h-full w-full" />
              <button
                type="button"
                onClick={closeGroup}
                aria-label={t('schedules.backToRoutes') || 'Back'}
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
      <div className="mb-4 flex items-center gap-2">
        <RouteStopCombobox
          label={t('schedules.fromPlaceholder')}
          value={fromValue}
          onChange={setFromValue}
          options={origins}
          dotColor="#8b5cf6"
        />
        <button
          type="button"
          onClick={swapValues}
          aria-label={t('schedules.swapRoute')}
          className="flex-shrink-0 rounded-full border border-gerayo-border bg-gerayo-card/60 p-2 text-gerayo-muted hover:text-white"
        >
          ⇄
        </button>
        <RouteStopCombobox
          label={t('schedules.toPlaceholder')}
          value={toValue}
          onChange={setToValue}
          options={destinations.filter((d) => d !== fromValue)}
          dotColor="#22c55e"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {groups.map((g) => {
          const [origin, destination] = g.key.split(' → ')
          return (
            <button
              type="button"
              key={g.key}
              title={g.key}
              onClick={() => openGroup(g)}
              className="truncate rounded-xl border border-gerayo-border bg-gerayo-card/60 px-2 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-gerayo-border/60"
            >
              {abbreviateTown(origin)} → {abbreviateTown(destination)}
            </button>
          )
        })}
        {groups.length === 0 && (
          <div className="col-span-full py-10 text-center text-sm text-gerayo-muted">{t('search.noResultsFound')}</div>
        )}
      </div>
    </div>
  )
}
