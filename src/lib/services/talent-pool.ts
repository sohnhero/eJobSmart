import { api } from '../api'
import type { Availability, ContractType, Paginated, Profile, TalentPoolRequest, TalentPoolRequestStatus } from '../types'

export interface QueryTalentPoolParams {
  sector?: string
  skills?: string[]
  availability?: Availability
  contractTypesSought?: ContractType[]
  experienceYearsMin?: number
  city?: string
  country?: string
  page?: number
  limit?: number
}

export interface QueryTalentPoolRequestsParams {
  status?: TalentPoolRequestStatus
  page?: number
  limit?: number
}

export const talentPoolService = {
  async search(params: QueryTalentPoolParams = {}): Promise<Paginated<Profile>> {
    const { data } = await api.get<Paginated<Profile>>('/talent-pool', { params })
    return data
  },
  async createRequest(candidate: string, message?: string): Promise<TalentPoolRequest> {
    const { data } = await api.post<TalentPoolRequest>('/talent-pool/requests', { candidate, message })
    return data
  },
  async mine(params: QueryTalentPoolRequestsParams = {}): Promise<Paginated<TalentPoolRequest>> {
    const { data } = await api.get<Paginated<TalentPoolRequest>>('/talent-pool/requests/mine', { params })
    return data
  },
  async queue(params: QueryTalentPoolRequestsParams = {}): Promise<Paginated<TalentPoolRequest>> {
    const { data } = await api.get<Paginated<TalentPoolRequest>>('/talent-pool/requests', { params })
    return data
  },
  async approve(id: string, reviewNote?: string): Promise<TalentPoolRequest> {
    const { data } = await api.patch<TalentPoolRequest>(`/talent-pool/requests/${id}/approve`, { reviewNote })
    return data
  },
  async reject(id: string, reviewNote?: string): Promise<TalentPoolRequest> {
    const { data } = await api.patch<TalentPoolRequest>(`/talent-pool/requests/${id}/reject`, { reviewNote })
    return data
  },
}
