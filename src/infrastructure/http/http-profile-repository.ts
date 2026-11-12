import type { Profile } from '@domain/profile/profile'
import type { ProfileRepository } from '@domain/profile/profile-repository'
import { apiUrl, readJson } from '@infrastructure/http/read-json'
import { profileDocumentSchema, toProfile } from '@infrastructure/json/schemas'

export class HttpProfileRepository implements ProfileRepository {
  constructor(private readonly baseUrl: string) {}

  async get(): Promise<Profile> {
    const payload = await readJson(apiUrl(this.baseUrl, '/profile'), 'error')
    return toProfile(profileDocumentSchema.parse(payload))
  }
}
