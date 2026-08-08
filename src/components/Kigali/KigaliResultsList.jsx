import { useEffect, useRef, useState } from 'react'
import { KigaliResultCard } from './KigaliResultCard'
import { useLanguage } from '../../i18n/LanguageContext'

const PAGE_SIZE = 6
const STEP = 3
const MAX_VISIBLE = 9

function nowIndex(sorted) {
  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes()
  const idx = sorted.findIndex((it) => it.departAt >= nowMinutes)
  return idx === -1 ? Math.max(0, sorted.length - PAGE_SIZE) : idx
}

function sortKeyOf(itinerary) {
  return itinerary.departAt
}

function baseTemplateId(id) {
  const idx = id.indexOf('-mock-')
  return idx === -1 ? id : id.slice(0, idx)
}

function shiftLeg(leg, offsetMinutes) {
  if (leg.kind !== 'bus') return leg
  return { ...leg, boardAt: leg.boardAt + offsetMinutes, alightAt: leg.alightAt + offsetMinutes }
}

function makeMockItinerary(template, offsetMinutes, tag) {
  return {
    ...template,
    id: `${baseTemplateId(template.id)}-mock-${tag}`,
    departAt: template.departAt + offsetMinutes,
    arriveAt: template.arriveAt + offsetMinutes,
    legs: template.legs.map((leg) => shiftLeg(leg, offsetMinutes)),
  }
}

function generateEarlier(base, count, seq) {
  const template = base[0]
  const generated = []
  for (let i = count; i >= 1; i -= 1) {
    generated.push(makeMockItinerary(template, -30 * i, `e${seq + count - i}`))
  }
  return generated
}

function generateLater(base, count, seq) {
  const template = base[base.length - 1]
  const generated = []
  for (let i = 1; i <= count; i += 1) {
    generated.push(makeMockItinerary(template, 30 * i, `l${seq + i - 1}`))
  }
  return generated
}

export function KigaliResultsList({ results, focusedId, onFocus, onOpenDetail, onBuy, onPreview }) {
  const { t } = useLanguage()
  const [extended, setExtended] = useState(results)
  const [visibleStart, setVisibleStart] = useState(0)
  const [visibleEnd, setVisibleEnd] = useState(Math.min(PAGE_SIZE, results.length))
  const earlierSeq = useRef(1)
  const laterSeq = useRef(1)

  useEffect(() => {
    const sorted = [...results].sort((a, b) => sortKeyOf(a) - sortKeyOf(b))
    setExtended(results)
    earlierSeq.current = 1
    laterSeq.current = 1
    const start = nowIndex(sorted)
    setVisibleStart(start)
    setVisibleEnd(Math.min(sorted.length, start + PAGE_SIZE))
  }, [results])

  if (results.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-dashed border-gerayo-border p-6 text-center text-gerayo-muted">
        {t('results.empty')}
      </div>
    )
  }

  const sorted = [...extended].sort((a, b) => sortKeyOf(a) - sortKeyOf(b))
  const start = Math.max(0, visibleStart)
  const end = Math.min(sorted.length, visibleEnd)
  const visible = sorted.slice(start, end)

  const handleEarlier = () => {
    const size = end - start
    const grow = size + STEP <= MAX_VISIBLE
    const targetStart = start - STEP
    const newEnd = grow ? end : end - STEP

    if (targetStart >= 0) {
      setVisibleStart(targetStart)
      setVisibleEnd(newEnd)
      return
    }

    const needed = -targetStart
    const generated = generateEarlier(sorted, needed, earlierSeq.current)
    earlierSeq.current += needed
    setExtended((prev) => [...generated, ...prev])
    setVisibleStart(0)
    setVisibleEnd(newEnd + needed)
  }

  const handleLater = () => {
    const size = end - start
    const grow = size + STEP <= MAX_VISIBLE
    const newStart = grow ? start : start + STEP
    const targetEnd = end + STEP

    if (targetEnd <= sorted.length) {
      setVisibleStart(newStart)
      setVisibleEnd(targetEnd)
      return
    }

    const needed = targetEnd - sorted.length
    const generated = generateLater(sorted, needed, laterSeq.current)
    laterSeq.current += needed
    setExtended((prev) => [...prev, ...generated])
    setVisibleStart(newStart)
    setVisibleEnd(targetEnd)
  }

  return (
    <div className="mt-1 space-y-3">
      <button
        type="button"
        onClick={handleEarlier}
        className="block w-full text-center text-sm font-medium text-gerayo-from underline underline-offset-2 hover:brightness-110"
      >
        {t('results.earlierRoutes')}
      </button>

      {visible.map((itinerary) => (
        <KigaliResultCard
          key={itinerary.id}
          itinerary={itinerary}
          isActive={focusedId === itinerary.id}
          onOpenDetail={(it) => {
            onFocus(it.id)
            onOpenDetail(it)
          }}
          onBuy={onBuy}
          onPreview={onPreview}
        />
      ))}

      <button
        type="button"
        onClick={handleLater}
        className="block w-full text-center text-sm font-medium text-gerayo-from underline underline-offset-2 hover:brightness-110"
      >
        {t('results.laterRoutes')}
      </button>
    </div>
  )
}
