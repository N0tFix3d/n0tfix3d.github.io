import type { ArticleSection } from '@domain/rich-text/rich-text'

export interface SeverityLevel {
  readonly id: string
  readonly label: string
  readonly rank: number
  readonly cvssMin: number
  readonly cvssMax: number
  readonly summary: string
  readonly sections: readonly ArticleSection[]
}

export interface Category {
  readonly id: string
  readonly label: string
  readonly summary: string
  readonly sections: readonly ArticleSection[]
}

export interface Catalog {
  readonly severities: readonly SeverityLevel[]
  readonly categories: readonly Category[]
}
