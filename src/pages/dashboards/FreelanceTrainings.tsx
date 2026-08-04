import { useState, useEffect } from 'react'
import {
  BookOpen, Clock, Award, CheckCircle
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import { trainingsService, enrollmentsService } from '../../lib/services/trainings'
import { uploadsService } from '../../lib/services/uploads'
import { formatDurationHours } from '../../lib/training-labels'
import { extractApiErrorMessage } from '../../lib/api'
import type { Training, TrainingEnrollment } from '../../lib/types'

export default function FreelanceTrainings() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [trainings, setTrainings] = useState<Training[]>([])
  const [enrollments, setEnrollments] = useState<TrainingEnrollment[]>([])
  const [enrollingId, setEnrollingId] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      trainingsService.list({ limit: 20 }),
      enrollmentsService.mine().catch(() => []),
    ]).then(([res, myEnrollments]) => {
      setTrainings(res.items)
      setEnrollments(myEnrollments)
    }).finally(() => setLoading(false))
  }, [])

  const enrolledIds = new Set(enrollments.map(e => typeof e.training === 'string' ? e.training : e.training._id))
  const completed = enrollments.filter(e => e.status === 'completed')

  const handleEnroll = async (training: Training) => {
    setEnrollingId(training._id)
    try {
      await trainingsService.enroll(training._id)
      const fresh = await enrollmentsService.mine()
      setEnrollments(fresh)
      toast.success(`Inscription réussie à : ${training.title}`)
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Impossible de vous inscrire"))
    } finally {
      setEnrollingId(null)
    }
  }

  return (
    <DashboardLayout role="freelance">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          Formations Freelance <BookOpen className="w-5 h-5 text-blue-600" />
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">Renforcez vos compétences commerciales et techniques de consultant indépendant</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <Skeleton variant="card" count={2} />
          ) : trainings.length === 0 ? (
            <div className="card p-8 text-center text-slate-400 text-sm">Aucune formation disponible pour le moment</div>
          ) : (
            <div className="space-y-4">
              {trainings.map(c => (
                <div key={c._id} className="card p-5 hover:border-blue-300 hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors text-base">{c.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{c.instructorName}</p>
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100 flex-shrink-0">
                      {c.price === 0 ? 'Gratuit' : `${c.price.toLocaleString('fr-FR')} ${c.currency}`}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed line-clamp-2">{c.description}</p>
                  <div className="flex items-center justify-between border-t border-slate-50 pt-4 text-xs">
                    <span className="text-slate-400 flex items-center gap-1"><Clock className="w-4 h-4" /> Durée : {formatDurationHours(c.durationHours)}</span>
                    {enrolledIds.has(c._id) ? (
                      <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <CheckCircle className="w-4 h-4" /> Inscrit
                      </div>
                    ) : (
                      <Button size="sm" loading={enrollingId === c._id} onClick={() => handleEnroll(c)}>S'inscrire</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Achievements */}
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-4 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" /> Vos Certifications
            </h3>
            {completed.length === 0 ? (
              <p className="text-xs text-slate-400">Aucune certification obtenue pour l'instant</p>
            ) : (
              <div className="space-y-3">
                {completed.map(e => {
                  const training = typeof e.training === 'string' ? null : e.training
                  return (
                    <button
                      key={e._id}
                      type="button"
                      onClick={() => uploadsService.openFile(e.certificateUrl!).catch(err => toast.error(extractApiErrorMessage(err, "Impossible d'ouvrir l'attestation")))}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl flex gap-2 hover:border-amber-300 transition-colors text-left"
                    >
                      <Award className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{training?.title ?? 'Formation'}</p>
                        {e.completedAt && <p className="text-[10px] text-slate-400 mt-0.5">Obtenu le {new Date(e.completedAt).toLocaleDateString('fr-FR')}</p>}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
