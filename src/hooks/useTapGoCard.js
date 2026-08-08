import { useLocalStorage } from './useLocalStorage'

const DEFAULT_BALANCE = 1500
const CARDS_KEY = 'gerayo_tapgo_cards'
const ACTIVE_CARD_KEY = 'gerayo_tapgo_active_card'
const ARCHIVED_CARDS_KEY = 'gerayo_tapgo_archived_cards'

// Legacy single-card keys, migrated into the cards list on first load.
const LEGACY_CARD_ID_KEY = 'gerayo_tapgo_card_id'
const LEGACY_BALANCE_KEY = 'gerayo_tapgo_balance'
const LEGACY_TRANSACTIONS_KEY = 'gerayo_tapgo_transactions'

function migrateLegacyCard() {
  try {
    const legacyId = JSON.parse(window.localStorage.getItem(LEGACY_CARD_ID_KEY) ?? 'null')
    if (!legacyId) return null
    const balance = JSON.parse(window.localStorage.getItem(LEGACY_BALANCE_KEY) ?? String(DEFAULT_BALANCE))
    const transactions = JSON.parse(window.localStorage.getItem(LEGACY_TRANSACTIONS_KEY) ?? '[]')
    window.localStorage.removeItem(LEGACY_CARD_ID_KEY)
    window.localStorage.removeItem(LEGACY_BALANCE_KEY)
    window.localStorage.removeItem(LEGACY_TRANSACTIONS_KEY)
    return { id: legacyId, label: '', balance, transactions }
  } catch {
    return null
  }
}

const migratedCard = typeof window !== 'undefined' ? migrateLegacyCard() : null

export function useTapGoCard() {
  const [cards, setCards] = useLocalStorage(CARDS_KEY, migratedCard ? [migratedCard] : [])
  const [activeCardId, setActiveCardId] = useLocalStorage(ACTIVE_CARD_KEY, migratedCard?.id ?? null)
  const [archivedCards, setArchivedCards] = useLocalStorage(ARCHIVED_CARDS_KEY, [])

  const activeId = activeCardId && cards.some((c) => c.id === activeCardId) ? activeCardId : cards[0]?.id ?? null
  const activeCard = cards.find((c) => c.id === activeId) ?? null

  const updateCard = (id, updater) => {
    setCards((list) => list.map((c) => (c.id === id ? updater(c) : c)))
  }

  const enroll = (id, label = '') => {
    const trimmed = id.trim().toUpperCase()
    if (!trimmed) return false
    if (cards.some((c) => c.id === trimmed)) {
      setActiveCardId(trimmed)
      return true
    }
    const archived = archivedCards.find((c) => c.id === trimmed)
    if (archived) {
      const restoredLabel = label.trim() || archived.label
      setCards((list) => [...list, { ...archived, label: restoredLabel }])
      setArchivedCards((list) => list.filter((c) => c.id !== trimmed))
      setActiveCardId(trimmed)
      return true
    }
    const newCard = { id: trimmed, label: label.trim(), balance: DEFAULT_BALANCE, transactions: [] }
    setCards((list) => [...list, newCard])
    setActiveCardId(trimmed)
    return true
  }

  const removeCard = (id) => {
    const removed = cards.find((c) => c.id === id)
    setCards((list) => list.filter((c) => c.id !== id))
    if (removed) {
      setArchivedCards((list) => [...list.filter((c) => c.id !== id), removed])
    }
    if (activeId === id) {
      const remaining = cards.filter((c) => c.id !== id)
      setActiveCardId(remaining[0]?.id ?? null)
    }
  }

  const renameCard = (id, label) => {
    updateCard(id, (c) => ({ ...c, label: label.trim() }))
  }

  const switchCard = (id) => {
    if (cards.some((c) => c.id === id)) setActiveCardId(id)
  }

  const addTransaction = (entry) => {
    if (!activeId) return
    updateCard(activeId, (c) => ({
      ...c,
      transactions: [{ id: `TX-${Date.now()}`, timestamp: Date.now(), ...entry }, ...c.transactions],
    }))
  }

  const topUp = (amount, method) => {
    if (!activeId) return
    updateCard(activeId, (c) => ({ ...c, balance: c.balance + amount }))
    addTransaction({ type: 'topup', amount, method })
  }

  const tapBoard = (route) => {
    if (!activeCard || route.fare > activeCard.balance) return false
    updateCard(activeId, (c) => ({ ...c, balance: c.balance - route.fare }))
    addTransaction({ type: 'boarded', amount: route.fare, origin: route.origin, destination: route.destination, routeId: route.id })
    return true
  }

  const tapExit = (route) => {
    addTransaction({ type: 'exited', amount: 0, destination: route.destination, routeId: route.id })
  }

  const spend = (amount, meta = {}) => {
    if (!activeCard || amount > activeCard.balance) return false
    updateCard(activeId, (c) => ({ ...c, balance: c.balance - amount }))
    addTransaction({ type: 'boarded', amount, ...meta })
    return true
  }

  return {
    cardId: activeCard?.id ?? null,
    cardLabel: activeCard?.label ?? '',
    isEnrolled: Boolean(activeCard),
    balance: activeCard?.balance ?? 0,
    transactions: activeCard?.transactions ?? [],
    cards,
    activeCardId: activeId,
    enroll,
    removeCard,
    renameCard,
    switchCard,
    topUp,
    tapBoard,
    tapExit,
    spend,
  }
}
