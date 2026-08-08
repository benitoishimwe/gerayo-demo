import { useRef, useState } from 'react'
import { StatusPill } from '../common/StatusPill'
import { Button } from '../common/Button'
import { QRBlock } from './QRBlock'
import { PrintTicket } from './PrintTicket'
import agencies from '../../data/agencies.json'
import { useLanguage } from '../../i18n/LanguageContext'

export function TicketCard({ ticket }) {
  const { t } = useLanguage()
  const agency = agencies.find((a) => a.id === ticket.agencyId)
  const [rendering, setRendering] = useState(false)
  const printRef = useRef(null)

  const download = async () => {
    setRendering(true)
    await new Promise((resolve) => requestAnimationFrame(resolve))

    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ])

    const canvas = await html2canvas(printRef.current, { scale: 2, backgroundColor: '#ffffff' })
    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    })
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
    pdf.save(`gerayo-ticket-${ticket.id}.pdf`)

    setRendering(false)
  }
  const sendEmail = () => {
    const email = window.prompt(t('ticket.sendEmailPrompt'))
    if (email) window.alert(t('ticket.sendEmailConfirm', { email }))
  }

  return (
    <div className="rounded-xl border border-gerayo-border bg-gerayo-card p-4">
      <div className="flex items-center justify-between">
        <span className="font-medium text-white">{agency?.name}</span>
        <StatusPill status={ticket.status} />
      </div>

      <div className="mt-2 text-sm text-gerayo-text">
        {ticket.origin} → {ticket.destination}
      </div>
      <div className="mt-1 text-xs text-gerayo-muted">
        {ticket.date} · {ticket.departureTime}
        {ticket.type === 'kigali'
          ? ` · ${ticket.lines.map((l) => l.code).join(' → ')}`
          : ` · ${t('ticket.seats', { seats: ticket.seats.join(', ') })}`}
      </div>
      <div className="mt-1 text-sm font-semibold text-white">{ticket.total.toLocaleString()} RWF</div>

      {ticket.status === 'paid' ? (
        <div className="mt-4 space-y-3">
          <QRBlock value={ticket.id} />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={download} disabled={rendering}>
              {rendering ? t('ticket.preparingPdf') : t('ticket.download')}
            </Button>
            <Button variant="secondary" onClick={sendEmail}>
              {t('ticket.sendToEmail')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-3 text-xs text-gerayo-muted">{t('ticket.awaitingPayment')}</div>
      )}

      {ticket.status === 'paid' && (
        <div style={{ position: 'fixed', top: 0, left: '-9999px', zIndex: -1 }}>
          <div ref={printRef}>
            <PrintTicket ticket={ticket} agency={agency} />
          </div>
        </div>
      )}
    </div>
  )
}
