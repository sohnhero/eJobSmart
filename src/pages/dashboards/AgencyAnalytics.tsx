import { useState, useEffect } from 'react'
import {
  BarChart3, Users, Briefcase, TrendingUp, DollarSign, Award, Target
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Skeleton from '../../components/ui/Skeleton'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function AgencyAnalytics() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    { title: 'Taux de Placement', value: '88%', icon: Target, iconColor: 'text-brand-600', trend: 4, trendLabel: 'ce mois' },
    { title: 'Mandats Actifs', value: '14', icon: Briefcase, iconColor: 'text-purple-600' },
    { title: 'Honoraires Cumulés', value: '8.4M', icon: DollarSign, iconColor: 'text-emerald-600', trend: 18, trendLabel: 'FCFA' },
    { title: 'Vivier Qualifié', value: '1,420', icon: Users, iconColor: 'text-amber-500' },
  ]

  const placementData = [
    { month: 'Jan', placements: 4, revenue: 1200000 },
    { month: 'Fev', placements: 6, revenue: 1800000 },
    { month: 'Mar', placements: 5, revenue: 1500000 },
    { month: 'Avr', placements: 8, revenue: 2400000 },
    { month: 'Mai', placements: 11, revenue: 3300000 },
    { month: 'Juin', placements: 14, revenue: 4200000 },
  ]

  const sectorData = [
    { sector: 'Tech', count: 42 },
    { sector: 'Finance', count: 28 },
    { sector: 'Logistique', count: 19 },
    { sector: 'BTP', count: 12 },
  ]

  return (
    <DashboardLayout role="agency" userName="Cabinet Talent RH" userTitle="Directeur Associé">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          Statistiques de placement <BarChart3 className="w-5 h-5 text-brand-600" />
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">Mesurez la performance de vos recrutements et l'évolution de vos honoraires</p>
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
              <h3 className="font-bold text-slate-900 mb-4">Honoraires et placements mensuels</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={placementData}>
                  <defs>
                    <linearGradient id="colorPlacements" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 11 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fill="url(#colorPlacements)" name="Honoraires (FCFA)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sector distribution */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-4">Répartition par secteur</h3>
            <div className="space-y-4">
              {sectorData.map(s => (
                <div key={s.sector}>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>{s.sector}</span>
                    <span>{s.count} recrutés</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-brand-600 h-full rounded-full" style={{ width: `${(s.count / 42) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
