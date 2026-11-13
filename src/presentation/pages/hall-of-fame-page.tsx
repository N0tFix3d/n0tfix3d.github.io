import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { recognitionKinds } from '@domain/recognition/recognition'
import { RichText } from '@presentation/components/rich-text/rich-text'
import { useArchiveSnapshot } from '@presentation/app/use-archive-snapshot'
import { evidenceUrl } from '@presentation/lib/site'
import layout from '@presentation/styles/layout.module.scss'
import styles from './hall-of-fame-page.module.scss'

export function HallOfFamePage() {
  const { recognitions } = useArchiveSnapshot()

  useEffect(() => {
    document.title = 'Hall of Fame — HiddenCry'
  }, [])

  return (
    <div className={layout.page}>
      <p className={layout.kicker}>Recognitions</p>
      <h1 className={`${layout.title} ${layout.wide}`}>Hall of Fame</h1>
      <p className={layout.lede}>
        Letters received for coordinated reports. A hall of fame entry publishes the researcher’s name. A vulnerability
        disclosure program is the legal frame that accepted the report.
      </p>

      <div className={styles.kinds}>
        {recognitionKinds.map((kind) => (
          <article key={kind.id} className={kind.id === 'hof' ? styles.hof : styles.vdp}>
            <p>{kind.label}</p>
            <span>{kind.summary}</span>
          </article>
        ))}
      </div>

      {recognitions.length === 0 ? (
        <p className={styles.empty}>
          No letter is listed yet. An entry needs the proof image, the organization, the year, a short description, and
          a type: HOF or VDP.
        </p>
      ) : (
        <ol className={styles.list}>
          {recognitions.map((item) => {
            const kind = recognitionKinds.find((entry) => entry.id === item.kind)
            return (
              <li key={item.id} className={item.kind === 'hof' ? styles.hof : styles.vdp}>
                <figure>
                  <img src={evidenceUrl(item.proof.src)} alt={item.proof.alt} />
                </figure>
                <div>
                  <p className={styles.badge}>{kind?.label ?? item.kind}</p>
                  <h2>{item.organization}</h2>
                  <p className={styles.year}>{item.year}</p>
                  <p className={styles.summary}>{item.summary}</p>
                  <RichText blocks={item.description} />
                </div>
              </li>
            )
          })}
        </ol>
      )}

      <p className={styles.more}>
        <Link to="/cves">Read the CVEs</Link>
      </p>
    </div>
  )
}
