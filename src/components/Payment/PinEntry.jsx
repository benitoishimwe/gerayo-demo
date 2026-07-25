import { useState } from 'react'
import { Button } from '../common/Button'
import { useLanguage } from '../../i18n/LanguageContext'

export function PinEntry({ label, onConfirm, onBack }) {
  const { t } = useLanguage()
  const [pin, setPin] = useState('')

  return (
    <div className="space-y-4">
      <div className="text-sm text-gerayo-muted">{label}</div>

      <div className="relative">
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
          className="absolute inset-0 h-14 w-full cursor-text opacity-0"
          autoFocus
        />
        <div className="flex justify-center gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex h-14 w-12 items-center justify-center rounded-xl border text-2xl font-semibold transition ${
                i < pin.length ? 'border-gerayo-to bg-gerayo-to/10 text-white' : 'border-gerayo-border bg-gerayo-card text-transparent'
              }`}
            >
              {i < pin.length ? '•' : ''}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack}>
          {t('common.back')}
        </Button>
        <Button
          disabled={pin.length !== 4}
          onClick={() => onConfirm(pin)}
          className="bg-gerayo-to text-white hover:brightness-110 disabled:bg-gerayo-to/40"
        >
          {t('payment.confirmPayment')}
        </Button>
      </div>
    </div>
  )
}
