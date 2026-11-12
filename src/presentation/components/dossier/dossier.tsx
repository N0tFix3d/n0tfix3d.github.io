import type { Catalog } from '@domain/catalog/catalog'
import type { Disclosure } from '@domain/disclosure/disclosure'
import { Link } from 'react-router-dom'
import { cx } from '@presentation/lib/cx'
import { cveUrl, cweUrl, formatDate, formatScore, readmeUrl, statusLabel } from '@presentation/lib/site'
import styles from './dossier.module.scss'

interface DossierProps {
  disclosure: Disclosure
  catalog: Catalog
}

export function Dossier({ disclosure, catalog }: DossierProps) {
  const severity = catalog.severities.find((level) => level.id === disclosure.severityId)

  return (
    <aside className={styles.dossier}>
      <Link
        className={cx(styles.severity, styles[disclosure.severityId] ?? styles.none)}
        to={`/severities/${disclosure.severityId}`}
      >
        {severity?.label ?? disclosure.severityId}
        {disclosure.cvss ? <span> {formatScore(disclosure.cvss.score)}</span> : null}
      </Link>
      <dl>
        <div>
          <dt>Record</dt>
          <dd>
            <a href={cveUrl(disclosure.id)} target="_blank" rel="noreferrer">
              {disclosure.id}
            </a>
          </dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{statusLabel(disclosure.status)}</dd>
        </div>
        <div>
          <dt>Product</dt>
          <dd>{disclosure.product.name}</dd>
        </div>
        <div>
          <dt>Vendor</dt>
          <dd>{disclosure.product.vendor}</dd>
        </div>
        <div>
          <dt>Affected</dt>
          <dd>{disclosure.product.affected}</dd>
        </div>
        <div>
          <dt>Fixed in</dt>
          <dd>{disclosure.product.patched}</dd>
        </div>
        <div>
          <dt>Discovered</dt>
          <dd>{formatDate(disclosure.discoveredOn)}</dd>
        </div>
        <div>
          <dt>Published</dt>
          <dd>{formatDate(disclosure.publishedOn)}</dd>
        </div>
        {disclosure.cvss?.vector ? (
          <div>
            <dt>Vector</dt>
            <dd className={styles.vector}>{disclosure.cvss.vector}</dd>
          </div>
        ) : null}
      </dl>
      <div className={styles.block}>
        <p className={styles.label}>Weakness</p>
        <ul>
          {disclosure.cwe.map((entry) => (
            <li key={entry.id}>
              <a href={cweUrl(entry.id)} target="_blank" rel="noreferrer">
                {entry.id}
              </a>
              <span>{entry.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.block}>
        <p className={styles.label}>Categories</p>
        <ul className={styles.links}>
          {disclosure.categoryIds.map((id) => {
            const category = catalog.categories.find((item) => item.id === id)
            return (
              <li key={id}>
                <Link to={`/categories/${id}`}>{category?.label ?? id}</Link>
              </li>
            )
          })}
        </ul>
      </div>
      <div className={styles.block}>
        <p className={styles.label}>In this record</p>
        <ul className={styles.links}>
          {disclosure.sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.title}</a>
            </li>
          ))}
        </ul>
      </div>
      <a className={styles.notes} href={readmeUrl(disclosure.readmePath)} target="_blank" rel="noreferrer">
        Original notes
      </a>
    </aside>
  )
}
