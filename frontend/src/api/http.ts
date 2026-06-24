export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function authHeaders(includeJson = true): HeadersInit {
  const token = localStorage.getItem('accessToken')
  const headers: Record<string, string> = {}

  if (includeJson) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Une erreur est survenue' }))

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('accessToken')
    }

    throw new ApiError(error.message ?? 'Une erreur est survenue', response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}
