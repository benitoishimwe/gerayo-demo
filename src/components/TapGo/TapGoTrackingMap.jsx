import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet'
import L from 'leaflet'
import routes from '../../data/tapgoRoutes.json'
import { useBusTracking } from '../../hooks/useBusTracking'
import { useLanguage } from '../../i18n/LanguageContext'

function busIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="width:22px;height:22px;border-radius:50%;background:#22c55e;border:3px solid white;box-shadow:0 1px 6px rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;font-size:11px">🚌</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })
}

const BUS_ICON = busIcon()

export function TapGoTrackingMap() {
  const { t } = useLanguage()
  const [routeId, setRouteId] = useState(routes[0].id)
  const route = routes.find((r) => r.id === routeId)
  const tracking = useBusTracking(route)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-1 text-sm font-semibold text-white">{t('tapgo.trackingTitle')}</div>
        <div className="text-xs text-gerayo-muted">{t('tapgo.trackingSubtitle')}</div>
      </div>

      <div className="flex flex-wrap gap-2">
        {routes.map((r) => (
          <button
            key={r.id}
            onClick={() => setRouteId(r.id)}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              routeId === r.id ? 'border-gerayo-from text-gerayo-from' : 'border-gerayo-border text-gerayo-muted'
            }`}
          >
            {r.origin} → {r.destination}
          </button>
        ))}
      </div>

      {tracking && (
        <>
          <div className="h-56 overflow-hidden rounded-xl border border-gerayo-border">
            <MapContainer center={tracking.origin} zoom={12} className="h-full w-full" zoomControl={false} dragging={true} scrollWheelZoom={false}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution="&copy; OpenStreetMap contributors &copy; CARTO"
              />
              <Polyline positions={[tracking.origin, tracking.destination]} pathOptions={{ color: '#22c55e', weight: 3, dashArray: '4 6' }} />
              <Marker position={tracking.position} icon={BUS_ICON} />
            </MapContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl border border-gerayo-border bg-gerayo-card/60 px-2 py-3">
              <div className="text-[10px] uppercase tracking-widest text-gerayo-muted">{t('tapgo.etaLabel')}</div>
              <div className="mt-1 text-sm font-semibold text-white">{t('tapgo.etaMinutes', { minutes: tracking.etaMinutes })}</div>
            </div>
            <div className="rounded-xl border border-gerayo-border bg-gerayo-card/60 px-2 py-3">
              <div className="text-[10px] uppercase tracking-widest text-gerayo-muted">{t('tapgo.speedLabel')}</div>
              <div className="mt-1 text-sm font-semibold text-white">{tracking.speedKmh} km/h</div>
            </div>
            <div className="rounded-xl border border-gerayo-border bg-gerayo-card/60 px-2 py-3">
              <div className="text-[10px] uppercase tracking-widest text-gerayo-muted">{t('tapgo.lastUpdated')}</div>
              <div className="mt-1 text-sm font-semibold text-white">{new Date(tracking.updatedAt).toLocaleTimeString()}</div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
