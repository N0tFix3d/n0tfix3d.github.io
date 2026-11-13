import type { PostRepository } from '@domain/blog/post-repository'
import type { CatalogRepository } from '@domain/catalog/catalog-repository'
import type { DisclosureRepository } from '@domain/disclosure/disclosure-repository'
import type { ProfileRepository } from '@domain/profile/profile-repository'
import type { RecognitionRepository } from '@domain/recognition/recognition-repository'

export interface ArchiveRepositories {
  readonly disclosures: DisclosureRepository
  readonly catalog: CatalogRepository
  readonly profile: ProfileRepository
  readonly recognitions: RecognitionRepository
  readonly posts: PostRepository
}
