import type { Catalog } from '@domain/catalog/catalog'

export interface CatalogRepository {
  get(): Promise<Catalog>
}
