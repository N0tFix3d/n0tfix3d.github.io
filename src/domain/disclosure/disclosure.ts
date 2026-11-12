import type { ArticleSection } from '@domain/rich-text/rich-text'

export interface CweRef {
  readonly id: string
  readonly name: string
}

export interface CvssScore {
  readonly version: '3.1'
  readonly score: number
  readonly vector?: string
}

export interface ProductRef {
  readonly name: string
  readonly vendor: string
  readonly affected: string
  readonly patched: string
}

export interface TimelineEvent {
  readonly date: string
  readonly title: string
  readonly detail?: string
  readonly href?: string
}

export interface ExternalReference {
  readonly label: string
  readonly href: string
}

export type DisclosureStatus = 'patched' | 'disclosed' | 'reserved'

export interface Disclosure {
  readonly id: string
  readonly title: string
  readonly summary: string
  readonly product: ProductRef
  readonly severityId: string
  readonly categoryIds: readonly string[]
  readonly cwe: readonly CweRef[]
  readonly cvss?: CvssScore
  readonly discoveredOn: string
  readonly publishedOn: string
  readonly status: DisclosureStatus
  readonly credit: string
  readonly readmePath: string
  readonly sections: readonly ArticleSection[]
  readonly timeline: readonly TimelineEvent[]
  readonly references: readonly ExternalReference[]
}
