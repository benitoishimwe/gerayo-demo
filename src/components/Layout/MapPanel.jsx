import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap, useMapEvents } from 'react-leaflet'
import { useEffect, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import coords from '../../data/coords.json'
import { nearestTown } from '../../utils/geo'
import { useLanguage } from '../../i18n/LanguageContext'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const KIGALI = [-1.9441, 30.0619]

function pinIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.5)"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

const startIcon = pinIcon('#3b82f6')
const endIcon = pinIcon('#22c55e')

// Fallback width for the floating sidebar panel that sits on top of the map
// on desktop, used only until the real panel width has been measured.
const SIDEBAR_OCCLUSION_FALLBACK = 470

function FitBounds({ points, sidebarWidth }) {
  const map = useMap()
  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    const leftPad = isDesktop ? (sidebarWidth || SIDEBAR_OCCLUSION_FALLBACK) : 40

    if (points.length > 1) {
      map.fitBounds(points, {
        paddingTopLeft: [leftPad, 60],
        paddingBottomRight: [60, 60],
      })
    } else {
      const target = points[0] || KIGALI
      map.setView(target, 8)
      if (isDesktop) {
        map.panBy([-(leftPad - 60) / 2, 0], { animate: false })
      }
    }
  }, [points, map, sidebarWidth])
  return null
}

function RoutePolyline({ origin, destination }) {
  const [path, setPath] = useState(null)

  useEffect(() => {
    let cancelled = false
    setPath(null)

    const url = `https://routing.openstreetmap.de/routed-car/route/v1/driving/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`routing request failed: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        const coordsGeo = data?.routes?.[0]?.geometry?.coordinates
        if (coordsGeo?.length) {
          setPath(coordsGeo.map(([lng, lat]) => [lat, lng]))
        } else {
          setPath([origin, destination])
        }
      })
      .catch((err) => {
        console.error('Route fetch failed, falling back to straight line:', err)
        if (!cancelled) setPath([origin, destination])
      })

    return () => {
      cancelled = true
    }
  }, [origin, destination])

  if (!path) return null

  return <Polyline positions={path} pathOptions={{ color: '#22c55e', weight: 4 }} />
}

function MapClickHandler({ pickMode, onPick }) {
  useMapEvents({
    click(e) {
      if (!pickMode) return
      const town = nearestTown(e.latlng.lat, e.latlng.lng)
      if (town) onPick(town)
    },
  })
  return null
}

function MapControls() {
  const map = useMap()
  const { t } = useLanguage()
  const [locating, setLocating] = useState(false)

  const handleLocate = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        map.flyTo([latitude, longitude], 14)
        setLocating(false)
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <>
    <div className="absolute right-3 top-3 z-[1000] flex flex-col gap-2">
      <div className="flex flex-col overflow-hidden rounded-xl bg-neutral-900/90 shadow-lg backdrop-blur">
        <button
          type="button"
          aria-label={t('map.zoomIn')}
          onClick={() => map.zoomIn()}
          className="flex h-9 w-9 items-center justify-center text-lg font-medium text-white hover:bg-white/10"
        >
          +
        </button>
        <div className="h-px w-full bg-white/10" />
        <button
          type="button"
          aria-label={t('map.zoomOut')}
          onClick={() => map.zoomOut()}
          className="flex h-9 w-9 items-center justify-center text-lg font-medium text-white hover:bg-white/10"
        >
          &minus;
        </button>
      </div>
      <button
        type="button"
        aria-label={t('map.findMyLocation')}
        onClick={handleLocate}
        disabled={locating}
        className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900/90 text-white shadow-lg backdrop-blur hover:bg-white/10 disabled:opacity-50"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
        </svg>
      </button>
    </div>
    <div className="absolute left-3 bottom-3 z-[1000] flex flex-col gap-2">
      <button
        type="button"
        aria-label={t('map.findMyLocation')}
        onClick={handleLocate}
        disabled={locating}
        className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl bg-neutral-900/90 text-white shadow-lg backdrop-blur hover:bg-white/10 disabled:opacity-50"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
        </svg>
      </button>
      <button
        type="button"
        aria-label={t('map.compass')}
        className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900/90 text-white shadow-lg backdrop-blur hover:bg-white/10"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M15 9l-3 6-3-6 3-1.5z" fill="currentColor" stroke="none" />
        </svg>
      </button>
    </div>
    </>
  )
}

export function MapPanel({
  selectedRoute,
  origin,
  destination,
  onSetOrigin,
  onSetDestination,
  sidebarWidth,
  className = '',
}) {
  const { t } = useLanguage()
  const originName = selectedRoute ? selectedRoute.origin : origin
  const destName = selectedRoute ? selectedRoute.destination : destination

  const originPoint = originName ? coords[originName] : null
  const destPoint = destName ? coords[destName] : null

  const points = [originPoint, destPoint].filter(Boolean)
  const fitTarget = points.length > 0 ? points : [KIGALI]

  const canPick = !selectedRoute && (onSetOrigin || onSetDestination)
  const [pickMode, setPickMode] = useState(canPick ? (originName ? 'destination' : 'origin') : null)

  useEffect(() => {
    if (!canPick) {
      setPickMode(null)
      return
    }
    setPickMode((current) => current || (originName ? 'destination' : 'origin'))
  }, [canPick, originName])

  function handlePick(town) {
    if (pickMode === 'origin') {
      onSetOrigin?.(town)
      setPickMode(destName ? null : 'destination')
    } else if (pickMode === 'destination') {
      onSetDestination?.(town)
      setPickMode(originName ? null : 'origin')
    }
  }

  return (
    <div className={`isolate z-0 relative ${className} ${canPick ? 'cursor-crosshair' : ''}`}>
      <MapContainer center={KIGALI} zoom={8} className="h-full w-full" zoomControl={false}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
        />
        <FitBounds points={fitTarget} sidebarWidth={sidebarWidth} />
        {canPick && <MapClickHandler pickMode={pickMode} onPick={handlePick} />}
        {originPoint && (
          <Marker position={originPoint} icon={startIcon}>
            <Tooltip permanent direction="top" offset={[0, -8]} className="jd-map-label">
              {t('map.start')}
              <br />
              {originName}
            </Tooltip>
          </Marker>
        )}
        {destPoint && (
          <Marker position={destPoint} icon={endIcon}>
            <Tooltip permanent direction="top" offset={[0, -8]} className="jd-map-label">
              {t('map.end')}
              <br />
              {destName}
            </Tooltip>
          </Marker>
        )}
        {selectedRoute && originPoint && destPoint && (
          <RoutePolyline origin={originPoint} destination={destPoint} />
        )}
        <MapControls />
      </MapContainer>
    </div>
  )
}
