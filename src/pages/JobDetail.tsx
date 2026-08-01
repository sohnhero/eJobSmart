import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  MapPin, Users, Bookmark, Share2, Building2,
  CheckCircle, ArrowLeft, Briefcase, GraduationCap,
  Globe, DollarSign, Calendar, Send, X, Upload, Zap, Flag,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'
import Badge, { ContractBadge } from '../components/ui/Badge'
import { jobsService } from '../lib/services/jobs'
import { applicationsService } from '../lib/services/applications'
import { uploadsService } from '../lib/services/uploads'
import { reportsService } from '../lib/services/reports'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import { extractApiErrorMessage } from '../lib/api'
import type { Job, Sector } from '../lib/types'

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const toast = useToast()

  const [job, setJob] = useState<Job | null>(null)
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [saved, setSaved] = useState(false)
  const [applyModal, setApplyModal] = useState(false)
  const [applied, setApplied] = useState(false)
  const [applying, setApplying] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [preselectAnswers, setPreselectAnswers] = useState<Record<string, string>>({})
  const [reporting, setReporting] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportSent, setReportSent] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    jobsService
      .getPublic(id)
      .then((data) => {
        if (cancelled) return
        setJob(data)
        const sectorId = typeof data.sector === 'string' ? data.sector : data.sector._id
        void jobsService
          .list({ sector: [sectorId], limit: 4 })
          .then((res) => setRelatedJobs(res.items.filter((j) => j._id !== data._id).slice(0, 3)))
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const canApply = isAuthenticated && (user?.role === 'candidate' || user?.role === 'freelance')

  const handleOpenApply = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/jobs/${id}` } })
      return
    }
    setApplyModal(true)
  }

  const handleApply = async () => {
    if (!job) return
    setApplying(true)
    try {
      let cvUrl: string | undefined
      if (cvFile) {
        cvUrl = await uploadsService.uploadCv(cvFile)
      }
      await applicationsService.apply({
        job: job._id,
        coverLetter: coverLetter || undefined,
        cvUrl,
        preselectAnswers: job.preselectQuestions.length
          ? job.preselectQuestions.map((question) => ({ question, answer: preselectAnswers[question] ?? '' }))
          : undefined,
      })
      setApplied(true)
      setTimeout(() => {
        setApplyModal(false)
        setApplied(false)
      }, 2000)
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Impossible d'envoyer votre candidature"))
    } finally {
      setApplying(false)
    }
  }

  const handleReport = async () => {
    if (!job || !reportReason.trim()) return
    try {
      await reportsService.create(job._id, reportReason.trim())
      setReportSent(true)
      toast.success('Signalement envoyé, merci')
      setTimeout(() => { setReporting(false); setReportSent(false); setReportReason('') }, 1500)
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Impossible d'envoyer le signalement"))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-slate-400">Chargement…</div>
        <Footer />
      </div>
    )
  }

  if (notFound || !job) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-slate-500">Cette offre n'existe pas ou n'est plus disponible.</p>
          <Button className="mt-4" onClick={() => navigate('/jobs')}>Voir les offres</Button>
        </div>
        <Footer />
      </div>
    )
  }

  const sectorName = typeof job.sector === 'string' ? '' : (job.sector as Sector).name

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour aux offres
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Header card */}
            <div className="card p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {job.companyLogo ? <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" /> : <Building2 className="w-7 h-7 text-slate-300" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-xl font-bold text-slate-900 leading-tight">{job.title}</h1>
                      <p className="text-slate-600 mt-1 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4" />
                        <span className="font-medium">{job.companyName}</span>
                        {sectorName && <><span className="text-slate-400">•</span><span className="text-slate-500">{sectorName}</span></>}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setSaved(!saved)}
                        className={`p-2.5 rounded-xl border-2 transition-all ${saved ? 'border-brand-200 bg-brand-50 text-brand-600' : 'border-slate-200 hover:border-brand-300 text-slate-400'}`}
                      >
                        <Bookmark className={`w-5 h-5 ${saved ? 'fill-brand-600' : ''}`} />
                      </button>
                      <button onClick={() => navigator.share ? navigator.share({ title: job.title, url: window.location.href }).catch(() => {}) : navigator.clipboard.writeText(window.location.href).then(() => toast.info('Lien copié'))} className="p-2.5 rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-400 transition-all">
                        <Share2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => setReporting(true)} className="p-2.5 rounded-xl border-2 border-slate-200 hover:border-red-300 hover:text-red-500 text-slate-400 transition-all">
                        <Flag className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <ContractBadge type={job.contractType} />
                    <Badge variant="slate">{job.remoteType}</Badge>
                    <Badge variant="blue">{job.experienceLevel}</Badge>
                    {job.isBoosted && (
                      <Badge variant="amber" className="flex items-center gap-1">
                        <Zap className="w-3 h-3" /> En vedette
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100">
                    {[
                      { icon: MapPin, label: 'Localisation', value: `${job.city}, ${job.country}` },
                      { icon: DollarSign, label: 'Salaire', value: job.isSalaryVisible && job.salaryMin && job.salaryMax ? `${(job.salaryMin / 1000).toFixed(0)}K — ${(job.salaryMax / 1000).toFixed(0)}K ${job.currency}` : 'Non communiqué' },
                      { icon: Users, label: 'Candidats', value: `${job.applicantsCount} candidatures` },
                      { icon: Calendar, label: 'Publiée le', value: job.postedAt ? new Date(job.postedAt).toLocaleDateString('fr-FR') : '—' },
                    ].map(item => (
                      <div key={item.label}>
                        <p className="text-xs text-slate-400 flex items-center gap-1"><item.icon className="w-3 h-3" />{item.label}</p>
                        <p className="text-sm font-semibold text-slate-800 mt-0.5">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="font-bold text-slate-900 text-lg mb-4">Description du poste</h2>
              <p className="text-slate-600 leading-relaxed">{job.description}</p>

              <h3 className="font-semibold text-slate-900 mt-6 mb-3">Missions & Responsabilités</h3>
              <ul className="space-y-2.5">
                {job.missions.map((m, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                    {m}
                  </li>
                ))}
              </ul>

              <h3 className="font-semibold text-slate-900 mt-6 mb-3">Profil recherché</h3>
              <ul className="space-y-2.5">
                {job.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-600 flex-shrink-0 mt-2" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div className="card p-6">
              <h2 className="font-bold text-slate-900 text-lg mb-4">Compétences requises</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-brand-50 text-brand-700 rounded-lg text-sm font-medium border border-brand-100">
                    {skill}
                  </span>
                ))}
              </div>

              {job.languages.length > 0 && (
                <>
                  <h3 className="font-semibold text-slate-900 mt-5 mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-500" /> Langues
                  </h3>
                  <div className="flex gap-2">
                    {job.languages.map(lang => <Badge key={lang} variant="slate">{lang}</Badge>)}
                  </div>
                </>
              )}
            </div>

            {/* Related jobs */}
            {relatedJobs.length > 0 && (
              <div>
                <h2 className="font-bold text-slate-900 text-lg mb-4">Offres similaires</h2>
                <div className="space-y-3">
                  {relatedJobs.map(rj => (
                    <div key={rj._id} onClick={() => navigate(`/jobs/${rj._id}`)} className="card p-4 cursor-pointer hover:-translate-y-0.5 transition-all group flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {rj.companyLogo ? <img src={rj.companyLogo} alt={rj.companyName} className="w-full h-full object-cover" /> : <Building2 className="w-4 h-4 text-slate-300" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-slate-900 group-hover:text-brand-600 transition-colors">{rj.title}</p>
                        <p className="text-xs text-slate-500">{rj.companyName} · {rj.city}</p>
                      </div>
                      <ContractBadge type={rj.contractType} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Apply card */}
            <div className="card p-5 sticky top-24">
              {job.expiresAt && (
                <div className="flex items-center justify-end mb-4">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Expire le</p>
                    <p className="text-sm font-semibold text-amber-600">{new Date(job.expiresAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              )}

              {canApply ? (
                <Button fullWidth size="lg" onClick={handleOpenApply} className="mb-3">
                  <Send className="w-4 h-4" />
                  Postuler maintenant
                </Button>
              ) : !isAuthenticated ? (
                <Button fullWidth size="lg" onClick={handleOpenApply} className="mb-3">
                  Se connecter pour postuler
                </Button>
              ) : null}
              <Button fullWidth size="md" variant="secondary" onClick={() => setSaved(!saved)}>
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-brand-600' : ''}`} />
                {saved ? 'Sauvegardée' : 'Sauvegarder'}
              </Button>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5">
                {[
                  { icon: Briefcase, label: 'Contrat', value: job.contractType },
                  { icon: MapPin, label: 'Lieu', value: `${job.city}, ${job.country}` },
                  { icon: GraduationCap, label: 'Expérience', value: job.experienceLevel },
                  { icon: Globe, label: 'Télétravail', value: job.remoteType },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{item.label}</span>
                      <span className="text-xs font-semibold text-slate-700">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Company card */}
            <div className="card p-5">
              <h3 className="font-semibold text-slate-900 mb-4">À propos de l'entreprise</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {job.companyLogo ? <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" /> : <Building2 className="w-5 h-5 text-slate-300" />}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{job.companyName}</p>
                  {sectorName && <p className="text-xs text-slate-500">{sectorName}</p>}
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Publication {job.publisherType === 'company' ? 'directe' : job.publisherType === 'agency' ? 'via cabinet RH' : 'eJobSmart'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {applyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !applying && setApplyModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            {applied ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Candidature envoyée !</h3>
                <p className="text-sm text-slate-500">Vous recevrez une notification dès que le recruteur examinera votre dossier.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Postuler</h3>
                    <p className="text-sm text-slate-500">{job.title} — {job.companyName}</p>
                  </div>
                  <button onClick={() => setApplyModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* CV upload */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">CV</label>
                  <label className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-brand-400 transition-colors cursor-pointer block">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
                    />
                    <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    {cvFile ? (
                      <p className="text-sm font-medium text-brand-600">{cvFile.name}</p>
                    ) : (
                      <>
                        <p className="text-sm text-slate-500">Glissez votre CV ici ou</p>
                        <p className="text-sm font-medium text-brand-600 mt-1">Parcourir les fichiers</p>
                      </>
                    )}
                    <p className="text-xs text-slate-400 mt-2">PDF, DOC, DOCX · Max 5 Mo</p>
                  </label>
                </div>

                {/* Preselect questions */}
                {job.preselectQuestions.map((question) => (
                  <div key={question} className="mb-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{question}</label>
                    <input
                      value={preselectAnswers[question] ?? ''}
                      onChange={(e) => setPreselectAnswers(prev => ({ ...prev, [question]: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                ))}

                {/* Cover letter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Lettre de motivation <span className="text-slate-400 font-normal">(optionnel)</span>
                  </label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={e => setCoverLetter(e.target.value)}
                    placeholder="Présentez-vous brièvement et expliquez votre motivation..."
                    className="input-field resize-none"
                  />
                </div>

                <Button fullWidth size="lg" loading={applying} onClick={handleApply}>
                  <Send className="w-4 h-4" />
                  Envoyer ma candidature
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reporting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setReporting(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
            {reportSent ? (
              <div className="py-6 text-center">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                <p className="text-sm text-slate-600">Signalement envoyé, merci.</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Signaler cette offre</h3>
                <textarea
                  rows={3}
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  placeholder="Expliquez pourquoi cette offre vous semble inappropriée..."
                  className="input-field resize-none mb-4"
                />
                <div className="flex gap-3">
                  <button onClick={() => setReporting(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50">Annuler</button>
                  <button onClick={handleReport} disabled={!reportReason.trim()} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50">Signaler</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
