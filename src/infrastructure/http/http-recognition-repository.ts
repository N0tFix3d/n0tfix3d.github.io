import type { Recognition } from '@domain/recognition/recognition'
import type { RecognitionRepository } from '@domain/recognition/recognition-repository'
import { apiUrl, readJson } from '@infrastructure/http/read-json'
import { recognitionFileSchema, toRecognition } from '@infrastructure/json/schemas'

export class HttpRecognitionRepository implements RecognitionRepository {
  constructor(private readonly baseUrl: string) {}

  async list(): Promise<readonly Recognition[]> {
    const payload = await readJson(apiUrl(this.baseUrl, '/recognitions'), 'error')
    return recognitionFileSchema.parse(payload).items.map(toRecognition)
  }
}
