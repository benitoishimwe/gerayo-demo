import stops from '../data/kigaliStops.json'
import lines from '../data/kigaliLines.json'

const STOP_HOP_MINS = 2 // demo constant: average time between two consecutive stops on a line
const TRANSFER_WALK_MINS = 2
const MAX_RESULTS = 8

export function allStops() {
  return stops
}

export function findStopByName(name) {
  return stops.find((s) => s.name === name) || null
}

export function findStopById(id) {
  return stops.find((s) => s.id === id) || null
}

export function getLineById(id) {
  return lines.find((l) => l.id === id) || null
}

export function allLines() {
  return lines
}

// Ordered stop objects for one line, used to draw its route on a map.
export function getLineStopPositions(line) {
  return line.stops.map((id) => findStopById(id)).filter(Boolean)
}

// Ordered stop objects covering every bus leg of an itinerary, used to draw
// its full route (including intermediate stops) on a map.
export function getItineraryStopPositions(itinerary) {
  const busLegs = itinerary.legs.filter((l) => l.kind === 'bus')
  const path = busLegs.flatMap((leg) => {
    const idx1 = leg.line.stops.indexOf(leg.boardStop.id)
    const idx2 = leg.line.stops.indexOf(leg.alightStop.id)
    return leg.line.stops.slice(idx1, idx2 + 1)
  })
  return path.map((id) => findStopById(id)).filter(Boolean)
}

export function dayTypeOf(date = new Date()) {
  const day = date.getDay()
  if (day === 0) return 'sunday'
  if (day === 6) return 'saturday'
  return 'weekday'
}

function toMinutes(time) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function toTimeString(mins) {
  const wrapped = ((mins % 1440) + 1440) % 1440
  const h = Math.floor(wrapped / 60)
  const m = wrapped % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// Deterministic 4-9 min "walk to stop" flavor value derived from the stop id,
// standing in for a real address-to-stop distance calculation.
function walkMinsFor(stopId, min, max) {
  let hash = 0
  for (let i = 0; i < stopId.length; i += 1) hash = (hash * 31 + stopId.charCodeAt(i)) >>> 0
  return min + (hash % (max - min + 1))
}

function stopIndex(line, stopId) {
  return line.stops.indexOf(stopId)
}

// Earliest scheduled arrival at `stopId` on `line`, on/after `nowMinutes`.
// Schedule times represent departure from the line's first stop.
function nextArrivalAtStop(line, dayType, stopId, nowMinutes) {
  const idx = stopIndex(line, stopId)
  if (idx === -1) return null
  const times = line.schedule[dayType] || []
  for (const t of times) {
    const arrival = toMinutes(t) + idx * STOP_HOP_MINS
    if (arrival >= nowMinutes) return arrival
  }
  if (times.length === 0) return null
  // Wrap to the first departure the next day.
  return toMinutes(times[0]) + idx * STOP_HOP_MINS + 1440
}

function buildDirectItinerary(line, originStop, destStop, nowMinutes) {
  const originIdx = stopIndex(line, originStop.id)
  const destIdx = stopIndex(line, destStop.id)
  if (originIdx === -1 || destIdx === -1 || originIdx >= destIdx) return null

  const walkToBoard = walkMinsFor(originStop.id, 4, 9)
  const walkFromAlight = walkMinsFor(destStop.id, 2, 6)
  const boardAt = nextArrivalAtStop(line, dayTypeOf(), originStop.id, nowMinutes + walkToBoard)
  if (boardAt == null) return null
  const alightAt = boardAt + (destIdx - originIdx) * STOP_HOP_MINS
  const departAt = boardAt - walkToBoard

  return {
    id: `${line.id}-${originStop.id}-${destStop.id}`,
    type: 'direct',
    legs: [
      { kind: 'walk', mins: walkToBoard },
      {
        kind: 'bus',
        line,
        boardStop: originStop,
        alightStop: destStop,
        boardAt,
        alightAt,
        stopsBetween: line.stops.slice(originIdx + 1, destIdx),
      },
      { kind: 'walk', mins: walkFromAlight },
    ],
    departAt,
    arriveAt: alightAt + walkFromAlight,
    durationMins: alightAt + walkFromAlight - departAt,
    fare: line.fare,
  }
}

function buildTransferItinerary(lineA, lineB, sharedStopId, originStop, destStop, nowMinutes) {
  const originIdxA = stopIndex(lineA, originStop.id)
  const sharedIdxA = stopIndex(lineA, sharedStopId)
  const sharedIdxB = stopIndex(lineB, sharedStopId)
  const destIdxB = stopIndex(lineB, destStop.id)
  if ([originIdxA, sharedIdxA, sharedIdxB, destIdxB].some((i) => i === -1)) return null
  if (originIdxA >= sharedIdxA || sharedIdxB >= destIdxB) return null

  const sharedStop = findStopById(sharedStopId)
  const walkToBoard = walkMinsFor(originStop.id, 4, 9)
  const walkFromAlight = walkMinsFor(destStop.id, 2, 6)

  const boardAtA = nextArrivalAtStop(lineA, dayTypeOf(), originStop.id, nowMinutes + walkToBoard)
  if (boardAtA == null) return null
  const arriveShared = boardAtA + (sharedIdxA - originIdxA) * STOP_HOP_MINS

  const boardAtB = nextArrivalAtStop(lineB, dayTypeOf(), sharedStopId, arriveShared + TRANSFER_WALK_MINS)
  if (boardAtB == null) return null
  const alightAtB = boardAtB + (destIdxB - sharedIdxB) * STOP_HOP_MINS
  const departAt = boardAtA - walkToBoard

  return {
    id: `${lineA.id}-${lineB.id}-${originStop.id}-${destStop.id}`,
    type: 'transfer',
    legs: [
      { kind: 'walk', mins: walkToBoard },
      {
        kind: 'bus',
        line: lineA,
        boardStop: originStop,
        alightStop: sharedStop,
        boardAt: boardAtA,
        alightAt: arriveShared,
        stopsBetween: lineA.stops.slice(originIdxA + 1, sharedIdxA),
      },
      { kind: 'walk', mins: TRANSFER_WALK_MINS },
      {
        kind: 'bus',
        line: lineB,
        boardStop: sharedStop,
        alightStop: destStop,
        boardAt: boardAtB,
        alightAt: alightAtB,
        stopsBetween: lineB.stops.slice(sharedIdxB + 1, destIdxB),
      },
      { kind: 'walk', mins: walkFromAlight },
    ],
    departAt,
    arriveAt: alightAtB + walkFromAlight,
    durationMins: alightAtB + walkFromAlight - departAt,
    fare: lineA.fare + lineB.fare,
  }
}

export function planJourney(originName, destinationName, nowDate = new Date()) {
  const originStop = findStopByName(originName)
  const destStop = findStopByName(destinationName)
  if (!originStop || !destStop || originStop.id === destStop.id) return []

  const nowMinutes = nowDate.getHours() * 60 + nowDate.getMinutes()
  const results = []

  const directLines = lines.filter((l) => {
    const oi = stopIndex(l, originStop.id)
    const di = stopIndex(l, destStop.id)
    return oi !== -1 && di !== -1 && oi < di
  })
  for (const line of directLines) {
    const it = buildDirectItinerary(line, originStop, destStop, nowMinutes)
    if (it) results.push(it)
  }

  const originLines = lines.filter((l) => stopIndex(l, originStop.id) !== -1)
  const destLines = lines.filter((l) => stopIndex(l, destStop.id) !== -1)
  for (const lineA of originLines) {
    const originIdxA = stopIndex(lineA, originStop.id)
    for (const lineB of destLines) {
      if (lineA.id === lineB.id) continue
      const destIdxB = stopIndex(lineB, destStop.id)
      const shared = lineA.stops.find((stopId, idx) => {
        if (idx <= originIdxA) return false
        const idxInB = stopIndex(lineB, stopId)
        return idxInB !== -1 && idxInB < destIdxB
      })
      if (!shared) continue
      const it = buildTransferItinerary(lineA, lineB, shared, originStop, destStop, nowMinutes)
      if (it) results.push(it)
    }
  }

  results.sort((a, b) => a.durationMins - b.durationMins)
  return results.slice(0, MAX_RESULTS)
}
