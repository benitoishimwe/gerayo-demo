import { useState } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { useLanguage } from '../../i18n/LanguageContext'

export function TapGoManageCardsModal({ card, onClose }) {
  const { t } = useLanguage()
  const [addingCard, setAddingCard] = useState(false)
  const [newCardId, setNewCardId] = useState('')
  const [newCardLabel, setNewCardLabel] = useState('')
  const [addError, setAddError] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editLabel, setEditLabel] = useState('')

  const startEdit = (c) => {
    setEditingId(c.id)
    setEditLabel(c.label)
  }

  const saveEdit = (id) => {
    card.renameCard(id, editLabel)
    setEditingId(null)
  }

  const submitAdd = (e) => {
    e.preventDefault()
    if (!card.enroll(newCardId, newCardLabel)) {
      setAddError(true)
      return
    }
    setAddError(false)
    setNewCardId('')
    setNewCardLabel('')
    setAddingCard(false)
  }

  const removeCard = (id) => {
    if (card.cards.length <= 1) return
    card.removeCard(id)
  }

  return (
    <Modal title={t('tapgo.manageCards')} onClose={onClose} sidebar>
      <div className="space-y-2">
        {card.cards.map((c) => (
          <div
            key={c.id}
            className={`rounded-xl border px-4 py-3 transition ${
              c.id === card.activeCardId ? 'border-gerayo-from bg-gerayo-from/10' : 'border-gerayo-border bg-gerayo-card/60'
            }`}
          >
            {editingId === c.id ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  placeholder={t('tapgo.cardLabelPlaceholder')}
                  autoFocus
                  className="flex-1 rounded-lg border border-gerayo-border bg-gerayo-card px-3 py-2 text-sm text-white outline-none focus:border-gerayo-from"
                />
                <button onClick={() => saveEdit(c.id)} className="text-xs font-semibold text-gerayo-from hover:underline">
                  {t('common.save')}
                </button>
                <button onClick={() => setEditingId(null)} className="text-xs text-gerayo-muted hover:underline">
                  {t('common.cancel')}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <button className="flex-1 text-left" onClick={() => card.switchCard(c.id)}>
                  <div className="flex items-center gap-2">
                    <div className="font-mono text-sm text-white">{c.id}</div>
                    {c.id === card.activeCardId && (
                      <span className="rounded-md bg-gerayo-from/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-gerayo-from">
                        {t('tapgo.cardStatusActive')}
                      </span>
                    )}
                  </div>
                  {c.label && <div className="text-xs text-gerayo-muted">{c.label}</div>}
                  <div className="text-xs text-gerayo-muted">{c.balance.toLocaleString()} RWF</div>
                </button>
                <div className="flex shrink-0 items-center gap-3 text-xs">
                  <button onClick={() => startEdit(c)} className="font-medium text-gerayo-muted hover:text-white">
                    {t('tapgo.editCard')}
                  </button>
                  {card.cards.length > 1 && (
                    <button onClick={() => removeCard(c.id)} className="font-medium text-red-400 hover:text-red-300">
                      {t('tapgo.removeCard')}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {addingCard ? (
        <form onSubmit={submitAdd} className="mt-4 space-y-3 rounded-xl border border-dashed border-gerayo-border p-4">
          <div>
            <label className="mb-1 block text-xs text-gerayo-muted">{t('tapgo.cardId')}</label>
            <input
              type="text"
              value={newCardId}
              onChange={(e) => setNewCardId(e.target.value)}
              required
              placeholder="TG-12345678"
              autoFocus
              className="w-full rounded-xl border border-gerayo-border bg-gerayo-card px-4 py-3 font-mono text-sm text-white outline-none focus:border-gerayo-from"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gerayo-muted">{t('tapgo.cardLabelPlaceholder')}</label>
            <input
              type="text"
              value={newCardLabel}
              onChange={(e) => setNewCardLabel(e.target.value)}
              placeholder={t('tapgo.cardLabelExample')}
              className="w-full rounded-xl border border-gerayo-border bg-gerayo-card px-4 py-3 text-sm text-white outline-none focus:border-gerayo-from"
            />
          </div>
          {addError && <p className="text-sm text-red-400">{t('tapgo.enrollError')}</p>}
          <div className="flex gap-2">
            <Button type="submit">{t('tapgo.enrollButton')}</Button>
            <button
              type="button"
              onClick={() => setAddingCard(false)}
              className="rounded-xl border border-gerayo-border px-4 text-sm text-gerayo-muted hover:text-white"
            >
              {t('common.cancel')}
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAddingCard(true)}
          className="mt-4 w-full rounded-xl border border-dashed border-gerayo-border px-4 py-3 text-sm font-medium text-gerayo-from hover:bg-gerayo-from/10"
        >
          + {t('tapgo.addCard')}
        </button>
      )}
    </Modal>
  )
}
