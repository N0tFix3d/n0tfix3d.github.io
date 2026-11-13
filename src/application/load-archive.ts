import type { ArchiveRepositories } from '@domain/archive/archive-repositories'
import type { BlogPost } from '@domain/blog/post'
import type { Catalog } from '@domain/catalog/catalog'
import type { Disclosure } from '@domain/disclosure/disclosure'
import type { Profile } from '@domain/profile/profile'
import type { Recognition } from '@domain/recognition/recognition'

export interface ArchiveSnapshot {
  readonly profile: Profile
  readonly catalog: Catalog
  readonly disclosures: readonly Disclosure[]
  readonly recognitions: readonly Recognition[]
  readonly posts: readonly BlogPost[]
}

export async function loadArchive(repositories: ArchiveRepositories): Promise<ArchiveSnapshot> {
  const [profile, catalog, disclosures, recognitions, posts] = await Promise.all([
    repositories.profile.get(),
    repositories.catalog.get(),
    repositories.disclosures.list(),
    repositories.recognitions.list(),
    repositories.posts.list(),
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

  assertUniqueIds(
    recognitions.map((item) => item.id),
    (id) => `Duplicate recognition id "${id}"`,
  )
  assertUniqueIds(
    posts.map((item) => item.id),
    (id) => `Duplicate blog post id "${id}"`,
  )

  const orderedPosts = [...posts].sort(
    (left, right) => right.publishedOn.localeCompare(left.publishedOn) || left.title.localeCompare(right.title),
  )
  const orderedRecognitions = [...recognitions].sort(
    (left, right) => right.year - left.year || left.organization.localeCompare(right.organization),
  )

  return { profile, catalog, disclosures, recognitions: orderedRecognitions, posts: orderedPosts }
}

function assertUniqueIds(ids: readonly string[], message: (id: string) => string): void {
  const seen = new Set<string>()
  for (const id of ids) {
    if (seen.has(id)) throw new Error(message(id))
    seen.add(id)
  }
}
