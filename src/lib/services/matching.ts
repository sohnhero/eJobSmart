import { api } from '../api'
import type { CandidateMatch, JobMatch } from '../types'

export const matchingService = {
  async recommendedJobs(limit?: number): Promise<JobMatch[]> {
    const { data } = await api.get<{ items: JobMatch[] }>('/matching/jobs', { params: { limit } })
    return data.items
  },
  async recommendedCandidates(jobId: string, limit?: number): Promise<CandidateMatch[]> {
    const { data } = await api.get<{ items: CandidateMatch[] }>(`/matching/jobs/${jobId}/candidates`, {
      params: { limit },
    })
    return data.items
  },
}
