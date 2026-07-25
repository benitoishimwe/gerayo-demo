import { useEffect, useRef, useState } from 'react'
import { Header } from './components/Layout/Header'
import { BottomNav } from './components/Layout/BottomNav'
import { MapPanel } from './components/Layout/MapPanel'
import { SearchForm } from './components/Search/SearchForm'
import { RouteHistory } from './components/Search/RouteHistory'
import { ResultsList } from './components/Results/ResultsList'
import { ResultsHeader } from './components/Results/ResultsHeader'
import { SeatModal } from './components/SeatSelection/SeatModal'
import { RouteDetailModal } from './components/Results/RouteDetailModal'
import { PaymentModal } from './components/Payment/PaymentModal'
import { WalletTopUpModal } from './components/Wallet/WalletTopUpModal'
import { AccountModal } from './components/Account/AccountModal'
import { TicketList } from './components/Ticket/TicketList'
import { Button } from './components/common/Button'
import { useSearch } from './hooks/useSearch'
import { useWallet } from './hooks/useWallet'
import { useTickets } from './hooks/useTickets'

export default function App() {
  const search = useSearch()
  const wallet = useWallet()
  const { tickets, addTicket, updateTicketStatus } = useTickets()

  const [focusedRouteId, setFocusedRouteId] = useState(null)
  const [hoveredRouteId, setHoveredRouteId] = useState(null)
  const [seatRoute, setSeatRoute] = useState(null)
  const [detailRoute, setDetailRoute] = useState(null)
  const [booking, setBooking] = useState(null) // { route, ticketId, total }
  const [showWallet, setShowWallet] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [showTickets, setShowTickets] = useState(false)
  const [activeTopTab, setActiveTopTab] = useState('provinces')
  const sidebarRef = useRef(null)
  const [sidebarWidth, setSidebarWidth] = useState(0)

  useEffect(() => {
    const el = sidebarRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      // Extra margin so markers land clear of the panel, not flush against it.
      setSidebarWidth(entry.contentRect.width + 50)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const focusedRoute =
    search.results.find((r) => r.id === hoveredRouteId) ||
    search.results.find((r) => r.id === focusedRouteId) ||
    seatRoute ||
    detailRoute ||
    booking?.route ||
    null

  const handleSelectSeats = (route) => {
    setFocusedRouteId(route.id)
    setDetailRoute(null)
    setSeatRoute(route)
  }

  const handleConfirmSeats = ({ selectedSeats, passengers, total }) => {
    const ticketId = `TCK-${Date.now()}`
    addTicket({
      id: ticketId,
      agencyId: seatRoute.agencyId,
      origin: seatRoute.origin,
      destination: seatRoute.destination,
      departureTime: seatRoute.departureTime,
      date: new Date().toISOString().slice(0, 10),
      seats: selectedSeats,
      passengers,
      total,
      status: 'pending',
    })
    setBooking({ route: seatRoute, ticketId, total })
    setSeatRoute(null)
  }

  const handlePaid = (method, finalTotal) => {
    if (method === 'wallet') wallet.deduct(finalTotal)
    updateTicketStatus(booking.ticketId, 'paid')
    setBooking(null)
    setShowTickets(true)
  }

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-gerayo-bg text-gerayo-text">
      <MapPanel
        selectedRoute={focusedRoute}
        origin={search.origin}
        destination={search.destination}
        onSetOrigin={search.setOrigin}
        onSetDestination={search.setDestination}
        sidebarWidth={sidebarWidth}
        className="absolute inset-0 hidden h-full w-full md:block"
      />

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col md:flex-row">
        <div
          ref={sidebarRef}
          className="pointer-events-auto relative flex h-dvh min-h-0 w-full flex-shrink-0 flex-col overflow-hidden bg-gerayo-bg shadow-2xl md:h-[calc(100%-2rem)] md:w-[420px] md:m-4 md:rounded-2xl md:border md:border-gerayo-border"
        >
          {!(search.hasSearched && !showTickets) && (
            <Header
              onOpenAccount={() => setShowAccount(true)}
              activeTopTab={activeTopTab}
              onChangeTopTab={setActiveTopTab}
              showTickets={showTickets}
            />
          )}
          {showTickets ? (
            <TicketList tickets={tickets} onPlanJourney={() => setShowTickets(false)} />
          ) : search.hasSearched ? (
            <>
              <ResultsHeader
                origin={search.origin}
                destination={search.destination}
                agencyIds={search.agencyIds}
                setAgencyIds={search.setAgencyIds}
                onBack={() => {
                  search.reset()
                  setFocusedRouteId(null)
                  setHoveredRouteId(null)
                }}
              />
              <div className="jd-scroll flex-1 overflow-y-auto p-4">
                <ResultsList
                  results={search.results}
                  onSelectSeats={handleSelectSeats}
                  focusedRouteId={focusedRouteId}
                  onFocusRoute={setFocusedRouteId}
                  onHoverRoute={setHoveredRouteId}
                  onOpenDetail={setDetailRoute}
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex-shrink-0 p-4 pb-0">
                <SearchForm search={search} />
              </div>
              <div className="jd-scroll flex-1 overflow-y-auto p-4 pt-3">
                <RouteHistory
                  history={search.routeHistory}
                  onSelect={search.applyRoute}
                  onClear={search.clearHistory}
                />
              </div>
              {search.canSearch && (
                <div className="flex-shrink-0 px-4 pb-3">
                  <Button onClick={search.search}>Reba inzira →</Button>
                </div>
              )}
            </>
          )}
          {!(search.hasSearched && !showTickets) && (
            <BottomNav
              active={showTickets ? 'tickets' : 'trip'}
              onChange={(key) => {
                if (key === 'tickets') setShowTickets(true)
                else if (key === 'trip') setShowTickets(false)
              }}
            />
          )}
        </div>
      </div>

      {detailRoute && !seatRoute && (
        <RouteDetailModal route={detailRoute} onClose={() => setDetailRoute(null)} onSelectSeats={handleSelectSeats} />
      )}

      {seatRoute && <SeatModal route={seatRoute} onClose={() => setSeatRoute(null)} onConfirm={handleConfirmSeats} />}

      {booking && (
        <PaymentModal
          total={booking.total}
          balance={wallet.balance}
          onClose={() => setBooking(null)}
          onOpenTopUp={() => setShowWallet(true)}
          onPaid={handlePaid}
        />
      )}

      {showWallet && (
        <WalletTopUpModal
          balance={wallet.balance}
          onClose={() => setShowWallet(false)}
          onTopUp={(amount) => {
            wallet.topUp(amount)
            setShowWallet(false)
          }}
        />
      )}

      {showAccount && (
        <AccountModal
          email="benishimwe31@gmail.com"
          balance={wallet.balance}
          city="Kigali"
          onClose={() => setShowAccount(false)}
          onOpenWallet={() => {
            setShowAccount(false)
            setShowWallet(true)
          }}
        />
      )}
    </div>
  )
}
