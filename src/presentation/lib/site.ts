const repositoryUrl = 'https://github.com/HiddenCry/Vulnerability-Disclosures'

export function readmeUrl(readmePath: string): string {
  return `${repositoryUrl}/blob/main/${readmePath}`
}

export function cweUrl(id: string): string {
  const number = id.replace(/^CWE-/, '')
  return `https://cwe.mitre.org/data/definitions/${number}.html`
}

export function cveUrl(id: string): string {
  return `https://www.cve.org/CVERecord?id=${encodeURIComponent(id)}`
}

export function evidenceUrl(src: string): string {
  if (/^https?:\/\//.test(src)) return src
  const base = import.meta.env.BASE_URL
  const prefix = base.endsWith('/') ? base : `${base}/`
  return `${prefix}evidence/${src.replace(/^\//, '')}`
}

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  if (!year || !month || !day) return isoDate
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)))
}

export function formatScore(score: number): string {
  return score.toFixed(1)
}

export function statusLabel(status: 'patched' | 'disclosed' | 'reserved'): string {
  if (status === 'patched') return 'Patched'
  if (status === 'disclosed') return 'Disclosed'
  return 'Reserved'
}
