import { useEffect, useState } from 'react'
import {
  FileText, Clock, Building2, MapPin,
  ChevronRight, Search, X, Send, Trash2, CheckCircle2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { StatusBadge } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { applicationsService } from '../../lib/services/applications'
import { uploadsService } from '../../lib/services/uploads'
import { useToast } from '../../components/ui/Toast'
import { extractApiErrorMessage } from '../../lib/api'
import type { Application, ApplicationStatus, Job } from '../../lib/types'

const STATUS_OPTIONS: ApplicationStatus[] = [
  'Reçue', "En cours d'examen", 'Présélectionnée', 'Entretien planifié',
  'Test envoyé', 'Offre émise', 'Acceptée', 'Refusée', 'Annulée',
]

const TERMINAL_STATUSES: ApplicationStatus[] = ['Acceptée', 'Refusée', 'Annulée']

function getTimelineSteps(status: ApplicationStatus) {
  const reachedReview = status !== 'Reçue'
  const reachedInterview = ['Entretien planifié', 'Test envoyé', 'Offre émise', 'Acceptée', 'Refusée'].includes(status)
  const reachedDecision = ['Acceptée', 'Refusée'].includes(status)
  return [
    { name: 'Candidature reçue', desc: 'Votre CV a été transmis à l\'entreprise.', done: true },
    { name: "En cours d'examen", desc: 'Le recruteur étudie votre profil.', done: reachedReview },
    { name: 'Entretien planifié', desc: 'Échange technique ou RH.', done: reachedInterview },
    { name: 'Décision finale', desc: "Offre d'embauche ou refus.", done: reachedDecision },
  ]
}

export default function CandidateApplications() {
  const navigate = useNavigate()
  const toast = useToast()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'Tous les statuts' | ApplicationStatus>('Tous les statuts')
  const [cancelling, setCancelling] = useState(false)

  const load = () => {
    setLoading(true)
    applicationsService.mine().then(setApplications).catch(() => setApplications([])).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const jobOf = (app: Application): Job | null => (typeof app.job === 'string' ? null : app.job)

  const filteredApps = applications.filter(app => {
    const job = jobOf(app)
    const matchesSearch =
      (job?.title ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job?.companyName ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'Tous les statuts' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleWithdraw = async () => {
    if (!selectedApp) return
    setCancelling(true)
    try {
      await applicationsService.cancel(selectedApp._id)
      toast.success('Candidature retirée')
      setSelectedApp(null)
      load()
    } catch (err) {
      toast.error(extractApiErrorMessage(err, 'Impossible de retirer cette candidature'))
    } finally {
      setCancelling(false)
    }
  }

  return (
    <DashboardLayout role="candidate">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Mes candidatures</h1>
        <p className="text-slate-500 text-sm mt-0.5">Suivez l'état de vos demandes d'emploi</p>
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
              onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
              className="bg-white border border-slate-200 rounded-xl text-xs px-3 py-2 outline-none cursor-pointer"
            >
              <option value="Tous les statuts">Tous les statuts</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">Chargement…</div>
          ) : (
            <>
              {filteredApps.map(app => {
                const job = jobOf(app)
                return (
                  <div
                    key={app._id}
                    onClick={() => setSelectedApp(app)}
                    className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                        {(job?.companyName ?? '?').charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{job?.title ?? 'Offre'}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> {job?.companyName ?? '—'}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Postulé le {new Date(app.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <StatusBadge status={app.status} />
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-600 transition-colors" />
                    </div>
                  </div>
                )
              })}

              {filteredApps.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-semibold">Aucune candidature trouvée</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Slide-out Drawer */}
      {selectedApp && (() => {
        const job = jobOf(selectedApp)
        return (
          <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300" onClick={() => setSelectedApp(null)} />

              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <div className="pointer-events-auto w-screen max-w-md transform bg-white shadow-2xl transition-all duration-300 border-l border-slate-200 flex flex-col">
                  <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black text-slate-900">Détails de la candidature</h2>
                    </div>
                    <button onClick={() => setSelectedApp(null)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                        {(job?.companyName ?? '?').charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{job?.title ?? 'Offre'}</h3>
                        <p className="text-sm text-slate-600 font-medium">{job?.companyName ?? '—'}</p>
                        {job && (
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {job.city}, {job.country}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Statut actuel</p>
                        <StatusBadge status={selectedApp.status} />
                      </div>
                      {selectedApp.interviewAt && (
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Entretien</p>
                          <p className="text-xs font-semibold text-slate-700">{new Date(selectedApp.interviewAt).toLocaleString('fr-FR')}</p>
                        </div>
                      )}
                    </div>

                    {selectedApp.rejectionReason && (
                      <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                        <p className="text-xs font-bold text-red-700 mb-1">Motif</p>
                        <p className="text-xs text-red-700">{selectedApp.rejectionReason}</p>
                      </div>
                    )}

                    <div>
                      <h4 className="font-bold text-slate-800 text-sm mb-4">Suivi du recrutement</h4>
                      <div className="space-y-4">
                        {getTimelineSteps(selectedApp.status).map((step, idx) => (
                          <div key={idx} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </div>
                              {idx < 3 && <div className={`w-0.5 h-10 ${step.done ? 'bg-brand-600' : 'bg-slate-200'}`} />}
                            </div>
                            <div>
                              <p className={`text-xs font-bold ${step.done ? 'text-slate-800' : 'text-slate-400'}`}>{step.name}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{step.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-brand-50/50 rounded-2xl p-4 border border-brand-100">
                      <h4 className="font-bold text-brand-900 text-xs mb-1.5 flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5 text-brand-600" /> Recruteur en charge
                      </h4>
                      <p className="text-xs text-slate-700 mb-3">
                        Pour toute question concernant cette opportunité, contactez directement le recruteur de {job?.companyName ?? "l'entreprise"}.
                      </p>
                      <Button size="sm" fullWidth onClick={() => navigate('/dashboard/candidate/messages')} leftIcon={<Send className="w-3.5 h-3.5" />}>
                        Envoyer un message
                      </Button>
                    </div>

                    {selectedApp.coverLetter && (
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-3">Lettre de motivation</h4>
                        <p className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 leading-relaxed">{selectedApp.coverLetter}</p>
                      </div>
                    )}

                    {selectedApp.cvUrl && (
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-3">Documents transmis</h4>
                        <button
                          type="button"
                          onClick={() => uploadsService.openFile(selectedApp.cvUrl!).catch(err => toast.error(extractApiErrorMessage(err, "Impossible d'ouvrir le CV")))}
                          className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100 rounded-xl text-left"
                        >
                          <FileText className="w-8 h-8 text-red-500" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">{selectedApp.cvUrl.split('/').pop()}</p>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>

                  {!TERMINAL_STATUSES.includes(selectedApp.status) && (
                    <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
                      <Button variant="ghost" size="sm" loading={cancelling} className="text-red-600 hover:bg-red-50" leftIcon={<Trash2 className="w-4 h-4" />} onClick={handleWithdraw}>
                        Retirer ma candidature
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </DashboardLayout>
  )
}
