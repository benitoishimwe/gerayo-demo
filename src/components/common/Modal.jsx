export function Modal({ title, onClose, children, wide, sidebar }) {
  if (sidebar) {
    return (
      <div className="absolute inset-0 z-[2000] flex items-stretch justify-start bg-black/70 md:bg-transparent md:pointer-events-none">
        <div
          className="jd-scroll pointer-events-auto flex w-full h-full flex-col overflow-hidden bg-gerayo-panel border border-gerayo-border md:max-h-[calc(100%-2rem)] md:h-[calc(100%-2rem)] md:w-[420px] md:m-4 md:rounded-2xl"
        >
          <div className="sticky top-0 flex items-center justify-between px-5 py-4 border-b border-gerayo-border bg-gerayo-panel">
            <h2 className="text-lg font-semibold text-gerayo-text">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="h-8 w-8 rounded-full flex items-center justify-center text-gerayo-muted hover:bg-gerayo-card hover:text-white transition"
            >
              ✕
            </button>
          </div>
          <div className="jd-scroll flex-1 overflow-y-auto p-5">{children}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/70 p-0 sm:p-4">
      <div
        className={`jd-scroll w-full ${wide ? 'sm:max-w-2xl' : 'sm:max-w-md'} max-h-[92dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-gerayo-panel border border-gerayo-border`}
      >
        <div className="sticky top-0 flex items-center justify-between px-5 py-4 border-b border-gerayo-border bg-gerayo-panel">
          <h2 className="text-lg font-semibold text-gerayo-text">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="h-8 w-8 rounded-full flex items-center justify-center text-gerayo-muted hover:bg-gerayo-card hover:text-white transition"
          >
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
