import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  MapPin, Clock, Users, Bookmark, Share2, Building2,
  CheckCircle, ArrowLeft, Briefcase, GraduationCap,
  Globe, DollarSign, Calendar, Send, X, Upload, Zap
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'
import Badge, { ContractBadge } from '../components/ui/Badge'
import MatchScore from '../components/ui/MatchScore'
import { jobs } from '../data/jobs'

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [applyModal, setApplyModal] = useState(false)
  const [applied, setApplied] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')

  const job = jobs.find(j => j.id === Number(id)) || jobs[0]
  const relatedJobs = jobs.filter(j => j.sectorId === job.sectorId && j.id !== job.id).slice(0, 3)

  const handleApply = () => {
    setApplied(true)
    setTimeout(() => { setApplyModal(false); setApplied(false) }, 2000)
  }

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
                <img src={job.companyLogo} alt={job.company} className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-xl font-bold text-slate-900 leading-tight">{job.title}</h1>
                      <p className="text-slate-600 mt-1 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4" />
                        <span className="font-medium">{job.company}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">{job.sector}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setSaved(!saved)}
                        className={`p-2.5 rounded-xl border-2 transition-all ${saved ? 'border-brand-200 bg-brand-50 text-brand-600' : 'border-slate-200 hover:border-brand-300 text-slate-400'}`}
                      >
                        <Bookmark className={`w-5 h-5 ${saved ? 'fill-brand-600' : ''}`} />
                      </button>
                      <button className="p-2.5 rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-400 transition-all">
                        <Share2 className="w-5 h-5" />
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
                      { icon: DollarSign, label: 'Salaire', value: `${(job.salaryMin / 1000).toFixed(0)}K — ${(job.salaryMax / 1000).toFixed(0)}K ${job.currency}` },
                      { icon: Users, label: 'Candidats', value: `${job.applicants} candidatures` },
                      { icon: Calendar, label: 'Publiée le', value: new Date(job.postedAt).toLocaleDateString('fr-FR') },
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
                    <div key={rj.id} onClick={() => navigate(`/jobs/${rj.id}`)} className="card p-4 cursor-pointer hover:-translate-y-0.5 transition-all group flex items-center gap-3">
                      <img src={rj.companyLogo} alt={rj.company} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-slate-900 group-hover:text-brand-600 transition-colors">{rj.title}</p>
                        <p className="text-xs text-slate-500">{rj.company} · {rj.city}</p>
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
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-400">Votre score de matching</p>
                  <MatchScore score={87} size="lg" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Expire dans</p>
                  <p className="text-sm font-semibold text-amber-600">22 jours</p>
                </div>
              </div>

              <Button fullWidth size="lg" onClick={() => setApplyModal(true)} className="mb-3">
                <Send className="w-4 h-4" />
                Postuler maintenant
              </Button>
              <Button fullWidth size="md" variant="secondary">
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
                <img src={job.companyLogo} alt={job.company} className="w-12 h-12 rounded-xl" />
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{job.company}</p>
                  <p className="text-xs text-slate-500">{job.sector}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Entreprise vérifiée · Publication {job.publisherType === 'company' ? 'directe' : 'via cabinet RH'}
              </p>
              <button className="mt-3 text-xs text-brand-600 font-medium hover:text-brand-800">
                Voir le profil entreprise →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {applyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setApplyModal(false)} />
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
                    <p className="text-sm text-slate-500">{job.title} — {job.company}</p>
                  </div>
                  <button onClick={() => setApplyModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* CV upload */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">CV *</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-brand-400 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Glissez votre CV ici ou</p>
                    <p className="text-sm font-medium text-brand-600 mt-1">Parcourir les fichiers</p>
                    <p className="text-xs text-slate-400 mt-2">PDF, DOC, DOCX · Max 5 Mo</p>
                  </div>
                </div>

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

                <Button fullWidth size="lg" onClick={handleApply}>
                  <Send className="w-4 h-4" />
                  Envoyer ma candidature
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
