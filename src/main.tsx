import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { createRepositories } from '@composition/create-repositories'
import { RepositoryProvider } from '@presentation/app/repository-context'
import { router } from '@presentation/app/router'
import '@presentation/styles/global.scss'

const root = document.getElementById('root')
if (!root) throw new Error('Root element #root is missing')

const repositories = createRepositories()

createRoot(root).render(
  <StrictMode>
    <RepositoryProvider repositories={repositories}>
      <RouterProvider router={router} />
    </RepositoryProvider>
  </StrictMode>,
)
