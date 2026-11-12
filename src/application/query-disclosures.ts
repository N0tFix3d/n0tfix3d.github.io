import type { Catalog } from '@domain/catalog/catalog'
import type { Disclosure } from '@domain/disclosure/disclosure'
import type { DisclosureQuery } from '@application/disclosure-query'

export function queryDisclosures(
  disclosures: readonly Disclosure[],
  catalog: Catalog,
  query: DisclosureQuery,
): Disclosure[] {
  const severityRank = new Map(catalog.severities.map((level) => [level.id, level.rank]))
  const text = query.text?.trim().toLowerCase()

  return disclosures
    .filter((item) => {
      if (query.severityId && item.severityId !== query.severityId) return false
      if (query.categoryId && !item.categoryIds.includes(query.categoryId)) return false
      if (query.product && item.product.name !== query.product) return false
      if (!text) return true

      const haystack = [
        item.id,
        item.title,
        item.summary,
        item.product.name,
        item.product.vendor,
        ...item.cwe.flatMap((entry) => [entry.id, entry.name]),
        ...item.categoryIds,
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(text)
    })
    .slice()
    .sort((left, right) => {
      const rankDelta = (severityRank.get(right.severityId) ?? 0) - (severityRank.get(left.severityId) ?? 0)
      if (rankDelta !== 0) return rankDelta
      const scoreDelta = (right.cvss?.score ?? -1) - (left.cvss?.score ?? -1)
      if (scoreDelta !== 0) return scoreDelta
      return right.publishedOn.localeCompare(left.publishedOn)
    })
}

export function listProducts(disclosures: readonly Disclosure[]): string[] {
  return [...new Set(disclosures.map((item) => item.product.name))].sort((left, right) => left.localeCompare(right))
}

export function relatedDisclosures(
  disclosures: readonly Disclosure[],
  current: Disclosure,
  limit = 3,
): Disclosure[] {
  return disclosures
    .filter((item) => item.id !== current.id)
    .map((item) => {
      const sameProduct = item.product.name === current.product.name ? 2 : 0
      const sharedCategories = item.categoryIds.filter((id) => current.categoryIds.includes(id)).length
      return { item, score: sameProduct + sharedCategories }
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      const scoreDelta = right.score - left.score
      if (scoreDelta !== 0) return scoreDelta
      return (right.item.cvss?.score ?? 0) - (left.item.cvss?.score ?? 0)
    })
    .slice(0, limit)
    .map((entry) => entry.item)
}
