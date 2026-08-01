import { useEffect, useState } from 'react'
import {
  Search, FileText,
  TrendingUp, Clock, DollarSign, Briefcase,
  CheckCircle, Zap, X
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/ui/Toast'
import { applicationsService } from '../../lib/services/applications'
import { jobsService } from '../../lib/services/jobs'
import { profilesService } from '../../lib/services/profiles'
import { enrollmentsService } from '../../lib/services/trainings'
import { extractApiErrorMessage } from '../../lib/api'
import type { Application, Availability, Job } from '../../lib/types'

const ACTIVE_STATUSES = ['Présélectionnée', 'Entretien planifié', 'Test envoyé', 'Offre émise']

export default function FreelanceDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()

  const [applications, setApplications] = useState<Application[]>([])
  const [enrollmentsCount, setEnrollmentsCount] = useState(0)
  const [availability, setAvailability] = useState<Availability | null>(null)
  const [loading, setLoading] = useState(true)

  const [showFindModal, setShowFindModal] = useState(false)
  const [missions, setMissions] = useState<Job[]>([])
  const [loadingMissions, setLoadingMissions] = useState(false)
  const [biddingJob, setBiddingJob] = useState<Job | null>(null)
  const [bidRate, setBidRate] = useState('')
  const [bidTime, setBidTime] = useState('')
  const [bidSuccess, setBidSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([
      applicationsService.mine().catch(() => []),
      enrollmentsService.mine().catch(() => []),
      profilesService.me().catch(() => null),
    ]).then(([apps, enrollments, profile]) => {
      setApplications(apps)
      setEnrollmentsCount(enrollments.length)
      setAvailability(profile?.availability ?? null)
      setLoading(false)
    })
  }, [])

  const activeMissions = applications.filter(a => ACTIVE_STATUSES.includes(a.status))
  const interviews = applications.filter(a => a.status === 'Entretien planifié').length

  const stats = [
    { title: 'Missions actives', value: activeMissions.length.toString(), icon: Briefcase, iconColor: 'text-blue-600' },
    { title: 'Propositions envoyées', value: applications.length.toString(), icon: FileText, iconColor: 'text-purple-600' },
    { title: 'Entretiens', value: interviews.toString(), icon: DollarSign, iconColor: 'text-emerald-600' },
    { title: 'Formations suivies', value: enrollmentsCount.toString(), icon: TrendingUp, iconColor: 'text-amber-500' },
  ]

  const toggleAvailability = async () => {
    const next: Availability = availability === 'Immédiate' ? 'En poste' : 'Immédiate'
    try {
      await profilesService.updateMe({ availability: next })
      setAvailability(next)
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    }
  }

  const openFindModal = () => {
    setShowFindModal(true)
    setLoadingMissions(true)
    jobsService.list({ contractType: ['Freelance'], limit: 10 }).then(res => setMissions(res.items)).catch(() => setMissions([])).finally(() => setLoadingMissions(false))
  }

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!biddingJob || !bidRate.trim()) return
    setIsSubmitting(true)
    try {
      await applicationsService.apply({
        job: biddingJob._id,
        coverLetter: `Tarif proposé : ${bidRate} FCFA${bidTime ? ` — Délai de réalisation : ${bidTime}` : ''}`,
      })
      setBidSuccess(true)
      setApplications(prev => [...prev])
      void applicationsService.mine().then(setApplications)
      setTimeout(() => {
        setBidSuccess(false)
        setBiddingJob(null)
        setBidRate('')
        setBidTime('')
      }, 1500)
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Impossible d'envoyer votre proposition"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout role="freelance">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Bienvenue{user ? `, ${user.firstName}` : ''} !</h1>
          <p className="text-slate-500 text-sm mt-0.5">Voici un aperçu de vos missions et opportunités freelance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={openFindModal} leftIcon={<Search className="w-4 h-4" />}>
            Trouver une mission
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" /> Missions Actives
              </h2>
            </div>
            {loading ? (
              <p className="text-sm text-slate-400 text-center py-6">Chargement…</p>
            ) : activeMissions.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">Aucune mission active pour le moment</p>
            ) : (
              <div className="space-y-4">
                {activeMissions.map(app => {
                  const job = typeof app.job === 'string' ? null : app.job
                  return (
                    <div key={app._id} onClick={() => navigate('/dashboard/freelance/proposals')} className="p-4 border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/30 transition-all group cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{job?.title ?? 'Mission'}</h3>
                          <p className="text-xs text-slate-500">{job?.companyName}</p>
                        </div>
                        <Badge variant="amber">{app.status}</Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="card p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2 text-white">Boostez votre profil Freelance !</h3>
              <p className="text-blue-100 text-sm mb-4 max-w-md">Ajoutez vos dernières réalisations à votre portfolio pour attirer plus d'entreprises.</p>
              <Button variant="white" size="sm" onClick={() => navigate('/dashboard/freelance/profile')}>Mettre à jour mon portfolio</Button>
            </div>
            <TrendingUp className="absolute -bottom-6 -right-6 w-32 h-32 text-blue-500/20 rotate-12" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-4 text-sm">Disponibilité</h3>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${availability === 'Immédiate' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className="text-xs font-semibold text-slate-700">
                  {availability || 'Non renseignée'}
                </span>
              </div>
              <button onClick={toggleAvailability} className="text-[10px] text-brand-600 font-bold hover:underline">
                Modifier
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Find Missions Catalog Modal */}
      {showFindModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowFindModal(false)} />

          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-slate-900">Missions Freelance</h3>
              <button onClick={() => setShowFindModal(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {loadingMissions ? (
                <p className="text-sm text-slate-400 text-center py-6">Chargement…</p>
              ) : missions.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">Aucune mission freelance disponible pour le moment</p>
              ) : (
                missions.map(m => (
                  <div key={m._id} className="p-4 border border-slate-200 rounded-2xl hover:border-brand-500 hover:bg-brand-50/5 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-800">{m.title}</h4>
                        <p className="text-xs text-slate-500 mb-2">{m.companyName}</p>
                      </div>
                      {m.isSalaryVisible && m.salaryMax && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                          {m.salaryMax.toLocaleString('fr-FR')} FCFA
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mb-4 line-clamp-2">{m.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {m.city}</span>
                      <Button size="sm" onClick={() => setBiddingJob(m)}>Proposer mes services</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bidding dialog modal */}
      {biddingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setBiddingJob(null)} />

          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden border border-slate-100 p-6 text-center">
            {bidSuccess ? (
              <div>
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-1">Offre transmise !</h4>
                <p className="text-xs text-slate-500">Votre proposition a été soumise au client.</p>
              </div>
            ) : (
              <form onSubmit={handleBidSubmit} className="space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                  <h4 className="font-black text-slate-900 text-sm">Formuler ma proposition</h4>
                  <button type="button" onClick={() => setBiddingJob(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                </div>
                <p className="text-xs text-slate-500">Poste: <strong>{biddingJob.title}</strong> chez {biddingJob.companyName}</p>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Votre tarif souhaité (FCFA)</label>
                  <input
                    type="text" placeholder="ex: 400,000" required
                    value={bidRate} onChange={e => setBidRate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Temps de réalisation</label>
                  <input
                    type="text" placeholder="ex: 5 jours, 2 semaines"
                    value={bidTime} onChange={e => setBidTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setBiddingJob(null)} className="flex-1">Annuler</Button>
                  <Button type="submit" size="sm" loading={isSubmitting} className="flex-1">Soumettre</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
