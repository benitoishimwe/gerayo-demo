import { useMemo, useState } from 'react'
import routes from '../../data/routes.json'
import agencies from '../../data/agencies.json'
import { useLanguage } from '../../i18n/LanguageContext'

function agencyOf(id) {
  return agencies.find((a) => a.id === id)
}

export function SchedulesView() {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')

  const groups = useMemo(() => {
    const map = new Map()
    for (const r of routes) {
      const key = `${r.origin} → ${r.destination}`
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(r)
    }
    let list = Array.from(map.entries()).map(([key, list]) => ({
      key,
      hasHorizon: list.some((r) => r.agencyId === 'horizon'),
      routes: list.slice().sort((a, b) => a.departureTime.localeCompare(b.departureTime)),
    }))
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter((g) => g.key.toLowerCase().includes(q))
    }
    list.sort((a, b) => (b.hasHorizon ? 1 : 0) - (a.hasHorizon ? 1 : 0))
    return list
  }, [query])

  return (
    <div className="jd-scroll flex-1 overflow-y-auto p-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('schedules.searchPlaceholder')}
        className="mb-4 w-full rounded-xl border border-gerayo-border bg-gerayo-card/60 px-3 py-2.5 text-sm text-white outline-none focus:border-gerayo-from"
      />

      <div className="space-y-5">
        {groups.map((g) => (
          <div key={g.key} className="rounded-2xl border border-gerayo-border bg-gerayo-card/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-white">{g.key}</div>
              {g.hasHorizon && (
                <span className="rounded-full bg-gerayo-bg border border-gerayo-border px-2 py-0.5 text-[10px] font-medium text-gerayo-muted">
                  {t('schedules.officialTimes')}
                </span>
              )}
            </div>
            <div className="space-y-2">
              {g.routes.map((r) => {
                const agency = agencyOf(r.agencyId)
                return (
                  <div key={r.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="w-14 flex-none font-semibold text-white">{r.departureTime}</span>
                    <span
                      className="min-w-0 flex-1 truncate rounded-md px-2 py-0.5 text-center text-xs font-bold text-white"
                      style={{ background: agency?.color }}
                    >
                      {agency?.name}
                    </span>
                    <span className="w-20 flex-none text-right text-gerayo-muted">{r.price.toLocaleString()} RWF</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
        {groups.length === 0 && <div className="py-10 text-center text-sm text-gerayo-muted">{t('search.noResultsFound')}</div>}
      </div>
    </div>
  )
}
