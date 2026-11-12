import { useEffect, useRef } from 'react'
import { cx } from '@presentation/lib/cx'
import styles from './signal-field.module.scss'

interface SignalFieldProps {
  className?: string
}

export function SignalField({ className }: SignalFieldProps) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    let dispose = () => {}
    let cancelled = false

    void import('@presentation/three/create-signal-field').then(({ mountSignalField }) => {
      if (cancelled || !hostRef.current) return
      dispose = mountSignalField(hostRef.current)
    })

    return () => {
      cancelled = true
      dispose()
    }
  }, [])

  return <div ref={hostRef} className={cx(styles.field, className)} aria-hidden="true" />
}
