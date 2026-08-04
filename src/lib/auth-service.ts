import { api } from './api'
import type { LoginResult, LoginSuccess, RegisterPayload, User } from './types'

export type OAuthExchangeResult = LoginSuccess | { pendingToken: string }

export type OAuthRole = 'candidate' | 'freelance' | 'company' | 'agency'

export const authService = {
  async login(email: string, password: string): Promise<LoginResult> {
    const { data } = await api.post<LoginResult>('/auth/login', { email, password })
    return data
  },

  async verifyTwoFactorLogin(challengeToken: string, code: string): Promise<LoginSuccess> {
    const { data } = await api.post<LoginSuccess>('/auth/2fa/verify-login', { challengeToken, code })
    return data
  },

  async register(payload: RegisterPayload): Promise<LoginSuccess> {
    const { data } = await api.post<LoginSuccess>('/auth/register', payload)
    return data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async me(): Promise<User> {
    const { data } = await api.get<User>('/users/me')
    return data
  },

  async updateMe(payload: Partial<Pick<User, 'firstName' | 'lastName' | 'phone' | 'companyName' | 'companyLogo'>>): Promise<User> {
    const { data } = await api.patch<User>('/users/me', payload)
    return data
  },

  async setupTwoFactor(): Promise<{ secret: string; otpauthUrl: string; qrCodeDataUrl: string }> {
    const { data } = await api.post<{ secret: string; otpauthUrl: string; qrCodeDataUrl: string }>('/auth/2fa/setup')
    return data
  },

  async enableTwoFactor(code: string): Promise<void> {
    await api.post('/auth/2fa/enable', { code })
  },

  async disableTwoFactor(code: string, password?: string): Promise<void> {
    await api.post('/auth/2fa/disable', { code, password })
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.patch('/auth/password', { currentPassword, newPassword })
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email })
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post('/auth/reset-password', { token, newPassword })
  },

  async completeOAuthSignup(pendingToken: string, role: OAuthRole): Promise<LoginSuccess> {
    const { data } = await api.post<LoginSuccess>('/auth/oauth/complete', { pendingToken, role })
    return data
  },

  // Le callback OAuth (/oauth-callback, /oauth-choose-role) ne transporte plus que ce code
  // opaque à usage unique — jamais les tokens en clair dans l'URL (cf. audit sécurité).
  async exchangeOAuthCode(code: string): Promise<OAuthExchangeResult> {
    const { data } = await api.post<OAuthExchangeResult>('/auth/oauth/exchange', { code })
    return data
  },
}
