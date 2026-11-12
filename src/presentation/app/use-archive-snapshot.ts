import { useOutletContext } from 'react-router-dom'
import type { ArchiveSnapshot } from '@application/load-archive'

export function useArchiveSnapshot(): ArchiveSnapshot {
  return useOutletContext<ArchiveSnapshot>()
}
