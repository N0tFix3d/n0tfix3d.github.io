import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { loadArchive, type ArchiveSnapshot } from '@application/load-archive'
import type { Profile } from '@domain/profile/profile'
import { cx } from '@presentation/lib/cx'
import { useRepositories } from '@presentation/app/repository-context'
import styles from './page-shell.module.scss'

function monogram(name: string): string {
  const capitals = name.match(/[A-Z]/g)
  if (capitals && capitals.length >= 2) return `${capitals[0] ?? ''}${capitals[1] ?? ''}`
  const parts = name.split(/[\s_-]+/).filter((part) => part.length > 0)
  if (parts.length >= 2) return `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

function brandDetail(profile: Profile | null): string {
  if (!profile) return 'HiddenCry'
  if (profile.handle.toLowerCase() === profile.name.toLowerCase()) return profile.role
  return profile.handle
}

type ShellState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; snapshot: ArchiveSnapshot }

export function PageShell() {
  const repositories = useRepositories()
  const [state, setState] = useState<ShellState>({ status: 'loading' })

  useEffect(() => {
    let active = true
    loadArchive(repositories)
      .then((snapshot) => {
        if (active) setState({ status: 'ready', snapshot })
      })
      .catch((error: unknown) => {
        if (!active) return
        setState({
          status: 'error',
          message: error instanceof Error ? error.message : 'The archive could not be opened.',
        })
      })
    return () => {
      active = false
    }
  }, [repositories])

  const profile = state.status === 'ready' ? state.snapshot.profile : null

  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#content">
        Skip to content
      </a>
      <header className={cx(styles.header, 'site-chrome')}>
        <div className={styles.bar}>
          <NavLink to="/" className={styles.brand} end>
            <span className={styles.monogram}>{monogram(profile?.name ?? 'HiddenCry')}</span>
            <span>
              <span className={styles.brandName}>{profile?.name ?? 'HiddenCry'}</span>
              <span className={styles.handle}>{brandDetail(profile)}</span>
            </span>
          </NavLink>
          <nav aria-label="Primary">
            <NavLink to="/disclosures" className={({ isActive }) => cx(styles.navLink, isActive && styles.active)}>
              Archive
            </NavLink>
            <NavLink to="/method" className={({ isActive }) => cx(styles.navLink, isActive && styles.active)}>
              Practice
            </NavLink>
          </nav>
        </div>
      </header>
      <main id="content" className={styles.main}>
        {state.status === 'loading' ? <p className={styles.status}>Opening the archive…</p> : null}
        {state.status === 'error' ? (
          <p className={styles.status} role="alert">
            {state.message}
          </p>
        ) : null}
        {state.status === 'ready' ? <Outlet context={state.snapshot} /> : null}
      </main>
      <footer className={cx(styles.footer, 'site-chrome')}>
        <div className={styles.footerInner}>
          <p>
            {profile?.name ?? 'HiddenCry'}
            <span>Published after the fix.</span>
          </p>
          <ul>
            {profile?.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
            {profile ? (
              <li>
                <a href={`mailto:${profile.contact.email}`}>{profile.contact.label}</a>
              </li>
            ) : null}
          </ul>
        </div>
      </footer>
    </div>
  )
}
