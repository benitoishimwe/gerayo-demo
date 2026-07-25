import { useEffect, useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'

const WEEKDAY_KEYS = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su']

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatLabel(date, mode) {
  const day = date.toLocaleDateString('en-US', { weekday: 'short' })
  const d = date.getDate()
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`
  return `${day} ${d} ${month} ${time}`
}

function startOfMonthGrid(year, month) {
  const first = new Date(year, month, 1)
  const startOffset = (first.getDay() + 6) % 7 // Monday = 0
  const gridStart = new Date(year, month, 1 - startOffset)
  return gridStart
}

export function DateTimePicker({ value, onChange }) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('leave') // 'leave' | 'arrive'
  const [draft, setDraft] = useState(value)
  const [viewYear, setViewYear] = useState(value.getFullYear())
  const [viewMonth, setViewMonth] = useState(value.getMonth())

  useEffect(() => {
    if (!open) return
    setDraft(value)
    setViewYear(value.getFullYear())
    setViewMonth(value.getMonth())
    function handleKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, value])

  const changeMinutes = (delta) => {
    setDraft((d) => new Date(d.getTime() + delta * 60000))
  }

  const changeMonth = (delta) => {
    let m = viewMonth + delta
    let y = viewYear
    if (m < 0) {
      m = 11
      y -= 1
    } else if (m > 11) {
      m = 0
      y += 1
    }
    setViewMonth(m)
    setViewYear(y)
  }

  const pickDay = (date) => {
    setDraft((d) => {
      const next = new Date(d)
      next.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())
      return next
    })
  }

  const resetToNow = () => {
    const now = new Date()
    setDraft(now)
    setViewYear(now.getFullYear())
    setViewMonth(now.getMonth())
    setMode('leave')
  }

  const save = () => {
    onChange(draft, mode)
    setOpen(false)
  }

  const gridStart = startOfMonthGrid(viewYear, viewMonth)
  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart)
    d.setDate(gridStart.getDate() + i)
    return d
  })

  return (
    <div className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex flex-shrink-0 items-center gap-2 rounded-full bg-gerayo-card border border-gerayo-border px-4 py-2 text-sm text-gerayo-text hover:border-gerayo-from transition whitespace-nowrap"
      >
        {formatLabel(value, mode)}
        <svg className="h-4 w-4 flex-shrink-0 text-gerayo-muted" viewBox="0 0 20 20" fill="none" stroke="currentColor">
          <path d="M5 7.5L10 12.5L15 7.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[1999]" onClick={() => setOpen(false)} />

          <div className="jd-scroll absolute left-0 top-full z-[2000] mt-2 w-72 max-w-[calc(100vw-2rem)] max-h-[70vh] overflow-y-auto rounded-2xl bg-gerayo-panel border border-gerayo-border shadow-xl">
            <div className="flex items-center justify-end px-3 py-1.5 flex-shrink-0">
              <button
                onClick={() => setOpen(false)}
                aria-label={t('common.close')}
                className="h-6 w-6 rounded-full flex items-center justify-center text-gerayo-muted hover:bg-gerayo-card hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="px-3 pb-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex flex-1 rounded-full bg-gerayo-card border border-gerayo-border p-1">
                  <button
                    type="button"
                    onClick={() => setMode('leave')}
                    className={`flex-1 rounded-full px-2 py-1.5 text-xs font-medium transition ${
                      mode === 'leave' ? 'bg-gerayo-border text-white' : 'text-gerayo-muted'
                    }`}
                  >
                    {t('search.leaveAt')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('arrive')}
                    className={`flex-1 rounded-full px-2 py-1.5 text-xs font-medium transition ${
                      mode === 'arrive' ? 'bg-gerayo-border text-white' : 'text-gerayo-muted'
                    }`}
                  >
                    {t('search.arriveBy')}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={resetToNow}
                  aria-label={t('search.resetToNow')}
                  className="h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center text-gerayo-muted hover:bg-gerayo-card hover:text-white transition"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <path d="M4 10a6 6 0 1 1 1.76 4.24M4 10V6m0 4h4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center justify-center gap-6">
                <button
                  type="button"
                  onClick={() => changeMinutes(-1)}
                  className="h-7 w-7 rounded-full flex items-center justify-center text-gerayo-muted hover:bg-gerayo-card hover:text-white transition"
                  aria-label={t('search.earlier')}
                >
                  ‹
                </button>
                <span className="text-lg font-semibold tabular-nums text-gerayo-text">
                  {pad(draft.getHours())} : {pad(draft.getMinutes())}
                </span>
                <button
                  type="button"
                  onClick={() => changeMinutes(1)}
                  className="h-7 w-7 rounded-full flex items-center justify-center text-gerayo-muted hover:bg-gerayo-card hover:text-white transition"
                  aria-label={t('search.later')}
                >
                  ›
                </button>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => changeMonth(-1)}
                  className="h-6 w-6 rounded-full flex items-center justify-center text-gerayo-muted hover:bg-gerayo-card hover:text-white transition"
                  aria-label={t('search.previousMonth')}
                >
                  ‹
                </button>
                <span className="text-sm font-medium text-gerayo-text">
                  {t(`search.months.${viewMonth + 1}`)} {viewYear}
                </span>
                <button
                  type="button"
                  onClick={() => changeMonth(1)}
                  className="h-6 w-6 rounded-full flex items-center justify-center text-gerayo-muted hover:bg-gerayo-card hover:text-white transition"
                  aria-label={t('search.nextMonth')}
                >
                  ›
                </button>
              </div>

              <div className="grid grid-cols-7 gap-y-1 text-center">
                {WEEKDAY_KEYS.map((w) => (
                  <span key={w} className="text-[11px] text-gerayo-muted">
                    {t(`search.weekdays.${w}`)}
                  </span>
                ))}
                {cells.map((d, i) => {
                  const inMonth = d.getMonth() === viewMonth
                  const isSelected =
                    d.getFullYear() === draft.getFullYear() &&
                    d.getMonth() === draft.getMonth() &&
                    d.getDate() === draft.getDate()
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => pickDay(d)}
                      disabled={!inMonth}
                      className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs transition ${
                        isSelected
                          ? 'bg-gerayo-from text-black font-semibold'
                          : inMonth
                          ? 'text-gerayo-text hover:bg-gerayo-card'
                          : 'text-transparent pointer-events-none'
                      }`}
                    >
                      {d.getDate()}
                    </button>
                  )
                })}
              </div>

              <button
                type="button"
                onClick={save}
                className="w-full rounded-xl bg-gerayo-from px-3 py-2 text-sm font-medium text-black hover:brightness-110 transition"
              >
                {t('common.save')}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
