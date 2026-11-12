const API_URL = process.env.API_URL || 'http://localhost:4000'

type ApiInit = Omit<RequestInit, 'body'> & {
  token?: string
  body?: unknown
}

export async function apiFetch<T>(path: string, init: ApiInit = {}): Promise<T> {
  const { token, body, headers, ...rest } = init

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(payload.error || `Falha na comunicação com a API (${response.status})`)
  }

  return (await response.json()) as T
}
