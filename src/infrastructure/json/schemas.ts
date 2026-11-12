import { z } from 'zod'
import type { Catalog } from '@domain/catalog/catalog'
import type { Disclosure } from '@domain/disclosure/disclosure'
import type { Profile } from '@domain/profile/profile'

const inlineSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), value: z.string().min(1) }),
  z.object({ type: z.literal('strong'), value: z.string().min(1) }),
  z.object({ type: z.literal('code'), value: z.string().min(1) }),
  z.object({ type: z.literal('link'), label: z.string().min(1), href: z.string().url() }),
])

const blockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('paragraph'), content: z.array(inlineSchema).min(1) }),
  z.object({
    type: z.literal('heading'),
    level: z.union([z.literal(2), z.literal(3)]),
    text: z.string().min(1),
  }),
  z.object({
    type: z.literal('list'),
    ordered: z.boolean(),
    items: z.array(z.array(inlineSchema).min(1)).min(1),
  }),
  z.object({ type: z.literal('code'), language: z.string().min(1), code: z.string().min(1) }),
  z.object({ type: z.literal('quote'), content: z.array(inlineSchema).min(1) }),
  z.object({
    type: z.literal('image'),
    src: z.string().regex(/^(?!\/)(?!.*\.\.)[A-Za-z0-9_./-]+$/, 'Image path must stay inside the repository'),
    alt: z.string().min(1),
    caption: z.string().min(1).optional(),
  }),
  z.object({
    type: z.literal('callout'),
    tone: z.enum(['impact', 'note', 'risk']),
    title: z.string().min(1).optional(),
    content: z.array(inlineSchema).min(1),
  }),
])

const sectionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  blocks: z.array(blockSchema).min(1),
})

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

export const disclosureDocumentSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().regex(/^CVE-\d{4}-\d+$/),
  title: z.string().min(1),
  summary: z.string().min(1),
  product: z.object({
    name: z.string().min(1),
    vendor: z.string().min(1),
    affected: z.string().min(1),
    patched: z.string().min(1),
  }),
  severityId: z.string().regex(/^[a-z0-9-]+$/),
  categoryIds: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1),
  cwe: z
    .array(
      z.object({
        id: z.string().regex(/^CWE-\d+$/),
        name: z.string().min(1),
      }),
    )
    .min(1),
  cvss: z
    .object({
      version: z.literal('3.1'),
      score: z.number().min(0).max(10),
      vector: z.string().regex(/^CVSS:3\.1\/.+/).optional(),
    })
    .optional(),
  discoveredOn: isoDate,
  publishedOn: isoDate,
  status: z.enum(['patched', 'disclosed', 'reserved']),
  credit: z.string().min(1),
  readmePath: z.string().regex(/^(?!\/)(?!.*\.\.)[A-Za-z0-9_./-]+\.md$/),
  sections: z.array(sectionSchema).min(1),
  timeline: z.array(
    z.object({
      date: isoDate,
      title: z.string().min(1),
      detail: z.string().min(1).optional(),
      href: z.string().url().optional(),
    }),
  ),
  references: z.array(
    z.object({
      label: z.string().min(1),
      href: z.string().url(),
    }),
  ),
})

export const severityDocumentSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  label: z.string().min(1),
  rank: z.number().int().min(0).max(5),
  cvssMin: z.number().min(0).max(10),
  cvssMax: z.number().min(0).max(10),
  summary: z.string().min(1),
  sections: z.array(sectionSchema).min(1),
})

export const categoryDocumentSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  label: z.string().min(1),
  summary: z.string().min(1),
  sections: z.array(sectionSchema).min(1),
})

export const severityFileSchema = z.object({
  schemaVersion: z.literal(1),
  items: z.array(severityDocumentSchema).min(1),
})

export const categoryFileSchema = z.object({
  schemaVersion: z.literal(1),
  items: z.array(categoryDocumentSchema).min(1),
})

export const catalogDocumentSchema = z.object({
  schemaVersion: z.literal(1),
  severities: z.array(severityDocumentSchema).min(1),
  categories: z.array(categoryDocumentSchema).min(1),
})

export const profileDocumentSchema = z.object({
  schemaVersion: z.literal(1),
  name: z.string().min(1),
  handle: z.string().min(1),
  role: z.string().min(1),
  statement: z.string().min(1),
  summary: z.string().min(1),
  focus: z.array(z.string().min(1)).min(1),
  links: z.array(z.object({ label: z.string().min(1), href: z.string().url() })),
  contact: z.object({
    email: z.string().email(),
    label: z.string().min(1),
  }),
  sections: z.array(sectionSchema).min(1),
})

export const disclosureListSchema = z.array(disclosureDocumentSchema).min(1)

export type DisclosureDocument = z.infer<typeof disclosureDocumentSchema>

export function toDisclosure(document: DisclosureDocument): Disclosure {
  return document
}

export function toCatalog(severities: z.infer<typeof severityDocumentSchema>[], categories: z.infer<typeof categoryDocumentSchema>[]): Catalog {
  return { severities, categories }
}

export function toProfile(document: z.infer<typeof profileDocumentSchema>): Profile {
  return {
    name: document.name,
    handle: document.handle,
    role: document.role,
    statement: document.statement,
    summary: document.summary,
    focus: document.focus,
    links: document.links,
    contact: document.contact,
    sections: document.sections,
  }
}
