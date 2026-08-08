import { useState } from 'react'
import { TicketCard } from './TicketCard'
import { TicketArchiveRow } from './TicketArchiveRow'
import { useLanguage } from '../../i18n/LanguageContext'
import { AuthForm } from '../Account/AuthForm'
import { TapGoEnroll } from '../TapGo/TapGoEnroll'
import { TapGoCardView } from '../TapGo/TapGoCardView'
import { TapGoTopUpModal } from '../TapGo/TapGoTopUpModal'
import { TapGoTapModal } from '../TapGo/TapGoTapModal'
import { TapGoTrackingMap } from '../TapGo/TapGoTrackingMap'
import { TapGoAbout } from '../TapGo/TapGoAbout'
import { TapGoManageCardsModal } from '../TapGo/TapGoManageCardsModal'

const TAPGO_SUBTABS = ['card', 'track', 'about']

function TicketOutlineIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12 text-gerayo-muted">
      <path
        d="M4 9a2 2 0 0 0 0 4v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3a2 2 0 0 1 0-4V6a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M14 5v14" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
  )
}

function TicketsPane({ tickets, onPlanJourney }) {
  const { t } = useLanguage()
  const [tab, setTab] = useState('current')

  const current = tickets.filter((ticket) => ticket.status === 'pending' || ticket.status === 'paid')
  const archive = tickets.filter((ticket) => ticket.status === 'expired' || ticket.status === 'refunded')
  const shown = tab === 'current' ? current : archive

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-shrink-0 px-4 pt-3">
        <div className="flex gap-1 rounded-full bg-gerayo-card p-1">
          <button
            onClick={() => setTab('current')}
            className={`flex-1 rounded-full py-1.5 text-sm font-semibold transition ${
              tab === 'current' ? 'bg-gerayo-border text-white' : 'text-gerayo-muted'
            }`}
          >
            {t('ticket.current')}
          </button>
          <button
            onClick={() => setTab('archive')}
            className={`flex-1 rounded-full py-1.5 text-sm font-semibold transition ${
              tab === 'archive' ? 'bg-gerayo-border text-white' : 'text-gerayo-muted'
            }`}
          >
            {t('ticket.archive')}
          </button>
        </div>
      </div>

      <div className="jd-scroll flex-1 overflow-y-auto p-4">
        {shown.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
            <TicketOutlineIcon />
            <div className="text-base font-semibold text-white">
              {tab === 'current' ? t('ticket.noTickets') : t('ticket.noPastTickets')}
            </div>
            <div className="max-w-[240px] text-sm text-gerayo-muted">
              {tab === 'current' ? t('ticket.noTicketsMessage') : t('ticket.noPastTicketsMessage')}
            </div>
            {tab === 'current' && (
              <button onClick={onPlanJourney} className="text-sm font-semibold text-gerayo-from hover:underline">
                {t('ticket.planJourney')}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {shown.map((ticket) =>
              tab === 'current' ? (
                <TicketCard key={ticket.id} ticket={ticket} />
              ) : (
                <TicketArchiveRow key={ticket.id} ticket={ticket} />
              )
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function TapGoPane({ auth, card }) {
  const { t } = useLanguage()
  const [subtab, setSubtab] = useState('card')
  const [showTopUp, setShowTopUp] = useState(false)
  const [boardingRoute, setBoardingRoute] = useState(null)
  const [showManageCards, setShowManageCards] = useState(false)

  return (
    <div className="jd-scroll flex-1 overflow-y-auto p-4">
      {!auth.isAuthenticated ? (
        <AuthForm auth={auth} title={t('tapgo.signInRequired')} subtitle={t('tapgo.signInRequiredSubtitle')} />
      ) : !card.isEnrolled ? (
        <TapGoEnroll onEnroll={card.enroll} />
      ) : (
        <>
          <div className="mb-5 flex overflow-hidden rounded-xl border border-gerayo-border">
            {TAPGO_SUBTABS.map((key) => (
              <button
                key={key}
                onClick={() => setSubtab(key)}
                className={`flex-1 py-2.5 text-sm font-medium transition ${
                  subtab === key ? 'bg-gerayo-from text-black' : 'bg-gerayo-card/60 text-gerayo-muted hover:text-white'
                }`}
              >
                {t(`tapgo.tabs.${key}`)}
              </button>
            ))}
          </div>

          {subtab === 'card' && (
            <TapGoCardView
              card={card}
              onTopUp={() => setShowTopUp(true)}
              onBoard={setBoardingRoute}
              onManageCards={() => setShowManageCards(true)}
            />
          )}
          {subtab === 'track' && <TapGoTrackingMap />}
          {subtab === 'about' && <TapGoAbout />}

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

          {showManageCards && <TapGoManageCardsModal card={card} onClose={() => setShowManageCards(false)} />}

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
      )}
    </div>
  )
}

export function TicketsTapGoView({ auth, tapGo, tickets, onPlanJourney }) {
  const { t } = useLanguage()
  const [pane, setPane] = useState('tapgo')

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-shrink-0 border-b border-gerayo-border px-4 pt-3 pb-3">
        <div className="flex gap-1 rounded-full bg-gerayo-card p-1">
          <button
            onClick={() => setPane('tapgo')}
            className={`flex-1 rounded-full py-1.5 text-sm font-semibold transition ${
              pane === 'tapgo' ? 'bg-gerayo-border text-white' : 'text-gerayo-muted'
            }`}
          >
            {t('tapgo.navLabel')}
          </button>
          <button
            onClick={() => setPane('tickets')}
            className={`flex-1 rounded-full py-1.5 text-sm font-semibold transition ${
              pane === 'tickets' ? 'bg-gerayo-border text-white' : 'text-gerayo-muted'
            }`}
          >
            {t('header.tickets')}
          </button>
        </div>
      </div>

      {pane === 'tapgo' ? (
        <TapGoPane auth={auth} card={tapGo} />
      ) : (
        <TicketsPane tickets={tickets} onPlanJourney={onPlanJourney} />
      )}
    </div>
  )
}
