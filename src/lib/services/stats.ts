import { api } from '../api'
import type { PlatformStats } from '../types'

export const statsService = {
  async getPlatformStats(): Promise<PlatformStats> {
    const { data } = await api.get<PlatformStats>('/stats/platform')
    return data
  },
}
