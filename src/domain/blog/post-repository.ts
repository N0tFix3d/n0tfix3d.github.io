import type { BlogPost } from '@domain/blog/post'

export interface PostRepository {
  list(): Promise<readonly BlogPost[]>
  findById(id: string): Promise<BlogPost | null>
}
