import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EssayPage } from '@presentation/pages/essay-page'
import { useArchiveSnapshot } from '@presentation/app/use-archive-snapshot'
import { formatDate } from '@presentation/lib/site'
import layout from '@presentation/styles/layout.module.scss'

export function BlogPostPage() {
  const { postId } = useParams()
  const { posts } = useArchiveSnapshot()
  const post = posts.find((item) => item.id === postId)

  useEffect(() => {
    document.title = post ? `${post.title} — HiddenCry` : 'Article not found — HiddenCry'
  }, [post])

  if (!post) {
    return (
      <div className={layout.page}>
        <p className={layout.kicker}>Missing article</p>
        <h1 className={layout.title}>This note is not in the blog.</h1>
        <p className={layout.lede}>
          <Link to="/blog">Return to the blog</Link>
        </p>
      </div>
    )
  }

  return (
    <EssayPage kicker={formatDate(post.publishedOn)} title={post.title} summary={post.summary} sections={post.sections}>
      <p className={layout.lede}>
        <Link to="/blog">All notes</Link>
      </p>
    </EssayPage>
  )
}
