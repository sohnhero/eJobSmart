import { useEffect, useState } from 'react'
import {
  Search, CheckCircle, XCircle, Eye,
  MessageSquare, Calendar, X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import { useToast } from '../../components/ui/Toast'
import { jobsService } from '../../lib/services/jobs'
import { applicationsService } from '../../lib/services/applications'
import { profilesService } from '../../lib/services/profiles'
import { messagesService } from '../../lib/services/messages'
import { uploadsService } from '../../lib/services/uploads'
import { extractApiErrorMessage } from '../../lib/api'
import type { Application, Job, Profile } from '../../lib/types'

interface Row {
  application: Application
  job: Job
}

export default function CompanyApplications() {
  const navigate = useNavigate()
  const toast = useToast()
  const [jobs, setJobs] = useState<Job[]>([])
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [jobFilter, setJobFilter] = useState<string>('Toutes les offres')
  const [selected, setSelected] = useState<Row | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [updating, setUpdating] = useState(false)

  const load = () => {
    setLoading(true)
    jobsService.mine().then(async (myJobs) => {
      setJobs(myJobs)
      const perJob = await Promise.all(
        myJobs.map(job => applicationsService.forJob(job._id).then(res => res.items.map(application => ({ application, job }))).catch(() => [] as Row[]))
      )
      setRows(perJob.flat())
    }).catch(() => setRows([])).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filteredRows = rows.filter(({ application, job }) => {
    const candidate = typeof application.candidate === 'string' ? null : application.candidate
    const candidateName = candidate ? `${candidate.firstName} ${candidate.lastName}` : ''
    const matchesSearch = candidateName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesJob = jobFilter === 'Toutes les offres' || job.title === jobFilter
    return matchesSearch && matchesJob
  })

  const openDrawer = (row: Row) => {
    setSelected(row)
    setSelectedProfile(null)
    const candidateId = typeof row.application.candidate === 'string' ? row.application.candidate : row.application.candidate._id
    profilesService.get(candidateId).then(setSelectedProfile).catch(() => {})
  }

  const handleUpdateStatus = async (id: string, newStatus: 'Présélectionnée' | 'Refusée' | 'Entretien planifié') => {
    setUpdating(true)
    try {
      const updated = await applicationsService.updateStatus(id, { status: newStatus })
      setRows(prev => prev.map(r => r.application._id === id ? { ...r, application: updated } : r))
      if (selected?.application._id === id) setSelected(prev => prev ? { ...prev, application: updated } : null)
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    } finally {
      setUpdating(false)
    }
  }

  const handleMessage = async (row: Row) => {
    try {
      await messagesService.startConversation(row.application._id)
      navigate('/dashboard/company/messages')
    } catch (err) {
      toast.error(extractApiErrorMessage(err, 'Impossible de démarrer la conversation'))
    }
  }

  const candidateOf = (app: Application) => (typeof app.candidate === 'string' ? null : app.candidate)

  return (
    <DashboardLayout role="company">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Candidatures reçues</h1>
        <p className="text-slate-500 text-sm mt-0.5">Gérez et évaluez les profils des candidats</p>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un candidat..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={jobFilter}
              onChange={e => setJobFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl text-xs px-3 py-2 outline-none cursor-pointer"
            >
              <option value="Toutes les offres">Toutes les offres</option>
              {jobs.map(j => <option key={j._id} value={j.title}>{j.title}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Candidat</th>
                <th className="px-6 py-4">Offre visée</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="p-12 text-center text-slate-400 text-sm">Chargement…</td></tr>
              ) : (
                <>
                  {filteredRows.map(({ application, job }) => {
                    const candidate = candidateOf(application)
                    const name = candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Candidat'
                    return (
                      <tr key={application._id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={name} size="sm" />
                            <p className="text-sm font-bold text-slate-800">{name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{job.title}</td>
                        <td className="px-6 py-4 text-xs text-slate-400">
                          {new Date(application.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={application.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button title="Voir le profil" onClick={() => openDrawer({ application, job })} className="p-2 text-slate-400 hover:text-brand-600 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button title="Envoyer un message" onClick={() => handleMessage({ application, job })} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}

                  {filteredRows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-slate-400 text-sm">
                        Aucun candidat trouvé.
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CV Detail Drawer */}
      {selected && (() => {
        const candidate = candidateOf(selected.application)
        const name = candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Candidat'
        return (
          <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelected(null)} />

              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <div className="pointer-events-auto w-screen max-w-lg transform bg-white shadow-2xl transition-all duration-300 border-l border-slate-200 flex flex-col">
                  <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black text-slate-900">Dossier de candidature</h2>
                      <p className="text-xs text-slate-400 mt-0.5">{selected.job.title}</p>
                    </div>
                    <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="flex items-center gap-4">
                      <Avatar name={name} size="lg" />
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">{name}</h3>
                        {selectedProfile?.experienceYears !== undefined && <p className="text-xs text-slate-500 mt-0.5">{selectedProfile.experienceYears} ans d'expérience</p>}
                        <div className="flex flex-col gap-0.5 mt-2 text-xs text-slate-400">
                          {candidate?.email && <span>Email: {candidate.email}</span>}
                          {candidate?.phone && <span>Tél: {candidate.phone}</span>}
                        </div>
                      </div>
                    </div>

                    {selectedProfile?.bio && (
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Profil professionnel</h4>
                        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                          {selectedProfile.bio}
                        </p>
                      </div>
                    )}

                    <div className="card p-4 text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Statut</p>
                      <StatusBadge status={selected.application.status} />
                    </div>

                    {selectedProfile?.skills && selectedProfile.skills.length > 0 && (
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">Compétences clés</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProfile.skills.map(s => (
                            <span key={s} className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-xl border border-brand-100">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selected.application.coverLetter && (
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">Lettre de motivation</h4>
                        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100 whitespace-pre-line">
                          {selected.application.coverLetter}
                        </p>
                      </div>
                    )}

                    {selected.application.cvUrl && (
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">Curriculum Vitae</h4>
                        <button
                          type="button"
                          onClick={() => uploadsService.openFile(selected.application.cvUrl!).catch(err => toast.error(extractApiErrorMessage(err, "Impossible d'ouvrir le CV")))}
                          className="w-full flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 transition-colors text-left"
                        >
                          <div className="w-10 h-10 bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs rounded-xl">
                            CV
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{selected.application.cvUrl.split('/').pop()}</p>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="secondary" loading={updating} leftIcon={<XCircle className="w-4 h-4 text-red-500" />} onClick={() => handleUpdateStatus(selected.application._id, 'Refusée')}>
                        Refuser
                      </Button>
                      <Button size="sm" loading={updating} leftIcon={<CheckCircle className="w-4 h-4 text-emerald-500" />} onClick={() => handleUpdateStatus(selected.application._id, 'Présélectionnée')}>
                        Sélectionner
                      </Button>
                    </div>
                    <Button size="sm" variant="ghost" leftIcon={<Calendar className="w-4 h-4 text-purple-600" />} onClick={() => { void handleUpdateStatus(selected.application._id, 'Entretien planifié'); navigate('/dashboard/company/messages') }}>
                      Entretien
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </DashboardLayout>
  )
}
