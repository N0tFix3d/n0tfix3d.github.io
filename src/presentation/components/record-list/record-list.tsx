import { Link } from 'react-router-dom'
import type { Catalog } from '@domain/catalog/catalog'
import type { Disclosure } from '@domain/disclosure/disclosure'
import { cx } from '@presentation/lib/cx'
import { formatScore } from '@presentation/lib/site'
import styles from './record-list.module.scss'

interface RecordListProps {
  items: readonly Disclosure[]
  catalog: Catalog
}

export function RecordList({ items, catalog }: RecordListProps) {
  if (items.length === 0) {
    return <p className={styles.empty}>No record matches this cut of the archive.</p>
  }

  return (
    <ol className={styles.list}>
      {items.map((item) => {
        const severity = catalog.severities.find((level) => level.id === item.severityId)
        const categories = item.categoryIds
          .map((id) => catalog.categories.find((category) => category.id === id)?.label)
          .filter((label): label is string => Boolean(label))

        return (
          <li key={item.id}>
            <Link className={styles.row} to={`/disclosures/${item.id}`}>
              <div>
                <p className={cx(styles.id, styles[item.severityId] ?? styles.none)}>{item.id}</p>
                <p className={styles.product}>{item.product.name}</p>
              </div>
              <div>
                <h2>{item.title}</h2>
                <p className={styles.summary}>{item.summary}</p>
                <p className={styles.meta}>
                  <span>{severity?.label ?? item.severityId}</span>
                  <span>Affected {item.product.affected}</span>
                  <span>Fixed in {item.product.patched}</span>
                  {categories.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </p>
              </div>
              <p className={cx(styles.score, styles[item.severityId] ?? styles.none)}>
                {item.cvss ? <strong>{formatScore(item.cvss.score)}</strong> : <strong>—</strong>}
                <span>{severity?.label ?? 'Unscored'}</span>
              </p>
            </Link>
          </li>
        )
      })}
    </ol>
  )
}
