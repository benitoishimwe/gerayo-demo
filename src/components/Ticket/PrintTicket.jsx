import { QRCodeSVG } from 'qrcode.react'
import { useLanguage } from '../../i18n/LanguageContext'

export function PrintTicket({ ticket, agency }) {
  const { t } = useLanguage()
  const accent = agency?.color || '#16a34a'

  return (
    <div
      className="print-ticket"
      style={{
        fontFamily: 'Arial, Helvetica, sans-serif',
        color: '#111',
        width: '480px',
        margin: '0 auto',
        border: '1px solid #e5e5e5',
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          background: accent,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 34,
              width: 34,
              borderRadius: 8,
              background: '#fff',
            }}
          >
            <img src="/logo.png" alt="Gerayo" style={{ height: 24, width: 24, objectFit: 'contain' }} />
          </div>
          <span style={{ fontSize: 19, fontWeight: 800, color: '#fff', letterSpacing: 0.3 }}>Gerayo</span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.6 }}>
          {t('ticket.print.busTicket')}
        </span>
      </div>

      <div style={{ padding: '22px 24px 6px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 17, fontWeight: 700 }}>{agency?.name}</span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.4,
              color: ticket.status === 'paid' ? '#16a34a' : '#b45309',
              border: `1px solid ${ticket.status === 'paid' ? '#16a34a' : '#b45309'}`,
              borderRadius: 999,
              padding: '3px 10px',
              whiteSpace: 'nowrap',
            }}
          >
            {t(`ticket.status.${ticket.status}`)}
          </span>
        </div>

        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20, fontWeight: 700 }}>{ticket.origin}</span>
          <span style={{ fontSize: 16, color: accent }}>→</span>
          <span style={{ fontSize: 20, fontWeight: 700 }}>{ticket.destination}</span>
        </div>
      </div>

      <div style={{ padding: '10px 24px 20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <tbody>
            {[
              [t('ticket.print.date'), ticket.date],
              [t('ticket.print.departure'), ticket.departureTime],
              [t('ticket.print.seats'), ticket.seats.join(', ')],
              [t('ticket.print.ticketId'), ticket.id],
            ].map(([label, value]) => (
              <tr key={label} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: '8px 0', color: '#777' }}>{label}</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>{value}</td>
              </tr>
            ))}
            <tr style={{ borderTop: '1px solid #eee' }}>
              <td style={{ padding: '8px 0', color: '#777', fontWeight: 700 }}>{t('ticket.print.totalPaid')}</td>
              <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 800, fontSize: 15, color: accent }}>
                {ticket.total.toLocaleString()} RWF
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        style={{
          position: 'relative',
          borderTop: '2px dashed #ddd',
          padding: '24px 24px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -10,
            left: -10,
            height: 20,
            width: 20,
            borderRadius: '50%',
            background: '#f4f4f4',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: -10,
            right: -10,
            height: 20,
            width: 20,
            borderRadius: '50%',
            background: '#f4f4f4',
          }}
        />
        <div style={{ background: '#fff', padding: 12, borderRadius: 12, border: '1px solid #eee' }}>
          <QRCodeSVG value={ticket.id} size={150} fgColor="#111111" bgColor="#ffffff" />
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>{t('ticket.print.showQr')}</span>
      </div>

      <div style={{ background: '#fafafa', padding: '12px 24px', textAlign: 'center' }}>
        <span style={{ fontSize: 10, color: '#999' }}>{t('ticket.print.issuedVia')}</span>
        <div style={{ fontSize: 10, color: '#999', marginTop: 2 }}>gerayoapp.com</div>
      </div>
    </div>
  )
}
