export async function readJson(url: string, missing: 'null' | 'error'): Promise<unknown> {
  const response = await fetch(url)
  if (response.status === 404 && missing === 'null') return null
  if (!response.ok) {
    throw new Error(`Archive API responded ${response.status} for ${url}`)
  }
  return response.json() as Promise<unknown>
}

export function apiUrl(baseUrl: string, path: string): string {
  const trimmed = baseUrl.replace(/\/$/, '')
  return `${trimmed}${path}`
}
