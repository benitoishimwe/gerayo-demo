import { useState } from 'react'
import { Button } from '../common/Button'
import { useLanguage } from '../../i18n/LanguageContext'

export function TapGoEnroll({ onEnroll }) {
  const { t } = useLanguage()
  const [cardId, setCardId] = useState('')
  const [error, setError] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!onEnroll(cardId)) {
      setError(true)
      return
    }
    setError(false)
  }

  return (
    <div>
      <h3 className="text-base font-bold text-white">{t('tapgo.enrollTitle')}</h3>
      <p className="mt-1 text-sm text-gerayo-muted">{t('tapgo.enrollSubtitle')}</p>

      <form onSubmit={submit} className="mt-4 space-y-3">
        <div>
          <label className="mb-1 block text-xs text-gerayo-muted">{t('tapgo.cardId')}</label>
          <input
            type="text"
            value={cardId}
            onChange={(e) => setCardId(e.target.value)}
            required
            placeholder="TG-12345678"
            className="w-full rounded-xl border border-gerayo-border bg-gerayo-card px-4 py-3 font-mono text-sm text-white outline-none focus:border-gerayo-from"
          />
        </div>
        {error && <p className="text-sm text-red-400">{t('tapgo.enrollError')}</p>}
        <Button type="submit">{t('tapgo.enrollButton')}</Button>
      </form>

      <div className="mt-4 rounded-xl border border-dashed border-gerayo-border bg-gerayo-card/60 px-4 py-3 text-xs text-gerayo-muted">
        <div className="mb-1 font-semibold text-gerayo-text">{t('tapgo.enrollDemoTitle')}</div>
        <div className="font-mono">TG-88881234</div>
        <button
          type="button"
          onClick={() => setCardId('TG-88881234')}
          className="mt-2 font-medium text-gerayo-from hover:underline"
        >
          {t('tapgo.enrollUseDemo')}
        </button>
      </div>
    </div>
  )
}
