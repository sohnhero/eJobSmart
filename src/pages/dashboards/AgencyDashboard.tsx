import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users, Briefcase, TrendingUp, Search,
  CheckCircle, Plus,
  BarChart3, ExternalLink,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/Badge'
import { useAuth } from '../../context/AuthContext'
import { agencyResourcesService } from '../../lib/services/agency-resources'
import { jobsService } from '../../lib/services/jobs'
import type { AgencyResource, Job, ResourceProposal } from '../../lib/types'

export default function AgencyDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [resources, setResources] = useState<AgencyResource[]>([])
  const [proposals, setProposals] = useState<ResourceProposal[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      agencyResourcesService.mine({ limit: 50 }).then(res => res.items).catch(() => []),
      agencyResourcesService.myProposals().catch(() => []),
      jobsService.mine().catch(() => []),
    ]).then(([res, props, myJobs]) => {
      setResources(res)
      setProposals(props)
      setJobs(myJobs)
      setLoading(false)
    })
  }, [])

  const activeJobs = jobs.filter(j => j.status === 'active').length
  const accepted = proposals.filter(p => p.status === 'accepted').length
  const placementRate = proposals.length > 0 ? Math.round((accepted / proposals.length) * 100) : 0

  const stats = [
    { title: 'Ressources au portefeuille', value: resources.length.toString(), icon: Users, iconColor: 'text-emerald-600' },
    { title: 'Placements réussis', value: accepted.toString(), icon: CheckCircle, iconColor: 'text-brand-600' },
    { title: 'Offres en cours', value: activeJobs.toString(), icon: Briefcase, iconColor: 'text-purple-600' },
    { title: 'Propositions envoyées', value: proposals.length.toString(), icon: TrendingUp, iconColor: 'text-blue-600' },
  ]

  const recentProposals = [...proposals].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)

  return (
    <DashboardLayout role="agency">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{user?.companyName ?? 'Cabinet RH'}</h1>
          <p className="text-slate-500 text-sm mt-0.5">Gestion de votre portefeuille de talents et placements</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" leftIcon={<Search className="w-4 h-4" />} onClick={() => navigate('/jobs')}>Trouver des offres</Button>
          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => navigate('/dashboard/agency/resources')}>Ajouter une ressource</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main: Resources */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Portefeuille RH récent</h2>
              <button onClick={() => navigate('/dashboard/agency/resources')} className="text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors">Tout voir</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidat</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Profil & Exp</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-400 text-sm">Chargement…</td></tr>
                  ) : resources.length === 0 ? (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-400 text-sm">Aucune ressource pour le moment</td></tr>
                  ) : (
                    resources.slice(0, 5).map(res => (
                      <tr key={res._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-800 text-sm">{res.firstName} {res.lastName}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-600">{res.headline ?? '—'}</p>
                          {res.experienceYears !== undefined && <p className="text-[10px] text-slate-400">{res.experienceYears} ans</p>}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={res.status} />
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => navigate('/dashboard/agency/resources')} className="p-2 text-slate-400 hover:text-brand-600 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
            <h3 className="text-lg font-bold mb-2 text-white">Prêt à placer de nouveaux talents ?</h3>
            <p className="text-emerald-100 text-sm mb-4">Parcourez les offres d'entreprises qui recherchent des ressources externes ou de l'intérim.</p>
            <Button variant="white" size="sm" onClick={() => navigate('/jobs')}>Consulter les offres</Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-4 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" /> Performance du Cabinet
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Taux de placement</span>
                <span className="text-sm font-bold text-slate-900">{placementRate}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${placementRate}%` }} />
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-4 text-sm">Dernières propositions</h3>
            {recentProposals.length === 0 ? (
              <p className="text-xs text-slate-400">Aucune proposition envoyée</p>
            ) : (
              <div className="space-y-4">
                {recentProposals.map(p => {
                  const resource = typeof p.resource === 'string' ? null : p.resource
                  const job = typeof p.job === 'string' ? null : p.job
                  return (
                    <div key={p._id} className="flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <StatusBadge status={p.status} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{resource ? `${resource.firstName} ${resource.lastName}` : 'Ressource'}</p>
                        <p className="text-[10px] text-slate-400">{job?.title ?? ''}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
