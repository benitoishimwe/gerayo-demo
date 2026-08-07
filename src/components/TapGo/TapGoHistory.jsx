import { useLanguage } from '../../i18n/LanguageContext'

function describe(t, tx) {
  if (tx.type === 'topup') return t('tapgo.transaction.topup', { method: t(`tapgo.topUpMethods.${tx.method}`) })
  if (tx.type === 'boarded') return t('tapgo.transaction.boarded', { origin: tx.origin, destination: tx.destination })
  return t('tapgo.transaction.exited', { destination: tx.destination })
}

export function TapGoHistory({ transactions }) {
  const { t } = useLanguage()

  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-gerayo-muted">
        {t('tapgo.history')}
      </div>
      {transactions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gerayo-border px-4 py-5 text-center text-xs text-gerayo-muted">
          {t('tapgo.noHistory')}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gerayo-border bg-gerayo-card/60">
          {transactions.map((tx, i) => (
            <div
              key={tx.id}
              className={`flex items-center justify-between px-4 py-3 ${i > 0 ? 'border-t border-gerayo-border' : ''}`}
            >
              <div>
                <div className="text-sm text-white">{describe(t, tx)}</div>
                <div className="text-xs text-gerayo-muted">{new Date(tx.timestamp).toLocaleTimeString()}</div>
              </div>
              {tx.amount !== 0 && (
                <span className={`text-sm font-semibold ${tx.type === 'topup' ? 'text-gerayo-from' : 'text-white'}`}>
                  {tx.type === 'topup' ? '+' : '-'}
                  {tx.amount.toLocaleString()} RWF
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
