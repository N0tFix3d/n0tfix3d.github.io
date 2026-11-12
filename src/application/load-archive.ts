import type { ArchiveRepositories } from '@domain/archive/archive-repositories'
import type { Catalog } from '@domain/catalog/catalog'
import type { Disclosure } from '@domain/disclosure/disclosure'
import type { Profile } from '@domain/profile/profile'

export interface ArchiveSnapshot {
  readonly profile: Profile
  readonly catalog: Catalog
  readonly disclosures: readonly Disclosure[]
}

export async function loadArchive(repositories: ArchiveRepositories): Promise<ArchiveSnapshot> {
  const [profile, catalog, disclosures] = await Promise.all([
    repositories.profile.get(),
    repositories.catalog.get(),
    repositories.disclosures.list(),
  ])

  const severityIds = new Set(catalog.severities.map((level) => level.id))
  const categoryIds = new Set(catalog.categories.map((category) => category.id))
  const seen = new Set<string>()

  for (const disclosure of disclosures) {
    if (seen.has(disclosure.id)) {
      throw new Error(`Duplicate disclosure id "${disclosure.id}"`)
    }
    seen.add(disclosure.id)

    if (!severityIds.has(disclosure.severityId)) {
      throw new Error(`Disclosure ${disclosure.id} references unknown severity "${disclosure.severityId}"`)
    }

    for (const categoryId of disclosure.categoryIds) {
      if (!categoryIds.has(categoryId)) {
        throw new Error(`Disclosure ${disclosure.id} references unknown category "${categoryId}"`)
      }
    }
  }

  return { profile, catalog, disclosures }
}
