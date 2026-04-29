import { useNavigate } from 'react-router-dom'
import {
  Briefcase, FileText, TrendingUp, Eye, Bell, Star,
  ChevronRight, Clock, MapPin, Building2, BookOpen, ArrowUpRight,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Badge, { ContractBadge, StatusBadge } from '../../components/ui/Badge'
import MatchScore from '../../components/ui/MatchScore'
import Button from '../../components/ui/Button'
import { jobs } from '../../data/jobs'
import { myApplications } from '../../data/candidates'
import { dashboardStats } from '../../data/stats'
import { trainings } from '../../data/trainings'

const profileCompletion = [
  { label: 'Photo de profil', done: true },
  { label: 'Informations personnelles', done: true },
  { label: 'Expériences professionnelles', done: true },
  { label: 'CV uploadé', done: false },
  { label: 'Compétences renseignées', done: true },
  { label: 'Alertes emploi configurées', done: false },
]

export default function CandidateDashboard() {
  const navigate = useNavigate()
  const stats = dashboardStats.candidate
  const recommendedJobs = jobs.slice(0, 5)

  return (
    <DashboardLayout role="candidate" userName="Amadou Diallo">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <p className="text-blue-200 text-sm font-medium">Bonjour 👋</p>
        <h1 className="text-2xl font-black mt-1 mb-2">Amadou Diallo</h1>
        <p className="text-blue-200 text-sm">Développeur Full Stack · Dakar, Sénégal</p>
        <div className="flex items-center gap-4 mt-4">
          <div>
            <p className="text-3xl font-black">{stats.profileScore}%</p>
            <p className="text-xs text-blue-200">Profil complété</p>
          </div>
          <div className="flex-1 bg-white/20 rounded-full h-2">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${stats.profileScore}%` }} />
          </div>
        </div>
        <p className="text-xs text-blue-200 mt-1.5">{stats.matchingJobs} offres correspondent à votre profil</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Candidatures" value={stats.applicationsSent} icon={FileText} trend={12} trendLabel="ce mois" iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard title="En examen" value={stats.inReview} icon={Clock} iconBg="bg-amber-50" iconColor="text-amber-600" />
        <StatCard title="Entretiens" value={stats.interviews} icon={Briefcase} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard title="Vues profil" value={stats.profileViews} icon={Eye} trend={34} trendLabel="7 jours" iconBg="bg-purple-50" iconColor="text-purple-600" />
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
            <div className="space-y-3">
              {myApplications.slice(0, 4).map(app => (
                <div key={app.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {app.company.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-sm text-slate-900 group-hover:text-brand-600 transition-colors">{app.jobTitle}</p>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />{app.company}
                      <span className="text-slate-300 mx-1">·</span>
                      <Clock className="w-3 h-3" />{new Date(app.appliedAt).toLocaleDateString('fr-FR')}
                    </p>
                    {app.nextStep && (
                      <p className="text-xs text-slate-400 mt-1 truncate">{app.nextStep}</p>
                    )}
                  </div>
                  <MatchScore score={app.matchScore} size="sm" showLabel={false} />
                </div>
              ))}
            </div>
          </div>

          {/* Recommended jobs */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900">Offres recommandées</h2>
              <button onClick={() => navigate('/jobs')} className="text-xs text-brand-600 font-medium flex items-center gap-1">
                Voir tout <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-3">
              {recommendedJobs.map((job, i) => (
                <div key={job.id} onClick={() => navigate(`/jobs/${job.id}`)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                  <img src={job.companyLogo} alt={job.company} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 group-hover:text-brand-600 transition-colors truncate">{job.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-slate-500">{job.company}</p>
                      <ContractBadge type={job.contractType} />
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin className="w-2.5 h-2.5" />{job.city}</p>
                  </div>
                  <MatchScore score={95 - i * 3} size="sm" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Profile completion */}
          <div className="card p-5">
            <h2 className="font-bold text-slate-900 mb-1">Complétez votre profil</h2>
            <p className="text-xs text-slate-400 mb-4">Un profil complet reçoit 3× plus de vues</p>
            <div className="space-y-2.5">
              {profileCompletion.map(item => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                    {item.done
                      ? <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      : <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    }
                  </div>
                  <span className={`text-xs ${item.done ? 'text-slate-600 line-through' : 'text-slate-700 font-medium'}`}>{item.label}</span>
                </div>
              ))}
            </div>
            <Button fullWidth size="sm" variant="secondary" className="mt-4">
              Compléter mon profil
            </Button>
          </div>

          {/* Alerts */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4 text-brand-600" />
              <h2 className="font-bold text-slate-900">Alertes emploi</h2>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'React Developer', count: 12, sector: 'Tech' },
                { label: 'Full Stack + Dakar', count: 8, sector: 'Tech' },
                { label: 'CDI + Télétravail', count: 23, sector: 'Tous' },
              ].map(alert => (
                <div key={alert.label} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-brand-50 transition-colors cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{alert.label}</p>
                    <p className="text-xs text-slate-400">{alert.sector}</p>
                  </div>
                  <span className="text-xs font-bold text-brand-600 bg-brand-100 px-2 py-0.5 rounded-full">
                    {alert.count} nouvelles
                  </span>
                </div>
              ))}
            </div>
            <Button fullWidth size="sm" variant="secondary" className="mt-3">
              <Bell className="w-3.5 h-3.5" /> Créer une alerte
            </Button>
          </div>

          {/* Suggested training */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <h2 className="font-bold text-slate-900">Formation recommandée</h2>
            </div>
            {trainings.slice(0, 1).map(t => (
              <div key={t.id} onClick={() => navigate(`/trainings/${t.id}`)} className="cursor-pointer group">
                <div className="relative h-28 rounded-xl overflow-hidden mb-3">
                  <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform" style={{ backgroundImage: `url(${t.thumbnail})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-white font-semibold">{t.rating}</span>
                  </div>
                </div>
                <p className="font-semibold text-sm text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2">{t.title}</p>
                <p className="text-xs text-slate-400 mt-1">{t.instructor}</p>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="blue" size="sm">{t.format}</Badge>
                  <span className="text-sm font-bold text-slate-900">
                    {t.price === 0 ? <span className="text-emerald-600">Gratuit</span> : `${t.price.toLocaleString('fr-FR')} FCFA`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
