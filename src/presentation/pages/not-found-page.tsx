import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import layout from '@presentation/styles/layout.module.scss'

export function NotFoundPage() {
  useEffect(() => {
    document.title = 'Not found — HiddenCry'
  }, [])

  return (
    <div className={layout.page}>
      <p className={layout.kicker}>404</p>
      <h1 className={layout.title}>This page is not in the archive.</h1>
      <p className={layout.lede}>
        <Link to="/">Back to the front</Link>
      </p>
    </div>
  )
}
