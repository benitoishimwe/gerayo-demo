import coords from '../data/coords.json'

function haversine([lat1, lon1], [lat2, lon2]) {
  const toRad = (d) => (d * Math.PI) / 180
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(a))
}

export function nearestTown(lat, lon) {
  let best = null
  let bestDist = Infinity
  for (const [town, [tLat, tLon]] of Object.entries(coords)) {
    const dist = haversine([lat, lon], [tLat, tLon])
    if (dist < bestDist) {
      bestDist = dist
      best = town
    }
  }
  return best
}
