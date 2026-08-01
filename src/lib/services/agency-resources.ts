import { api } from '../api'
import type {
  AgencyResource,
  CreateAgencyResourcePayload,
  Paginated,
  ProfileStatus,
  ResourceProposal,
  UpdateAgencyResourcePayload,
} from '../types'

export interface QueryAgencyResourcesParams {
  q?: string
  sector?: string
  status?: ProfileStatus
  page?: number
  limit?: number
}

export const agencyResourcesService = {
  async create(payload: CreateAgencyResourcePayload): Promise<AgencyResource> {
    const { data } = await api.post<AgencyResource>('/agency-resources', payload)
    return data
  },
  async mine(params: QueryAgencyResourcesParams = {}): Promise<Paginated<AgencyResource>> {
    const { data } = await api.get<Paginated<AgencyResource>>('/agency-resources/mine', { params })
    return data
  },
  async myProposals(): Promise<ResourceProposal[]> {
    const { data } = await api.get<ResourceProposal[]>('/agency-resources/proposals/mine')
    return data
  },
  async get(id: string): Promise<AgencyResource> {
    const { data } = await api.get<AgencyResource>(`/agency-resources/mine/${id}`)
    return data
  },
  async update(id: string, payload: UpdateAgencyResourcePayload): Promise<AgencyResource> {
    const { data } = await api.patch<AgencyResource>(`/agency-resources/${id}`, payload)
    return data
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/agency-resources/${id}`)
  },
  async propose(resourceId: string, job: string, message?: string): Promise<ResourceProposal> {
    const { data } = await api.post<ResourceProposal>(`/agency-resources/${resourceId}/propose`, { job, message })
    return data
  },
}

export const proposalsService = {
  async forJob(jobId: string): Promise<ResourceProposal[]> {
    const { data } = await api.get<ResourceProposal[]>(`/jobs/${jobId}/proposals`)
    return data
  },
  async accept(jobId: string, proposalId: string, reviewNote?: string): Promise<ResourceProposal> {
    const { data } = await api.patch<ResourceProposal>(`/jobs/${jobId}/proposals/${proposalId}/accept`, { reviewNote })
    return data
  },
  async decline(jobId: string, proposalId: string, reviewNote?: string): Promise<ResourceProposal> {
    const { data } = await api.patch<ResourceProposal>(`/jobs/${jobId}/proposals/${proposalId}/decline`, { reviewNote })
    return data
  },
}
