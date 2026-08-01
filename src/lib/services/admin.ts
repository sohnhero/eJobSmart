import { api } from '../api'
import type { AdminDashboardOverview, BackendRole, PlatformSettings, User } from '../types'

export const adminService = {
  async dashboardOverview(): Promise<AdminDashboardOverview> {
    const { data } = await api.get<AdminDashboardOverview>('/admin/dashboard')
    return data
  },
  async getSettings(): Promise<PlatformSettings> {
    const { data } = await api.get<PlatformSettings>('/admin/settings')
    return data
  },
  async updateSettings(payload: Partial<PlatformSettings>): Promise<PlatformSettings> {
    const { data } = await api.patch<PlatformSettings>('/admin/settings', payload)
    return data
  },
  async listUsers(role?: BackendRole): Promise<User[]> {
    const { data } = await api.get<User[]>('/users', { params: role ? { role } : undefined })
    return data
  },
  async getUser(id: string): Promise<User> {
    const { data } = await api.get<User>(`/users/${id}`)
    return data
  },
  async activateUser(id: string): Promise<User> {
    const { data } = await api.patch<User>(`/users/${id}/activate`)
    return data
  },
  async deactivateUser(id: string): Promise<User> {
    const { data } = await api.patch<User>(`/users/${id}/deactivate`)
    return data
  },
}
