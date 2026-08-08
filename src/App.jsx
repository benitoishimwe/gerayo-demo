import { useEffect, useMemo, useRef, useState } from 'react'
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
import { TicketsTapGoView } from './components/Ticket/TicketsTapGoView'
import { SchedulesView } from './components/Schedules/SchedulesView'
import { KigaliSearchForm } from './components/Kigali/KigaliSearchForm'
import { KigaliResultsList } from './components/Kigali/KigaliResultsList'
import { KigaliItineraryModal } from './components/Kigali/KigaliItineraryModal'
import { KigaliSchedulesView } from './components/Kigali/KigaliSchedulesView'
import { Button } from './components/common/Button'
import { useSearch } from './hooks/useSearch'
import { useKigaliSearch } from './hooks/useKigaliSearch'
import { useWallet } from './hooks/useWallet'
import { useAuth } from './hooks/useAuth'
import { useTickets } from './hooks/useTickets'
import { useTapGoCard } from './hooks/useTapGoCard'
import { toTimeString, getItineraryStopPositions, getLineStopPositions } from './utils/kigaliJourney'
import { useLanguage } from './i18n/LanguageContext'

export default function App() {
  const { t } = useLanguage()
  const search = useSearch()
  const kigaliSearch = useKigaliSearch()
  const wallet = useWallet()
  const tapGo = useTapGoCard()
  const auth = useAuth()
  const { tickets, addTicket, updateTicketStatus } = useTickets()

  const [focusedRouteId, setFocusedRouteId] = useState(null)
  const [hoveredRouteId, setHoveredRouteId] = useState(null)
  const [seatRoute, setSeatRoute] = useState(null)
  const [detailRoute, setDetailRoute] = useState(null)
  const [booking, setBooking] = useState(null) // { route, ticketId, total }
  const [kigaliFocusedId, setKigaliFocusedId] = useState(null)
  const [kigaliItinerary, setKigaliItinerary] = useState(null)
  const [kigaliPreviewItinerary, setKigaliPreviewItinerary] = useState(null)
  const [kigaliPreviewLine, setKigaliPreviewLine] = useState(null)
  const [schedulesPreviewRoute, setSchedulesPreviewRoute] = useState(null)
  const [kigaliLineDetailOpen, setKigaliLineDetailOpen] = useState(false)
  const [kigaliBooking, setKigaliBooking] = useState(null) // { ticketId, total }
  const [showWallet, setShowWallet] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [accountStartInAuth, setAccountStartInAuth] = useState(false)
  const [showTickets, setShowTickets] = useState(false)
  const [showSchedules, setShowSchedules] = useState(false)
  const [activeTopTab, setActiveTopTab] = useState('provinces')
  const isKigali = activeTopTab === 'kigali'
  const hasSearched = isKigali ? kigaliSearch.hasSearched : search.hasSearched
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

  const kigaliRouteStops = useMemo(() => {
    if (kigaliItinerary) return getItineraryStopPositions(kigaliItinerary)
    if (kigaliPreviewItinerary) return getItineraryStopPositions(kigaliPreviewItinerary)
    if (kigaliPreviewLine) return getLineStopPositions(kigaliPreviewLine)
    return null
  }, [kigaliItinerary, kigaliPreviewItinerary, kigaliPreviewLine])

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

  const handleBuyKigaliTicket = (itinerary) => {
    if (!auth.isAuthenticated) {
      setKigaliItinerary(null)
      setAccountStartInAuth(true)
      setShowAccount(true)
      return
    }
    const busLegs = itinerary.legs.filter((l) => l.kind === 'bus')
    const firstLeg = busLegs[0]
    const lastLeg = busLegs[busLegs.length - 1]
    const ticketId = `TCK-${Date.now()}`
    addTicket({
      id: ticketId,
      type: 'kigali',
      agencyId: firstLeg.line.agencyId,
      lines: busLegs.map((leg) => ({ code: leg.line.code, agencyId: leg.line.agencyId })),
      origin: firstLeg.boardStop.name,
      destination: lastLeg.alightStop.name,
      departureTime: toTimeString(itinerary.departAt),
      date: new Date().toISOString().slice(0, 10),
      total: itinerary.fare,
      status: 'pending',
    })
    setKigaliBooking({ ticketId, total: itinerary.fare })
    setKigaliItinerary(null)
  }

  const handlePaid = (method, finalTotal) => {
    if (method === 'wallet') wallet.deduct(finalTotal)
    if (method === 'tapgo') tapGo.spend(finalTotal, { origin: booking?.route?.origin, destination: booking?.route?.destination })
    if (booking) {
      updateTicketStatus(booking.ticketId, 'paid')
      setBooking(null)
    } else if (kigaliBooking) {
      updateTicketStatus(kigaliBooking.ticketId, 'paid')
      setKigaliBooking(null)
    }
    setShowTickets(true)
  }

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-gerayo-bg text-gerayo-text">
      <MapPanel
        selectedRoute={isKigali ? null : showSchedules ? schedulesPreviewRoute : focusedRoute}
        origin={isKigali ? kigaliSearch.origin : search.origin}
        destination={isKigali ? kigaliSearch.destination : search.destination}
        onSetOrigin={isKigali ? undefined : search.setOrigin}
        onSetDestination={isKigali ? undefined : search.setDestination}
        sidebarWidth={sidebarWidth}
        className="absolute inset-0 hidden h-full w-full md:block"
        kigaliMode={isKigali}
        kigaliRoute={kigaliRouteStops}
      />

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col md:flex-row">
        <div
          ref={sidebarRef}
          className="pointer-events-auto relative flex h-dvh min-h-0 w-full flex-shrink-0 flex-col overflow-hidden bg-gerayo-bg shadow-2xl md:m-4 md:h-[calc(100%-2rem)] md:w-[420px] md:rounded-2xl md:border md:border-gerayo-border xl:mb-0 xl:h-[calc(100%-279px)]"
        >
          {!(hasSearched && !showTickets && !showSchedules) && (
            <div className={kigaliLineDetailOpen ? 'hidden md:block' : ''}>
              <Header
                onOpenAccount={() => setShowAccount(true)}
                activeTopTab={activeTopTab}
                onChangeTopTab={setActiveTopTab}
                showTickets={showTickets}
                showSchedules={showSchedules}
              />
            </div>
          )}
          {showSchedules ? (
            isKigali ? (
              <KigaliSchedulesView onPreviewLine={setKigaliPreviewLine} onDetailOpenChange={setKigaliLineDetailOpen} />
            ) : (
              <SchedulesView onPreviewRoute={setSchedulesPreviewRoute} onOpenDetail={setDetailRoute} />
            )
          ) : showTickets ? (
            <TicketsTapGoView auth={auth} tapGo={tapGo} tickets={tickets} onPlanJourney={() => setShowTickets(false)} />
          ) : isKigali ? (
            kigaliSearch.hasSearched ? (
              <>
                <div className="flex-shrink-0 border-b border-gerayo-border p-4">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        kigaliSearch.reset()
                        setKigaliFocusedId(null)
                        setKigaliPreviewItinerary(null)
                      }}
                      aria-label={t('common.back')}
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-gerayo-text hover:bg-gerayo-card transition"
                    >
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="h-5 w-5">
                        <path d="M12.5 4L6 10l6.5 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <div className="flex flex-1 items-stretch gap-3">
                      <div className="flex flex-col items-center pt-1.5">
                        <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: '#22c55e' }} />
                        <span className="my-1 w-px flex-1 bg-gerayo-border" />
                        <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: '#3b82f6' }} />
                      </div>
                      <div className="flex flex-1 flex-col justify-between gap-2 py-0.5">
                        <span className="truncate font-medium text-white">{kigaliSearch.origin}</span>
                        <span className="truncate font-medium text-white">{kigaliSearch.destination}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="jd-scroll flex-1 overflow-y-auto p-4">
                  <KigaliResultsList
                    results={kigaliSearch.results}
                    focusedId={kigaliFocusedId}
                    onFocus={setKigaliFocusedId}
                    onOpenDetail={setKigaliItinerary}
                    onBuy={handleBuyKigaliTicket}
                    onPreview={setKigaliPreviewItinerary}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex-shrink-0 p-4 pb-0">
                  <KigaliSearchForm search={kigaliSearch} />
                </div>
                <div className="jd-scroll flex-1 overflow-y-auto p-4 pt-3">
                  <RouteHistory
                    history={kigaliSearch.routeHistory}
                    onSelect={kigaliSearch.applyRoute}
                    onClear={kigaliSearch.clearHistory}
                  />
                </div>
                {kigaliSearch.canSearch && (
                  <div className="flex-shrink-0 px-4 pb-3">
                    <Button onClick={kigaliSearch.search}>{t('search.searchButton')}</Button>
                  </div>
                )}
              </>
            )
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
                  <Button onClick={search.search}>{t('search.searchButton')}</Button>
                </div>
              )}
            </>
          )}
          {!(hasSearched && !showTickets && !showSchedules) && (
            <BottomNav
              active={showSchedules ? 'schedules' : showTickets ? 'tickets' : 'trip'}
              onChange={(key) => {
                if (key === 'tickets' && !auth.isAuthenticated) {
                  setAccountStartInAuth(true)
                  setShowAccount(true)
                  return
                }
                setShowTickets(key === 'tickets')
                setShowSchedules(key === 'schedules')
              }}
            />
          )}
        </div>
      </div>

      {detailRoute && !seatRoute && (
        <RouteDetailModal
          route={detailRoute}
          onClose={() => {
            setDetailRoute(null)
            setSchedulesPreviewRoute(null)
          }}
          onSelectSeats={handleSelectSeats}
        />
      )}

      {seatRoute && <SeatModal route={seatRoute} onClose={() => setSeatRoute(null)} onConfirm={handleConfirmSeats} />}

      {kigaliItinerary && (
        <KigaliItineraryModal
          itinerary={kigaliItinerary}
          onClose={() => setKigaliItinerary(null)}
          onBuy={handleBuyKigaliTicket}
        />
      )}

      {(booking || kigaliBooking) && (
        <PaymentModal
          total={(booking || kigaliBooking).total}
          balance={wallet.balance}
          tapgoBalance={tapGo.balance}
          onClose={() => {
            setBooking(null)
            setKigaliBooking(null)
          }}
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
          auth={auth}
          balance={wallet.balance}
          city="Kigali"
          startInAuth={accountStartInAuth}
          onClose={() => {
            setShowAccount(false)
            setAccountStartInAuth(false)
          }}
          onOpenWallet={() => {
            setShowAccount(false)
            setShowWallet(true)
          }}
        />
      )}
    </div>
  )
}
