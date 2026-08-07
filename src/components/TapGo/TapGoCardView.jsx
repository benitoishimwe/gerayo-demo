import { Button } from '../common/Button'
import { useLanguage } from '../../i18n/LanguageContext'
import routes from '../../data/tapgoRoutes.json'
import { TapGoHistory } from './TapGoHistory'

export function TapGoCardView({ card, onTopUp, onBoard }) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col gap-5">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-lime-400 p-5 text-black shadow-lg">
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/15" />
        <div className="absolute -bottom-8 -left-4 h-24 w-24 rounded-full bg-black/10" />
        <div className="relative flex items-start justify-between">
          <div className="text-lg font-bold tracking-wide">Tap&amp;Go</div>
          <span className="rounded-md bg-black/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest">
            {t('tapgo.cardStatusActive')}
          </span>
        </div>
        <div className="relative mt-6">
          <div className="text-xs font-medium opacity-80">{t('tapgo.cardBalance')}</div>
          <div className="text-3xl font-bold">{card.balance.toLocaleString()} RWF</div>
        </div>
        <div className="relative mt-6 flex items-end justify-between text-xs font-medium">
          <div>
            <div className="opacity-70">{t('tapgo.cardId')}</div>
            <div className="font-mono">{card.cardId}</div>
          </div>
          <div className="text-right opacity-80">{t('tapgo.cardHolder')}</div>
        </div>
      </div>

      <Button onClick={onTopUp}>{t('tapgo.topUp')}</Button>

      <div>
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-gerayo-muted">
          {t('tapgo.selectRoutePrompt')}
        </div>
        <div className="space-y-2">
          {routes.map((route) => (
            <button
              key={route.id}
              onClick={() => onBoard(route)}
              className="flex w-full items-center justify-between rounded-xl border border-gerayo-border bg-gerayo-card/60 px-4 py-3 text-left transition hover:bg-white/5"
            >
              <div>
                <div className="text-sm font-medium text-white">
                  {route.origin} → {route.destination}
                </div>
                <div className="text-xs text-gerayo-muted">{t('tapgo.busLabel', { plate: route.plate })}</div>
              </div>
              <span className="text-sm font-semibold text-white">{route.fare} RWF</span>
            </button>
          ))}
        </div>
      </div>

      <TapGoHistory transactions={card.transactions} />
    </div>
  )
}
