import type { Disclosure } from '@domain/disclosure/disclosure'

export interface DisclosureRepository {
  list(): Promise<readonly Disclosure[]>
  findById(id: string): Promise<Disclosure | null>
}
