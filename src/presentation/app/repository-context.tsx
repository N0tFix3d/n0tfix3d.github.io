import { createContext, useContext, type ReactNode } from 'react'
import type { ArchiveRepositories } from '@domain/archive/archive-repositories'

const RepositoryContext = createContext<ArchiveRepositories | null>(null)

interface RepositoryProviderProps {
  repositories: ArchiveRepositories
  children: ReactNode
}

export function RepositoryProvider({ repositories, children }: RepositoryProviderProps) {
  return <RepositoryContext.Provider value={repositories}>{children}</RepositoryContext.Provider>
}

export function useRepositories(): ArchiveRepositories {
  const repositories = useContext(RepositoryContext)
  if (!repositories) throw new Error('Archive repositories are not available')
  return repositories
}
