const STORAGE_KEY = 'gerayo:recentTowns'
const MAX_ITEMS = 6

export function getRecentTowns() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addRecentTown(town) {
  if (!town) return
  try {
    const existing = getRecentTowns().filter((t) => t !== town)
    const next = [town, ...existing].slice(0, MAX_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // ignore storage errors
  }
}
