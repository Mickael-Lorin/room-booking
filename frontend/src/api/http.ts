export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'
export const ACCESS_TOKEN_KEY = 'accessToken'
export const USER_ROLE_KEY = 'USER_ROLE'

export class ApiError extends Error {

  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function clearAuthStorage(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(USER_ROLE_KEY)
}

export function authHeaders(includeJson = true): HeadersInit {
  const token = getAccessToken()
  const headers: Record<string, string> = {}

  if (includeJson) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const error = await response.json()
    return error.message ?? 'Une erreur est survenue'
  } catch {
    return 'Une erreur est survenue'
  }
}

export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      clearAuthStorage()
    }
    throw new ApiError(await getErrorMessage(response), response.status)
  }


  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text();

  if (!text || text.trim() === '') {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  authenticated?: boolean
}

export async function apiRequest<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
): Promise<T> {
  const {
    body,
    authenticated = false,
    headers,
    ...requestOptions
  } = options

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...requestOptions,
    headers: {
      ...(authenticated
          ? authHeaders(body !== undefined)
          : body !== undefined
              ? { 'Content-Type': 'application/json' }
              : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  return handleResponse<T>(response)
}