import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Star, Clock, Users, Award, Play, Filter } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { trainings } from '../data/trainings'
import type { Training } from '../data/trainings'

const formats = ['Tous', 'En ligne', 'Présentiel', 'Hybride', 'Webinaire']
const levels = ['Tous', 'Débutant', 'Intermédiaire', 'Avancé']

export default function Trainings() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [format, setFormat] = useState('Tous')
  const [level, setLevel] = useState('Tous')
  const [freeOnly, setFreeOnly] = useState(false)

  const filtered = trainings.filter(t => {
    if (query && !t.title.toLowerCase().includes(query.toLowerCase()) && !t.instructor.toLowerCase().includes(query.toLowerCase())) return false
    if (format !== 'Tous' && t.format !== format) return false
    if (level !== 'Tous' && t.level !== level) return false
    if (freeOnly && t.price > 0) return false
    return true
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-900 to-brand-700 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-sm font-semibold text-blue-300 tracking-wider uppercase">Formations</span>
          <h1 className="text-3xl md:text-4xl font-black text-white mt-2 mb-3">
            Boostez votre carrière avec nos formations
          </h1>
          <p className="text-blue-200 text-lg mb-8">
            Formations RH, management et métiers certifiantes dispensées par des experts africains
          </p>
          <div className="bg-white rounded-2xl p-2 flex gap-2 max-w-lg mx-auto">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Titre, formateur, thème..." value={query} onChange={e => setQuery(e.target.value)} className="flex-1 outline-none text-sm" />
            </div>
            <Button size="sm" className="rounded-xl">Rechercher</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Format :</span>
            <div className="flex gap-1.5">
              {formats.map(f => (
                <button key={f} onClick={() => setFormat(f)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${format === f ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">Niveau :</span>
            <div className="flex gap-1.5">
              {levels.map(l => (
                <button key={l} onClick={() => setLevel(l)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${level === l ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer ml-auto">
            <div
              onClick={() => setFreeOnly(!freeOnly)}
              className={`w-10 h-5 rounded-full transition-colors relative ${freeOnly ? 'bg-brand-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${freeOnly ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm font-medium text-slate-700">Formations gratuites</span>
          </label>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-6 mb-6 text-sm text-slate-500">
          <span><span className="font-semibold text-slate-900">{filtered.length}</span> formation{filtered.length > 1 ? 's' : ''}</span>
          <span><span className="font-semibold text-slate-900">{trainings.reduce((a, t) => a + t.enrolledCount, 0).toLocaleString('fr-FR')}</span> apprenants au total</span>
        </div>

        {/* Featured */}
        {filtered.filter(t => t.isFeatured).length > 0 && (
          <div className="mb-8">
            <h2 className="font-bold text-slate-900 text-lg mb-4">En vedette</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filtered.filter(t => t.isFeatured).slice(0, 2).map(training => (
                <TrainingCardFeatured key={training.id} training={training} navigate={navigate} />
              ))}
            </div>
          </div>
        )}

        {/* All trainings */}
        <div>
          <h2 className="font-bold text-slate-900 text-lg mb-4">Toutes les formations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(training => (
              <TrainingCard key={training.id} training={training} navigate={navigate} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function TrainingCard({ training, navigate }: { training: Training; navigate: (path: string) => void }) {
  return (
    <div onClick={() => navigate(`/trainings/${training.id}`)} className="card overflow-hidden cursor-pointer group hover:-translate-y-1 transition-all duration-200">
      <div className="relative h-40 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
          style={{ backgroundImage: `url(${training.thumbnail})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge variant={training.format === 'En ligne' ? 'blue' : 'purple'} size="sm">{training.format}</Badge>
          {training.price === 0 && <Badge variant="green" size="sm">Gratuit</Badge>}
        </div>
        {training.hasCertificate && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-amber-500/90 text-white text-[10px] px-2 py-1 rounded-full font-semibold">
            <Award className="w-2.5 h-2.5" /> Certifiant
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 leading-snug mb-2 group-hover:text-brand-600 transition-colors">
          {training.title}
        </h3>
        <p className="text-xs text-slate-500 mb-3">{training.instructor}</p>
        <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{training.duration}</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{training.enrolledCount.toLocaleString('fr-FR')}</span>
          <Badge variant={training.level === 'Débutant' ? 'green' : training.level === 'Intermédiaire' ? 'amber' : 'red'} size="sm">
            {training.level}
          </Badge>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold text-slate-800">{training.rating}</span>
            <span className="text-xs text-slate-400">({training.reviewCount})</span>
          </div>
          {training.price === 0
            ? <span className="text-sm font-bold text-emerald-600">Gratuit</span>
            : <span className="text-sm font-bold text-slate-900">{training.price.toLocaleString('fr-FR')} {training.currency}</span>
          }
        </div>
      </div>
    </div>
  )
}

function TrainingCardFeatured({ training, navigate }: { training: Training; navigate: (path: string) => void }) {
  return (
    <div onClick={() => navigate(`/trainings/${training.id}`)} className="card overflow-hidden cursor-pointer group hover:-translate-y-1 transition-all duration-200 flex flex-col sm:flex-row">
      <div className="relative sm:w-52 h-44 sm:h-auto overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300" style={{ backgroundImage: `url(${training.thumbnail})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40 group-hover:bg-white/30 transition-colors">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>
      <div className="p-5 flex-1">
        <div className="flex gap-1.5 mb-2">
          <Badge variant="blue" size="sm">{training.format}</Badge>
          {training.price === 0 && <Badge variant="green" size="sm">Gratuit</Badge>}
          {training.hasCertificate && <Badge variant="amber" size="sm">Certifiant</Badge>}
        </div>
        <h3 className="font-bold text-slate-900 leading-snug mb-1 group-hover:text-brand-600 transition-colors">{training.title}</h3>
        <p className="text-xs text-slate-500 mb-3">{training.instructor}</p>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">{training.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-slate-800">{training.rating}</span>
            <span>({training.enrolledCount.toLocaleString('fr-FR')} apprenants)</span>
          </div>
          {training.price === 0
            ? <span className="font-bold text-emerald-600">Gratuit</span>
            : <span className="font-bold text-slate-900">{training.price.toLocaleString('fr-FR')} {training.currency}</span>
          }
        </div>
      </div>
    </div>
  )
}
