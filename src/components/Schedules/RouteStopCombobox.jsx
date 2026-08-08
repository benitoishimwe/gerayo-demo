import { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'

export function RouteStopCombobox({ label, value, onChange, options, dotColor }) {
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

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.toLowerCase().includes(q))
  }, [query, options])

  function selectOption(option) {
    onChange(option)
    setQuery(option)
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
      if (activeIndex >= 0 && matches[activeIndex]) selectOption(matches[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
      setQuery(value || '')
    }
  }

  return (
    <div ref={rootRef} className="relative flex-1 min-w-0">
      <label className="flex items-center gap-2 rounded-xl bg-gerayo-card border border-gerayo-border px-3 py-2.5">
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
          className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-gerayo-muted"
        />
        {value && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              onChange('')
              setQuery('')
              inputRef.current?.focus()
            }}
            className="flex-shrink-0 text-gerayo-muted hover:text-white"
            aria-label="Clear"
          >
            ✕
          </button>
        )}
      </label>

      {open && (
        <div className="absolute z-20 mt-1 w-full max-h-80 overflow-y-auto rounded-xl bg-gerayo-card border border-gerayo-border shadow-2xl py-1">
          {matches.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gerayo-muted">{t('search.noResultsFound')}</div>
          ) : (
            matches.map((option) => (
              <button
                key={option}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectOption(option)}
                onMouseEnter={() => setActiveIndex(matches.indexOf(option))}
                className={`w-full text-left px-4 py-2 text-sm text-gerayo-text ${
                  matches.indexOf(option) === activeIndex ? 'bg-gerayo-border' : 'hover:bg-gerayo-border'
                } ${option === value ? 'font-semibold' : ''}`}
              >
                {option}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
