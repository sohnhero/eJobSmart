import type { BackendRole } from './types'

// Les routes du dashboard utilisent des segments différents des valeurs de rôle du backend
// pour admin_rh et super_admin (voir DashboardLayout.tsx / App.tsx).
export type DashboardRole = 'candidate' | 'freelance' | 'company' | 'agency' | 'admin-rh' | 'admin'

const ROLE_TO_DASHBOARD: Record<BackendRole, DashboardRole> = {
  candidate: 'candidate',
  freelance: 'freelance',
  company: 'company',
  agency: 'agency',
  admin_rh: 'admin-rh',
  super_admin: 'admin',
  trainer: 'admin-rh',
}

export function roleToDashboardPath(role: BackendRole): string {
  return `/dashboard/${ROLE_TO_DASHBOARD[role]}`
}

export function roleToDashboardSegment(role: BackendRole): DashboardRole {
  return ROLE_TO_DASHBOARD[role]
}

const ROLE_LABELS: Record<BackendRole, string> = {
  candidate: 'Candidat',
  freelance: 'Freelance',
  company: 'Entreprise',
  agency: 'Cabinet RH',
  admin_rh: 'Admin RH',
  super_admin: 'Super Admin',
  trainer: 'Formateur',
}

export function roleToLabel(role: BackendRole): string {
  return ROLE_LABELS[role]
}
