import { TownCombobox } from './TownCombobox'
import { AgencyPicker } from './AgencyPicker'
import { DateTimePicker } from './DateTimePicker'
import { useLanguage } from '../../i18n/LanguageContext'

export function SearchForm({ search }) {
  const { t } = useLanguage()
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
      <TownCombobox label={t('search.originPlaceholder')} value={origin} onChange={setOrigin} dotColor="#22c55e" />
      <TownCombobox label={t('search.destinationPlaceholder')} value={destination} onChange={setDestination} dotColor="#3b82f6" />

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
