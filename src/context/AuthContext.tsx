import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { AUTH_UNAUTHORIZED_EVENT } from '../lib/api'
import { authService } from '../lib/auth-service'
import { tokenStorage } from '../lib/token-storage'
import { disconnectMessagesSocket } from '../lib/socket'
import type { AuthTokens, LoginResult, RegisterPayload, User } from '../lib/types'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<LoginResult>
  verifyTwoFactorLogin: (challengeToken: string, code: string) => Promise<User>
  register: (payload: RegisterPayload) => Promise<User>
  logout: () => Promise<void>
  refreshUser: () => Promise<User>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function hydrate() {
      if (!tokenStorage.getAccessToken()) {
        setIsLoading(false)
        return
      }
      try {
        const me = await authService.me()
        if (!cancelled) setUser(me)
      } catch {
        if (!cancelled) tokenStorage.clear()
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void hydrate()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const handleUnauthorized = () => { disconnectMessagesSocket(); setUser(null) }
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [])

  const applySession = useCallback((sessionUser: User, tokens: AuthTokens) => {
    tokenStorage.setTokens(tokens)
    setUser(sessionUser)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const result = await authService.login(email, password)
    if (!('requiresTwoFactor' in result)) {
      applySession(result.user, result.tokens)
    }
    return result
  }, [applySession])

  const verifyTwoFactorLogin = useCallback(async (challengeToken: string, code: string) => {
    const result = await authService.verifyTwoFactorLogin(challengeToken, code)
    applySession(result.user, result.tokens)
    return result.user
  }, [applySession])

  const register = useCallback(async (payload: RegisterPayload) => {
    const result = await authService.register(payload)
    applySession(result.user, result.tokens)
    return result.user
  }, [applySession])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // Le token est peut-être déjà expiré côté serveur — on nettoie côté client dans tous les cas
    } finally {
      tokenStorage.clear()
      disconnectMessagesSocket()
      setUser(null)
    }
  }, [])

  const refreshUser = useCallback(async () => {
    const me = await authService.me()
    setUser(me)
    return me
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        verifyTwoFactorLogin,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
