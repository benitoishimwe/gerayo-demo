import { QRCodeSVG } from 'qrcode.react'
import { useLanguage } from '../../i18n/LanguageContext'

export function QRBlock({ value }) {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-4">
      <QRCodeSVG value={value} size={160} />
      <span className="text-xs text-gray-500">{t('ticket.showQrToDriver')}</span>
    </div>
  )
}
