import { useEffect, useRef, useState } from 'react'
import coords from '../data/coords.json'

const TICK_MS = 1000
const TRIP_DURATION_S = 90 // simulated end-to-end travel time for the demo bus

function lerp(a, b, t) {
  return a + (b - a) * t
}

export function useBusTracking(route) {
  const [progress, setProgress] = useState(0.15)
  const startRef = useRef(Date.now())

  useEffect(() => {
    if (!route) return
    startRef.current = Date.now()
    setProgress(0.15)
    const interval = setInterval(() => {
      setProgress((p) => (p >= 1 ? 0.05 : p + 1 / TRIP_DURATION_S))
    }, TICK_MS)
    return () => clearInterval(interval)
  }, [route?.id])

  if (!route) return null

  const origin = coords[route.origin]
  const destination = coords[route.destination]
  if (!origin || !destination) return null

  const position = [lerp(origin[0], destination[0], progress), lerp(origin[1], destination[1], progress)]
  const remainingMins = Math.max(1, Math.round((1 - progress) * (TRIP_DURATION_S / 60) * 8))
  const speedKmh = 28 + Math.round(Math.sin(progress * Math.PI * 4) * 6)

  return { position, origin, destination, progress, etaMinutes: remainingMins, speedKmh, updatedAt: Date.now() }
}
