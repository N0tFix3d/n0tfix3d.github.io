import type { Disclosure } from '@domain/disclosure/disclosure'
import type { DisclosureRepository } from '@domain/disclosure/disclosure-repository'
import { apiUrl, readJson } from '@infrastructure/http/read-json'
import { disclosureDocumentSchema, disclosureListSchema, toDisclosure } from '@infrastructure/json/schemas'

export class HttpDisclosureRepository implements DisclosureRepository {
  constructor(private readonly baseUrl: string) {}

  async list(): Promise<readonly Disclosure[]> {
    const payload = await readJson(apiUrl(this.baseUrl, '/disclosures'), 'error')
    return disclosureListSchema.parse(payload).map(toDisclosure)
  }

  async findById(id: string): Promise<Disclosure | null> {
    const payload = await readJson(apiUrl(this.baseUrl, `/disclosures/${encodeURIComponent(id)}`), 'null')
    if (payload === null) return null
    return toDisclosure(disclosureDocumentSchema.parse(payload))
  }
}
