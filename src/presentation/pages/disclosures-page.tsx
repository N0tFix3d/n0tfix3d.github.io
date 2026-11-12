import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { listProducts, queryDisclosures } from '@application/query-disclosures'
import type { DisclosureQuery } from '@application/disclosure-query'
import { RecordList } from '@presentation/components/record-list/record-list'
import { useArchiveSnapshot } from '@presentation/app/use-archive-snapshot'
import { cx } from '@presentation/lib/cx'
import layout from '@presentation/styles/layout.module.scss'
import styles from './disclosures-page.module.scss'

export function DisclosuresPage() {
  const { catalog, disclosures } = useArchiveSnapshot()
  const [params, setParams] = useSearchParams()
  const query = readQuery(params)
  const results = queryDisclosures(disclosures, catalog, query)
  const products = listProducts(disclosures)

  useEffect(() => {
    document.title = 'Archive — HiddenCry'
  }, [])

  const update = (next: DisclosureQuery) => {
    const upcoming = new URLSearchParams()
    if (next.text) upcoming.set('q', next.text)
    if (next.severityId) upcoming.set('severity', next.severityId)
    if (next.categoryId) upcoming.set('category', next.categoryId)
    if (next.product) upcoming.set('product', next.product)
    setParams(upcoming, { replace: true })
  }

  return (
    <div className={layout.page}>
      <p className={layout.kicker}>Coordinated disclosures</p>
      <h1 className={layout.title}>The archive</h1>
      <p className={layout.lede}>
        {disclosures.length} published records. Filter by severity, weakness class, or product. Scores are the ones assigned with the CVE.
      </p>
      <p className={styles.bands}>
        {catalog.severities
          .slice()
          .sort((left, right) => right.rank - left.rank)
          .map((level) => (
            <Link key={level.id} to={`/severities/${level.id}`}>
              {level.label}
            </Link>
          ))}
      </p>

      <form className={styles.filters} role="search" onSubmit={(event) => event.preventDefault()}>
        <label>
          Search
          <input
            type="search"
            value={query.text ?? ''}
            placeholder="CVE, product, CWE, or a phrase"
            onChange={(event) => update({ ...query, text: event.target.value || undefined })}
          />
        </label>

        <fieldset>
          <legend>Severity</legend>
          <div>
            <FilterChip pressed={!query.severityId} onClick={() => update({ ...query, severityId: undefined })}>
              All
            </FilterChip>
            {catalog.severities
              .slice()
              .sort((left, right) => right.rank - left.rank)
              .map((level) => (
                <FilterChip
                  key={level.id}
                  pressed={query.severityId === level.id}
                  onClick={() => update({ ...query, severityId: query.severityId === level.id ? undefined : level.id })}
                >
                  {level.label}
                </FilterChip>
              ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Class</legend>
          <div>
            {catalog.categories.map((category) => (
              <FilterChip
                key={category.id}
                pressed={query.categoryId === category.id}
                onClick={() =>
                  update({ ...query, categoryId: query.categoryId === category.id ? undefined : category.id })
                }
              >
                {category.label}
              </FilterChip>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Product</legend>
          <div>
            {products.map((product) => (
              <FilterChip
                key={product}
                pressed={query.product === product}
                onClick={() => update({ ...query, product: query.product === product ? undefined : product })}
              >
                {product}
              </FilterChip>
            ))}
          </div>
        </fieldset>
      </form>

      <p className={styles.count}>
        {results.length} {results.length === 1 ? 'record' : 'records'}
      </p>
      <RecordList items={results} catalog={catalog} />
    </div>
  )
}

function FilterChip({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button type="button" aria-pressed={pressed} className={cx(styles.chip, pressed && styles.pressed)} onClick={onClick}>
      {children}
    </button>
  )
}

function readQuery(params: URLSearchParams): DisclosureQuery {
  const text = params.get('q')?.trim()
  const severityId = params.get('severity')?.trim()
  const categoryId = params.get('category')?.trim()
  const product = params.get('product')?.trim()
  return {
    ...(text ? { text } : {}),
    ...(severityId ? { severityId } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(product ? { product } : {}),
  }
}
