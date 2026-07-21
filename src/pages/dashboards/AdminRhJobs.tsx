import { useState, useEffect } from 'react'
import {
  Briefcase, CheckCircle, XCircle, Eye, Search, AlertTriangle
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'

interface JobModerationItem {
  id: number
  title: string
  company: string
  type: string
  submittedDate: string
  status: 'En attente' | 'Approuvé' | 'Rejeté'
}

export default function AdminRhJobs() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [jobs, setJobs] = useState<JobModerationItem[]>([
    { id: 1, title: 'Développeur React Senior', company: 'Sonatel Digital', type: 'CDI', submittedDate: '2026-07-20', status: 'En attente' },
    { id: 2, title: 'Architecte Solution Cloud', company: 'Wave Senegal', type: 'CDI', submittedDate: '2026-07-19', status: 'En attente' },
    { id: 3, title: 'Comptable Confirmé', company: 'Ecobank', type: 'CDD', submittedDate: '2026-07-18', status: 'Approuvé' },
  ])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleApprove = (id: number, title: string) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'Approuvé' as const } : j))
    toast.success(`L'offre "${title}" a été approuvée et publiée avec succès !`)
  }

  const handleReject = (id: number, title: string) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'Rejeté' as const } : j))
    toast.info(`L'offre "${title}" a été rejetée.`)
  }

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout role="admin-rh" userName="Admin RH Internal" userTitle="Modérateur">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          Modération des offres <Briefcase className="w-5 h-5 text-brand-600" />
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">Vérifiez et validez les offres d'emploi avant leur publication sur le portail public</p>
      </div>

      <div className="card">
        {/* Search */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par poste ou entreprise..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-4">
              <Skeleton variant="table" count={1} />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Offre</th>
                  <th className="px-6 py-4">Entreprise</th>
                  <th className="px-6 py-4">Type de contrat</th>
                  <th className="px-6 py-4">Date de soumission</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJobs.map(j => (
                  <tr key={j.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 text-sm">{j.title}</td>
                    <td className="px-6 py-4 text-xs text-slate-600 font-semibold">{j.company}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{j.type}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">{new Date(j.submittedDate).toLocaleDateString('fr-FR')}</td>
                    <td className="px-6 py-4">
                      <Badge variant={j.status === 'Approuvé' ? 'green' : j.status === 'Rejeté' ? 'red' : 'blue'}>{j.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        {j.status === 'En attente' && (
                          <>
                            <button
                              onClick={() => handleApprove(j.id, j.title)}
                              className="p-1 hover:bg-emerald-100 rounded text-emerald-600"
                              title="Approuver"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(j.id, j.title)}
                              className="p-1 hover:bg-red-100 rounded text-red-500"
                              title="Rejeter"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button className="p-1.5 text-slate-400 hover:text-slate-600" title="Consulter l'offre"><Eye className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
