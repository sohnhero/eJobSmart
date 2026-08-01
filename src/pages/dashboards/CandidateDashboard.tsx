import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Briefcase, FileText, Bell,
  ChevronRight, Clock, MapPin, Building2, BookOpen, Sparkles,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Badge, { ContractBadge, StatusBadge } from '../../components/ui/Badge'
import MatchScore from '../../components/ui/MatchScore'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { applicationsService } from '../../lib/services/applications'
import { matchingService } from '../../lib/services/matching'
import { profilesService } from '../../lib/services/profiles'
import { jobAlertsService } from '../../lib/services/job-alerts'
import { jobsService } from '../../lib/services/jobs'
import { trainingsService, enrollmentsService } from '../../lib/services/trainings'
import { TRAINING_FORMAT_LABELS, trainingCoverImage } from '../../lib/training-labels'
import type { Application, JobMatch, JobAlert, Profile, Training } from '../../lib/types'

const IN_PROGRESS_STATUSES = ["En cours d'examen", 'Présélectionnée', 'Test envoyé', 'Offre émise']

export default function CandidateDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [applications, setApplications] = useState<Application[]>([])
  const [recommended, setRecommended] = useState<JobMatch[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [alerts, setAlerts] = useState<JobAlert[]>([])
  const [alertMatches, setAlertMatches] = useState<Record<string, number>>({})
  const [suggestedTraining, setSuggestedTraining] = useState<Training | null>(null)
  const [enrollmentsCount, setEnrollmentsCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      applicationsService.mine().catch(() => []),
      matchingService.recommendedJobs(5).catch(() => []),
      profilesService.me().catch(() => null),
      jobAlertsService.list().catch(() => []),
      trainingsService.list({ limit: 1 }).then(res => res.items[0] ?? null).catch(() => null),
      enrollmentsService.mine().catch(() => []),
    ]).then(([apps, jobs, prof, jobAlerts, training, enrollments]) => {
      if (cancelled) return
      setApplications(apps)
      setRecommended(jobs)
      setProfile(prof)
      setAlerts(jobAlerts)
      setSuggestedTraining(training)
      setEnrollmentsCount(enrollments.length)
      setLoading(false)

      jobAlerts.slice(0, 3).forEach((alert) => {
        void jobsService
          .list({
            sector: alert.sectors.map((s) => (typeof s === 'string' ? s : s._id)),
            contractType: alert.contractTypes.length ? alert.contractTypes : undefined,
            city: alert.city,
            country: alert.country,
            remoteType: alert.remoteType,
            experienceLevel: alert.experienceLevel,
            q: alert.keywords,
            limit: 1,
          })
          .then((res) => {
            if (!cancelled) setAlertMatches((prev) => ({ ...prev, [alert._id]: res.total }))
          })
          .catch(() => {})
      })
    })
    return () => { cancelled = true }
  }, [])

  const profileCompletion = [
    { label: 'Informations personnelles', done: !!profile?.headline, tab: 'info' },
    { label: 'Expériences professionnelles', done: (profile?.experiences.length ?? 0) > 0, tab: 'experience' },
    { label: 'CV uploadé', done: !!profile?.cvUrl, tab: 'cv' },
    { label: 'Compétences renseignées', done: (profile?.skills.length ?? 0) > 0, tab: 'skills' },
    { label: 'Alertes emploi configurées', done: alerts.length > 0, href: '/dashboard/candidate/alerts' },
  ]

  const completionPct = Math.round((profileCompletion.filter(c => c.done).length / profileCompletion.length) * 100)

  const handleCompletionClick = (item: typeof profileCompletion[0]) => {
    if (item.href) {
      navigate(item.href)
    } else if (item.tab) {
      navigate('/dashboard/candidate/profile', { state: { activeTab: item.tab } })
    }
  }

  const handleCompleteProfileClick = () => {
    const nextUnchecked = profileCompletion.find(c => !c.done)
    if (nextUnchecked) {
      handleCompletionClick(nextUnchecked)
    } else {
      navigate('/dashboard/candidate/profile')
    }
  }

  const inReview = applications.filter(a => IN_PROGRESS_STATUSES.includes(a.status)).length
  const interviews = applications.filter(a => a.status === 'Entretien planifié').length

  return (
    <DashboardLayout role="candidate">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <p className="text-blue-200 text-sm font-medium flex items-center gap-2">Bonjour <Sparkles className="w-3.5 h-3.5" /></p>
        <h1 className="text-2xl font-black mt-1 mb-2">{user ? `${user.firstName} ${user.lastName}` : '—'}</h1>
        {profile?.headline && <p className="text-blue-200 text-sm">{profile.headline}{profile.city ? ` · ${profile.city}` : ''}</p>}
        <div className="flex items-center gap-4 mt-4">
          <div>
            <p className="text-3xl font-black">{completionPct}%</p>
            <p className="text-xs text-blue-200">Profil complété</p>
          </div>
          <div className="flex-1 bg-white/20 rounded-full h-2">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${completionPct}%` }} />
          </div>
        </div>
        <p className="text-xs text-blue-200 mt-1.5">{recommended.length} offres correspondent à votre profil</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Candidatures" value={applications.length} icon={FileText} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard title="En examen" value={inReview} icon={Clock} iconBg="bg-amber-50" iconColor="text-amber-600" />
        <StatCard title="Entretiens" value={interviews} icon={Briefcase} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard title="Formations suivies" value={enrollmentsCount} icon={BookOpen} iconBg="bg-purple-50" iconColor="text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          {/* My applications */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900">Mes candidatures récentes</h2>
              <button onClick={() => navigate('/dashboard/candidate/applications')} className="text-xs text-brand-600 font-medium hover:text-brand-800 flex items-center gap-1">
                Toutes <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {loading ? (
              <p className="text-sm text-slate-400 py-6 text-center">Chargement…</p>
            ) : applications.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">Aucune candidature pour l'instant</p>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 4).map(app => {
                  const job = typeof app.job === 'string' ? null : app.job
                  return (
                    <div key={app._id} onClick={() => navigate('/dashboard/candidate/applications')} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        {job?.companyName?.charAt(0) ?? '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-sm text-slate-900 group-hover:text-brand-600 transition-colors">{job?.title ?? 'Offre'}</p>
                          <StatusBadge status={app.status} />
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <Building2 className="w-3 h-3" />{job?.companyName ?? '—'}
                          <span className="text-slate-300 mx-1">·</span>
                          <Clock className="w-3 h-3" />{new Date(app.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Recommended jobs */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900">Offres recommandées</h2>
              <button onClick={() => navigate('/dashboard/candidate/jobs')} className="text-xs text-brand-600 font-medium flex items-center gap-1">
                Voir tout <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {loading ? (
              <p className="text-sm text-slate-400 py-6 text-center">Chargement…</p>
            ) : recommended.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">Complétez votre profil pour recevoir des recommandations</p>
            ) : (
              <div className="space-y-3">
                {recommended.map(({ job, score }) => (
                  <div key={job._id} onClick={() => navigate(`/jobs/${job._id}`)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {job.companyLogo ? <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" /> : <Building2 className="w-4 h-4 text-slate-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-900 group-hover:text-brand-600 transition-colors truncate">{job.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-slate-500">{job.companyName}</p>
                        <ContractBadge type={job.contractType} />
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin className="w-2.5 h-2.5" />{job.city}</p>
                    </div>
                    <MatchScore score={Math.round(score * 100)} size="sm" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Profile completion */}
          <div className="card p-5">
            <h2 className="font-bold text-slate-900 mb-1">Complétez votre profil</h2>
            <p className="text-xs text-slate-400 mb-4">Un profil complet reçoit plus de vues</p>
            <div className="space-y-2.5">
              {profileCompletion.map(item => (
                <div
                  key={item.label}
                  onClick={() => handleCompletionClick(item)}
                  className="flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 p-1 rounded-lg transition-colors group animate-fade-in"
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${item.done ? 'bg-emerald-100 group-hover:bg-emerald-200' : 'bg-slate-100 group-hover:bg-brand-50'}`}>
                    {item.done
                      ? <svg className="w-3 h-3 text-emerald-600 animate-scale-up" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      : <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-brand-400" />
                    }
                  </div>
                  <span className={`text-xs transition-colors group-hover:text-brand-600 ${item.done ? 'text-slate-500 line-through' : 'text-slate-700 font-medium'}`}>{item.label}</span>
                </div>
              ))}
            </div>
            <Button fullWidth size="sm" variant="secondary" className="mt-4" onClick={handleCompleteProfileClick}>
              Compléter mon profil
            </Button>
          </div>

          {/* Alerts */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4 text-brand-600" />
              <h2 className="font-bold text-slate-900">Alertes emploi</h2>
            </div>
            {alerts.length === 0 ? (
              <p className="text-xs text-slate-400 mb-3">Aucune alerte configurée</p>
            ) : (
              <div className="space-y-2.5">
                {alerts.slice(0, 3).map(alert => (
                  <div key={alert._id} onClick={() => navigate('/dashboard/candidate/alerts')} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-brand-50 transition-colors cursor-pointer">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{alert.name || alert.keywords || 'Alerte'}</p>
                      <p className="text-xs text-slate-400">{alert.city || alert.country || 'Tous lieux'}</p>
                    </div>
                    {alertMatches[alert._id] !== undefined && (
                      <span className="text-xs font-bold text-brand-600 bg-brand-100 px-2 py-0.5 rounded-full">
                        {alertMatches[alert._id]} offres
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            <Button fullWidth size="sm" variant="secondary" className="mt-3" onClick={() => navigate('/dashboard/candidate/alerts')}>
              <Bell className="w-3.5 h-3.5" /> {alerts.length > 0 ? 'Gérer mes alertes' : 'Créer une alerte'}
            </Button>
          </div>

          {/* Suggested training */}
          {suggestedTraining && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-purple-600" />
                <h2 className="font-bold text-slate-900">Formation recommandée</h2>
              </div>
              <div onClick={() => navigate(`/trainings/${suggestedTraining._id}`)} className="cursor-pointer group">
                <div className="relative h-28 rounded-xl overflow-hidden mb-3">
                  <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform" style={{ backgroundImage: `url(${trainingCoverImage(suggestedTraining)})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <p className="font-semibold text-sm text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2">{suggestedTraining.title}</p>
                <p className="text-xs text-slate-400 mt-1">{suggestedTraining.instructorName}</p>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="blue" size="sm">{TRAINING_FORMAT_LABELS[suggestedTraining.format]}</Badge>
                  <span className="text-sm font-bold text-slate-900">
                    {suggestedTraining.price === 0 ? <span className="text-emerald-600">Gratuit</span> : `${suggestedTraining.price.toLocaleString('fr-FR')} ${suggestedTraining.currency}`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
