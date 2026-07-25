import { QRCodeSVG } from 'qrcode.react'

export function QRBlock({ value }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-4">
      <QRCodeSVG value={value} size={160} />
      <span className="text-xs text-gray-500">Show to driver when boarding</span>
    </div>
  )
}
