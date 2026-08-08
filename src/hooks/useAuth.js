import { useLocalStorage } from './useLocalStorage'

const USER_KEY = 'gerayo_auth_user'

export const DEMO_EMAIL = 'kevin.ishimwe0002@gmail.com'
export const DEMO_PASSWORD = 'demo1234'

export function useAuth() {
  const [user, setUser] = useLocalStorage(USER_KEY, null)

  const login = (email, password) => {
    const normalized = email.trim().toLowerCase()
    if (normalized === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setUser({ email: DEMO_EMAIL })
      return { ok: true }
    }
    return { ok: false, error: 'invalidCredentials' }
  }

  const signup = (email, password) => {
    const normalized = email.trim().toLowerCase()
    if (!normalized || !normalized.includes('@')) return { ok: false, error: 'invalidEmail' }
    if (!password || password.length < 4) return { ok: false, error: 'weakPassword' }
    setUser({ email: normalized })
    return { ok: true }
  }

  const logout = () => setUser(null)

  return { user, isAuthenticated: Boolean(user), login, signup, logout }
}
