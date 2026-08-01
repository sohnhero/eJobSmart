import { api } from '../api'
import type { AdminUpdateProfilePayload, Profile, UpsertProfilePayload } from '../types'

export const profilesService = {
  async me(): Promise<Profile> {
    const { data } = await api.get<Profile>('/profiles/me')
    return data
  },
  async updateMe(payload: UpsertProfilePayload): Promise<Profile> {
    const { data } = await api.patch<Profile>('/profiles/me', payload)
    return data
  },
  async get(userId: string): Promise<Profile> {
    const { data } = await api.get<Profile>(`/profiles/${userId}`)
    return data
  },
  async adminUpdate(userId: string, payload: AdminUpdateProfilePayload): Promise<Profile> {
    const { data } = await api.patch<Profile>(`/profiles/${userId}/admin`, payload)
    return data
  },
}
