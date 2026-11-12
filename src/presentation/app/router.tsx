import { createBrowserRouter } from 'react-router-dom'
import { PageShell } from '@presentation/app/page-shell'
import { CategoryPage } from '@presentation/pages/category-page'
import { DisclosureDetailPage } from '@presentation/pages/disclosure-detail-page'
import { DisclosuresPage } from '@presentation/pages/disclosures-page'
import { HomePage } from '@presentation/pages/home-page'
import { MethodPage } from '@presentation/pages/method-page'
import { NotFoundPage } from '@presentation/pages/not-found-page'
import { SeverityPage } from '@presentation/pages/severity-page'

function routerBasename(): string | undefined {
  const base = import.meta.env.BASE_URL
  if (base === '/' || base === './') return undefined
  return base.replace(/\/$/, '')
}

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <PageShell />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'disclosures', element: <DisclosuresPage /> },
        { path: 'disclosures/:disclosureId', element: <DisclosureDetailPage /> },
        { path: 'categories/:categoryId', element: <CategoryPage /> },
        { path: 'severities/:severityId', element: <SeverityPage /> },
        { path: 'method', element: <MethodPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  { basename: routerBasename() },
)
