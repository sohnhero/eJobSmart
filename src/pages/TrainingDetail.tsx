import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Clock, Users, Award, Play, BookOpen, Star, Share2, Bookmark,
  ChevronRight, CheckCircle, Globe, Monitor, ArrowLeft, Send,
  MessageSquare, X, Calendar, User
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { trainings } from '../data/trainings'

export default function TrainingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [enrolled, setEnrolled] = useState(false)
  const [enrollModal, setEnrollModal] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'instructor' | 'reviews'>('content')

  const training = trainings.find(t => t.id === Number(id)) || trainings[0]
  const related = trainings.filter(t => t.id !== training.id).slice(0, 3)

  const handleEnroll = () => {
    setEnrolled(true)
    setTimeout(() => { setEnrollModal(false) }, 2000)
  }

  const modules = [
    { title: 'Introduction et contexte', duration: '15 min', done: true },
    { title: 'Fondamentaux et concepts clés', duration: '45 min', done: true },
    { title: 'Cas pratiques et exercices', duration: '60 min', done: false },
    { title: 'Études de cas africains', duration: '45 min', done: false },
    { title: 'Outils et ressources', duration: '30 min', done: false },
    { title: 'Évaluation finale', duration: '20 min', done: false },
  ]

  const reviews = [
    { name: 'Fatou M.', rating: 5, text: 'Formation très complète et adaptée au contexte africain. Le formateur est excellent !', date: '2026-04-15', avatar: 'FM' },
    { name: 'Ibrahima D.', rating: 5, text: 'J\'ai beaucoup appris. Les cas pratiques sont vraiment pertinents.', date: '2026-04-10', avatar: 'ID' },
    { name: 'Aissatou B.', rating: 4, text: 'Bonne formation, j\'aurais aimé plus d\'exercices interactifs.', date: '2026-04-05', avatar: 'AB' },
  ]

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
                  style={{ backgroundImage: `url(${training.thumbnail})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40 hover:bg-white/30 transition-all hover:scale-110">
                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                  </button>
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant={training.format === 'En ligne' ? 'blue' : training.format === 'Hybride' ? 'purple' : 'amber'}>
                    {training.format}
                  </Badge>
                  {training.price === 0 && <Badge variant="green">Gratuit</Badge>}
                  {training.hasCertificate && <Badge variant="amber"><Award className="w-3 h-3" /> Certifiant</Badge>}
                </div>
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <button
                    onClick={() => setSaved(!saved)}
                    className={`p-2 rounded-xl border-2 transition-all ${saved ? 'border-brand-200 bg-brand-50/20 text-brand-300' : 'border-white/30 hover:border-white/50 text-white'}`}
                  >
                    <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 rounded-xl border-2 border-white/30 hover:border-white/50 text-white transition-all">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h1 className="text-xl font-bold text-slate-900 mb-3">{training.title}</h1>

                <div className="flex items-center gap-4 flex-wrap mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-slate-900">{training.rating}</span>
                    <span className="text-sm text-slate-400">({training.reviewCount} avis)</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Users className="w-4 h-4" />
                    {training.enrolledCount.toLocaleString('fr-FR')} apprenants
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    {training.duration}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Globe className="w-4 h-4" />
                    {training.language}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {training.instructor.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Formateur</p>
                    <p className="text-sm font-semibold text-slate-800">{training.instructor}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="card">
              <div className="flex border-b border-slate-100">
                {(['content', 'instructor', 'reviews'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors ${activeTab === tab ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {tab === 'content' && <BookOpen className="w-4 h-4" />}
                    {tab === 'instructor' && <User className="w-4 h-4" />}
                    {tab === 'reviews' && <Star className="w-4 h-4" />}
                    {tab === 'content' ? 'Contenu' : tab === 'instructor' ? 'Formateur' : 'Avis'}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'content' && (
                  <div>
                    <h2 className="font-bold text-slate-900 mb-2">Description</h2>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">{training.description}</p>

                    <h2 className="font-bold text-slate-900 mb-4">Programme</h2>
                    <div className="space-y-2">
                      {modules.map((mod, i) => (
                        <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${mod.done ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${mod.done ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                            {mod.done
                              ? <CheckCircle className="w-4 h-4 text-white" />
                              : <span className="text-xs font-bold text-slate-500">{i + 1}</span>
                            }
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${mod.done ? 'text-slate-700' : 'text-slate-800'}`}>{mod.title}</p>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            {mod.duration}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'instructor' && (
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {training.instructor.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900 text-lg">{training.instructor}</h2>
                      <p className="text-sm text-slate-500 mb-3">Expert RH & Formateur certifié</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {training.rating} de note</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {training.enrolledCount.toLocaleString('fr-FR')} apprenants</span>
                        <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> 8 formations</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Expert RH avec plus de 15 ans d'expérience dans les ressources humaines en Afrique de l'Ouest. 
                        Spécialisé dans la gestion des talents, le recrutement et le développement organisationnel. 
                        Il a accompagné plus de 200 entreprises dans leur transformation RH.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {reviews.map((review, i) => (
                      <div key={i} className="border-b border-slate-100 pb-4 last:border-0">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold">
                            {review.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-slate-900">{review.name}</p>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, j) => (
                                <Star key={j} className={`w-3 h-3 ${j < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                              ))}
                            </div>
                          </div>
                          <span className="ml-auto text-xs text-slate-400">{new Date(review.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <p className="text-sm text-slate-600">{review.text}</p>
                      </div>
                    ))}
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
                    <div key={t.id} onClick={() => navigate(`/trainings/${t.id}`)} className="card p-4 cursor-pointer hover:-translate-y-0.5 transition-all group flex items-center gap-4">
                      <div className="relative w-16 h-12 rounded-xl overflow-hidden flex-shrink-0">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${t.thumbnail})` }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">{t.title}</p>
                        <p className="text-xs text-slate-500">{t.instructor}</p>
                      </div>
                      <div className="text-right">
                        {t.price === 0
                          ? <span className="text-sm font-bold text-emerald-600">Gratuit</span>
                          : <span className="text-sm font-bold text-slate-900">{t.price.toLocaleString('fr-FR')} FCFA</span>
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
                      <p className="text-xs text-slate-400 mt-1">Accès à vie · Certificat inclus</p>
                    </div>
                  )
                }
              </div>

              <Button
                fullWidth size="lg"
                onClick={() => setEnrollModal(true)}
                className="mb-3"
              >
                <Monitor className="w-4 h-4" />
                {training.price === 0 ? 'S\'inscrire gratuitement' : 'S\'inscrire maintenant'}
              </Button>
              <Button fullWidth variant="secondary" size="md" onClick={() => setSaved(!saved)}>
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-brand-600' : ''}`} />
                {saved ? 'Sauvegardée' : 'Sauvegarder'}
              </Button>

              <div className="mt-5 space-y-3">
                {[
                  { icon: Clock, label: 'Durée', value: training.duration },
                  { icon: Users, label: 'Apprenants', value: training.enrolledCount.toLocaleString('fr-FR') },
                  { icon: Globe, label: 'Langue', value: training.language },
                  { icon: Monitor, label: 'Format', value: training.format },
                  { icon: Award, label: 'Certificat', value: training.hasCertificate ? 'Inclus' : 'Non' },
                  { icon: Calendar, label: 'Niveau', value: training.level },
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

              <button className="mt-4 w-full text-xs text-brand-600 font-medium flex items-center justify-center gap-1 hover:text-brand-800 transition-colors">
                <MessageSquare className="w-3.5 h-3.5" /> Contacter le formateur
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enroll Modal */}
      {enrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEnrollModal(false)} />
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
                    <Button fullWidth size="lg" onClick={handleEnroll} rightIcon={<Send className="w-4 h-4" />}>
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
                    <div className="space-y-2 mb-4">
                      {['Orange Money', 'Wave', 'Carte bancaire'].map(m => (
                        <button key={m} className="w-full text-left p-3 border-2 border-slate-200 rounded-xl text-sm font-medium hover:border-brand-400 transition-colors">
                          {m}
                        </button>
                      ))}
                    </div>
                    <Button fullWidth size="lg" onClick={handleEnroll}>
                      Payer & s'inscrire
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
