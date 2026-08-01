import { api } from '../api'
import type { Sector } from '../types'

export const sectorsService = {
  async list(): Promise<Sector[]> {
    const { data } = await api.get<Sector[]>('/sectors')
    return data
  },
  async get(id: string): Promise<Sector> {
    const { data } = await api.get<Sector>(`/sectors/${id}`)
    return data
  },
  async create(payload: Partial<Sector>): Promise<Sector> {
    const { data } = await api.post<Sector>('/sectors', payload)
    return data
  },
  async update(id: string, payload: Partial<Sector>): Promise<Sector> {
    const { data } = await api.patch<Sector>(`/sectors/${id}`, payload)
    return data
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/sectors/${id}`)
  },
}
