import { StatusPill } from '../common/StatusPill'
import agencies from '../../data/agencies.json'

export function TicketArchiveRow({ ticket }) {
  const agency = agencies.find((a) => a.id === ticket.agencyId)

  return (
    <div className="rounded-xl border border-gerayo-border bg-gerayo-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">
          {ticket.origin} → {ticket.destination}
        </span>
        <StatusPill status={ticket.status} />
      </div>
      <div className="mt-1 text-xs text-gerayo-muted">
        {agency?.name} · {ticket.date} · {ticket.departureTime}
      </div>
    </div>
  )
}
