import { useState } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'

const PRESETS = [1000, 2000, 5000, 10000]

const REFILL_METHODS = [
  { id: 'momo', label: 'MTN Mobile Money', icon: '📱' },
  { id: 'airtel', label: 'Airtel Money', icon: '📶' },
]

export function WalletTopUpModal({ balance = 0, onClose, onTopUp }) {
  const [amount, setAmount] = useState(PRESETS[0])
  const [editing, setEditing] = useState(false)
  const [method, setMethod] = useState(REFILL_METHODS[0].id)

  const setPreset = (p) => {
    setAmount(p)
    setEditing(false)
  }

  const handleCustomChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '')
    setAmount(digits ? Number(digits) : 0)
  }

  return (
    <Modal title="Wallet" onClose={onClose} sidebar>
      <div className="flex h-full flex-col">
      <div className="rounded-2xl bg-gradient-to-br from-gerayo-card to-gerayo-card/60 border border-gerayo-border px-4 py-3 mb-6">
        <div className="text-xs text-gerayo-muted">Funds in the wallet</div>
        <div className="text-2xl font-bold text-white">{balance.toLocaleString()} RWF</div>
      </div>

      <div className="flex flex-col items-center">
        <div className="text-xs text-gerayo-muted mb-1">Refill amount</div>
        {editing ? (
          <input
            autoFocus
            value={amount || ''}
            onChange={handleCustomChange}
            onBlur={() => setEditing(false)}
            placeholder="0"
            className="w-40 bg-transparent text-center text-4xl font-bold text-white outline-none"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-4xl font-bold text-white"
          >
            {amount ? amount.toLocaleString() : '0'} <span className="text-2xl align-top">RWF</span>
          </button>
        )}
        <div className="mt-2 h-0.5 w-40 bg-gerayo-from" />
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setPreset(p)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              amount === p ? 'border-gerayo-from text-gerayo-from' : 'border-gerayo-border text-gerayo-muted'
            }`}
          >
            {p.toLocaleString()} RWF
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-2">
        {REFILL_METHODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
              method === m.id ? 'border-gerayo-from bg-gerayo-card' : 'border-gerayo-border bg-gerayo-card/60'
            }`}
          >
            <span className="text-xl">{m.icon}</span>
            <div className="flex-1 text-sm font-medium text-white">{m.label}</div>
            <span
              className={`h-4 w-4 rounded-full border-2 ${
                method === m.id ? 'border-gerayo-from bg-gerayo-from' : 'border-gerayo-muted'
              }`}
            />
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-1.5 border-t border-gerayo-border pt-4 text-sm">
        <div className="flex justify-between text-gerayo-muted">
          <span>Wallet refill</span>
          <span>{amount.toLocaleString()} RWF</span>
        </div>
        <div className="flex justify-between text-gerayo-muted">
          <span>Service fee</span>
          <span>0 RWF</span>
        </div>
        <div className="flex justify-between font-semibold text-white">
          <span>Total</span>
          <span>{amount.toLocaleString()} RWF</span>
        </div>
      </div>

      <Button className="mt-auto pt-5" disabled={!amount} onClick={() => onTopUp(amount)}>
        Confirm payment · {amount ? amount.toLocaleString() : 0} RWF
      </Button>
      </div>
    </Modal>
  )
}
