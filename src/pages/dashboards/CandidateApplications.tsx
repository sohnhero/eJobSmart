import {
  FileText, Clock, Building2, MapPin,
  ChevronRight, Search, Filter,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import { myApplications } from '../../data/candidates'
import MatchScore from '../../components/ui/MatchScore'

export default function CandidateApplications() {
  return (
    <DashboardLayout role="candidate" userName="Amadou Diallo">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Mes candidatures</h1>
        <p className="text-slate-500 text-sm mt-0.5">Suivez l'état de vos demandes d'emploi en temps réel</p>
      </div>

      <div className="card">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une candidature..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <select className="bg-white border border-slate-200 rounded-xl text-xs px-3 py-2 outline-none">
              <option>Tous les statuts</option>
              <option>En examen</option>
              <option>Entretien</option>
              <option>Refusé</option>
            </select>
            <button className="p-2 text-slate-400 hover:text-slate-600"><Filter className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {myApplications.map(app => (
            <div key={app.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-brand-600 font-black text-lg flex-shrink-0">
                  {app.company.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{app.jobTitle}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> {app.company}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Postulé le {new Date(app.appliedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  {app.nextStep && (
                    <p className="text-[11px] text-brand-600 font-medium mt-2 bg-brand-50 px-2 py-0.5 rounded-lg inline-block">
                      Prochaine étape : {app.nextStep}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center hidden md:block">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Matching</p>
                  <MatchScore score={app.matchScore} size="sm" />
                </div>
                <div className="text-right">
                  <StatusBadge status={app.status} />
                  <p className="text-[10px] text-slate-400 mt-1">ID: #{app.id}429</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
