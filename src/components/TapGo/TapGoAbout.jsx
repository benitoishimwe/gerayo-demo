import { useLanguage } from '../../i18n/LanguageContext'

const POINT_KEYS = ['reach', 'eta', 'unified', 'data']

export function TapGoAbout() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-sm font-semibold text-white">{t('tapgo.aboutTitle')}</div>
        <p className="mt-2 text-sm text-gerayo-muted">{t('tapgo.aboutIntro')}</p>
      </div>

      <div className="space-y-2">
        {POINT_KEYS.map((key) => (
          <div key={key} className="flex gap-3 rounded-xl border border-gerayo-border bg-gerayo-card/60 px-4 py-3">
            <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-gerayo-from" />
            <p className="text-sm text-gerayo-text">{t(`tapgo.aboutPoints.${key}`)}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-dashed border-gerayo-border px-4 py-3 text-xs text-gerayo-muted">
        {t('tapgo.aboutCta')}
      </div>
    </div>
  )
}
