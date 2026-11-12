import type { ArchiveRepositories } from '@domain/archive/archive-repositories'
import { HttpCatalogRepository } from '@infrastructure/http/http-catalog-repository'
import { HttpDisclosureRepository } from '@infrastructure/http/http-disclosure-repository'
import { HttpProfileRepository } from '@infrastructure/http/http-profile-repository'
import { JsonCatalogRepository } from '@infrastructure/json/json-catalog-repository'
import { JsonDisclosureRepository } from '@infrastructure/json/json-disclosure-repository'
import { JsonProfileRepository } from '@infrastructure/json/json-profile-repository'

export function createRepositories(): ArchiveRepositories {
  if (import.meta.env.VITE_DATA_SOURCE === 'http') {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    if (!baseUrl) {
      throw new Error('VITE_API_BASE_URL is required when VITE_DATA_SOURCE is "http"')
    }
    return {
      disclosures: new HttpDisclosureRepository(baseUrl),
      catalog: new HttpCatalogRepository(baseUrl),
      profile: new HttpProfileRepository(baseUrl),
    }
  }

  return {
    disclosures: new JsonDisclosureRepository(),
    catalog: new JsonCatalogRepository(),
    profile: new JsonProfileRepository(),
  }
}
