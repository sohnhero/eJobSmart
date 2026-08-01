import type { JobStatus } from './types'

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  draft: 'Brouillon',
  pending_review: 'En attente de modération',
  active: 'Active',
  suspended: 'Suspendue',
  closed: 'Clôturée',
  expired: 'Expirée',
}
