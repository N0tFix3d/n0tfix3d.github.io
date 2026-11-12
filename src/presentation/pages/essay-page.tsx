import type { ReactNode } from 'react'
import type { ArticleSection } from '@domain/rich-text/rich-text'
import { RichText } from '@presentation/components/rich-text/rich-text'
import layout from '@presentation/styles/layout.module.scss'
import styles from './essay-page.module.scss'

interface EssayPageProps {
  kicker: string
  title: string
  summary: string
  sections: readonly ArticleSection[]
  children?: ReactNode
}

export function EssayPage({ kicker, title, summary, sections, children }: EssayPageProps) {
  return (
    <div className={layout.page}>
      <p className={layout.kicker}>{kicker}</p>
      <h1 className={layout.wide ? `${layout.title} ${layout.wide}` : layout.title}>{title}</h1>
      <p className={layout.lede}>{summary}</p>
      <div className={styles.sections}>
        {sections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2>{section.title}</h2>
            <RichText blocks={section.blocks} />
          </section>
        ))}
      </div>
      {children}
    </div>
  )
}
