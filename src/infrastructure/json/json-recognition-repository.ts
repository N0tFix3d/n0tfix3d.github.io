import recognitionsFile from '../../../content/recognitions.json'
import type { Recognition } from '@domain/recognition/recognition'
import type { RecognitionRepository } from '@domain/recognition/recognition-repository'
import { recognitionFileSchema, toRecognition } from '@infrastructure/json/schemas'

export class JsonRecognitionRepository implements RecognitionRepository {
  private cache: Promise<readonly Recognition[]> | null = null

  list(): Promise<readonly Recognition[]> {
    this.cache ??= Promise.resolve(this.load())
    return this.cache
  }

  private load(): readonly Recognition[] {
    return recognitionFileSchema.parse(recognitionsFile).items.map(toRecognition)
  }
}
