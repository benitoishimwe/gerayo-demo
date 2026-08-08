import { useEffect, useMemo, useRef, useState } from 'react'
import { allStops } from '../../utils/kigaliJourney'
import { useLanguage } from '../../i18n/LanguageContext'

function filterStops(query) {
  const q = query.trim().toLowerCase()
  const stops = allStops()
  if (!q) return stops
  return stops.filter((s) => s.name.toLowerCase().includes(q))
}

export function KigaliStopCombobox({ label, value, onChange, dotColor }) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(value || '')
  const [activeIndex, setActiveIndex] = useState(-1)
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

  const matches = useMemo(() => filterStops(query), [query])

  function selectStop(stop) {
    onChange(stop.name)
    setQuery(stop.name)
    setOpen(false)
    setActiveIndex(-1)
    inputRef.current?.blur()
  }

  function handleKeyDown(e) {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') setOpen(true)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, matches.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && matches[activeIndex]) selectStop(matches[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
      setQuery(value || '')
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <label className="flex items-center gap-3 rounded-xl bg-gerayo-card border border-gerayo-border px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: dotColor }} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={label}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setActiveIndex(-1)
            if (!e.target.value) onChange('')
          }}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-gerayo-text outline-none placeholder:text-gerayo-muted"
        />
      </label>

      {open && (
        <div className="absolute z-20 mt-1 w-full max-h-80 overflow-y-auto rounded-xl bg-gerayo-card border border-gerayo-border shadow-2xl py-1">
          {matches.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gerayo-muted">{t('search.noResultsFound')}</div>
          ) : (
            matches.map((s) => (
              <button
                key={s.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectStop(s)}
                onMouseEnter={() => setActiveIndex(matches.indexOf(s))}
                className={`w-full text-left px-4 py-2 text-sm text-gerayo-text ${
                  matches.indexOf(s) === activeIndex ? 'bg-gerayo-border' : 'hover:bg-gerayo-border'
                } ${s.name === value ? 'font-semibold' : ''}`}
              >
                {s.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
