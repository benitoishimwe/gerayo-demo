import { useLanguage } from '../../i18n/LanguageContext'

const TABS = [
  {
    key: 'trip',
    labelKey: 'nav.trip',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path
          d="M12 2 3 8v3l9-2 9 2V8l-9-6Z"
          stroke={active ? '#22c55e' : '#9ca3af'}
          strokeWidth="1.6"
          strokeLinejoin="round"
          fill={active ? '#22c55e' : 'none'}
        />
        <path
          d="M9 12 4 20l8-3 8 3-5-8"
          stroke={active ? '#22c55e' : '#9ca3af'}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: 'schedules',
    labelKey: 'nav.schedules',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <rect x="4" y="3" width="16" height="18" rx="2" stroke={active ? '#22c55e' : '#9ca3af'} strokeWidth="1.6" />
        <path d="M7 8h10M7 12h10M7 16h6" stroke={active ? '#22c55e' : '#9ca3af'} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'tickets',
    labelKey: 'nav.tickets',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path
          d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a1.5 1.5 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a1.5 1.5 0 0 0 0-4V8Z"
          stroke={active ? '#22c55e' : '#9ca3af'}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M14 6v12" stroke={active ? '#22c55e' : '#9ca3af'} strokeWidth="1.6" strokeDasharray="2 2" />
      </svg>
    ),
  },
]

export function BottomNav({ active, onChange }) {
  const { t } = useLanguage()
  return (
    <div className="flex flex-shrink-0 items-stretch justify-around border-t border-gerayo-border bg-gerayo-bg px-2 py-2">
      {TABS.map((tab) => {
        const isActive = active === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className="flex flex-1 flex-col items-center gap-1 py-1"
          >
            {tab.icon(isActive)}
            <span className={`text-xs ${isActive ? 'font-semibold text-white' : 'text-gerayo-muted'}`}>
              {t(tab.labelKey)}
            </span>
          </button>
        )
      })}
    </div>
  )
}
