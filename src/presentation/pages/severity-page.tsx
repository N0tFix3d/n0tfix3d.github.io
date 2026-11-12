import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { queryDisclosures } from '@application/query-disclosures'
import { RecordList } from '@presentation/components/record-list/record-list'
import { EssayPage } from '@presentation/pages/essay-page'
import { useArchiveSnapshot } from '@presentation/app/use-archive-snapshot'
import layout from '@presentation/styles/layout.module.scss'

export function SeverityPage() {
  const { severityId } = useParams()
  const { catalog, disclosures } = useArchiveSnapshot()
  const severity = catalog.severities.find((item) => item.id === severityId)
  const records = severity ? queryDisclosures(disclosures, catalog, { severityId: severity.id }) : []

  useEffect(() => {
    document.title = severity ? `${severity.label} — HiddenCry` : 'Severity not found — HiddenCry'
  }, [severity])

  if (!severity) {
    return (
      <div className={layout.page}>
        <p className={layout.kicker}>Missing band</p>
        <h1 className={layout.title}>This severity is not in the catalog.</h1>
        <p className={layout.lede}>
          <Link to="/disclosures">Return to the archive</Link>
        </p>
      </div>
    )
  }

  return (
    <EssayPage
      kicker={`CVSS ${severity.cvssMin}–${severity.cvssMax}`}
      title={severity.label}
      summary={severity.summary}
      sections={severity.sections}
    >
      <section className={layout.section}>
        <div className={layout.sectionHead}>
          <h2>Records in this band</h2>
        </div>
        <RecordList items={records} catalog={catalog} />
      </section>
    </EssayPage>
  )
}
