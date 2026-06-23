import { useState } from 'react'
import {
  Plus, Search, Filter, MoreVertical,
  Zap, Clock, Users, Eye, Edit3, Trash2, CheckCircle2, AlertCircle
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge, { ContractBadge } from '../../components/ui/Badge'
import { jobs } from '../../data/jobs'

export default function CompanyJobs() {
  const navigate = useNavigate()
  
  const [list, setList] = useState(
    jobs.slice(0, 5).map(j => ({ ...j, activeStatus: true }))
  )
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Toutes')

  const handleDeleteJob = (id: number) => {
    setList(prev => prev.filter(j => j.id !== id))
  }

  const handleToggleActive = (id: number) => {
    setList(prev => prev.map(j => j.id === id ? { ...j, activeStatus: !j.activeStatus } : j))
  }

  const filteredJobs = list.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.city.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (statusFilter === 'Actives') return matchesSearch && job.activeStatus
    if (statusFilter === 'Expirées') return matchesSearch && !job.activeStatus
    return matchesSearch
  })

  return (
    <DashboardLayout role="company" userName="Sonatel Digital" userTitle="Compte Entreprise">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Mes offres d'emploi</h1>
          <p className="text-slate-500 text-sm mt-0.5">Gérez vos publications et suivez les performances</p>
        </div>
        <Button onClick={() => navigate('/dashboard/company/jobs/new')} leftIcon={<Plus className="w-4 h-4" />}>
          Publier une offre
        </Button>
      </div>

      <div className="card">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une offre..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl text-xs px-3 py-2 outline-none cursor-pointer"
            >
              <option value="Toutes">Toutes les offres</option>
              <option value="Actives">Actives</option>
              <option value="Expirées">Expirées</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Offre</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Candidatures</th>
                <th className="px-6 py-4">Vues</th>
                <th className="px-6 py-4">Date limite</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.map(job => (
                <tr key={job.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-slate-800 group-hover:text-brand-600 transition-colors">{job.title}</p>
                      {job.isBoosted && <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <ContractBadge type={job.contractType} />
                      <span className="text-[10px] text-slate-400">{job.city}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggleActive(job.id)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                        job.activeStatus 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {job.activeStatus ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-brand-600" onClick={() => navigate('/dashboard/company/applications')}>
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-700">{job.applicants}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm text-slate-600">{Math.floor(job.applicants * 12.4)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(job.expiresAt).toLocaleDateString('fr-FR')}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                        title="Supprimer l'offre"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredJobs.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400 text-sm">
                    Aucune offre d'emploi publiée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
