import type { Profile } from '@domain/profile/profile'

export interface ProfileRepository {
  get(): Promise<Profile>
}
