import { useState, useEffect } from 'react'
import {
  Search, Mail,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Avatar from '../../components/ui/Avatar'
import Skeleton from '../../components/ui/Skeleton'
import { adminService } from '../../lib/services/admin'
import type { User } from '../../lib/types'

export default function AdminRhCandidates() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [candidates, setCandidates] = useState<User[]>([])

  useEffect(() => {
    Promise.all([
      adminService.listUsers('candidate').catch(() => []),
      adminService.listUsers('freelance').catch(() => []),
    ]).then(([c, f]) => {
      setCandidates([...c, ...f].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    }).finally(() => setIsLoading(false))
  }, [])

  const filtered = candidates.filter(c =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
    c.email.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <DashboardLayout role="admin-rh">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Candidats inscrits</h1>
          <p className="text-slate-500 text-sm mt-0.5">Vue d'ensemble des comptes candidats et freelances</p>
        </div>
      </div>

      <div className="card">
        {/* Search */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un candidat..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-4">
              <Skeleton variant="table" count={1} />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Candidat</th>
                  <th className="px-6 py-4">Type de compte</th>
                  <th className="px-6 py-4">Email vérifié</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Inscrit le</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(c => (
                  <tr key={c._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={`${c.firstName} ${c.lastName}`} size="sm" />
                        <div>
                          <p className="text-sm font-bold text-slate-800">{c.firstName} {c.lastName}</p>
                          <p className="text-xs text-slate-400">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg capitalize">{c.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${c.isVerified ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                        {c.isVerified ? 'Vérifié' : 'Non vérifié'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${c.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {c.isActive ? 'Actif' : 'Désactivé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">{new Date(c.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <a href={`mailto:${c.email}`} className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Contacter par mail">
                          <Mail className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400 text-sm">
                      Aucun candidat trouvé.
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
