import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { queryDisclosures } from '@application/query-disclosures'
import { RecordList } from '@presentation/components/record-list/record-list'
import { EssayPage } from '@presentation/pages/essay-page'
import { useArchiveSnapshot } from '@presentation/app/use-archive-snapshot'
import layout from '@presentation/styles/layout.module.scss'

export function CategoryPage() {
  const { categoryId } = useParams()
  const { catalog, disclosures } = useArchiveSnapshot()
  const category = catalog.categories.find((item) => item.id === categoryId)
  const records = category ? queryDisclosures(disclosures, catalog, { categoryId: category.id }) : []

  useEffect(() => {
    document.title = category ? `${category.label} — HiddenCry` : 'Class not found — HiddenCry'
  }, [category])

  if (!category) {
    return (
      <div className={layout.page}>
        <p className={layout.kicker}>Missing class</p>
        <h1 className={layout.title}>This weakness class is not in the catalog.</h1>
        <p className={layout.lede}>
          <Link to="/disclosures">Return to the archive</Link>
        </p>
      </div>
    )
  }

  return (
    <EssayPage kicker="Weakness class" title={category.label} summary={category.summary} sections={category.sections}>
      <section className={layout.section}>
        <div className={layout.sectionHead}>
          <h2>Records</h2>
        </div>
        <RecordList items={records} catalog={catalog} />
      </section>
    </EssayPage>
  )
}
