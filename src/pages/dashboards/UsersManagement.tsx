import { useEffect, useState } from 'react'
import {
  Search, ShieldAlert,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import { adminService } from '../../lib/services/admin'
import { extractApiErrorMessage } from '../../lib/api'
import type { BackendRole, User } from '../../lib/types'

const ROLE_OPTIONS: { value: BackendRole | 'All'; label: string }[] = [
  { value: 'All', label: 'Tous les rôles' },
  { value: 'candidate', label: 'Candidats' },
  { value: 'freelance', label: 'Freelances' },
  { value: 'company', label: 'Entreprises' },
  { value: 'agency', label: 'Cabinets RH' },
  { value: 'admin_rh', label: 'Admin RH' },
  { value: 'super_admin', label: 'Super Admin' },
]

const ROLE_BADGE: Record<BackendRole, { label: string; variant: 'purple' | 'green' | 'blue' | 'amber' | 'slate' }> = {
  candidate: { label: 'Candidat', variant: 'slate' },
  freelance: { label: 'Freelance', variant: 'blue' },
  company: { label: 'Entreprise', variant: 'purple' },
  agency: { label: 'Cabinet RH', variant: 'green' },
  admin_rh: { label: 'Admin RH', variant: 'amber' },
  super_admin: { label: 'Super Admin', variant: 'amber' },
  trainer: { label: 'Formateur', variant: 'blue' },
}

export default function UsersManagement() {
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [filterRole, setFilterRole] = useState<BackendRole | 'All'>('All')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    adminService.listUsers(filterRole === 'All' ? undefined : filterRole)
      .then(res => setUsers([...res].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [filterRole])

  const filteredUsers = users.filter(u =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase())
  )

  const handleToggleSuspend = async (user: User) => {
    setBusyId(user._id)
    try {
      const updated = user.isActive ? await adminService.deactivateUser(user._id) : await adminService.activateUser(user._id)
      setUsers(prev => prev.map(u => u._id === user._id ? updated : u))
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <DashboardLayout role="admin">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Gestion des Utilisateurs</h1>
          <p className="text-slate-500 text-sm mt-0.5">Contrôle des comptes et de leur accès à la plateforme</p>
        </div>
      </div>

      <div className="card">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>
            <select
              value={filterRole}
              onChange={e => setFilterRole(e.target.value as BackendRole | 'All')}
              className="bg-white border border-slate-200 rounded-xl text-sm px-4 py-2 outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
            >
              {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-4"><Skeleton variant="table" count={1} /></div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Utilisateur</th>
                  <th className="px-6 py-4">Rôle</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Date d'inscription</th>
                  <th className="px-6 py-4">Dernière connexion</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(user => (
                  <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={`${user.firstName} ${user.lastName}`} size="sm" />
                        <div>
                          <p className="text-sm font-bold text-slate-800">{user.companyName || `${user.firstName} ${user.lastName}`}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Badge variant={ROLE_BADGE[user.role].variant}>{ROLE_BADGE[user.role].label}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={user.isActive ? 'active' : 'closed'} />
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('fr-FR') : 'Jamais'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          disabled={busyId === user._id}
                          onClick={() => handleToggleSuspend(user)}
                          title={user.isActive ? 'Suspendre' : 'Activer'}
                          className={`p-2 rounded-lg transition-colors disabled:opacity-40 ${user.isActive ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                        >
                          <ShieldAlert className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400 text-sm">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
