import { useState } from 'react'
import { TicketCard } from './TicketCard'
import { TicketArchiveRow } from './TicketArchiveRow'

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

export function TicketList({ tickets, onPlanJourney }) {
  const [tab, setTab] = useState('current')

  const current = tickets.filter((t) => t.status === 'pending' || t.status === 'paid')
  const archive = tickets.filter((t) => t.status === 'expired' || t.status === 'refunded')
  const shown = tab === 'current' ? current : archive

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-shrink-0 border-b border-gerayo-border px-4 pt-3">
        <div className="flex gap-1 rounded-full bg-gerayo-card p-1">
          <button
            onClick={() => setTab('current')}
            className={`flex-1 rounded-full py-1.5 text-sm font-semibold transition ${
              tab === 'current' ? 'bg-gerayo-border text-white' : 'text-gerayo-muted'
            }`}
          >
            Current
          </button>
          <button
            onClick={() => setTab('archive')}
            className={`flex-1 rounded-full py-1.5 text-sm font-semibold transition ${
              tab === 'archive' ? 'bg-gerayo-border text-white' : 'text-gerayo-muted'
            }`}
          >
            Archive
          </button>
        </div>
      </div>

      <div className="jd-scroll flex-1 overflow-y-auto p-4">
        {shown.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
            <TicketOutlineIcon />
            <div className="text-base font-semibold text-white">
              {tab === 'current' ? 'No tickets' : 'No past tickets'}
            </div>
            <div className="max-w-[240px] text-sm text-gerayo-muted">
              {tab === 'current'
                ? 'You have not purchased any tickets. Maybe it is time to plan a journey?'
                : 'Tickets that have expired or been refunded will show up here.'}
            </div>
            {tab === 'current' && (
              <button onClick={onPlanJourney} className="text-sm font-semibold text-gerayo-from hover:underline">
                Plan a journey
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {shown.map((t) =>
              tab === 'current' ? <TicketCard key={t.id} ticket={t} /> : <TicketArchiveRow key={t.id} ticket={t} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
