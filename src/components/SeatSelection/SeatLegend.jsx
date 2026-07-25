const ITEMS = [
  { label: 'Available', className: 'bg-gerayo-card border-gerayo-border' },
  { label: 'Selected', className: 'bg-gerayo-from border-gerayo-from' },
  { label: 'Taken', className: 'bg-gerayo-card/40 border-gerayo-border opacity-50' },
  { label: 'VIP', className: 'bg-gerayo-vip/10 border-gerayo-vip' },
]

export function SeatLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gerayo-muted">
      {ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className={`h-4 w-4 rounded-md border ${item.className}`} />
          {item.label}
        </div>
      ))}
    </div>
  )
}
