import { api } from '../api'
import type {
  CreateTrainingPayload,
  Paginated,
  Training,
  TrainingEnrollment,
  TrainingFormat,
  TrainingLevel,
  UpdateTrainingPayload,
} from '../types'

export interface QueryTrainingsParams {
  q?: string
  sector?: string
  format?: TrainingFormat
  level?: TrainingLevel
  page?: number
  limit?: number
}

export const trainingsService = {
  async list(params: QueryTrainingsParams = {}): Promise<Paginated<Training>> {
    const { data } = await api.get<Paginated<Training>>('/trainings', { params })
    return data
  },
  async get(id: string): Promise<Training> {
    const { data } = await api.get<Training>(`/trainings/${id}`)
    return data
  },
  async mine(): Promise<Training[]> {
    const { data } = await api.get<Training[]>('/trainings/mine')
    return data
  },
  async mineById(id: string): Promise<Training> {
    const { data } = await api.get<Training>(`/trainings/mine/${id}`)
    return data
  },
  async create(payload: CreateTrainingPayload): Promise<Training> {
    const { data } = await api.post<Training>('/trainings', payload)
    return data
  },
  async update(id: string, payload: UpdateTrainingPayload): Promise<Training> {
    const { data } = await api.patch<Training>(`/trainings/${id}`, payload)
    return data
  },
  async publish(id: string): Promise<Training> {
    const { data } = await api.patch<Training>(`/trainings/${id}/publish`)
    return data
  },
  async archive(id: string): Promise<Training> {
    const { data } = await api.patch<Training>(`/trainings/${id}/archive`)
    return data
  },
  async remove(id: string): Promise<void> {
    await api.delete(`/trainings/${id}`)
  },
  async enroll(id: string): Promise<TrainingEnrollment> {
    const { data } = await api.post<TrainingEnrollment>(`/trainings/${id}/enroll`)
    return data
  },
  async enrollments(id: string): Promise<TrainingEnrollment[]> {
    const { data } = await api.get<TrainingEnrollment[]>(`/trainings/${id}/enrollments`)
    return data
  },
}

export const enrollmentsService = {
  async mine(): Promise<TrainingEnrollment[]> {
    const { data } = await api.get<TrainingEnrollment[]>('/training-enrollments/mine')
    return data
  },
  async completeModule(enrollmentId: string, moduleId: string): Promise<TrainingEnrollment> {
    const { data } = await api.patch<TrainingEnrollment>(
      `/training-enrollments/${enrollmentId}/modules/${moduleId}/complete`,
    )
    return data
  },
}
