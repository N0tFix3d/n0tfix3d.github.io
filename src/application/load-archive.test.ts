import { describe, expect, it } from 'vitest'
import type { ArchiveRepositories } from '@domain/archive/archive-repositories'
import type { Catalog } from '@domain/catalog/catalog'
import type { Disclosure } from '@domain/disclosure/disclosure'
import type { Profile } from '@domain/profile/profile'
import { loadArchive } from '@application/load-archive'

const profile: Profile = {
  name: 'HiddenCry',
  handle: 'HiddenCry',
  role: 'Security researcher',
  statement: 'Findings, written down after the fix.',
  summary: 'Archive',
  focus: ['Web'],
  links: [],
  contact: { email: 'research@example.com', label: 'Research contact' },
  sections: [],
}

const catalog: Catalog = {
  severities: [
    { id: 'high', label: 'High', rank: 4, cvssMin: 7, cvssMax: 8.9, summary: 'High', sections: [] },
  ],
  categories: [{ id: 'session-management', label: 'Session management', summary: 'Sessions', sections: [] }],
}

const disclosure: Disclosure = {
  id: 'CVE-2026-0001',
  title: 'Token survives disablement',
  summary: 'A disabled account can still authenticate.',
  product: { name: 'Example', vendor: 'Example', affected: '< 1', patched: '1' },
  severityId: 'high',
  categoryIds: ['session-management'],
  cwe: [{ id: 'CWE-613', name: 'Insufficient Session Expiration' }],
  discoveredOn: '2026-04-25',
  publishedOn: '2026-06-08',
  status: 'patched',
  credit: 'HiddenCry',
  readmePath: 'Example/CVE-2026-0001/CVE-2026-0001.md',
  sections: [],
  timeline: [],
  references: [],
}

function repositories(disclosures: readonly Disclosure[]): ArchiveRepositories {
  return {
    profile: { get: async () => profile },
    catalog: { get: async () => catalog },
    disclosures: {
      list: async () => disclosures,
      findById: async (id) => disclosures.find((item) => item.id === id) ?? null,
    },
  }
}

describe('loadArchive', () => {
  it('returns the snapshot when references resolve', async () => {
    const snapshot = await loadArchive(repositories([disclosure]))
    expect(snapshot.disclosures).toHaveLength(1)
    expect(snapshot.profile.handle).toBe('HiddenCry')
  })

  it('rejects a disclosure that points at an unknown category', async () => {
    const broken: Disclosure = { ...disclosure, categoryIds: ['missing'] }
    await expect(loadArchive(repositories([broken]))).rejects.toThrow(/unknown category/)
  })
})
