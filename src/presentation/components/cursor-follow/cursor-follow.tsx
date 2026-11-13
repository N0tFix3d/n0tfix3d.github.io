import { useEffect, useRef } from 'react'
import styles from './cursor-follow.module.scss'

export function CursorFollow() {
  const rootRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLSpanElement>(null)
  const ringRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const dot = dotRef.current
    const ring = ringRef.current
    if (!root || !dot || !ring) return

    const fine = window.matchMedia('(pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduced.matches) return

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let ringX = x
    let ringY = y
    let frame = 0

    const place = (element: HTMLElement, left: number, top: number) => {
      element.style.transform = `translate3d(${left}px, ${top}px, 0) translate(-50%, -50%)`
    }

    const tick = () => {
      ringX += (x - ringX) * 0.18
      ringY += (y - ringY) * 0.18
      place(dot, x, y)
      place(ring, ringX, ringY)
      frame = window.requestAnimationFrame(tick)
    }

    const onMove = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
      root.dataset.visible = 'true'
      const target = event.target
      const interactive = target instanceof Element && Boolean(target.closest('a, button, input, textarea, select, summary'))
      root.dataset.hot = interactive ? 'true' : 'false'
    }

    const hide = () => {
      delete root.dataset.visible
    }

    root.dataset.armed = 'true'
    window.addEventListener('pointermove', onMove)
    window.addEventListener('blur', hide)
    document.documentElement.addEventListener('pointerleave', hide)
    frame = window.requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('blur', hide)
      document.documentElement.removeEventListener('pointerleave', hide)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={rootRef} className={styles.root} aria-hidden="true">
      <span ref={ringRef} className={styles.ring} />
      <span ref={dotRef} className={styles.dot} />
    </div>
  )
}
