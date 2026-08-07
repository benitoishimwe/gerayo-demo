import { useEffect, useState } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { useLanguage } from '../../i18n/LanguageContext'

export function TapGoTapModal({ route, balance, onClose, onConfirmBoard, onExit }) {
  const { t } = useLanguage()
  const [step, setStep] = useState('waiting') // waiting -> detected -> charged
  const insufficient = route.fare > balance

  useEffect(() => {
    if (insufficient) return
    const t1 = setTimeout(() => setStep('detected'), 900)
    const t2 = setTimeout(() => {
      setStep('charged')
      onConfirmBoard()
    }, 1700)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [insufficient])

  return (
    <Modal title={t('tapgo.tapModalBoardTitle')} onClose={onClose} sidebar>
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-gerayo-border">
          {step !== 'waiting' && !insufficient && (
            <div className="absolute inset-0 animate-ping rounded-full border-4 border-gerayo-from opacity-40" />
          )}
          <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none" stroke={insufficient ? '#f87171' : step === 'waiting' ? '#9ca3af' : '#22c55e'} strokeWidth="1.6">
            <rect x="2" y="6" width="20" height="14" rx="2" />
            <path d="M6 2v4M12 1v6M18 2v4" strokeLinecap="round" />
          </svg>
        </div>

        {insufficient ? (
          <span className="text-sm font-medium text-red-400">{t('tapgo.insufficientCardBalance')}</span>
        ) : step === 'waiting' ? (
          <span className="text-sm text-gerayo-muted">{t('tapgo.waitingForTap')}</span>
        ) : step === 'detected' ? (
          <span className="gerayo-shimmer bg-clip-text text-sm text-gerayo-muted">{t('tapgo.tapDetected')}</span>
        ) : (
          <>
            <span className="text-lg font-semibold text-white">
              {t('tapgo.fareCharged', { amount: route.fare.toLocaleString() })}
            </span>
            <span className="text-xs text-gerayo-muted">{t('tapgo.tapOutPrompt')}</span>
            <Button
              className="mt-2 w-auto px-6"
              variant="secondary"
              onClick={() => {
                onExit()
                onClose()
              }}
            >
              {t('tapgo.tapToExit')}
            </Button>
          </>
        )}
      </div>
    </Modal>
  )
}
