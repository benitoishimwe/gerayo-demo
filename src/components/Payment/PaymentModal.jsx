import { useState } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { PaymentMethodList } from './PaymentMethodList'
import { PinEntry } from './PinEntry'

const PROMO_CODES = { GERAYO10: 0.1 }

export function PaymentModal({ total, balance, onClose, onOpenTopUp, onPaid }) {
  const [step, setStep] = useState('select')
  const [method, setMethod] = useState(null)
  const [promo, setPromo] = useState('')
  const [promoApplied, setPromoApplied] = useState(0)
  const [error, setError] = useState('')

  const discountedTotal = Math.round(total * (1 - promoApplied))

  const applyPromo = () => {
    const code = promo.trim().toUpperCase()
    if (PROMO_CODES[code]) {
      setPromoApplied(PROMO_CODES[code])
      setError('')
    } else {
      setError('Invalid promo code')
    }
  }

  const startPayment = () => {
    if (!method) return
    if (method === 'wallet') {
      finishPayment()
    } else {
      setStep('pin')
    }
  }

  const finishPayment = () => {
    setStep('processing')
    setTimeout(() => {
      setStep('success')
      setTimeout(() => onPaid(method, discountedTotal), 900)
    }, 1200)
  }

  if (step === 'processing') {
    return (
      <Modal title="Processing payment" onClose={onClose} sidebar>
        <div className="flex flex-col items-center gap-4 py-10">
          <div className="relative h-14 w-14">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-gerayo-border border-t-gerayo-to" />
          </div>
          <span className="gerayo-shimmer bg-clip-text text-sm text-gerayo-muted">Confirming your payment...</span>
        </div>
      </Modal>
    )
  }

  if (step === 'success') {
    return (
      <Modal title="Payment successful" onClose={onClose} sidebar>
        <div className="flex flex-col items-center gap-3 py-10">
          <svg viewBox="0 0 52 52" className="h-16 w-16">
            <circle cx="26" cy="26" r="24" fill="none" stroke="#22c55e" strokeWidth="2.5" opacity="0.35" />
            <path
              className="gerayo-check-path"
              d="M14 27l7 7 17-17"
              fill="none"
              stroke="#22c55e"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-lg font-semibold text-white">{discountedTotal.toLocaleString()} RWF paid</span>
          <span className="text-xs text-gerayo-muted">Your ticket is ready — enjoy the ride!</span>
        </div>
      </Modal>
    )
  }

  if (step === 'pin') {
    return (
      <Modal title={method === 'momo' ? 'MTN MoMo PIN' : 'Airtel Money PIN'} onClose={onClose} sidebar>
        <PinEntry
          label={`Enter your 4-digit PIN to pay ${discountedTotal.toLocaleString()} RWF`}
          onBack={() => setStep('select')}
          onConfirm={finishPayment}
        />
      </Modal>
    )
  }

  return (
    <Modal title="Complete Payment" onClose={onClose} sidebar>
      <div className="mb-5 rounded-xl border border-gerayo-border bg-gerayo-card/60 px-4 py-3">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-gerayo-muted">Total</div>
        <div className="mt-1 text-2xl font-semibold text-white">{discountedTotal.toLocaleString()} RWF</div>
        {promoApplied > 0 && (
          <div className="mt-1 text-xs text-gerayo-from">Promo GERAYO10 applied — you saved {promoApplied * 100}%</div>
        )}
      </div>

      <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-gerayo-muted">
        Select the payment method
      </div>
      <PaymentMethodList selected={method} onSelect={setMethod} balance={balance} total={discountedTotal} />

      {method === 'wallet' && balance < discountedTotal && (
        <Button variant="secondary" className="mt-3" onClick={onOpenTopUp}>
          Refill Wallet
        </Button>
      )}

      <div className="mt-4 flex gap-2">
        <input
          value={promo}
          onChange={(e) => setPromo(e.target.value)}
          placeholder="Promo code"
          className="flex-1 rounded-xl bg-gerayo-card border border-gerayo-border px-4 py-2.5 text-white outline-none placeholder:text-gerayo-muted"
        />
        <Button variant="secondary" className="w-auto px-4" onClick={applyPromo}>
          Apply
        </Button>
      </div>
      {error && <div className="mt-1 text-xs text-red-400">{error}</div>}

      <div className="sticky bottom-0 -mx-5 mt-5 border-t border-gerayo-border bg-gerayo-panel px-5 pt-4 pb-1">
        <Button
          disabled={!method || (method === 'wallet' && balance < discountedTotal)}
          onClick={startPayment}
          className="bg-gerayo-to text-white hover:brightness-110 disabled:bg-gerayo-to/40"
        >
          Pay {discountedTotal.toLocaleString()} RWF
        </Button>
      </div>
    </Modal>
  )
}
