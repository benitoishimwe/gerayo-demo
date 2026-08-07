import { useLanguage } from '../../i18n/LanguageContext'

const TOP_TABS = [
  {
    key: 'kigali',
    labelKey: 'header.kigaliCity',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M4 21V6l6-3v18M4 21h16M10 21V10l6-2v13M10 3l6 5"
          stroke={active ? '#ffffff' : '#9ca3af'}
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    key: 'provinces',
    labelKey: 'header.provinces',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <circle cx="12" cy="12" r="9" stroke={active ? '#ffffff' : '#9ca3af'} strokeWidth="1.6" />
        <path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9Z" stroke={active ? '#ffffff' : '#9ca3af'} strokeWidth="1.6" />
      </svg>
    ),
  },
]

export function Header({ onOpenAccount, onOpenTapGo, activeTopTab = 'provinces', onChangeTopTab, showTickets = false, showSchedules = false }) {
  const { t } = useLanguage()
  const title = showTickets ? t('header.tickets') : showSchedules ? t('nav.schedules') : 'Gerayo'
  return (
    <div className="flex-shrink-0 border-b border-gerayo-border">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-xl font-bold text-white">{title}</span>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTapGo}
            aria-label={t('tapgo.navLabel')}
            className="flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-lime-500 px-3 text-xs font-bold text-black hover:brightness-110 transition"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <rect x="2" y="6" width="20" height="14" rx="2" stroke="black" strokeWidth="1.8" />
              <path d="M6 2v4M12 1v6M18 2v4" stroke="black" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            {t('tapgo.navLabel')}
          </button>
          <button
            onClick={onOpenAccount}
            aria-label={t('header.account')}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gerayo-card border border-gerayo-border text-gerayo-text hover:bg-gerayo-border transition"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M4.5 20c1.5-3.5 5-5 7.5-5s6 1.5 7.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {!showTickets && !showSchedules && (
        <div className="flex px-4 text-sm font-semibold">
          {TOP_TABS.map((tab) => {
            const isActive = activeTopTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => onChangeTopTab?.(tab.key)}
                className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-2 py-2 transition ${
                  isActive ? 'border-gerayo-from text-white' : 'border-transparent text-gerayo-muted'
                }`}
              >
                {tab.icon(isActive)}
                {t(tab.labelKey)}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
