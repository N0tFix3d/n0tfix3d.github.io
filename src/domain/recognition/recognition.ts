import type { RichBlock } from '@domain/rich-text/rich-text'

export type RecognitionKind = 'hof' | 'vdp'

export interface RecognitionProof {
  readonly src: string
  readonly alt: string
}

export interface Recognition {
  readonly id: string
  readonly kind: RecognitionKind
  readonly organization: string
  readonly year: number
  readonly summary: string
  readonly description: readonly RichBlock[]
  readonly proof: RecognitionProof
}

export interface RecognitionKindDefinition {
  readonly id: RecognitionKind
  readonly label: string
  readonly summary: string
}

export const recognitionKinds: readonly RecognitionKindDefinition[] = [
  {
    id: 'hof',
    label: 'Hall of Fame',
    summary:
      'An honorary listing. The organization publishes the researcher’s name for a contribution to its security.',
  },
  {
    id: 'vdp',
    label: 'Vulnerability Disclosure Program',
    summary: 'A legal framework that sets how a vulnerability may be reported to the organization.',
  },
]
