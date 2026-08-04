import { useState, useEffect } from 'react'
import {
  BookOpen, Play, Award,
  ChevronRight,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import { enrollmentsService } from '../../lib/services/trainings'
import { trainingsService } from '../../lib/services/trainings'
import { uploadsService } from '../../lib/services/uploads'
import { trainingCoverImage, formatDurationHours } from '../../lib/training-labels'
import { extractApiErrorMessage } from '../../lib/api'
import type { Training, TrainingEnrollment } from '../../lib/types'

export default function CandidateTrainings() {
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [enrollments, setEnrollments] = useState<TrainingEnrollment[]>([])
  const [recommended, setRecommended] = useState<Training[]>([])

  useEffect(() => {
    setLoading(true)
    enrollmentsService.mine().then((data) => {
      setEnrollments(data)
      const enrolledIds = new Set(data.map(e => typeof e.training === 'string' ? e.training : e.training._id))
      void trainingsService.list({ limit: 6 }).then(res => setRecommended(res.items.filter(t => !enrolledIds.has(t._id)).slice(0, 2)))
    }).catch(() => setEnrollments([])).finally(() => setLoading(false))
  }, [])

  const trainingOf = (e: TrainingEnrollment): Training | null => (typeof e.training === 'string' ? null : e.training)
  const inProgress = enrollments.filter(e => e.status !== 'completed')
  const completed = enrollments.filter(e => e.status === 'completed')

  return (
    <DashboardLayout role="candidate">
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
            {loading ? (
              <Skeleton variant="list" count={2} className="h-28" />
            ) : inProgress.length === 0 ? (
              <div className="card p-8 text-center text-slate-400 text-sm">Aucune formation en cours</div>
            ) : (
              inProgress.map(enrollment => {
                const training = trainingOf(enrollment)
                if (!training) return null
                return (
                  <div
                    key={enrollment._id}
                    onClick={() => navigate(`/trainings/${training._id}`)}
                    className="card p-5 flex flex-col sm:flex-row gap-5 hover:border-brand-200 transition-colors cursor-pointer group"
                  >
                    <div className="w-full sm:w-32 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={trainingCoverImage(training)} alt={training.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-brand-600 transition-colors">{training.title}</h3>
                      <p className="text-xs text-slate-400 mb-3">{training.instructorName} · {formatDurationHours(training.durationHours)}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="bg-brand-600 h-full rounded-full" style={{ width: `${enrollment.progressPercent}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-600">{enrollment.progressPercent}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-end">
                      <Button
                        size="sm"
                        variant="secondary"
                        rightIcon={<ChevronRight className="w-4 h-4" />}
                        onClick={(e) => { e.stopPropagation(); navigate(`/trainings/${training._id}`) }}
                      >
                        Continuer
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <h2 className="font-bold text-slate-900 pt-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" /> Formations terminées
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <Skeleton variant="list" count={2} />
            ) : completed.length === 0 ? (
              <div className="card p-8 text-center text-slate-400 text-sm md:col-span-2">Aucune formation terminée pour l'instant</div>
            ) : (
              completed.map(enrollment => {
                const training = trainingOf(enrollment)
                if (!training) return null
                return (
                  <div key={enrollment._id} className="card p-4 flex gap-4 animate-fade-in">
                    <div className="w-16 h-16 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                      <Award className="w-8 h-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{training.title}</h3>
                      {enrollment.completedAt && (
                        <p className="text-[10px] text-slate-400 mb-2">Terminé le {new Date(enrollment.completedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      )}
                      {enrollment.certificateUrl ? (
                        <button
                          type="button"
                          onClick={() => uploadsService.openFile(enrollment.certificateUrl!).catch(err => toast.error(extractApiErrorMessage(err, "Impossible d'ouvrir l'attestation")))}
                          className="text-[10px] font-bold text-brand-600 hover:underline"
                        >
                          Télécharger le certificat
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400">Certificat non disponible</span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Sidebar: Recommendations */}
        <div className="space-y-6">
          <div className="card p-5 bg-gradient-to-br from-brand-900 to-brand-700 text-white">
            <h3 className="font-bold mb-2">Passez au niveau supérieur !</h3>
            <p className="text-xs text-blue-100 mb-4 leading-relaxed">
              Les profils certifiés eJobSmart sont plus susceptibles d'être contactés par les recruteurs.
            </p>
            <Button variant="white" size="sm" fullWidth onClick={() => navigate('/trainings')}>
              Voir les certifications
            </Button>
          </div>

          {recommended.length > 0 && (
            <div className="card p-5">
              <h3 className="font-bold text-slate-900 mb-4 text-sm">Recommandé pour vous</h3>
              <div className="space-y-4">
                {recommended.map(t => (
                  <div key={t._id} onClick={() => navigate(`/trainings/${t._id}`)} className="flex gap-3 group cursor-pointer">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={trainingCoverImage(t)} alt={t.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-2 group-hover:text-brand-600 transition-colors">{t.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{formatDurationHours(t.durationHours)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
