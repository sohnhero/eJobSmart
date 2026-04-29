import {
  Plus, Search, Filter, MoreVertical,
  Zap, Clock, Users, Eye, Edit3, Trash2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge, { ContractBadge } from '../../components/ui/Badge'
import { jobs } from '../../data/jobs'

export default function CompanyJobs() {
  const navigate = useNavigate()
  const companyJobs = jobs.slice(0, 5) // Mocking company jobs

  return (
    <DashboardLayout role="company" userName="Sonatel Digital">
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
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" leftIcon={<Filter className="w-4 h-4" />}>Filtrer</Button>
            <select className="bg-white border border-slate-200 rounded-xl text-xs px-3 py-2 outline-none">
              <option>Toutes les offres</option>
              <option>Actives</option>
              <option>Expirées</option>
              <option>Brouillons</option>
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
              {companyJobs.map(job => (
                <tr key={job.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-slate-800 group-hover:text-brand-600 transition-colors">{job.title}</p>
                      {job.isBoosted && <Zap className="w-3.5 h-3.5 text-amber-500" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <ContractBadge type={job.contractType} />
                      <span className="text-[10px] text-slate-400">{job.city}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="green" size="sm">Active</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
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
                      <button className="p-2 text-slate-400 hover:text-brand-600 transition-colors"><Edit3 className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
