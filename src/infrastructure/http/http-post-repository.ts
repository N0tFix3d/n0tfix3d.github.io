import type { BlogPost } from '@domain/blog/post'
import type { PostRepository } from '@domain/blog/post-repository'
import { apiUrl, readJson } from '@infrastructure/http/read-json'
import { blogPostListSchema, blogPostSchema, toBlogPost } from '@infrastructure/json/schemas'

export class HttpPostRepository implements PostRepository {
  constructor(private readonly baseUrl: string) {}

  async list(): Promise<readonly BlogPost[]> {
    const payload = await readJson(apiUrl(this.baseUrl, '/posts'), 'error')
    return blogPostListSchema.parse(payload).map(toBlogPost)
  }

  async findById(id: string): Promise<BlogPost | null> {
    const payload = await readJson(apiUrl(this.baseUrl, `/posts/${encodeURIComponent(id)}`), 'null')
    if (payload === null) return null
    return toBlogPost(blogPostSchema.parse(payload))
  }
}
