const DEFAULT_STORAGE_KEY = 'gerayo:routeHistory'
const MAX_ITEMS = 8

export function getRouteHistory(storageKey = DEFAULT_STORAGE_KEY) {
  try {
    const raw = localStorage.getItem(storageKey)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addRouteHistory(origin, destination, storageKey = DEFAULT_STORAGE_KEY) {
  if (!origin || !destination) return
  try {
    const existing = getRouteHistory(storageKey).filter(
      (r) => !(r.origin === origin && r.destination === destination),
    )
    const next = [{ origin, destination, searchedAt: Date.now() }, ...existing].slice(0, MAX_ITEMS)
    localStorage.setItem(storageKey, JSON.stringify(next))
    return next
  } catch {
    // ignore storage errors
  }
}

export function clearRouteHistory(storageKey = DEFAULT_STORAGE_KEY) {
  try {
    localStorage.removeItem(storageKey)
  } catch {
    // ignore storage errors
  }
}
