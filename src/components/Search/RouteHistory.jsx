import { useLanguage } from '../../i18n/LanguageContext'

function formatGroupLabel(timestamp, t) {
  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

  const formatted = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  if (isSameDay(date, today)) return t('routeHistory.today', { date: formatted })
  if (isSameDay(date, yesterday)) return t('routeHistory.yesterday', { date: formatted })
  return formatted
}

export function RouteHistory({ history, onSelect, onClear }) {
  const { t } = useLanguage()
  const groups = []
  for (const r of history) {
    const label = formatGroupLabel(r.searchedAt, t)
    let group = groups.find((g) => g.label === label)
    if (!group) {
      group = { label, items: [] }
      groups.push(group)
    }
    group.items.push(r)
  }

  return (
    <div className="border-t border-gerayo-border pt-3">
      <h3 className="text-base font-bold text-white">{t('routeHistory.title')}</h3>

      {history.length === 0 ? (
        <p className="mt-2 text-xs text-gerayo-muted">{t('routeHistory.empty')}</p>
      ) : (
        <>
          {groups.map((group) => (
            <div key={group.label} className="mt-3">
              <p className="text-xs text-gerayo-muted">{group.label}</p>
              <ul className="mt-1">
                {group.items.map((r, i) => (
                  <li key={`${r.origin}-${r.destination}-${i}`}>
                    <button
                      onClick={() => onSelect(r)}
                      className="flex w-full flex-col gap-1 rounded-lg px-2 py-2 text-left text-sm text-gerayo-text hover:bg-gerayo-card transition"
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 flex-shrink-0 rounded-full bg-gerayo-from" />
                        <span className="truncate">{r.origin}</span>
                      </span>
                      <span className="flex items-center gap-2 pl-[3px]">
                        <span className="h-3 flex-shrink-0 border-l border-dotted border-gerayo-muted" />
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                        <span className="truncate">{r.destination}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <button
            onClick={onClear}
            className="mt-4 w-full text-center text-xs font-medium text-gerayo-muted underline hover:text-gerayo-text"
          >
            {t('routeHistory.clear')}
          </button>
        </>
      )}
    </div>
  )
}
