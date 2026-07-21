import { useState, useEffect } from 'react'
import {
  BookOpen, Clock, Award, Star, CheckCircle
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'

interface Course {
  id: number
  title: string
  provider: string
  duration: string
  rating: number
  enrolled: boolean
  desc: string
}

export default function AgencyTrainings() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      title: 'Techniques Avancées de Sourcing Digital & Boolean Search',
      provider: 'eJobSmart Advisors',
      duration: '8 heures',
      rating: 4.9,
      enrolled: false,
      desc: 'Apprenez à sourcer de manière chirurgicale sur LinkedIn, Github, StackOverflow et dans le vivier local de talents qualifiés.',
    },
    {
      id: 2,
      title: 'Recrutement Inclusif & Évaluation des Soft Skills',
      provider: 'African HR Federation',
      duration: '12 heures',
      rating: 4.8,
      enrolled: false,
      desc: 'Conduire des entretiens structurés pour évaluer le fit culturel, la capacité d\'adaptation et éliminer les biais inconscients.',
    }
  ])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleEnroll = (id: number, title: string) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, enrolled: true } : c))
    toast.success(`Inscription enregistrée pour l'équipe du cabinet : ${title}`)
  }

  return (
    <DashboardLayout role="agency" userName="Cabinet Talent RH" userTitle="Directeur Associé">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          Formations Professionnelles RH <BookOpen className="w-5 h-5 text-emerald-600" />
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">Certifiez vos recruteurs internes et optimisez vos processus de placement</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <Skeleton variant="card" count={2} />
          ) : (
            <div className="space-y-4">
              {courses.map(c => (
                <div key={c.id} className="card p-5 hover:border-emerald-300 hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors text-base">{c.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{c.provider} · ⭐ {c.rating}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">{c.desc}</p>
                  <div className="flex items-center justify-between border-t border-slate-50 pt-4 text-xs">
                    <span className="text-slate-400 flex items-center gap-1"><Clock className="w-4 h-4" /> Durée : {c.duration}</span>
                    {c.enrolled ? (
                      <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <CheckCircle className="w-4 h-4" /> Inscrit
                      </div>
                    ) : (
                      <Button size="sm" onClick={() => handleEnroll(c.id, c.title)}>Inscrire mes recruteurs</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-4 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" /> Labellisation Cabinet
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex gap-2">
                <Award className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-800">Label Excellence RH 2026</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Délivré par eJobSmart Advisors</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
