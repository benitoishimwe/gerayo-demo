import { useLanguage } from '../../i18n/LanguageContext'

const METHODS = [
  { id: 'wallet', labelKey: 'payment.methods.wallet', icon: '👛', tint: 'bg-gerayo-from/15 text-gerayo-from' },
  { id: 'tapgo', labelKey: 'payment.methods.tapgo', icon: '🚏', tint: 'bg-lime-500/15 text-lime-400' },
  { id: 'momo', labelKey: 'payment.methods.momo', icon: '📱', tint: 'bg-yellow-500/15 text-yellow-400' },
  { id: 'airtel', labelKey: 'payment.methods.airtel', icon: '📶', tint: 'bg-red-500/15 text-red-400' },
]

export function PaymentMethodList({ selected, onSelect, balance, tapgoBalance = 0, total }) {
  const { t } = useLanguage()
  return (
    <div className="overflow-hidden rounded-xl border border-gerayo-border bg-gerayo-card/60">
      {METHODS.map((m, i) => {
        const insufficient = (m.id === 'wallet' && balance < total) || (m.id === 'tapgo' && tapgoBalance < total)
        const isSelected = selected === m.id
        return (
          <button
            key={m.id}
            disabled={insufficient}
            onClick={() => onSelect(m.id)}
            className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition disabled:opacity-40 ${
              i > 0 ? 'border-t border-gerayo-border' : ''
            } ${isSelected ? 'bg-gerayo-to/10' : 'hover:bg-white/5'}`}
          >
            <span
              className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${
                isSelected ? 'border-gerayo-to' : 'border-gerayo-muted'
              }`}
            >
              {isSelected && <span className="h-2 w-2 rounded-full bg-gerayo-to" />}
            </span>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">{t(m.labelKey)}</div>
              {m.id === 'wallet' && (
                <div className="text-xs text-gerayo-muted">{t('payment.methods.walletBalance', { balance: balance.toLocaleString() })}</div>
              )}
              {m.id === 'tapgo' && (
                <div className="text-xs text-gerayo-muted">{t('payment.methods.tapgoBalance', { balance: tapgoBalance.toLocaleString() })}</div>
              )}
              {insufficient && <div className="text-xs text-red-400">{t('payment.insufficientBalance')}</div>}
            </div>
            <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-base ${m.tint}`}>
              {m.icon}
            </span>
          </button>
        )
      })}
    </div>
  )
}
