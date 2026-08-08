import { useState } from 'react'
import { Button } from '../common/Button'
import { useLanguage } from '../../i18n/LanguageContext'
export function AuthForm({ auth, title, subtitle }) {
  const { t } = useLanguage()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const submit = (e) => {
    e.preventDefault()
    const result = mode === 'login' ? auth.login(email, password) : auth.signup(email, password)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setError(null)
  }

  return (
    <div>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-base font-bold text-white">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gerayo-muted">{subtitle}</p>}
        </div>
      )}

      <div className="mb-4 flex overflow-hidden rounded-xl border border-gerayo-border">
        {['login', 'signup'].map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setMode(key)
              setError(null)
            }}
            className={`flex-1 py-2.5 text-sm font-medium transition ${
              mode === key ? 'bg-gerayo-from text-black' : 'bg-gerayo-card/60 text-gerayo-muted hover:text-white'
            }`}
          >
            {t(`auth.${key}`)}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-gerayo-muted">{t('auth.email')}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-gerayo-border bg-gerayo-card px-4 py-3 text-sm text-white outline-none focus:border-gerayo-from"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gerayo-muted">{t('auth.password')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-gerayo-border bg-gerayo-card px-4 py-3 text-sm text-white outline-none focus:border-gerayo-from"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-sm text-red-400">{t(`auth.errors.${error}`)}</p>}

        <Button type="submit">{t(mode === 'login' ? 'auth.signInButton' : 'auth.signUpButton')}</Button>
      </form>
    </div>
  )
}
