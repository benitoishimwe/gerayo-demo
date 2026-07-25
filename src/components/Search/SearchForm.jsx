import { TownCombobox } from './TownCombobox'
import { AgencyPicker } from './AgencyPicker'
import { DateTimePicker } from './DateTimePicker'

export function SearchForm({ search }) {
  const {
    origin,
    setOrigin,
    destination,
    setDestination,
    agencyIds,
    setAgencyIds,
    dateTime,
    setDateTime,
    setTimeMode,
  } = search

  return (
    <div className="space-y-3">
      <TownCombobox label="Shakisha aho uhagurukira..." value={origin} onChange={setOrigin} dotColor="#22c55e" />
      <TownCombobox label="Shakisha aho ugana..." value={destination} onChange={setDestination} dotColor="#3b82f6" />

      <div className="flex items-center justify-between gap-2">
        <DateTimePicker
          value={dateTime}
          onChange={(date, mode) => {
            setDateTime(date)
            setTimeMode(mode)
          }}
        />
        <AgencyPicker agencyIds={agencyIds} setAgencyIds={setAgencyIds} />
      </div>
    </div>
  )
}
