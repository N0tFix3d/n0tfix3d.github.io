import type { BlogPost } from '@domain/blog/post'
import type { PostRepository } from '@domain/blog/post-repository'
import { blogPostSchema, toBlogPost } from '@infrastructure/json/schemas'

export class JsonPostRepository implements PostRepository {
  private cache: Promise<readonly BlogPost[]> | null = null

  list(): Promise<readonly BlogPost[]> {
    this.cache ??= Promise.resolve(this.load())
    return this.cache
  }

  async findById(id: string): Promise<BlogPost | null> {
    const posts = await this.list()
    return posts.find((post) => post.id === id) ?? null
  }

  private load(): readonly BlogPost[] {
    const modules = import.meta.glob('../../../content/blog/*.json', { eager: true, import: 'default' })
    return Object.entries(modules).map(([source, value]) => {
      const parsed = blogPostSchema.safeParse(value)
      if (!parsed.success) {
        throw new Error(`Invalid blog JSON in ${source}: ${parsed.error.message}`)
      }
      return toBlogPost(parsed.data)
    })
  }
}
