import { useState } from 'react'
import {
  FileText, Clock, Building2, MapPin,
  ChevronRight, Search, Filter, X, Send, Trash2, CheckCircle2, AlertCircle
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { myApplications } from '../../data/candidates'
import MatchScore from '../../components/ui/MatchScore'

export default function CandidateApplications() {
  const navigate = useNavigate()
  const [selectedApp, setSelectedApp] = useState<typeof myApplications[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tous les statuts')

  const filteredApps = myApplications.filter(app => {
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'Tous les statuts' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Timeline phases based on status
  const getTimelineSteps = (status: string) => {
    const baseSteps = [
      { name: 'Candidature reçue', desc: 'Votre CV a été transmis à l\'entreprise.', done: true },
      { name: 'En cours d\'examen', desc: 'Le recruteur étudie votre profil.', done: status !== 'En attente' },
      { name: 'Entretien planifié', desc: 'Échange technique ou RH.', done: status === 'Entretien' || status === 'Vérifié' },
      { name: 'Décision finale', desc: 'Offre d\'embauche ou refus.', done: status === 'Inactif' || status === 'Vérifié' },
    ]
    return baseSteps
  }

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
              <option value="Tous les statuts">Tous les statuts</option>
              <option value="En examen">En examen</option>
              <option value="Entretien">Entretien</option>
              <option value="Vérifié">Vérifié</option>
              <option value="Inactif">Inactif</option>
              <option value="En attente">En attente</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredApps.map(app => (
            <div 
              key={app.id} 
              onClick={() => setSelectedApp(app)}
              className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
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

          {filteredApps.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-semibold">Aucune candidature trouvée</p>
            </div>
          )}
        </div>
      </div>

      {/* Slide-out Drawer */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Overlay */}
            <div 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300" 
              onClick={() => setSelectedApp(null)}
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md transform bg-white shadow-2xl transition-all duration-300 border-l border-slate-200 flex flex-col">
                {/* Header */}
                <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Détails de la candidature</h2>
                    <p className="text-xs text-slate-400 mt-0.5">ID: #{selectedApp.id}429</p>
                  </div>
                  <button 
                    onClick={() => setSelectedApp(null)}
                    className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Job & Company Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                      {selectedApp.company.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{selectedApp.jobTitle}</h3>
                      <p className="text-sm text-slate-600 font-medium">{selectedApp.company}</p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Dakar, Sénégal
                      </p>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Statut actuel</p>
                      <StatusBadge status={selectedApp.status} />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Taux d'adéquation</p>
                      <MatchScore score={selectedApp.matchScore} size="sm" />
                    </div>
                  </div>

                  {/* Progress Timeline */}
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-4">Suivi du recrutement</h4>
                    <div className="space-y-4">
                      {getTimelineSteps(selectedApp.status).map((step, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                              step.done ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400'
                            }`}>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                            {idx < 3 && <div className={`w-0.5 h-10 ${step.done ? 'bg-brand-600' : 'bg-slate-200'}`} />}
                          </div>
                          <div>
                            <p className={`text-xs font-bold ${step.done ? 'text-slate-800' : 'text-slate-400'}`}>
                              {step.name}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recruiter contact */}
                  <div className="bg-brand-50/50 rounded-2xl p-4 border border-brand-100">
                    <h4 className="font-bold text-brand-900 text-xs mb-1.5 flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-brand-600" /> Recruteur en charge
                    </h4>
                    <p className="text-xs text-slate-700 mb-3">
                      Pour toute question concernant cette opportunité, vous pouvez contacter directement le chargé de recrutement de {selectedApp.company}.
                    </p>
                    <Button 
                      size="sm" 
                      fullWidth 
                      onClick={() => navigate('/dashboard/candidate/messages')}
                      leftIcon={<Send className="w-3.5 h-3.5" />}
                    >
                      Envoyer un message
                    </Button>
                  </div>

                  {/* Attachments */}
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-3">Documents transmis</h4>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100 rounded-xl cursor-pointer">
                      <FileText className="w-8 h-8 text-red-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">CV_Amadou_Diallo_2026.pdf</p>
                        <p className="text-[10px] text-slate-400">245 Ko · Document Principal</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:bg-red-50"
                    leftIcon={<Trash2 className="w-4 h-4" />}
                  >
                    Retirer ma candidature
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
