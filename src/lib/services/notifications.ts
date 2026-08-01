import { api } from '../api'
import type { AppNotification, Paginated } from '../types'

export interface QueryNotificationsParams {
  isRead?: boolean
  page?: number
  limit?: number
}

export const notificationsService = {
  async list(params: QueryNotificationsParams = {}): Promise<Paginated<AppNotification>> {
    const { data } = await api.get<Paginated<AppNotification>>('/notifications', { params })
    return data
  },
  async unreadCount(): Promise<number> {
    const { data } = await api.get<{ count: number }>('/notifications/unread-count')
    return data.count
  },
  async markAllRead(): Promise<void> {
    await api.patch('/notifications/read-all')
  },
  async markRead(id: string): Promise<AppNotification> {
    const { data } = await api.patch<AppNotification>(`/notifications/${id}/read`)
    return data
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`)
  },
}
