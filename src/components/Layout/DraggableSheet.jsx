import { useRef, useState } from 'react'

export function DraggableSheet({ mapContent, children, collapsedTop = 224, expandedTop = 56, className = '' }) {
  const [top, setTop] = useState(collapsedTop)
  const [dragging, setDragging] = useState(false)
  const drag = useRef(null)

  const clamp = (v) => Math.min(collapsedTop, Math.max(expandedTop, v))

  function handlePointerDown(e) {
    drag.current = { startY: e.clientY, startTop: top }
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  function handlePointerMove(e) {
    if (!drag.current) return
    const dy = e.clientY - drag.current.startY
    setTop(clamp(drag.current.startTop + dy))
  }
  function handlePointerUp() {
    if (!drag.current) return
    drag.current = null
    setDragging(false)
    setTop((t) => (t < (collapsedTop + expandedTop) / 2 ? expandedTop : collapsedTop))
  }

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <div className="absolute inset-0">{mapContent}</div>
      <div
        className={`jd-scroll absolute inset-x-0 bottom-0 flex flex-col overflow-hidden rounded-t-3xl bg-gerayo-panel shadow-2xl ${
          dragging ? '' : 'transition-[top] duration-200 ease-out'
        }`}
        style={{ top }}
      >
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="flex flex-none cursor-grab touch-none justify-center py-2 active:cursor-grabbing"
        >
          <span className="h-1 w-10 rounded-full bg-gerayo-border" />
        </div>
        <div className="jd-scroll min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
