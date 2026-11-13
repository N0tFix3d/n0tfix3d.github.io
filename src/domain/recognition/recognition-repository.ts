import type { Recognition } from '@domain/recognition/recognition'

export interface RecognitionRepository {
  list(): Promise<readonly Recognition[]>
}
