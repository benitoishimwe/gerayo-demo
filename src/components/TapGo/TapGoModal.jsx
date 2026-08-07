import { useState } from 'react'
import { Modal } from '../common/Modal'
import { useLanguage } from '../../i18n/LanguageContext'
import { useTapGoCard } from '../../hooks/useTapGoCard'
import { TapGoCardView } from './TapGoCardView'
import { TapGoTopUpModal } from './TapGoTopUpModal'
import { TapGoTapModal } from './TapGoTapModal'
import { TapGoTrackingMap } from './TapGoTrackingMap'
import { TapGoAbout } from './TapGoAbout'

const TABS = ['card', 'track', 'about']

export function TapGoModal({ onClose }) {
  const { t } = useLanguage()
  const card = useTapGoCard()
  const [tab, setTab] = useState('card')
  const [showTopUp, setShowTopUp] = useState(false)
  const [boardingRoute, setBoardingRoute] = useState(null)

  return (
    <>
      <Modal title={t('tapgo.title')} onClose={onClose} sidebar>
        <div className="mb-5 flex overflow-hidden rounded-xl border border-gerayo-border">
          {TABS.map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-2.5 text-sm font-medium transition ${
                tab === key ? 'bg-gerayo-from text-black' : 'bg-gerayo-card/60 text-gerayo-muted hover:text-white'
              }`}
            >
              {t(`tapgo.tabs.${key}`)}
            </button>
          ))}
        </div>

        {tab === 'card' && (
          <TapGoCardView card={card} onTopUp={() => setShowTopUp(true)} onBoard={setBoardingRoute} />
        )}
        {tab === 'track' && <TapGoTrackingMap />}
        {tab === 'about' && <TapGoAbout />}
      </Modal>

      {showTopUp && (
        <TapGoTopUpModal
          balance={card.balance}
          onClose={() => setShowTopUp(false)}
          onTopUp={(amount, method) => {
            card.topUp(amount, method)
            setShowTopUp(false)
          }}
        />
      )}

      {boardingRoute && (
        <TapGoTapModal
          route={boardingRoute}
          balance={card.balance}
          onClose={() => setBoardingRoute(null)}
          onConfirmBoard={() => card.tapBoard(boardingRoute)}
          onExit={() => card.tapExit(boardingRoute)}
        />
      )}
    </>
  )
}
