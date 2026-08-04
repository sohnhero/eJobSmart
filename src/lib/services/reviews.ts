import { api } from '../api'
import type { Paginated, Review, ReviewStatus } from '../types'

export const reviewsService = {
  async submitMine(rating: number, text: string): Promise<Review> {
    const { data } = await api.post<Review>('/reviews', { rating, text })
    return data
  },
  async findMine(): Promise<Review | null> {
    const { data } = await api.get<Review | null>('/reviews/mine')
    return data
  },
  async findPublicApproved(page = 1, limit = 12): Promise<Paginated<Review>> {
    const { data } = await api.get<Paginated<Review>>('/reviews', { params: { page, limit } })
    return data
  },
  async findQueue(params: { status?: ReviewStatus; page?: number; limit?: number } = {}): Promise<Paginated<Review>> {
    const { data } = await api.get<Paginated<Review>>('/reviews/queue', { params })
    return data
  },
  async approve(id: string): Promise<Review> {
    const { data } = await api.patch<Review>(`/reviews/${id}/approve`)
    return data
  },
  async reject(id: string, reason?: string): Promise<Review> {
    const { data } = await api.patch<Review>(`/reviews/${id}/reject`, { reason })
    return data
  },
}
