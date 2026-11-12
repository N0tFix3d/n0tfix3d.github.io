import type { ArticleSection } from '@domain/rich-text/rich-text'

export interface ProfileLink {
  readonly label: string
  readonly href: string
}

export interface Profile {
  readonly name: string
  readonly handle: string
  readonly role: string
  readonly statement: string
  readonly summary: string
  readonly focus: readonly string[]
  readonly links: readonly ProfileLink[]
  readonly contact: {
    readonly email: string
    readonly label: string
  }
  readonly sections: readonly ArticleSection[]
}
