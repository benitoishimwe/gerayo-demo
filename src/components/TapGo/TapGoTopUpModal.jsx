import { useState } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { useLanguage } from '../../i18n/LanguageContext'

const PRESETS = [500, 1000, 2000, 5000]

const METHODS = [
  { id: 'agent', icon: '🧍' },
  { id: 'momo', icon: '📱' },
  { id: 'airtel', icon: '📶' },
  { id: 'bank', icon: '💳' },
]

export function TapGoTopUpModal({ balance, onClose, onTopUp }) {
  const { t } = useLanguage()
  const [amount, setAmount] = useState(PRESETS[0])
  const [method, setMethod] = useState(METHODS[0].id)

  return (
    <Modal title={t('tapgo.topUp')} onClose={onClose} sidebar>
      <div className="flex h-full flex-col">
        <div className="rounded-2xl bg-gradient-to-br from-gerayo-card to-gerayo-card/60 border border-gerayo-border px-4 py-3 mb-6">
          <div className="text-xs text-gerayo-muted">{t('tapgo.cardBalance')}</div>
          <div className="text-2xl font-bold text-white">{balance.toLocaleString()} RWF</div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setAmount(p)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                amount === p ? 'border-gerayo-from text-gerayo-from' : 'border-gerayo-border text-gerayo-muted'
              }`}
            >
              {p.toLocaleString()} RWF
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          {METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                method === m.id ? 'border-gerayo-from bg-gerayo-card' : 'border-gerayo-border bg-gerayo-card/60'
              }`}
            >
              <span className="text-xl">{m.icon}</span>
              <div className="flex-1 text-sm font-medium text-white">{t(`tapgo.topUpMethods.${m.id}`)}</div>
              <span
                className={`h-4 w-4 rounded-full border-2 ${
                  method === m.id ? 'border-gerayo-from bg-gerayo-from' : 'border-gerayo-muted'
                }`}
              />
            </button>
          ))}
        </div>

        {method === 'agent' && (
          <div className="mt-3 rounded-xl border border-gerayo-border bg-gerayo-card/40 px-4 py-3 text-xs text-gerayo-muted">
            {t('tapgo.agentNote')}
          </div>
        )}

        <Button className="mt-6" disabled={!amount} onClick={() => onTopUp(amount, method)}>
          {t('tapgo.confirmTopUp', { amount: amount.toLocaleString() })}
        </Button>
      </div>
    </Modal>
  )
}
