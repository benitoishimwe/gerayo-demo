const STYLES = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
  paid: 'bg-green-500/15 text-green-400 border-green-500/40',
  expired: 'bg-gray-500/15 text-gray-400 border-gray-500/40',
}

const LABELS = {
  pending: 'PENDING',
  paid: 'PAID',
  expired: 'EXPIRED — Bus Departed',
}

export function StatusPill({ status }) {
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STYLES[status] || STYLES.pending}`}>
      {LABELS[status] || status}
    </span>
  )
}
