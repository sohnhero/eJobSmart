import { api } from '../api'
import type { CompanyVerification, KycStatus, Paginated } from '../types'

export interface SubmitVerificationPayload {
  ninea?: string
  rccm?: string
  nineaDocumentUrl: string
  rccmDocumentUrl: string
  idDocumentUrl?: string
}

export const companyVerificationService = {
  async findMine(): Promise<CompanyVerification> {
    const { data } = await api.get<CompanyVerification>('/company-verification/me')
    return data
  },
  async submitMine(payload: SubmitVerificationPayload): Promise<CompanyVerification> {
    const { data } = await api.post<CompanyVerification>('/company-verification/me', payload)
    return data
  },
  async findAll(status?: KycStatus, page = 1, limit = 20): Promise<Paginated<CompanyVerification>> {
    const { data } = await api.get<Paginated<CompanyVerification>>('/company-verification', {
      params: { status, page, limit },
    })
    return data
  },
  async approve(id: string): Promise<CompanyVerification> {
    const { data } = await api.patch<CompanyVerification>(`/company-verification/${id}/approve`)
    return data
  },
  async reject(id: string, reason: string): Promise<CompanyVerification> {
    const { data } = await api.patch<CompanyVerification>(`/company-verification/${id}/reject`, { reason })
    return data
  },
}
