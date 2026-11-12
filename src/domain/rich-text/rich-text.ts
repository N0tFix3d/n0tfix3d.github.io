export type InlineNode =
  | { readonly type: 'text'; readonly value: string }
  | { readonly type: 'strong'; readonly value: string }
  | { readonly type: 'code'; readonly value: string }
  | { readonly type: 'link'; readonly label: string; readonly href: string }

export type CalloutTone = 'impact' | 'note' | 'risk'

export type RichBlock =
  | { readonly type: 'paragraph'; readonly content: readonly InlineNode[] }
  | { readonly type: 'heading'; readonly level: 2 | 3; readonly text: string }
  | { readonly type: 'list'; readonly ordered: boolean; readonly items: readonly (readonly InlineNode[])[] }
  | { readonly type: 'code'; readonly language: string; readonly code: string }
  | { readonly type: 'quote'; readonly content: readonly InlineNode[] }
  | { readonly type: 'image'; readonly src: string; readonly alt: string; readonly caption?: string }
  | {
      readonly type: 'callout'
      readonly tone: CalloutTone
      readonly title?: string
      readonly content: readonly InlineNode[]
    }

export interface ArticleSection {
  readonly id: string
  readonly title: string
  readonly blocks: readonly RichBlock[]
}
