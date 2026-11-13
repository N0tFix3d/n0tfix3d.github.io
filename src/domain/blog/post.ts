import type { ArticleSection } from '@domain/rich-text/rich-text'

export interface BlogPost {
  readonly id: string
  readonly title: string
  readonly summary: string
  readonly publishedOn: string
  readonly sections: readonly ArticleSection[]
}
