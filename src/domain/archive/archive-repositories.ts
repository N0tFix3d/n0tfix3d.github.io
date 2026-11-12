import type { CatalogRepository } from '@domain/catalog/catalog-repository'
import type { DisclosureRepository } from '@domain/disclosure/disclosure-repository'
import type { ProfileRepository } from '@domain/profile/profile-repository'

export interface ArchiveRepositories {
  readonly disclosures: DisclosureRepository
  readonly catalog: CatalogRepository
  readonly profile: ProfileRepository
}
