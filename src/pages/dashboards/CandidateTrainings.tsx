import { useState } from 'react'
import {
  BookOpen, Clock, Play, Award,
  ChevronRight, Search, Filter, Loader2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { trainings } from '../../data/trainings'

export default function CandidateTrainings() {
  const navigate = useNavigate()
  const [downloadingId, setDownloadingId] = useState<number | null>(null)

  const handleDownloadCert = (e: React.MouseEvent, id: number, title: string) => {
    e.stopPropagation()
    setDownloadingId(id)
    setTimeout(() => {
      setDownloadingId(null)
      // download simulation
      const link = document.createElement('a')
      link.href = '#'
      link.setAttribute('download', `Certificat_${title.replace(/\s+/g, '_')}.pdf`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }, 1500)
  }

  const myTrainings = [
    { ...trainings[0], progress: 85, lastAccessed: 'Il y a 2h' },
    { ...trainings[1], progress: 100, lastAccessed: 'Hier', certified: true },
    { ...trainings[2], progress: 15, lastAccessed: 'Il y a 3 jours' },
  ]

  return (
    <DashboardLayout role="candidate" userName="Amadou Diallo">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Mes formations</h1>
          <p className="text-slate-500 text-sm mt-0.5">Continuez votre apprentissage et développez vos compétences</p>
        </div>
        <Button onClick={() => navigate('/trainings')} size="sm" leftIcon={<BookOpen className="w-4 h-4" />}>
          Catalogue complet
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main: In progress */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-bold text-slate-900 flex items-center gap-2">
            <Play className="w-5 h-5 text-brand-600" /> En cours d'apprentissage
          </h2>
          <div className="space-y-4">
            {myTrainings.filter(t => t.progress < 100).map(training => (
              <div 
                key={training.id} 
                onClick={() => navigate(`/trainings/${training.id}`)}
                className="card p-5 flex flex-col sm:flex-row gap-5 hover:border-brand-200 transition-colors cursor-pointer group"
              >
                <div className="w-full sm:w-32 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={training.thumbnail} alt={training.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-brand-600 transition-colors">{training.title}</h3>
                  <p className="text-xs text-slate-400 mb-3">{training.instructor} · {training.lastAccessed}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-brand-600 h-full rounded-full" style={{ width: `${training.progress}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-600">{training.progress}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/trainings/${training.id}`);
                    }}
                  >
                    Continuer
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <h2 className="font-bold text-slate-900 pt-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" /> Formations terminées
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myTrainings.filter(t => t.progress === 100).map(training => (
              <div key={training.id} className="card p-4 flex gap-4">
                <div className="w-16 h-16 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Award className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{training.title}</h3>
                  <p className="text-[10px] text-slate-400 mb-2">Terminé le 12 Avril 2026</p>
                  <button 
                    disabled={downloadingId === training.id}
                    onClick={(e) => handleDownloadCert(e, training.id, training.title)}
                    className="text-[10px] font-bold text-brand-600 hover:underline flex items-center gap-1 disabled:text-slate-400 disabled:no-underline"
                  >
                    {downloadingId === training.id ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" /> Téléchargement...
                      </>
                    ) : (
                      'Télécharger le certificat'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Recommendations */}
        <div className="space-y-6">
          <div className="card p-5 bg-gradient-to-br from-brand-900 to-brand-700 text-white">
            <h3 className="font-bold mb-2">Passez au niveau supérieur !</h3>
            <p className="text-xs text-blue-100 mb-4 leading-relaxed">
              Les profils certifiés eJobSmart sont 40% plus susceptibles d'être contactés par les recruteurs.
            </p>
            <Button 
              variant="white" 
              size="sm" 
              fullWidth
              onClick={() => navigate('/trainings')}
            >
              Voir les certifications
            </Button>
          </div>
          
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-4 text-sm">Recommandé pour vous</h3>
            <div className="space-y-4">
              {trainings.slice(3, 5).map(t => (
                <div 
                  key={t.id} 
                  onClick={() => navigate(`/trainings/${t.id}`)}
                  className="flex gap-3 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={t.thumbnail} alt={t.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-2 group-hover:text-brand-600 transition-colors">{t.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{t.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
