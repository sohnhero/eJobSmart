import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Clock, Users, Award, Play, BookOpen, Share2, Bookmark,
  CheckCircle, Globe, Monitor, ArrowLeft, Send,
  X, User,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { trainingsService } from '../lib/services/trainings'
import { TRAINING_FORMAT_LABELS, TRAINING_LEVEL_LABELS, formatDurationHours, trainingCoverImage } from '../lib/training-labels'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import { extractApiErrorMessage } from '../lib/api'
import type { Training } from '../lib/types'

export default function TrainingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const toast = useToast()

  const [training, setTraining] = useState<Training | null>(null)
  const [related, setRelated] = useState<Training[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [enrolled, setEnrolled] = useState(false)
  const [enrolling, setEnrolling] = useState(false)
  const [enrollModal, setEnrollModal] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'instructor'>('content')

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    trainingsService
      .get(id)
      .then((data) => {
        if (cancelled) return
        setTraining(data)
        void trainingsService.list({ limit: 4 }).then((res) => setRelated(res.items.filter((t) => t._id !== data._id).slice(0, 3)))
      })
      .catch(() => { if (!cancelled) setNotFound(true) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  const handleOpenEnroll = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/trainings/${id}` } })
      return
    }
    setEnrollModal(true)
  }

  const handleEnroll = async () => {
    if (!training) return
    setEnrolling(true)
    try {
      await trainingsService.enroll(training._id)
      setEnrolled(true)
      setTimeout(() => setEnrollModal(false), 2000)
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Impossible de finaliser l'inscription"))
    } finally {
      setEnrolling(false)
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

  if (notFound || !training) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-slate-500">Cette formation n'existe pas ou n'est plus disponible.</p>
          <Button className="mt-4" onClick={() => navigate('/trainings')}>Voir les formations</Button>
        </div>
        <Footer />
      </div>
    )
  }

  const initials = training.instructorName.split(' ').map(n => n[0]).join('').slice(0, 2)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour aux formations
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-5">
            {/* Hero card */}
            <div className="card overflow-hidden">
              {/* Thumbnail */}
              <div className="relative h-56 bg-gradient-to-br from-slate-800 to-slate-900">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${trainingCoverImage(training)})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40">
                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                  </div>
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant={training.format === 'online' ? 'blue' : training.format === 'hybrid' ? 'purple' : 'amber'}>
                    {TRAINING_FORMAT_LABELS[training.format]}
                  </Badge>
                  {training.price === 0 && <Badge variant="green">Gratuit</Badge>}
                  {training.certificateAwarded && <Badge variant="amber"><Award className="w-3 h-3" /> Certifiant</Badge>}
                </div>
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <button
                    onClick={() => setSaved(!saved)}
                    className={`p-2 rounded-xl border-2 transition-all ${saved ? 'border-brand-200 bg-brand-50/20 text-brand-300' : 'border-white/30 hover:border-white/50 text-white'}`}
                  >
                    <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                  </button>
                  <button onClick={() => navigator.share ? navigator.share({ title: training.title, url: window.location.href }).catch(() => {}) : navigator.clipboard.writeText(window.location.href).then(() => toast.info('Lien copié'))} className="p-2 rounded-xl border-2 border-white/30 hover:border-white/50 text-white transition-all">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h1 className="text-xl font-bold text-slate-900 mb-3">{training.title}</h1>

                <div className="flex items-center gap-4 flex-wrap mb-4">
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Users className="w-4 h-4" />
                    {training.enrollmentsCount.toLocaleString('fr-FR')} apprenants
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    {formatDurationHours(training.durationHours)}
                  </div>
                  {training.languages.length > 0 && (
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Globe className="w-4 h-4" />
                      {training.languages.join(', ')}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Formateur</p>
                    <p className="text-sm font-semibold text-slate-800">{training.instructorName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="card">
              <div className="flex border-b border-slate-100">
                {(['content', 'instructor'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors ${activeTab === tab ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {tab === 'content' && <BookOpen className="w-4 h-4" />}
                    {tab === 'instructor' && <User className="w-4 h-4" />}
                    {tab === 'content' ? 'Contenu' : 'Formateur'}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'content' && (
                  <div>
                    <h2 className="font-bold text-slate-900 mb-2">Description</h2>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">{training.description}</p>

                    {training.prerequisites.length > 0 && (
                      <>
                        <h2 className="font-bold text-slate-900 mb-3">Prérequis</h2>
                        <ul className="space-y-1.5 mb-6">
                          {training.prerequisites.map((p, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-brand-600 flex-shrink-0 mt-2" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    <h2 className="font-bold text-slate-900 mb-4">Programme</h2>
                    <div className="space-y-2">
                      {[...training.modules].sort((a, b) => a.order - b.order).map((mod, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-slate-500">{i + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800">{mod.title}</p>
                            {mod.description && <p className="text-xs text-slate-500 mt-0.5">{mod.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'instructor' && (
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {initials}
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900 text-lg">{training.instructorName}</h2>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mb-4 mt-2">
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {training.enrollmentsCount.toLocaleString('fr-FR')} apprenants</span>
                      </div>
                      {training.instructorBio && <p className="text-sm text-slate-600 leading-relaxed">{training.instructorBio}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div>
                <h2 className="font-bold text-slate-900 text-lg mb-4">Formations similaires</h2>
                <div className="space-y-3">
                  {related.map(t => (
                    <div key={t._id} onClick={() => navigate(`/trainings/${t._id}`)} className="card p-4 cursor-pointer hover:-translate-y-0.5 transition-all group flex items-center gap-4">
                      <div className="relative w-16 h-12 rounded-xl overflow-hidden flex-shrink-0">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${trainingCoverImage(t)})` }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">{t.title}</p>
                        <p className="text-xs text-slate-500">{t.instructorName}</p>
                      </div>
                      <div className="text-right">
                        {t.price === 0
                          ? <span className="text-sm font-bold text-emerald-600">Gratuit</span>
                          : <span className="text-sm font-bold text-slate-900">{t.price.toLocaleString('fr-FR')} {t.currency}</span>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="card p-5 sticky top-24">
              {/* Price */}
              <div className="text-center mb-4 pb-4 border-b border-slate-100">
                {training.price === 0
                  ? <p className="text-3xl font-black text-emerald-600">Gratuit</p>
                  : (
                    <div>
                      <p className="text-3xl font-black text-slate-900">
                        {training.price.toLocaleString('fr-FR')}
                        <span className="text-sm font-normal text-slate-400 ml-1">{training.currency}</span>
                      </p>
                      {training.certificateAwarded && <p className="text-xs text-slate-400 mt-1">Certificat inclus</p>}
                    </div>
                  )
                }
              </div>

              <Button
                fullWidth size="lg"
                onClick={handleOpenEnroll}
                className="mb-3"
              >
                <Monitor className="w-4 h-4" />
                {training.price === 0 ? "S'inscrire gratuitement" : "S'inscrire maintenant"}
              </Button>
              <Button fullWidth variant="secondary" size="md" onClick={() => setSaved(!saved)}>
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-brand-600' : ''}`} />
                {saved ? 'Sauvegardée' : 'Sauvegarder'}
              </Button>

              <div className="mt-5 space-y-3">
                {[
                  { icon: Clock, label: 'Durée', value: formatDurationHours(training.durationHours) },
                  { icon: Users, label: 'Apprenants', value: training.enrollmentsCount.toLocaleString('fr-FR') },
                  { icon: Globe, label: 'Langue', value: training.languages.join(', ') || '—' },
                  { icon: Monitor, label: 'Format', value: TRAINING_FORMAT_LABELS[training.format] },
                  { icon: Award, label: 'Certificat', value: training.certificateAwarded ? 'Inclus' : 'Non' },
                  { icon: BookOpen, label: 'Niveau', value: TRAINING_LEVEL_LABELS[training.level] },
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
          </div>
        </div>
      </div>

      {/* Enroll Modal */}
      {enrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !enrolling && setEnrollModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
            {enrolled ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Inscription confirmée !</h3>
                <p className="text-sm text-slate-500">Vous pouvez accéder à la formation depuis votre tableau de bord.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Inscription</h3>
                    <p className="text-sm text-slate-500 line-clamp-1">{training.title}</p>
                  </div>
                  <button onClick={() => setEnrollModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {training.price === 0 ? (
                  <div>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-4 text-center">
                      <p className="text-2xl font-black text-emerald-600">Gratuit</p>
                      <p className="text-xs text-emerald-700 mt-1">Accès immédiat à tous les modules</p>
                    </div>
                    <Button fullWidth size="lg" loading={enrolling} onClick={handleEnroll} rightIcon={<Send className="w-4 h-4" />}>
                      Confirmer l'inscription
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="bg-slate-50 rounded-2xl p-4 mb-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Formation</span>
                        <span className="font-semibold">{training.price.toLocaleString('fr-FR')} {training.currency}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold border-t border-slate-200 pt-2">
                        <span>Total</span>
                        <span className="text-brand-600">{training.price.toLocaleString('fr-FR')} {training.currency}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mb-4 text-center">Le paiement en ligne n'est pas encore disponible — votre inscription sera confirmée directement.</p>
                    <Button fullWidth size="lg" loading={enrolling} onClick={handleEnroll}>
                      Confirmer l'inscription
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
