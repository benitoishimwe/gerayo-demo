const STORAGE_KEY = 'gerayo:routeHistory'
const MAX_ITEMS = 8

export function getRouteHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addRouteHistory(origin, destination) {
  if (!origin || !destination) return
  try {
    const existing = getRouteHistory().filter(
      (r) => !(r.origin === origin && r.destination === destination),
    )
    const next = [{ origin, destination, searchedAt: Date.now() }, ...existing].slice(0, MAX_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    return next
  } catch {
    // ignore storage errors
  }
}

export function clearRouteHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore storage errors
  }
}
