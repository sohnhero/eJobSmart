import { api } from '../api'
import type { User } from '../types'

export interface InviteTeamMemberPayload {
  email: string
  firstName: string
  lastName: string
}

export const teamService = {
  async list(): Promise<User[]> {
    const { data } = await api.get<User[]>('/users/team')
    return data
  },
  async invite(payload: InviteTeamMemberPayload): Promise<User> {
    const { data } = await api.post<User>('/users/team/invite', payload)
    return data
  },
  async deactivate(id: string): Promise<User> {
    const { data } = await api.patch<User>(`/users/team/${id}/deactivate`)
    return data
  },
}
