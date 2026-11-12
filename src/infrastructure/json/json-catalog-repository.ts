import categoriesFile from '../../../content/categories.json'
import severitiesFile from '../../../content/severities.json'
import type { Catalog } from '@domain/catalog/catalog'
import type { CatalogRepository } from '@domain/catalog/catalog-repository'
import { categoryFileSchema, severityFileSchema, toCatalog } from '@infrastructure/json/schemas'

export class JsonCatalogRepository implements CatalogRepository {
  private cache: Promise<Catalog> | null = null

  get(): Promise<Catalog> {
    this.cache ??= Promise.resolve(this.load())
    return this.cache
  }

  private load(): Catalog {
    const severities = severityFileSchema.parse(severitiesFile)
    const categories = categoryFileSchema.parse(categoriesFile)
    const severityIds = new Set<string>()
    for (const level of severities.items) {
      if (severityIds.has(level.id)) throw new Error(`Duplicate severity id "${level.id}"`)
      if (level.cvssMin > level.cvssMax) throw new Error(`Severity "${level.id}" has an inverted CVSS range`)
      severityIds.add(level.id)
    }
    const categoryIds = new Set<string>()
    for (const category of categories.items) {
      if (categoryIds.has(category.id)) throw new Error(`Duplicate category id "${category.id}"`)
      categoryIds.add(category.id)
    }
    return toCatalog(severities.items, categories.items)
  }
}
