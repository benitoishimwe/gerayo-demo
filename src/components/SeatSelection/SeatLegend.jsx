import { useLanguage } from '../../i18n/LanguageContext'

const ITEMS = [
  { key: 'available', className: 'bg-gerayo-card border-gerayo-border' },
  { key: 'selected', className: 'bg-gerayo-from border-gerayo-from' },
  { key: 'taken', className: 'bg-gerayo-card/40 border-gerayo-border opacity-50' },
  { key: 'vip', className: 'bg-gerayo-vip/10 border-gerayo-vip' },
]

export function SeatLegend() {
  const { t } = useLanguage()
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gerayo-muted">
      {ITEMS.map((item) => (
        <div key={item.key} className="flex items-center gap-1.5">
          <span className={`h-4 w-4 rounded-md border ${item.className}`} />
          {t(`seat.legend.${item.key}`)}
        </div>
      ))}
    </div>
  )
}
