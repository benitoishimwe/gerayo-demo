import { useState } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { useLanguage } from '../../i18n/LanguageContext'

const SIZES = [
  { id: 'small', labelKey: 'parcel.sizes.small', price: 1500 },
  { id: 'medium', labelKey: 'parcel.sizes.medium', price: 3000 },
  { id: 'large', labelKey: 'parcel.sizes.large', price: 5000 },
]

export function ParcelModal({ route, agency, onClose }) {
  const { t } = useLanguage()
  const [size, setSize] = useState(SIZES[0].id)
  const [senderPhone, setSenderPhone] = useState('')
  const [receiverPhone, setReceiverPhone] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  const selected = SIZES.find((s) => s.id === size)
  const canConfirm = senderPhone.trim() && receiverPhone.trim()

  return (
    <Modal title={t('parcel.title')} onClose={onClose} sidebar>
      {confirmed ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gerayo-from/20 text-gerayo-from text-2xl">
            ✓
          </div>
          <div className="text-base font-semibold text-white">{t('parcel.confirmedTitle')}</div>
          <div className="max-w-[280px] text-sm text-gerayo-muted">
            {t('parcel.confirmedMessage', { agency: agency?.name, courierBrand: agency?.courierBrand })}
          </div>
          <Button onClick={onClose} className="mt-2">
            {t('common.done')}
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-xl border border-gerayo-border bg-gerayo-card/60 px-4 py-3 text-sm">
            <div className="font-semibold text-white">
              {route.origin} → {route.destination}
            </div>
            <div className="mt-0.5 text-xs text-gerayo-muted">
              {t('parcel.viaBus', { agency: agency?.name, time: route.departureTime })}
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-gerayo-muted">
              {t('parcel.sizeLabel')}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {SIZES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSize(s.id)}
                  className={`rounded-xl border px-1.5 py-2.5 text-center transition ${
                    size === s.id ? 'border-gerayo-from bg-gerayo-card' : 'border-gerayo-border bg-gerayo-card/60'
                  }`}
                >
                  <div className="text-sm font-semibold text-white">{t(s.labelKey)}</div>
                  <div className="text-[11px] text-gerayo-muted">{s.price.toLocaleString()} RWF</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gerayo-muted">
                {t('parcel.senderPhone')}
              </label>
              <input
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                placeholder="07xx xxx xxx"
                className="w-full rounded-xl border border-gerayo-border bg-gerayo-card/60 px-3 py-2.5 text-sm text-white outline-none focus:border-gerayo-from"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gerayo-muted">
                {t('parcel.receiverPhone')}
              </label>
              <input
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                placeholder="07xx xxx xxx"
                className="w-full rounded-xl border border-gerayo-border bg-gerayo-card/60 px-3 py-2.5 text-sm text-white outline-none focus:border-gerayo-from"
              />
            </div>
          </div>

          <div className="flex justify-between border-t border-gerayo-border pt-4 text-sm font-semibold text-white">
            <span>{t('parcel.total')}</span>
            <span>{selected.price.toLocaleString()} RWF</span>
          </div>

          <Button disabled={!canConfirm} onClick={() => setConfirmed(true)}>
            {t('parcel.confirmSend', { price: selected.price.toLocaleString() })}
          </Button>
        </div>
      )}
    </Modal>
  )
}
