// Generates a seat grid description from bus-type metadata (src/data/seatMaps.json).
// Returns an array of "rows", each row an array of cells: { seatId, side } or { spacer: true } for the aisle.

export function buildSeatLayout(busTypeId, busTypes) {
  const meta = busTypes[busTypeId]
  if (!meta) return { meta: null, rows: [], vipSeats: [] }

  if (meta.layoutType === 'minibus') {
    const rows = []
    for (let r = 1; r <= meta.rows; r++) {
      const single = `S${(r - 1) * 3 + 1}`
      const doubleA = `S${(r - 1) * 3 + 2}`
      const doubleB = `S${(r - 1) * 3 + 3}`
      rows.push([{ seatId: single }, { spacer: true }, { seatId: doubleA }, { seatId: doubleB }])
    }
    const benchStart = meta.rows * 3 + 1
    const bench = Array.from({ length: meta.rearBench }, (_, i) => ({ seatId: `S${benchStart + i}` }))
    rows.push(bench)
    return { meta, rows, vipSeats: meta.vipSeats }
  }

  if (meta.layoutType === 'coach') {
    const rows = []
    for (let r = 1; r <= meta.rows; r++) {
      const n = (r - 1) * 4
      const pad = (num) => `S${String(num).padStart(2, '0')}`
      rows.push([
        { seatId: pad(n + 1) },
        { seatId: pad(n + 2) },
        { spacer: true },
        { seatId: pad(n + 3) },
        { seatId: pad(n + 4) },
      ])
    }
    const benchStart = meta.rows * 4 + 1
    const pad = (num) => `S${String(num).padStart(2, '0')}`
    const bench = Array.from({ length: meta.rearBench }, (_, i) => ({ seatId: pad(benchStart + i) }))
    rows.push(bench)
    return { meta, rows, vipSeats: meta.vipSeats }
  }

  if (meta.layoutType === 'citybus') {
    const rows = []
    for (let r = 1; r <= meta.rows; r++) {
      const n = (r - 1) * 4
      rows.push([
        { seatId: `S${String(n + 1).padStart(2, '0')}` },
        { seatId: `S${String(n + 2).padStart(2, '0')}` },
        { spacer: true, label: r === 3 ? 'STANDING' : undefined },
        { seatId: `S${String(n + 3).padStart(2, '0')}` },
        { seatId: `S${String(n + 4).padStart(2, '0')}` },
      ])
    }
    const benchStart = meta.rows * 4 + 1
    const bench = Array.from({ length: meta.rearBench }, (_, i) => ({
      seatId: `S${String(benchStart + i).padStart(2, '0')}`,
    }))
    rows.push(bench)
    return { meta, rows, vipSeats: meta.vipSeats }
  }

  return { meta, rows: [], vipSeats: [] }
}

export function allSeatIds(busTypeId, busTypes) {
  const { rows } = buildSeatLayout(busTypeId, busTypes)
  return rows.flat().filter((c) => c.seatId).map((c) => c.seatId)
}
