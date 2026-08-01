import { api } from '../api'
import type { Paginated, Report, ReportStatus } from '../types'

export const reportsService = {
  async create(job: string, reason: string): Promise<Report> {
    const { data } = await api.post<Report>('/reports', { job, reason })
    return data
  },
  async list(params: { status?: ReportStatus; page?: number; limit?: number } = {}): Promise<Paginated<Report>> {
    const { data } = await api.get<Paginated<Report>>('/reports', { params })
    return data
  },
  async resolve(id: string, resolutionNote?: string): Promise<Report> {
    const { data } = await api.patch<Report>(`/reports/${id}/resolve`, { resolutionNote })
    return data
  },
  async dismiss(id: string, resolutionNote?: string): Promise<Report> {
    const { data } = await api.patch<Report>(`/reports/${id}/dismiss`, { resolutionNote })
    return data
  },
}
