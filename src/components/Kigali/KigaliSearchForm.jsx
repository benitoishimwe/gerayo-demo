import { KigaliStopCombobox } from './KigaliStopCombobox'
import { DateTimePicker } from '../Search/DateTimePicker'
import { useLanguage } from '../../i18n/LanguageContext'

export function KigaliSearchForm({ search }) {
  const { t } = useLanguage()
  const { origin, setOrigin, destination, setDestination, dateTime, setDateTime, setTimeMode, swap } = search

  return (
    <div className="space-y-3">
      <div className="relative space-y-2">
        <KigaliStopCombobox label={t('kigaliSearch.originPlaceholder')} value={origin} onChange={setOrigin} dotColor="#22c55e" />
        <KigaliStopCombobox label={t('kigaliSearch.destinationPlaceholder')} value={destination} onChange={setDestination} dotColor="#3b82f6" />
        <button
          type="button"
          onClick={swap}
          aria-label={t('kigaliSearch.swap')}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-gerayo-border bg-gerayo-panel text-gerayo-muted hover:text-white hover:border-gerayo-muted"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path d="M7 4v13M7 4L4 7M7 4l3 3M17 20V7m0 13l3-3m-3 3l-3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <DateTimePicker
        value={dateTime}
        onChange={(date, mode) => {
          setDateTime(date)
          setTimeMode(mode)
        }}
      />
    </div>
  )
}
