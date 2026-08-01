import { api } from '../api'
import type { CreateJobPayload, Job, Paginated, QueryJobsParams, UpdateJobPayload } from '../types'

export const jobsService = {
  async list(params: QueryJobsParams = {}): Promise<Paginated<Job>> {
    const { data } = await api.get<Paginated<Job>>('/jobs', { params })
    return data
  },
  async getPublic(id: string): Promise<Job> {
    const { data } = await api.get<Job>(`/jobs/${id}`)
    return data
  },
  async mine(): Promise<Job[]> {
    const { data } = await api.get<Job[]>('/jobs/mine')
    return data
  },
  async mineById(id: string): Promise<Job> {
    const { data } = await api.get<Job>(`/jobs/mine/${id}`)
    return data
  },
  async pendingReview(): Promise<Job[]> {
    const { data } = await api.get<Job[]>('/jobs/pending-review')
    return data
  },
  async create(payload: CreateJobPayload): Promise<Job> {
    const { data } = await api.post<Job>('/jobs', payload)
    return data
  },
  async update(id: string, payload: UpdateJobPayload): Promise<Job> {
    const { data } = await api.patch<Job>(`/jobs/${id}`, payload)
    return data
  },
  async publish(id: string): Promise<Job> {
    const { data } = await api.patch<Job>(`/jobs/${id}/publish`)
    return data
  },
  async approve(id: string): Promise<Job> {
    const { data } = await api.patch<Job>(`/jobs/${id}/approve`)
    return data
  },
  async reject(id: string, note?: string): Promise<Job> {
    const { data } = await api.patch<Job>(`/jobs/${id}/reject`, { note })
    return data
  },
  async suspend(id: string): Promise<Job> {
    const { data } = await api.patch<Job>(`/jobs/${id}/suspend`)
    return data
  },
  async close(id: string): Promise<Job> {
    const { data } = await api.patch<Job>(`/jobs/${id}/close`)
    return data
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/jobs/${id}`)
  },
  async boost(id: string): Promise<Job> {
    const { data } = await api.patch<Job>(`/jobs/${id}/boost`)
    return data
  },
  async unboost(id: string): Promise<Job> {
    const { data } = await api.patch<Job>(`/jobs/${id}/unboost`)
    return data
  },
}
