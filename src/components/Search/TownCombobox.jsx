import { useEffect, useMemo, useRef, useState } from 'react'
import provinces from '../../data/provinces.json'
import { getRecentTowns, addRecentTown } from '../../utils/recentSearches'
import { useLanguage } from '../../i18n/LanguageContext'

function filterGroups(query) {
  const q = query.trim().toLowerCase()
  if (!q) return provinces
  return provinces
    .map((p) => ({
      province: p.province,
      towns: p.towns.filter((t) => t.toLowerCase().includes(q)),
    }))
    .filter((p) => p.towns.length > 0)
}

function ClockIcon() {
  return (
    <svg className="h-4 w-4 flex-shrink-0 text-gerayo-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="8.5" strokeWidth="1.5" />
      <path d="M12 7.5V12L15 14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TargetIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="7" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <path d="M12 1.5V4M12 20V22.5M1.5 12H4M20 12H22.5" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function TownCombobox({ label, value, onChange, dotColor }) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(value || '')
  const [activeIndex, setActiveIndex] = useState(-1)
  const [recent, setRecent] = useState([])
  const rootRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    setQuery(value || '')
  }, [value])

  useEffect(() => {
    function handleClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false)
        setQuery(value || '')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [value])

  const groups = useMemo(() => filterGroups(open ? query : ''), [open, query])
  const flatTowns = useMemo(() => groups.flatMap((g) => g.towns), [groups])
  const showingRecent = open && !query.trim()

  function selectTown(town) {
    onChange(town)
    setQuery(town)
    addRecentTown(town)
    setOpen(false)
    setActiveIndex(-1)
    inputRef.current?.blur()
  }

  function handleFocus() {
    setRecent(getRecentTowns())
    setOpen(true)
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      () => selectTown('Aho ndi ubu'),
      () => {},
    )
  }

  function handleKeyDown(e) {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setOpen(true)
      }
      return
    }
    if (showingRecent) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, flatTowns.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && flatTowns[activeIndex]) {
        selectTown(flatTowns[activeIndex])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setQuery(value || '')
    }
  }

  let runningIndex = -1

  return (
    <div ref={rootRef} className="relative">
      <label className="flex items-center gap-3 rounded-xl bg-gerayo-card border border-gerayo-border px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: dotColor }} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={label}
          onFocus={handleFocus}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setActiveIndex(-1)
            if (!e.target.value) onChange('')
          }}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-gerayo-text outline-none placeholder:text-gerayo-muted"
        />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={useCurrentLocation}
          className="flex-shrink-0 text-gerayo-muted hover:text-gerayo-from transition"
          aria-label={t('search.useCurrentLocation')}
        >
          <TargetIcon className="h-4 w-4" />
        </button>
      </label>

      {open && (
        <div className="absolute z-20 mt-1 w-full max-h-80 overflow-y-auto rounded-xl bg-gerayo-card border border-gerayo-border shadow-2xl py-1">
          {showingRecent ? (
            <>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={useCurrentLocation}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gerayo-from hover:bg-gerayo-border"
              >
                <TargetIcon className="h-4 w-4 flex-shrink-0" />
                {t('search.useCurrentLocation')}
              </button>
              <div className="px-4 pt-2 pb-1 text-xs font-semibold text-gerayo-muted">
                {t('search.recentSearches')}
              </div>
              {recent.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gerayo-muted">
                  {t('search.noRecentPlaces')}
                </div>
              ) : (
                recent.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectTown(t)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gerayo-text hover:bg-gerayo-border"
                  >
                    <ClockIcon />
                    {t}
                  </button>
                ))
              )}
            </>
          ) : (
            <>
              {flatTowns.length === 0 && (
                <div className="px-4 py-3 text-sm text-gerayo-muted">{t('search.noResultsFound')}</div>
              )}
              {groups.map((g) => (
                <div key={g.province}>
                  <div className="px-4 pt-2 pb-1 text-xs font-semibold text-gerayo-muted">{g.province}</div>
                  {g.towns.map((t) => {
                    runningIndex += 1
                    const idx = runningIndex
                    return (
                      <button
                        key={t}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectTown(t)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={`w-full text-left px-4 py-2 text-sm text-gerayo-text ${
                          idx === activeIndex ? 'bg-gerayo-border' : 'hover:bg-gerayo-border'
                        } ${t === value ? 'font-semibold' : ''}`}
                      >
                        {t}
                      </button>
                    )
                  })}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
