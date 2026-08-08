import { useMemo, useState } from 'react'
import { planJourney } from '../utils/kigaliJourney'
import { getRouteHistory, addRouteHistory, clearRouteHistory } from '../utils/routeHistory'

const STORAGE_KEY = 'gerayo:kigaliRouteHistory'

export function useKigaliSearch() {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [dateTime, setDateTime] = useState(() => new Date())
  const [timeMode, setTimeMode] = useState('leave')
  const [hasSearched, setHasSearched] = useState(false)
  const [searchedAt, setSearchedAt] = useState(null)
  const [routeHistory, setRouteHistory] = useState(() => getRouteHistory(STORAGE_KEY))

  const results = useMemo(() => {
    if (!hasSearched || !searchedAt) return []
    return planJourney(origin, destination, searchedAt)
  }, [origin, destination, hasSearched, searchedAt])

  const canSearch = Boolean(origin && destination && origin !== destination)

  const search = () => {
    if (!canSearch) return
    setSearchedAt(dateTime)
    setHasSearched(true)
    const next = addRouteHistory(origin, destination, STORAGE_KEY)
    if (next) setRouteHistory(next)
  }

  const reset = () => {
    setHasSearched(false)
  }

  const swap = () => {
    setOrigin(destination)
    setDestination(origin)
  }

  const applyRoute = (route) => {
    setOrigin(route.origin)
    setDestination(route.destination)
  }

  const clearHistory = () => {
    clearRouteHistory(STORAGE_KEY)
    setRouteHistory([])
  }

  return {
    origin,
    setOrigin,
    destination,
    setDestination,
    dateTime,
    setDateTime,
    timeMode,
    setTimeMode,
    results,
    canSearch,
    hasSearched,
    search,
    reset,
    swap,
    routeHistory,
    applyRoute,
    clearHistory,
  }
}
