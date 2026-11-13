import { Navigate, createBrowserRouter, useParams, useSearchParams } from 'react-router-dom'
import { PageShell } from '@presentation/app/page-shell'
import { BlogPage } from '@presentation/pages/blog-page'
import { BlogPostPage } from '@presentation/pages/blog-post-page'
import { CategoryPage } from '@presentation/pages/category-page'
import { DisclosureDetailPage } from '@presentation/pages/disclosure-detail-page'
import { DisclosuresPage } from '@presentation/pages/disclosures-page'
import { HallOfFamePage } from '@presentation/pages/hall-of-fame-page'
import { HomePage } from '@presentation/pages/home-page'
import { NotFoundPage } from '@presentation/pages/not-found-page'
import { SeverityPage } from '@presentation/pages/severity-page'

function routerBasename(): string | undefined {
  const base = import.meta.env.BASE_URL
  if (base === '/' || base === './') return undefined
  return base.replace(/\/$/, '')
}

function LegacyDisclosureListRedirect() {
  const [params] = useSearchParams()
  const search = params.toString()
  return <Navigate to={search ? `/cves?${search}` : '/cves'} replace />
}

function LegacyDisclosureRedirect() {
  const { disclosureId } = useParams()
  return <Navigate to={disclosureId ? `/cves/${disclosureId}` : '/cves'} replace />
}

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <PageShell />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'cves', element: <DisclosuresPage /> },
        { path: 'cves/:disclosureId', element: <DisclosureDetailPage /> },
        { path: 'disclosures', element: <LegacyDisclosureListRedirect /> },
        { path: 'disclosures/:disclosureId', element: <LegacyDisclosureRedirect /> },
        { path: 'categories/:categoryId', element: <CategoryPage /> },
        { path: 'severities/:severityId', element: <SeverityPage /> },
        { path: 'hall-of-fame', element: <HallOfFamePage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'blog/:postId', element: <BlogPostPage /> },
        { path: 'method', element: <Navigate to="/blog/how-a-disclosure-moves" replace /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  { basename: routerBasename() },
)
