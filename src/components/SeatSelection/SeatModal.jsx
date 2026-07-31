import { useMemo, useState } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { SeatGrid } from './SeatGrid'
import { SeatLegend } from './SeatLegend'
import { PassengerList } from './PassengerList'
import seatMaps from '../../data/seatMaps.json'
import agencies from '../../data/agencies.json'
import { buildSeatLayout } from '../../utils/seatLayout'
import { useLanguage } from '../../i18n/LanguageContext'

export function SeatModal({ route, onClose, onConfirm }) {
  const { t } = useLanguage()
  const [tab, setTab] = useState('layout')
  const [selectedSeats, setSelectedSeats] = useState([])
  const [passengers, setPassengers] = useState({})

  const { rows, vipSeats } = useMemo(() => buildSeatLayout(route.busType, seatMaps), [route.busType])
  const bus = seatMaps[route.busType]
  const agency = agencies.find((a) => a.id === route.agencyId)

  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    )
    setPassengers((prev) => {
      if (selectedSeats.includes(seatId)) {
        const next = { ...prev }
        delete next[seatId]
        return next
      }
      return prev
    })
  }

  const changeName = (seatId, name) => setPassengers((prev) => ({ ...prev, [seatId]: name }))

  const total = selectedSeats.length * route.price

  return (
    <Modal title={`${bus.label} — ${agency?.name}`} onClose={onClose} sidebar>
      <div className="flex flex-col">
        {/* Route strip */}
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-gerayo-border bg-gerayo-card/60 px-3 py-2.5">
          <div className="flex flex-col items-center pt-0.5">
            <span className="h-2 w-2 rounded-full bg-gerayo-from" />
            <span className="my-0.5 h-5 w-px bg-gerayo-border" />
            <span className="h-2 w-2 rounded-full bg-gerayo-to" />
          </div>
          <div className="flex-1 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-white">{route.origin}</span>
              <span className="text-xs text-gerayo-muted">{route.departureTime}</span>
            </div>
            <div className="mt-2 font-medium text-white">{route.destination}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setTab('layout')}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              tab === 'layout' ? 'bg-gerayo-from text-black' : 'bg-gerayo-card text-gerayo-muted hover:text-white'
            }`}
          >
            {t('seat.fromLayout')}
          </button>
          <button
            onClick={() => setTab('passengers')}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              tab === 'passengers' ? 'bg-gerayo-from text-black' : 'bg-gerayo-card text-gerayo-muted hover:text-white'
            }`}
          >
            {t('seat.passengers', { count: selectedSeats.length })}
          </button>
        </div>

        {tab === 'layout' ? (
          <div className="gerayo-fade-up space-y-4">
            <SeatLegend />
            <div className="relative overflow-hidden rounded-2xl border border-gerayo-border bg-gerayo-bg p-4 pt-5">
              {/* windshield / driver */}
              <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-gerayo-border bg-gerayo-card px-4 py-1.5 text-[10px] font-semibold tracking-widest text-gerayo-muted">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
                  <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M12 4v3M12 17v3M4 12h3M17 12h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                {t('seat.driver')}
              </div>
              <SeatGrid
                rows={rows}
                takenSeats={route.takenSeats}
                vipSeats={vipSeats}
                selectedSeats={selectedSeats}
                onToggle={toggleSeat}
              />
            </div>
          </div>
        ) : (
          <div className="gerayo-fade-up">
            <PassengerList selectedSeats={selectedSeats} passengers={passengers} onChangeName={changeName} />
          </div>
        )}
      </div>

      <div className="sticky -bottom-5 -mx-5 -mb-5 mt-5 border-t border-gerayo-border bg-gerayo-panel px-5 pt-4 pb-5">
        <div className="flex items-center justify-between text-white">
          <span className="text-sm text-gerayo-muted">
            {selectedSeats.length > 0
              ? t(selectedSeats.length > 1 ? 'seat.seatsSelectedPlural' : 'seat.seatsSelected', { count: selectedSeats.length })
              : t('seat.total')}
          </span>
          <span className="text-lg font-semibold">{total.toLocaleString()} RWF</span>
        </div>

        <div className="mt-3 flex gap-3">
          <Button variant="secondary" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            disabled={selectedSeats.length === 0}
            onClick={() => onConfirm({ selectedSeats, passengers, total })}
          >
            {t('seat.confirmBooking')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
