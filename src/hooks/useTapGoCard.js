import { useLocalStorage } from './useLocalStorage'

const DEFAULT_BALANCE = 1500
const CARD_ID_KEY = 'gerayo_tapgo_card_id'
const BALANCE_KEY = 'gerayo_tapgo_balance'
const TRANSACTIONS_KEY = 'gerayo_tapgo_transactions'

function randomCardId() {
  const digits = Math.floor(10000000 + Math.random() * 89999999)
  return `TG-${digits}`
}

export function useTapGoCard() {
  const [cardId] = useLocalStorage(CARD_ID_KEY, randomCardId())
  const [balance, setBalance] = useLocalStorage(BALANCE_KEY, DEFAULT_BALANCE)
  const [transactions, setTransactions] = useLocalStorage(TRANSACTIONS_KEY, [])

  const addTransaction = (entry) => {
    setTransactions((list) => [{ id: `TX-${Date.now()}`, timestamp: Date.now(), ...entry }, ...list])
  }

  const topUp = (amount, method) => {
    setBalance((b) => b + amount)
    addTransaction({ type: 'topup', amount, method })
  }

  const tapBoard = (route) => {
    if (route.fare > balance) return false
    setBalance((b) => b - route.fare)
    addTransaction({ type: 'boarded', amount: route.fare, origin: route.origin, destination: route.destination, routeId: route.id })
    return true
  }

  const tapExit = (route) => {
    addTransaction({ type: 'exited', amount: 0, destination: route.destination, routeId: route.id })
  }

  return { cardId, balance, transactions, topUp, tapBoard, tapExit }
}
