import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useArchiveSnapshot } from '@presentation/app/use-archive-snapshot'
import { formatDate } from '@presentation/lib/site'
import layout from '@presentation/styles/layout.module.scss'
import styles from './blog-page.module.scss'

export function BlogPage() {
  const { posts } = useArchiveSnapshot()

  useEffect(() => {
    document.title = 'Blog — HiddenCry'
  }, [])

  return (
    <div className={layout.page}>
      <p className={layout.kicker}>Notes</p>
      <h1 className={layout.title}>Blog</h1>
      <p className={layout.lede}>Short notes on how the disclosures are written. Each article is a JSON rich-text file.</p>
      {posts.length === 0 ? (
        <p className={styles.empty}>No article is published yet.</p>
      ) : (
        <ol className={styles.list}>
          {posts.map((post) => (
            <li key={post.id}>
              <Link to={`/blog/${post.id}`}>
                <time dateTime={post.publishedOn}>{formatDate(post.publishedOn)}</time>
                <strong>{post.title}</strong>
                <span>{post.summary}</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
