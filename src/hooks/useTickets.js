import { useLocalStorage } from './useLocalStorage'

export function useTickets() {
  const [tickets, setTickets] = useLocalStorage('gerayo_tickets', [])

  const addTicket = (ticket) => setTickets((t) => [ticket, ...t])

  const updateTicketStatus = (id, status) =>
    setTickets((t) => t.map((tk) => (tk.id === id ? { ...tk, status } : tk)))

  return { tickets, addTicket, updateTicketStatus }
}
