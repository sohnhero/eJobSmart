import { useState, useEffect } from 'react'
import {
  Search, Filter, MapPin, Briefcase,
  Clock, Heart, ChevronRight,
  Sparkles, X, CheckCircle2, FileText
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import { ContractBadge } from '../../components/ui/Badge'
import MatchScore from '../../components/ui/MatchScore'
import { useToast } from '../../components/ui/Toast'
import Skeleton from '../../components/ui/Skeleton'
import { matchingService } from '../../lib/services/matching'
import { applicationsService } from '../../lib/services/applications'
import { profilesService } from '../../lib/services/profiles'
import { extractApiErrorMessage } from '../../lib/api'
import { timeAgo } from '../../lib/format'
import type { JobMatch, RemoteType } from '../../lib/types'

export default function CandidateRecommendedJobs() {
  const navigate = useNavigate()
  const toast = useToast()

  const [loading, setLoading] = useState(true)
  const [recommended, setRecommended] = useState<JobMatch[]>([])
  const [cvUrl, setCvUrl] = useState<string | null>(null)
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set())

  const [searchQuery, setSearchQuery] = useState('')
  const [remoteFilter, setRemoteFilter] = useState<RemoteType | 'Tous'>('Tous')
  const [salaryFilter, setSalaryFilter] = useState(2500000)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<'match' | 'recent' | 'salary'>('match')

  const [applyingJob, setApplyingJob] = useState<JobMatch['job'] | null>(null)
  const [coverMessage, setCoverMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      matchingService.recommendedJobs(30).catch(() => []),
      profilesService.me().then(p => p.cvUrl ?? null).catch(() => null),
      applicationsService.mine().then(apps => new Set(apps.map(a => typeof a.job === 'string' ? a.job : a.job._id))).catch(() => new Set<string>()),
    ]).then(([jobs, cv, applied]) => {
      setRecommended(jobs)
      setCvUrl(cv)
      setAppliedJobIds(applied)
      setLoading(false)
    })
  }, [])

  const filteredJobs = recommended
    .filter(({ job }) => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRemote = remoteFilter === 'Tous' || job.remoteType === remoteFilter
      const matchesSalary = !job.salaryMax || job.salaryMax <= salaryFilter || (job.salaryMin ?? 0) <= salaryFilter
      return matchesSearch && matchesRemote && matchesSalary
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.job.postedAt ?? b.job.createdAt).getTime() - new Date(a.job.postedAt ?? a.job.createdAt).getTime()
      if (sortBy === 'salary') return (b.job.salaryMax ?? 0) - (a.job.salaryMax ?? 0)
      return b.score - a.score
    })

  const toggleFavorite = (id: string) => {
    const isFav = favorites.has(id)
    setFavorites(prev => {
      const next = new Set(prev)
      isFav ? next.delete(id) : next.add(id)
      return next
    })
    toast[isFav ? 'info' : 'success'](isFav ? 'Offre retirée de vos favoris.' : 'Offre ajoutée à vos favoris !')
  }

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!applyingJob) return
    setIsSubmitting(true)
    try {
      await applicationsService.apply({ job: applyingJob._id, coverLetter: coverMessage || undefined, cvUrl: cvUrl ?? undefined })
      setIsSuccess(true)
      setAppliedJobIds(prev => new Set(prev).add(applyingJob._id))
      toast.success(`Candidature envoyée avec succès pour le poste chez ${applyingJob.companyName} !`)
      setTimeout(() => closeApplyModal(), 1500)
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Impossible d'envoyer votre candidature"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeApplyModal = () => {
    setApplyingJob(null)
    setCoverMessage('')
    setIsSuccess(false)
  }

  return (
    <DashboardLayout role="candidate">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            Offres recommandées <Sparkles className="w-5 h-5 text-brand-600 fill-brand-600" />
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Sélection calculée à partir de votre profil</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher parmi les offres recommandées..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">{filteredJobs.length} Offres trouvées</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Trier par :</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} className="text-xs font-bold text-slate-700 bg-transparent outline-none">
                <option value="match">Meilleur Matching</option>
                <option value="recent">Plus récentes</option>
                <option value="salary">Salaire élevé</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              <Skeleton variant="card" count={3} />
            </div>
          ) : (
            filteredJobs.map(({ job, score }) => (
              <div
                key={job._id}
                className="card p-5 group hover:border-brand-500 transition-all relative overflow-hidden flex flex-col md:flex-row md:items-start gap-4 animate-fade-in"
              >
                <div className="absolute top-0 right-0 p-4">
                  <MatchScore score={Math.round(score * 100)} />
                </div>

                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center p-2 flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
                  {job.companyLogo ? <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-contain" /> : <Briefcase className="w-5 h-5 text-slate-300" />}
                </div>

                <div className="flex-1 min-w-0 pr-16">
                  <h3
                    onClick={() => navigate(`/jobs/${job._id}`)}
                    className="font-bold text-lg text-slate-900 group-hover:text-brand-600 cursor-pointer transition-colors leading-tight mb-1 truncate"
                  >
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
                    <p className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-slate-400" /> {job.companyName}
                    </p>
                    <p className="text-sm text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400" /> {job.city}
                    </p>
                    <ContractBadge type={job.contractType} />
                  </div>

                  {job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.skills.slice(0, 5).map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-4">
                      {job.isSalaryVisible && job.salaryMin && job.salaryMax && (
                        <span className="text-xs font-bold text-emerald-600">
                          {job.salaryMin.toLocaleString('fr-FR')} - {job.salaryMax.toLocaleString('fr-FR')} {job.currency} / mois
                        </span>
                      )}
                      <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {timeAgo(job.postedAt ?? job.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavorite(job._id)}
                        className={`p-2 rounded-lg transition-colors ${favorites.has(job._id) ? 'text-red-500 bg-red-50' : 'text-slate-400 hover:text-red-500 hover:bg-slate-50'}`}
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      {appliedJobIds.has(job._id) ? (
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 px-3"><CheckCircle2 className="w-3.5 h-3.5" /> Déjà postulé</span>
                      ) : (
                        <Button size="sm" onClick={() => setApplyingJob(job)}>
                          Postuler
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {!loading && filteredJobs.length === 0 && (
            <div className="card p-12 text-center text-slate-400">
              <Briefcase className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-semibold">Aucune offre ne correspond à vos critères de filtrage</p>
            </div>
          )}
        </div>

        {/* Filters Sidebar */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-600" /> Filtres rapides
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Télétravail</label>
                <div className="flex flex-wrap gap-2">
                  {(['Tous', 'Sur site', 'Télétravail', 'Hybride'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setRemoteFilter(mode)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all border ${
                        remoteFilter === mode
                          ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-100'
                          : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-brand-50 hover:text-brand-600'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Salaire max souhaité (FCFA)</label>
                <input
                  type="range"
                  min="500000"
                  max="3000000"
                  step="100000"
                  value={salaryFilter}
                  onChange={e => setSalaryFilter(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-600">
                  <span>500K FCFA</span>
                  <span className="text-brand-600 font-black">{salaryFilter.toLocaleString('fr-FR')} FCFA</span>
                  <span>3M+ FCFA</span>
                </div>
              </div>
            </div>
          </div>

          {!cvUrl && (
            <div className="card p-6 bg-amber-50 border-amber-200">
              <h3 className="font-bold text-amber-900 mb-2">Complétez votre CV</h3>
              <p className="text-xs text-amber-700 mb-4 leading-relaxed">
                Ajoutez votre CV à votre profil pour postuler plus rapidement.
              </p>
              <Button size="sm" fullWidth onClick={() => navigate('/dashboard/candidate/profile', { state: { activeTab: 'cv' } })} rightIcon={<ChevronRight className="w-4 h-4" />}>
                Compléter mon profil
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeApplyModal} />

          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden border border-slate-100">
            {isSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">Candidature envoyée !</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Votre candidature pour le poste de <strong>"{applyingJob.title}"</strong> a été transmise avec succès à {applyingJob.companyName}.
                </p>
                <Button fullWidth onClick={closeApplyModal}>Fermer</Button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit}>
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-slate-900">Postuler à l'offre</h3>
                    <p className="text-xs text-slate-500">{applyingJob.title} · {applyingJob.companyName}</p>
                  </div>
                  <button type="button" onClick={closeApplyModal} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Votre Curriculum Vitae</label>
                    {cvUrl ? (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                        <FileText className="w-8 h-8 text-red-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">{cvUrl.split('/').pop()}</p>
                          <p className="text-[10px] text-slate-400">Document de votre profil</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                        Aucun CV sur votre profil — votre candidature sera envoyée sans CV joint.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Lettre de motivation (Optionnel)</label>
                    <textarea
                      rows={4}
                      value={coverMessage}
                      onChange={e => setCoverMessage(e.target.value)}
                      placeholder="Bonjour, je souhaite postuler à votre offre de..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 resize-none"
                    />
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                  <Button type="button" variant="ghost" size="sm" onClick={closeApplyModal}>Annuler</Button>
                  <Button type="submit" size="sm" loading={isSubmitting}>Envoyer ma candidature</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
