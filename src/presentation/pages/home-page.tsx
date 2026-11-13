import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { queryDisclosures } from '@application/query-disclosures'
import { RecordList } from '@presentation/components/record-list/record-list'
import { RichText } from '@presentation/components/rich-text/rich-text'
import { SignalField } from '@presentation/components/signal-field/signal-field'
import { useArchiveSnapshot } from '@presentation/app/use-archive-snapshot'
import { formatScore } from '@presentation/lib/site'
import layout from '@presentation/styles/layout.module.scss'
import styles from './home-page.module.scss'

export function HomePage() {
  const { profile, catalog, disclosures } = useArchiveSnapshot()
  const ordered = queryDisclosures(disclosures, catalog, {})
  const lead = ordered[0]
  const leadSeverity = catalog.severities.find((level) => level.id === lead?.severityId)
  const products = new Set(disclosures.map((item) => item.product.name)).size
  const critical = disclosures.filter((item) => item.severityId === 'critical').length
  const high = disclosures.filter((item) => item.severityId === 'high').length

  useEffect(() => {
    document.title = `${profile.name} — Vulnerability disclosures`
  }, [profile.name])

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <SignalField className={styles.field} />
        <div className={styles.copy}>
          <p className={layout.kicker}>
            {profile.handle} · {profile.role}
          </p>
          <h1>{profile.statement}</h1>
          <p className={styles.summary}>{profile.summary}</p>
          <div className={styles.actions}>
            <Link className={styles.primary} to="/cves">
              Read the CVEs
            </Link>
            <Link className={styles.secondary} to="/#about">
              About
            </Link>
          </div>
        </div>
        {lead ? (
          <Link className={styles.lead} to={`/cves/${lead.id}`}>
            <p>Highest in the archive</p>
            <strong>{lead.id}</strong>
            <span>{lead.title}</span>
            <em>
              {leadSeverity?.label}
              {lead.cvss ? ` · ${formatScore(lead.cvss.score)}` : ''} · {lead.product.name}
            </em>
          </Link>
        ) : null}
      </section>

      <section className={styles.stats} aria-label="Archive totals">
        <p>
          <strong>{disclosures.length}</strong>
          <span>published records</span>
        </p>
        <p>
          <strong>{products}</strong>
          <span>codebases</span>
        </p>
        <p>
          <strong>{critical}</strong>
          <span>critical</span>
        </p>
        <p>
          <strong>{high}</strong>
          <span>high</span>
        </p>
      </section>

      <section className={styles.about} id="about">
        <div>
          <p className={layout.kicker}>About</p>
          <h2>{profile.name}</h2>
          <p className={styles.role}>{profile.role}</p>
          <p className={styles.summary}>{profile.summary}</p>
        </div>
        <div>
          <p className={styles.focusLabel}>Focus</p>
          <ul className={styles.focus}>
            {profile.focus.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className={styles.notes}>
          {profile.sections.map((section) => (
            <section key={section.id}>
              <h3>{section.title}</h3>
              <RichText blocks={section.blocks} />
            </section>
          ))}
          <p className={styles.noteLinks}>
            <Link to="/blog/how-a-disclosure-moves">How a disclosure moves</Link>
            <Link to="/hall-of-fame">Hall of Fame</Link>
          </p>
        </div>
      </section>

      <section className={layout.section}>
        <div className={layout.sectionHead}>
          <h2>The records</h2>
          <Link to="/cves">Filter the CVEs</Link>
        </div>
        <RecordList items={ordered} catalog={catalog} />
      </section>

      <section className={layout.section}>
        <div className={layout.sectionHead}>
          <h2>Weakness classes</h2>
        </div>
        <div className={layout.grid}>
          {catalog.categories.map((category) => {
            const count = disclosures.filter((item) => item.categoryIds.includes(category.id)).length
            return (
              <Link key={category.id} className={layout.card} to={`/categories/${category.id}`}>
                <strong>{category.label}</strong>
                <p>{category.summary}</p>
                <span>
                  {count} {count === 1 ? 'record' : 'records'}
                </span>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
