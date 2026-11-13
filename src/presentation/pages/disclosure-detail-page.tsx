import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { relatedDisclosures } from '@application/query-disclosures'
import { Dossier } from '@presentation/components/dossier/dossier'
import { RecordList } from '@presentation/components/record-list/record-list'
import { RichText } from '@presentation/components/rich-text/rich-text'
import { useArchiveSnapshot } from '@presentation/app/use-archive-snapshot'
import { formatDate } from '@presentation/lib/site'
import layout from '@presentation/styles/layout.module.scss'
import styles from './disclosure-detail-page.module.scss'

export function DisclosureDetailPage() {
  const { disclosureId } = useParams()
  const { catalog, disclosures } = useArchiveSnapshot()
  const disclosure = disclosures.find((item) => item.id === disclosureId)
  const severity = catalog.severities.find((level) => level.id === disclosure?.severityId)

  useEffect(() => {
    document.title = disclosure ? `${disclosure.id} — HiddenCry` : 'Record not found — HiddenCry'
  }, [disclosure])

  if (!disclosure) {
    return (
      <div className={layout.page}>
        <p className={layout.kicker}>Missing record</p>
        <h1 className={cxTitle}>This CVE is not in the archive.</h1>
        <p className={layout.lede}>
          <Link to="/cves">Return to CVEs</Link>
        </p>
      </div>
    )
  }

  const related = relatedDisclosures(disclosures, disclosure)

  return (
    <article className={styles.article}>
      <p className={styles.crumb}>
        <Link to="/cves">CVEs</Link>
        <span>/</span>
        {disclosure.id}
      </p>
      <div className={styles.layout}>
        <div>
          <p className={layout.kicker}>
            {severity?.label ?? disclosure.severityId}
            {severity ? ` · CVSS ${severity.cvssMin}–${severity.cvssMax}` : ''}
          </p>
          <h1>{disclosure.title}</h1>
          <p className={styles.summary}>{disclosure.summary}</p>
          <p className={styles.byline}>
            {disclosure.credit} · published {formatDate(disclosure.publishedOn)}
          </p>
          {disclosure.sections.map((section) => (
            <section key={section.id} id={section.id} className={styles.section}>
              <h2>{section.title}</h2>
              <RichText blocks={section.blocks} />
            </section>
          ))}
          <section className={styles.section} id="timeline">
            <h2>Timeline</h2>
            <ol className={styles.timeline}>
              {disclosure.timeline.map((event) => (
                <li key={`${event.date}-${event.title}`}>
                  <time dateTime={event.date}>{formatDate(event.date)}</time>
                  {event.href ? (
                    <a href={event.href} target="_blank" rel="noreferrer">
                      {event.title}
                    </a>
                  ) : (
                    <strong>{event.title}</strong>
                  )}
                  {event.detail ? <p>{event.detail}</p> : null}
                </li>
              ))}
            </ol>
          </section>
          <section className={styles.section} id="references">
            <h2>References</h2>
            <ul className={styles.references}>
              {disclosure.references.map((reference) => (
                <li key={reference.href}>
                  <a href={reference.href} target="_blank" rel="noreferrer">
                    {reference.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <Dossier disclosure={disclosure} catalog={catalog} />
      </div>
      {related.length > 0 ? (
        <section className={layout.section}>
          <div className={layout.sectionHead}>
            <h2>Related records</h2>
          </div>
          <RecordList items={related} catalog={catalog} />
        </section>
      ) : null}
    </article>
  )
}

const cxTitle = layout.title
