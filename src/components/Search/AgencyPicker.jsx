import { useEffect, useState } from 'react'
import agencies from '../../data/agencies.json'
import { useLanguage } from '../../i18n/LanguageContext'

function initials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function AgencyPicker({ agencyIds, setAgencyIds, compact = false }) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(agencyIds)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (!open) return
    setDraft(agencyIds)
    function handleKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, agencyIds])

  const allSelected = agencyIds.length === agencies.length
  const label = allSelected
    ? t('search.allAgencies')
    : agencyIds.length === 1
    ? agencies.find((a) => a.id === agencyIds[0])?.name
    : t('search.agenciesCount', { count: agencyIds.length })
  const selectedOne = agencyIds.length === 1 ? agencies.find((a) => a.id === agencyIds[0]) : null

  const toggle = (id) => {
    setDraft((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const resetDraft = () => setDraft(agencies.map((a) => a.id))

  const done = () => {
    setAgencyIds(draft.length ? draft : agencies.map((a) => a.id))
    setOpen(false)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={label}
        title={label}
        className={
          compact
            ? 'relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gerayo-card border border-gerayo-border text-gerayo-text hover:border-gerayo-from transition'
            : 'flex flex-shrink-0 items-center gap-2 rounded-full bg-gerayo-card border border-gerayo-border px-4 py-2.5 text-sm text-gerayo-text hover:border-gerayo-from transition whitespace-nowrap max-w-[55%]'
        }
      >
        {compact ? (
          <>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path d="M3 5.5h14M3 10h14M3 14.5h14" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="7" cy="5.5" r="1.6" fill="currentColor" stroke="none" />
              <circle cx="13" cy="10" r="1.6" fill="currentColor" stroke="none" />
              <circle cx="8.5" cy="14.5" r="1.6" fill="currentColor" stroke="none" />
            </svg>
            {!allSelected && (
              <span
                className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-gerayo-card"
                style={{ background: selectedOne ? selectedOne.color : '#22c55e' }}
              />
            )}
          </>
        ) : (
          <>
            {selectedOne && (
              <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: selectedOne.color }} />
            )}
            <span className="truncate">{label}</span>
            <svg className="h-4 w-4 flex-shrink-0 text-gerayo-muted" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path d="M3 5.5h14M3 10h14M3 14.5h14" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="7" cy="5.5" r="1.6" fill="currentColor" stroke="none" />
              <circle cx="13" cy="10" r="1.6" fill="currentColor" stroke="none" />
              <circle cx="8.5" cy="14.5" r="1.6" fill="currentColor" stroke="none" />
            </svg>
          </>
        )}
      </button>

      {open && (
        <div className="absolute inset-0 z-50 flex flex-col">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />

          <div className="jd-scroll relative flex w-full h-full flex-col overflow-y-auto bg-gerayo-card border border-gerayo-border">
            <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b border-gerayo-border bg-gerayo-card">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gerayo-muted hover:text-gerayo-text"
                aria-label={t('common.close')}
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                  <path d="M5 5l10 10M15 5L5 15" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <button type="button" onClick={resetDraft} className="text-sm text-gerayo-muted hover:text-gerayo-text">
                {t('common.reset')}
              </button>
            </div>

            <div className="p-4">
              <h2 className="mb-4 text-lg font-semibold text-gerayo-text">{t('search.agenciesTitle')}</h2>

              <div className="grid grid-cols-3 gap-2">
                {agencies.map((a) => {
                  const checked = draft.includes(a.id)
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => toggle(a.id)}
                      className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-3 text-center transition ${
                        checked ? 'border-gerayo-from bg-gerayo-border/40' : 'border-gerayo-border bg-gerayo-panel'
                      }`}
                    >
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-black"
                        style={{ background: a.color }}
                      >
                        {initials(a.name)}
                      </span>
                      <span className="text-[11px] font-medium leading-tight text-gerayo-text">{a.name}</span>
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-md border ${
                          checked ? 'bg-gerayo-from border-gerayo-from' : 'border-gerayo-muted'
                        }`}
                      >
                        {checked && (
                          <svg className="h-3 w-3 text-black" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                            <path d="M4 10l4 4 8-8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="sticky bottom-0 border-t border-gerayo-border bg-gerayo-card p-4">
              <button
                type="button"
                onClick={done}
                className="w-full rounded-xl bg-gerayo-from px-4 py-3 font-medium text-black hover:brightness-110 transition"
              >
                {t('common.done')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="pointer-events-none absolute inset-x-0 bottom-20 z-[60] flex justify-center px-4">
          <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-black">
              <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <path d="M4 10l4 4 8-8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-sm font-medium text-black">{t('search.agenciesUpdatedToast')}</span>
          </div>
        </div>
      )}
    </>
  )
}
