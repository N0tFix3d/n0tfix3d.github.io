import type { Disclosure } from '@domain/disclosure/disclosure'
import type { DisclosureRepository } from '@domain/disclosure/disclosure-repository'
import { disclosureDocumentSchema, toDisclosure } from '@infrastructure/json/schemas'

export class JsonDisclosureRepository implements DisclosureRepository {
  private cache: Promise<readonly Disclosure[]> | null = null

  list(): Promise<readonly Disclosure[]> {
    this.cache ??= this.load()
    return this.cache
  }

  async findById(id: string): Promise<Disclosure | null> {
    const disclosures = await this.list()
    return disclosures.find((item) => item.id === id) ?? null
  }

  private async load(): Promise<readonly Disclosure[]> {
    const modules = {
      ...import.meta.glob('../../../YesWiki/**/CVE-*.json', { eager: true, import: 'default' }),
      ...import.meta.glob('../../../BluditCMS/**/CVE-*.json', { eager: true, import: 'default' }),
      ...import.meta.glob('../../../phpMyFAQ/**/CVE-*.json', { eager: true, import: 'default' }),
    }
    const documents = Object.values(modules).map((value, index) => {
      const parsed = disclosureDocumentSchema.safeParse(value)
      if (!parsed.success) {
        const source = Object.keys(modules)[index] ?? 'unknown disclosure file'
        throw new Error(`Invalid disclosure JSON in ${source}: ${parsed.error.message}`)
      }
      return toDisclosure(parsed.data)
    })

    if (documents.length === 0) {
      throw new Error('No CVE JSON documents were found')
    }

    return documents
  }
}
