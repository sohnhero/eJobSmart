import { api } from '../api'
import type {
  Application,
  ApplicationStatus,
  CreateApplicationPayload,
  Paginated,
  UpdateApplicationStatusPayload,
} from '../types'

export const applicationsService = {
  async apply(payload: CreateApplicationPayload): Promise<Application> {
    const { data } = await api.post<Application>('/applications', payload)
    return data
  },
  async forJob(
    job: string,
    params: { status?: ApplicationStatus; page?: number; limit?: number } = {},
  ): Promise<Paginated<Application>> {
    const { data } = await api.get<Paginated<Application>>('/applications', { params: { job, ...params } })
    return data
  },
  async mine(): Promise<Application[]> {
    const { data } = await api.get<Application[]>('/applications/mine')
    return data
  },
  async get(id: string): Promise<Application> {
    const { data } = await api.get<Application>(`/applications/${id}`)
    return data
  },
  async updateStatus(id: string, payload: UpdateApplicationStatusPayload): Promise<Application> {
    const { data } = await api.patch<Application>(`/applications/${id}/status`, payload)
    return data
  },
  async rate(id: string, rating: number): Promise<Application> {
    const { data } = await api.patch<Application>(`/applications/${id}/rating`, { rating })
    return data
  },
  async updateNotes(id: string, notes: string): Promise<Application> {
    const { data } = await api.patch<Application>(`/applications/${id}/notes`, { notes })
    return data
  },
  async cancel(id: string): Promise<Application> {
    const { data } = await api.patch<Application>(`/applications/${id}/cancel`)
    return data
  },
}
