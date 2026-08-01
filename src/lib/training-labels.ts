import type { EnrollmentStatus, Training, TrainingFormat, TrainingLevel } from './types'

export const TRAINING_FORMAT_LABELS: Record<TrainingFormat, string> = {
  online: 'En ligne',
  in_person: 'Présentiel',
  hybrid: 'Hybride',
}

export const TRAINING_LEVEL_LABELS: Record<TrainingLevel, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé',
}

export const ENROLLMENT_STATUS_LABELS: Record<EnrollmentStatus, string> = {
  enrolled: 'Inscrit',
  in_progress: 'En cours',
  completed: 'Terminée',
  cancelled: 'Annulée',
}

export function formatDurationHours(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} min`
  if (Number.isInteger(hours)) return `${hours}h`
  return `${hours.toFixed(1)}h`
}

export function trainingLevelBadgeVariant(level: TrainingLevel): 'green' | 'amber' | 'red' {
  if (level === 'beginner') return 'green'
  if (level === 'intermediate') return 'amber'
  return 'red'
}

export function trainingCoverImage(training: Pick<Training, 'coverImage'>): string {
  return training.coverImage || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80'
}
