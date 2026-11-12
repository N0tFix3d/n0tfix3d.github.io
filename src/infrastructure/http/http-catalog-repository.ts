import type { Catalog } from '@domain/catalog/catalog'
import type { CatalogRepository } from '@domain/catalog/catalog-repository'
import { apiUrl, readJson } from '@infrastructure/http/read-json'
import { catalogDocumentSchema, toCatalog } from '@infrastructure/json/schemas'

export class HttpCatalogRepository implements CatalogRepository {
  constructor(private readonly baseUrl: string) {}

  async get(): Promise<Catalog> {
    const payload = await readJson(apiUrl(this.baseUrl, '/catalog'), 'error')
    const document = catalogDocumentSchema.parse(payload)
    return toCatalog(document.severities, document.categories)
  }
}
