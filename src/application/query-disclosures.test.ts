import { describe, expect, it } from 'vitest'
import type { Catalog } from '@domain/catalog/catalog'
import type { Disclosure } from '@domain/disclosure/disclosure'
import { listProducts, queryDisclosures, relatedDisclosures } from '@application/query-disclosures'

const catalog: Catalog = {
  severities: [
    { id: 'critical', label: 'Critical', rank: 5, cvssMin: 9, cvssMax: 10, summary: '', sections: [] },
    { id: 'high', label: 'High', rank: 4, cvssMin: 7, cvssMax: 8.9, summary: '', sections: [] },
    { id: 'low', label: 'Low', rank: 2, cvssMin: 0.1, cvssMax: 3.9, summary: '', sections: [] },
  ],
  categories: [],
}

function disclosure(overrides: Partial<Disclosure> & Pick<Disclosure, 'id' | 'severityId'>): Disclosure {
  return {
    title: overrides.title ?? overrides.id,
    summary: overrides.summary ?? 'summary',
    product: overrides.product ?? { name: 'Product', vendor: 'Vendor', affected: '< 1', patched: '1' },
    categoryIds: overrides.categoryIds ?? ['code-injection'],
    cwe: overrides.cwe ?? [{ id: 'CWE-94', name: 'Code Injection' }],
    discoveredOn: overrides.discoveredOn ?? '2026-01-01',
    publishedOn: overrides.publishedOn ?? '2026-02-01',
    status: overrides.status ?? 'patched',
    credit: overrides.credit ?? 'HiddenCry',
    readmePath: overrides.readmePath ?? 'README.md',
    sections: overrides.sections ?? [],
    timeline: overrides.timeline ?? [],
    references: overrides.references ?? [],
    ...overrides,
  }
}

const records: Disclosure[] = [
  disclosure({
    id: 'CVE-2026-0001',
    severityId: 'low',
    title: 'Weak hash',
    product: { name: 'phpMyFAQ', vendor: 'phpMyFAQ', affected: '< 4.1.4', patched: '4.1.4' },
    categoryIds: ['cryptography'],
    publishedOn: '2026-06-08',
  }),
  disclosure({
    id: 'CVE-2026-0002',
    severityId: 'critical',
    title: 'Unsafe eval',
    cvss: { version: '3.1', score: 9.8 },
    product: { name: 'YesWiki', vendor: 'YesWiki', affected: '<= 4.6.5', patched: '4.6.6' },
    categoryIds: ['code-injection', 'denial-of-service'],
    publishedOn: '2026-06-08',
  }),
  disclosure({
    id: 'CVE-2026-0003',
    severityId: 'high',
    title: 'Ghost session',
    cvss: { version: '3.1', score: 8.8, vector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H' },
    product: { name: 'Bludit CMS', vendor: 'Bludit', affected: '< 3.22.0', patched: '3.22.0' },
    categoryIds: ['broken-access-control', 'session-management'],
    publishedOn: '2026-06-08',
  }),
]

describe('queryDisclosures', () => {
  it('orders by severity rank, then score', () => {
    const result = queryDisclosures(records, catalog, {})
    expect(result.map((item) => item.id)).toEqual(['CVE-2026-0002', 'CVE-2026-0003', 'CVE-2026-0001'])
  })

  it('filters by severity, category, product and text together', () => {
    const result = queryDisclosures(records, catalog, {
      severityId: 'high',
      categoryId: 'session-management',
      product: 'Bludit CMS',
      text: 'ghost',
    })
    expect(result.map((item) => item.id)).toEqual(['CVE-2026-0003'])
  })

  it('returns an empty list when nothing matches', () => {
    expect(queryDisclosures(records, catalog, { text: 'not-a-finding' })).toEqual([])
  })
})

describe('listProducts', () => {
  it('returns unique product names in alphabetical order', () => {
    expect(listProducts(records)).toEqual(['Bludit CMS', 'phpMyFAQ', 'YesWiki'])
  })
})

describe('relatedDisclosures', () => {
  it('prefers the same product, then a shared category', () => {
    const current = records[2]
    if (!current) throw new Error('missing fixture')
    const sibling = disclosure({
      id: 'CVE-2026-0004',
      severityId: 'high',
      product: current.product,
      categoryIds: ['session-management'],
      cvss: { version: '3.1', score: 7.1 },
    })
    const related = relatedDisclosures([...records, sibling], current)
    expect(related[0]?.id).toBe('CVE-2026-0004')
    expect(related.some((item) => item.id === current.id)).toBe(false)
  })
})
