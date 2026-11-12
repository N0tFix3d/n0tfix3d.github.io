import { useEffect } from 'react'
import { EssayPage } from '@presentation/pages/essay-page'
import { useArchiveSnapshot } from '@presentation/app/use-archive-snapshot'
import layout from '@presentation/styles/layout.module.scss'
import styles from './method-page.module.scss'

export function MethodPage() {
  const { profile } = useArchiveSnapshot()

  useEffect(() => {
    document.title = `Practice — ${profile.name}`
  }, [profile.name])

  return (
    <EssayPage
        kicker={`${profile.name} · ${profile.role}`}
        title={profile.statement}
        summary={profile.summary}
        sections={profile.sections}
      >
      <section className={layout.section}>
        <div className={layout.sectionHead}>
          <h2>Focus</h2>
        </div>
        <ul className={styles.focus}>
          {profile.focus.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className={styles.contact}>
          <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
          <span>{profile.contact.label}</span>
        </p>
      </section>
    </EssayPage>
  )
}
