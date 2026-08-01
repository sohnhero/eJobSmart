import { useEffect, useMemo, useState } from 'react'
import {
  BarChart3, Users, Briefcase, Target, Send
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Skeleton from '../../components/ui/Skeleton'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { agencyResourcesService } from '../../lib/services/agency-resources'
import { jobsService } from '../../lib/services/jobs'
import type { AgencyResource, Job, ResourceProposal, Sector } from '../../lib/types'

function monthLabel(date: Date): string {
  return date.toLocaleDateString('fr-FR', { month: 'short' })
}

export default function AgencyAnalytics() {
  const [loading, setLoading] = useState(true)
  const [resources, setResources] = useState<AgencyResource[]>([])
  const [proposals, setProposals] = useState<ResourceProposal[]>([])
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    Promise.all([
      agencyResourcesService.mine({ limit: 200 }).then(res => res.items).catch(() => []),
      agencyResourcesService.myProposals().catch(() => []),
      jobsService.mine().catch(() => []),
    ]).then(([res, props, myJobs]) => {
      setResources(res)
      setProposals(props)
      setJobs(myJobs)
      setLoading(false)
    })
  }, [])

  const accepted = proposals.filter(p => p.status === 'accepted').length
  const placementRate = proposals.length > 0 ? Math.round((accepted / proposals.length) * 100) : 0
  const activeMandates = jobs.filter(j => j.status === 'active').length

  const stats = [
    { title: 'Taux de Placement', value: `${placementRate}%`, icon: Target, iconColor: 'text-brand-600' },
    { title: 'Offres actives publiées', value: activeMandates.toString(), icon: Briefcase, iconColor: 'text-purple-600' },
    { title: 'Propositions envoyées', value: proposals.length.toString(), icon: Send, iconColor: 'text-emerald-600' },
    { title: 'Vivier qualifié', value: resources.length.toString(), icon: Users, iconColor: 'text-amber-500' },
  ]

  const monthlyProposals = useMemo(() => {
    const buckets = new Map<string, number>()
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      buckets.set(monthLabel(d), 0)
    }
    proposals.forEach(p => {
      const label = monthLabel(new Date(p.createdAt))
      if (buckets.has(label)) buckets.set(label, (buckets.get(label) ?? 0) + 1)
    })
    return Array.from(buckets.entries()).map(([month, count]) => ({ month, count }))
  }, [proposals])

  const sectorDistribution = useMemo(() => {
    const counts = new Map<string, number>()
    resources.forEach(r => {
      const sectorName = !r.sector ? 'Non renseigné' : typeof r.sector === 'string' ? r.sector : (r.sector as Sector).name
      counts.set(sectorName, (counts.get(sectorName) ?? 0) + 1)
    })
    return Array.from(counts.entries()).map(([sector, count]) => ({ sector, count })).sort((a, b) => b.count - a.count)
  }, [resources])
  const maxSectorCount = Math.max(1, ...sectorDistribution.map(s => s.count))

  return (
    <DashboardLayout role="agency">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          Statistiques de placement <BarChart3 className="w-5 h-5 text-brand-600" />
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">Mesurez la performance de vos placements et de votre portefeuille</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton variant="card" count={1} />
          </div>
          <div>
            <Skeleton variant="list" count={2} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Charts */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-5">
              <h3 className="font-bold text-slate-900 mb-4">Propositions envoyées par mois</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthlyProposals}>
                  <defs>
                    <linearGradient id="colorPlacements" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 11 }} />
                  <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} fill="url(#colorPlacements)" name="Propositions" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sector distribution */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-4">Portefeuille par secteur</h3>
            {sectorDistribution.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">Aucune ressource enregistrée</p>
            ) : (
              <div className="space-y-4">
                {sectorDistribution.map(s => (
                  <div key={s.sector}>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>{s.sector}</span>
                      <span>{s.count}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="bg-brand-600 h-full rounded-full" style={{ width: `${(s.count / maxSectorCount) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
