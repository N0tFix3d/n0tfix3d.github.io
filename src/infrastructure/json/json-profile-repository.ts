import profileFile from '../../../content/profile.json'
import type { Profile } from '@domain/profile/profile'
import type { ProfileRepository } from '@domain/profile/profile-repository'
import { profileDocumentSchema, toProfile } from '@infrastructure/json/schemas'

export class JsonProfileRepository implements ProfileRepository {
  private cache: Promise<Profile> | null = null

  get(): Promise<Profile> {
    this.cache ??= Promise.resolve(toProfile(profileDocumentSchema.parse(profileFile)))
    return this.cache
  }
}
