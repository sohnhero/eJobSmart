import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { tokenStorage } from './token-storage'
import type { ApiErrorBody, AuthTokens } from './types'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1'

export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccessToken()
  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`)
  }
  return config
})

// Un seul rafraîchissement de token en vol à la fois : les requêtes qui échouent pendant
// le rafraîchissement attendent la même promesse au lieu de déclencher chacune leur propre refresh.
let refreshPromise: Promise<AuthTokens> | null = null

async function refreshTokens(): Promise<AuthTokens> {
  const refreshToken = tokenStorage.getRefreshToken()
  if (!refreshToken) {
    throw new Error('Aucun refresh token disponible')
  }
  const { data } = await axios.post<AuthTokens>(`${baseURL}/auth/refresh`, { refreshToken })
  tokenStorage.setTokens(data)
  return data
}

export const AUTH_UNAUTHORIZED_EVENT = 'ejobsmart:auth-unauthorized'

// Le token de rafraîchissement est invalide/expiré : on nettoie le stockage et on prévient
// l'AuthContext (plutôt qu'une redirection forcée ici, qui interromprait la navigation sur
// les pages publiques pour un visiteur ayant simplement un vieux token en cache).
function forceLogout() {
  tokenStorage.clear()
  window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT))
}

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined
    const isAuthEndpoint = config?.url?.includes('/auth/login') || config?.url?.includes('/auth/refresh')

    if (error.response?.status !== 401 || !config || config._retried || isAuthEndpoint) {
      return Promise.reject(error)
    }

    config._retried = true
    try {
      refreshPromise ??= refreshTokens().finally(() => {
        refreshPromise = null
      })
      const tokens = await refreshPromise
      config.headers.set('Authorization', `Bearer ${tokens.accessToken}`)
      return api(config)
    } catch {
      forceLogout()
      return Promise.reject(error)
    }
  },
)

export function extractApiErrorMessage(error: unknown, fallback = 'Une erreur est survenue'): string {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as ApiErrorBody | undefined
    if (body?.message) {
      return Array.isArray(body.message) ? body.message[0] : body.message
    }
    if (error.message === 'Network Error') {
      return 'Impossible de contacter le serveur — vérifiez votre connexion.'
    }
  }
  return fallback
}
