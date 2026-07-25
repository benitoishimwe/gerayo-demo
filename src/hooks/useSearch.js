import { useState, useMemo, useEffect } from 'react'
import routes from '../data/routes.json'
import agencies from '../data/agencies.json'
import { getRouteHistory, addRouteHistory, clearRouteHistory } from '../utils/routeHistory'
import { nearestTown } from '../utils/geo'

export function useSearch() {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [agencyIds, setAgencyIds] = useState(() => agencies.map((a) => a.id))
  const [hasSearched, setHasSearched] = useState(false)
  const [dateTime, setDateTime] = useState(() => new Date())
  const [timeMode, setTimeMode] = useState('leave')
  const [routeHistory, setRouteHistory] = useState(() => getRouteHistory())

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin((current) => {
          if (current) return current
          const town = nearestTown(pos.coords.latitude, pos.coords.longitude)
          return town || current
        })
      },
      () => {},
      { timeout: 5000 },
    )
  }, [])

  const results = useMemo(() => {
    if (!hasSearched) return []
    return routes.filter((r) => {
      const originMatch = !origin || r.origin === origin
      const destMatch = !destination || r.destination === destination
      const agencyMatch = agencyIds.length === agencies.length || agencyIds.includes(r.agencyId)
      return originMatch && destMatch && agencyMatch
    })
  }, [origin, destination, agencyIds, hasSearched])

  const canSearch = origin && destination

  const search = () => {
    if (!canSearch) return
    setHasSearched(true)
    const next = addRouteHistory(origin, destination)
    if (next) setRouteHistory(next)
  }

  const reset = () => {
    setHasSearched(false)
  }

  const applyRoute = (route) => {
    setOrigin(route.origin)
    setDestination(route.destination)
  }

  const clearHistory = () => {
    clearRouteHistory()
    setRouteHistory([])
  }

  return {
    origin,
    setOrigin,
    destination,
    setDestination,
    agencyIds,
    setAgencyIds,
    dateTime,
    setDateTime,
    timeMode,
    setTimeMode,
    results,
    canSearch,
    hasSearched,
    search,
    reset,
    routeHistory,
    applyRoute,
    clearHistory,
  }
}
