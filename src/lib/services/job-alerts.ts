import { api } from '../api'
import type { CreateJobAlertPayload, JobAlert, UpdateJobAlertPayload } from '../types'

export const jobAlertsService = {
  async list(): Promise<JobAlert[]> {
    const { data } = await api.get<JobAlert[]>('/job-alerts')
    return data
  },
  async create(payload: CreateJobAlertPayload): Promise<JobAlert> {
    const { data } = await api.post<JobAlert>('/job-alerts', payload)
    return data
  },
  async update(id: string, payload: UpdateJobAlertPayload): Promise<JobAlert> {
    const { data } = await api.patch<JobAlert>(`/job-alerts/${id}`, payload)
    return data
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/job-alerts/${id}`)
  },
}
