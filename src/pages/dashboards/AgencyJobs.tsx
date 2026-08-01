import { useEffect, useState } from 'react'
import {
  Search, Briefcase,
  Users, X, Send, MapPin,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import { StatusBadge, ContractBadge } from '../../components/ui/Badge'
import { useToast } from '../../components/ui/Toast'
import { jobsService } from '../../lib/services/jobs'
import { agencyResourcesService } from '../../lib/services/agency-resources'
import { extractApiErrorMessage } from '../../lib/api'
import type { AgencyResource, Job, ResourceProposal } from '../../lib/types'

export default function AgencyJobs() {
  const navigate = useNavigate()
  const toast = useToast()
  const [tab, setTab] = useState<'browse' | 'mine'>('browse')
  const [query, setQuery] = useState('')
  const [jobs, setJobs] = useState<Job[]>([])
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [proposals, setProposals] = useState<ResourceProposal[]>([])
  const [loadingProposals, setLoadingProposals] = useState(true)

  const [proposingJob, setProposingJob] = useState<Job | null>(null)
  const [resources, setResources] = useState<AgencyResource[]>([])
  const [selectedResourceId, setSelectedResourceId] = useState('')
  const [proposalMessage, setProposalMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLoadingJobs(true)
    jobsService.list({ q: query || undefined, limit: 30 }).then(res => setJobs(res.items)).catch(() => setJobs([])).finally(() => setLoadingJobs(false))
  }, [query])

  const loadProposals = () => {
    setLoadingProposals(true)
    agencyResourcesService.myProposals().then(setProposals).catch(() => setProposals([])).finally(() => setLoadingProposals(false))
  }
  useEffect(loadProposals, [])

  const proposedJobIds = new Set(proposals.map(p => typeof p.job === 'string' ? p.job : p.job._id))

  const openProposeModal = (job: Job) => {
    setProposingJob(job)
    setSelectedResourceId('')
    setProposalMessage('')
    agencyResourcesService.mine({ limit: 100, status: 'Disponible' }).then(res => setResources(res.items)).catch(() => setResources([]))
  }

  const handlePropose = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!proposingJob || !selectedResourceId) return
    setSubmitting(true)
    try {
      await agencyResourcesService.propose(selectedResourceId, proposingJob._id, proposalMessage || undefined)
      toast.success('Candidat proposé avec succès !')
      setProposingJob(null)
      loadProposals()
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Impossible d'envoyer la proposition"))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout role="agency">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Offres de placement</h1>
          <p className="text-slate-500 text-sm mt-0.5">Proposez vos ressources sur les offres ouvertes de la plateforme</p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/dashboard/agency/resources')} leftIcon={<Users className="w-4 h-4" />}>
          Mon portefeuille
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('browse')} className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${tab === 'browse' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
          Offres disponibles
        </button>
        <button onClick={() => setTab('mine')} className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${tab === 'mine' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
          Mes propositions
        </button>
      </div>

      {tab === 'browse' && (
        <div className="card">
          <div className="p-4 border-b border-slate-100">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par poste ou entreprise..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Poste & Entreprise</th>
                  <th className="px-6 py-4">Contrat</th>
                  <th className="px-6 py-4">Lieu</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingJobs ? (
                  <tr><td colSpan={4} className="p-12 text-center text-slate-400 text-sm">Chargement…</td></tr>
                ) : jobs.length === 0 ? (
                  <tr><td colSpan={4} className="p-12 text-center text-slate-400 text-sm">Aucune offre trouvée.</td></tr>
                ) : (
                  jobs.map(job => (
                    <tr key={job._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 cursor-pointer" onClick={() => navigate(`/jobs/${job._id}`)}>
                        <p className="text-sm font-bold text-slate-800 group-hover:text-brand-600">{job.title}</p>
                        <p className="text-xs text-slate-400">{job.companyName}</p>
                      </td>
                      <td className="px-6 py-4"><ContractBadge type={job.contractType} /></td>
                      <td className="px-6 py-4 text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{job.city}</td>
                      <td className="px-6 py-4 text-right">
                        {proposedJobIds.has(job._id) ? (
                          <span className="text-xs font-semibold text-emerald-600">Déjà proposé</span>
                        ) : (
                          <Button size="sm" onClick={() => openProposeModal(job)} leftIcon={<Send className="w-3.5 h-3.5" />}>Proposer</Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'mine' && (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Candidat proposé</th>
                  <th className="px-6 py-4">Offre</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Envoyée le</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingProposals ? (
                  <tr><td colSpan={4} className="p-12 text-center text-slate-400 text-sm">Chargement…</td></tr>
                ) : proposals.length === 0 ? (
                  <tr><td colSpan={4} className="p-12 text-center text-slate-400 text-sm">Aucune proposition envoyée.</td></tr>
                ) : (
                  proposals.map(p => {
                    const resource = typeof p.resource === 'string' ? null : p.resource
                    const job = typeof p.job === 'string' ? null : p.job
                    return (
                      <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-800">{resource ? `${resource.firstName} ${resource.lastName}` : 'Ressource'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-600">{job?.title ?? '—'}</p>
                          <p className="text-xs text-slate-400">{job?.companyName}</p>
                        </td>
                        <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                        <td className="px-6 py-4 text-xs text-slate-400">{new Date(p.createdAt).toLocaleDateString('fr-FR')}</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Propose Modal */}
      {proposingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setProposingJob(null)} />
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden border border-slate-100">
            <form onSubmit={handlePropose}>
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-slate-900 flex items-center gap-2"><Briefcase className="w-4 h-4 text-brand-600" /> Proposer un candidat</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{proposingJob.title} — {proposingJob.companyName}</p>
                </div>
                <button type="button" onClick={() => setProposingJob(null)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Ressource du portefeuille</label>
                  <select required value={selectedResourceId} onChange={e => setSelectedResourceId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer">
                    <option value="">Sélectionner un candidat</option>
                    {resources.map(r => <option key={r._id} value={r._id}>{r.firstName} {r.lastName} — {r.headline}</option>)}
                  </select>
                  {resources.length === 0 && <p className="text-[11px] text-amber-600 mt-1">Aucune ressource disponible dans votre portefeuille</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Message (optionnel)</label>
                  <textarea rows={3} value={proposalMessage} onChange={e => setProposalMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 resize-none" />
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setProposingJob(null)}>Annuler</Button>
                <Button type="submit" size="sm" loading={submitting} disabled={!selectedResourceId}>Envoyer la proposition</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
