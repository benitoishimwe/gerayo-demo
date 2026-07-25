import { useLocalStorage } from './useLocalStorage'

const DEFAULT_BALANCE = 2700

export function useWallet() {
  const [balance, setBalance] = useLocalStorage('gerayo_wallet_balance', DEFAULT_BALANCE)

  const topUp = (amount) => setBalance((b) => b + amount)
  const deduct = (amount) => {
    if (amount > balance) return false
    setBalance((b) => b - amount)
    return true
  }

  return { balance, topUp, deduct }
}
