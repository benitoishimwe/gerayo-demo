import { useEffect, useState } from 'react'
import { Modal } from '../common/Modal'
import { AuthForm } from './AuthForm'
import { useLanguage, LANGUAGES } from '../../i18n/LanguageContext'

const RowChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 flex-shrink-0 text-gerayo-muted">
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const RowExternal = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 flex-shrink-0 text-gerayo-muted">
    <path
      d="M14 4h6v6M20 4l-8 8M9 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

function LinkRow({ icon, label, external, highlight, onClick, href }) {
  const Wrapper = href ? 'a' : 'button'
  return (
    <Wrapper
      href={href}
      target={href ? '_blank' : undefined}
      rel={href ? 'noreferrer' : undefined}
      onClick={onClick}
      className="flex w-full items-center gap-3 py-3 text-left"
    >
      {icon}
      <span className={`flex-1 text-sm font-medium ${highlight ? 'text-gerayo-from' : 'text-white'}`}>{label}</span>
      {external ? <RowExternal /> : <RowChevron />}
    </Wrapper>
  )
}

export function AccountModal({ auth, balance, city, onClose, onOpenWallet, startInAuth }) {
  const { t, language, setLanguage } = useLanguage()
  const [langOpen, setLangOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(Boolean(startInAuth))
  const currentLanguage = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0]

  useEffect(() => {
    if (auth.isAuthenticated) setAuthOpen(false)
  }, [auth.isAuthenticated])

  if (authOpen) {
    return (
      <Modal title={t('account.profile')} onClose={() => setAuthOpen(false)} sidebar>
        <AuthForm auth={auth} subtitle={t('auth.accountPrompt')} />
      </Modal>
    )
  }

  return (
    <Modal title={t('account.title')} onClose={onClose} sidebar>
      <div className="rounded-xl bg-gerayo-card border border-gerayo-border px-4 py-3">
        <div className="text-xs text-gerayo-muted">{t('account.selectedCity')}</div>
        <div className="mt-0.5 flex items-center justify-between">
          <span className="text-lg font-semibold text-gerayo-from">{city}</span>
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-gerayo-muted">
            <path d="M8 9l4-4 4 4M8 15l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-gerayo-card border border-gerayo-border px-4 py-3">
        <button
          type="button"
          onClick={() => setLangOpen((o) => !o)}
          className="flex w-full items-center justify-between text-left"
        >
          <div>
            <div className="text-xs text-gerayo-muted">{t('account.language')}</div>
            <div className="mt-0.5 text-lg font-semibold text-gerayo-from">{currentLanguage.native}</div>
          </div>
          <svg viewBox="0 0 24 24" fill="none" className={`h-4 w-4 text-gerayo-muted transition ${langOpen ? 'rotate-180' : ''}`}>
            <path d="M8 9l4-4 4 4M8 15l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {langOpen && (
          <div className="mt-3 space-y-1 border-t border-gerayo-border pt-3">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  setLanguage(l.code)
                  setLangOpen(false)
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                  l.code === language ? 'bg-gerayo-border text-white font-semibold' : 'text-gerayo-text hover:bg-gerayo-border/60'
                }`}
              >
                <span>{l.native}</span>
                {l.code === language && (
                  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-gerayo-from">
                    <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <h3 className="mt-6 mb-1 text-base font-bold text-white">{t('account.profile')}</h3>
      {auth.isAuthenticated ? (
        <div className="divide-y divide-gerayo-border">
          <LinkRow
            icon={
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <circle cx="12" cy="9" r="3.2" fill="#f59e0b" />
                  <path d="M5 20c1.6-3.6 4.6-5.4 7-5.4s5.4 1.8 7 5.4" fill="#f59e0b" />
                </svg>
              </span>
            }
            label={auth.user.email}
          />
          <LinkRow label={t('auth.logOut')} onClick={auth.logout} />
        </div>
      ) : (
        <div className="divide-y divide-gerayo-border">
          <LinkRow label={t('auth.accountPrompt')} onClick={() => setAuthOpen(true)} />
        </div>
      )}

      {auth.isAuthenticated && (
        <button
          onClick={onOpenWallet}
          className="mt-3 flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-gerayo-card to-gerayo-border border border-gerayo-border px-4 py-3 text-left transition hover:brightness-110"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 flex-shrink-0 text-white">
            <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M3 10h18" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="16.5" cy="14" r="1.3" fill="currentColor" />
          </svg>
          <div>
            <div className="text-sm text-gerayo-muted">{t('account.wallet')}</div>
            <div className="text-xl font-bold text-white">{balance.toLocaleString()} RWF</div>
          </div>
        </button>
      )}

      <h3 className="mt-6 mb-1 text-base font-bold text-white">{t('account.aboutUs')}</h3>
      <div className="divide-y divide-gerayo-border">
        <LinkRow label={t('account.contactUs')} href="https://www.gerayoapp.com/support.html" external />
        <LinkRow label={t('account.aboutCompany')} href="https://www.gerayoapp.com/" external />
        <LinkRow
          label="Instagram"
          href="https://www.instagram.com/gerayoapp/"
          external
          icon={
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-500 text-xs text-white">
              ◎
            </span>
          }
        />
        <LinkRow
          label="TikTok"
          href="https://www.tiktok.com/@gerayotransportationapp"
          external
          icon={
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-black text-xs text-white">
              ♪
            </span>
          }
        />
      </div>

      <h3 className="mt-6 mb-1 text-base font-bold text-white">{t('account.support')}</h3>
      <div className="divide-y divide-gerayo-border">
        <LinkRow label={t('account.termsOfService')} href="https://www.gerayoapp.com/terms.html" external />
        <LinkRow label={t('account.privacyPolicy')} href="https://www.gerayoapp.com/privacy.html" external />
      </div>

      <div className="mt-6 pb-1 text-xs text-gerayo-muted">
        <div>{t('account.version', { date: new Date().toISOString().slice(0, 10).split('-').reverse().join('/') })}</div>
        <div>{t('account.copyright')}</div>
      </div>
    </Modal>
  )
}
