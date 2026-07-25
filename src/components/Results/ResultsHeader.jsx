import { AgencyPicker } from '../Search/AgencyPicker'

export function ResultsHeader({ origin, destination, onBack, agencyIds, setAgencyIds }) {
  return (
    <div className="flex-shrink-0 border-b border-gerayo-border p-4">
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-gerayo-text hover:bg-gerayo-card transition"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="h-5 w-5">
            <path d="M12.5 4L6 10l6.5 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex items-start gap-3">
          <div className="flex flex-1 items-stretch gap-3">
            <div className="flex flex-col items-center pt-1.5">
              <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: '#22c55e' }} />
              <span className="my-1 w-px flex-1 bg-gerayo-border" />
              <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: '#3b82f6' }} />
            </div>
            <div className="flex flex-1 flex-col justify-between gap-2 py-0.5">
              <span className="truncate font-medium text-white">{origin}</span>
              <span className="truncate font-medium text-white">{destination}</span>
            </div>
          </div>

          <div className="flex flex-shrink-0 items-center pt-0.5">
            <AgencyPicker agencyIds={agencyIds} setAgencyIds={setAgencyIds} compact />
          </div>
        </div>
      </div>
    </div>
  )
}
