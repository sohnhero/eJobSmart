import { useState, useEffect } from 'react'
import {
  BookOpen, Plus, Trash2, Edit3, Search, Clock, Save, X
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'

interface CourseItem {
  id: number
  title: string
  provider: string
  duration: string
  studentsCount: number
}

export default function AdminRhTrainings() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [courses, setCourses] = useState<CourseItem[]>([
    { id: 1, title: 'Négocier son TJM et gérer ses contrats', provider: 'eJobSmart Academy', duration: '6h', studentsCount: 245 },
    { id: 2, title: 'AWS Cloud Foundations', provider: 'Instructors AWS', duration: '18h', studentsCount: 189 },
    { id: 3, title: 'Fiscalité Auto-Entrepreneur Sénégal', provider: 'Cabinet Advisory', duration: '10h', studentsCount: 134 },
  ])

  // Add training modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newProvider, setNewProvider] = useState('')
  const [newDuration, setNewDuration] = useState('10h')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newProvider.trim()) return

    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 800))
    setIsSubmitting(false)

    const newCourse: CourseItem = {
      id: Date.now(),
      title: newTitle,
      provider: newProvider,
      duration: newDuration,
      studentsCount: 0,
    }

    setCourses(prev => [newCourse, ...prev])
    setShowAddModal(false)
    setNewTitle('')
    setNewProvider('')
    toast.success(`La formation "${newTitle}" a été publiée avec succès !`)
  }

  const handleDeleteCourse = (id: number, title: string) => {
    setCourses(prev => prev.filter(c => c.id !== id))
    toast.info(`Formation "${title}" supprimée.`)
  }

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.provider.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout role="admin-rh" userName="Admin RH Internal" userTitle="Academy Manager">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            Gestion du catalogue de formations <BookOpen className="w-5 h-5 text-brand-600" />
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Créez, éditez et supprimez les modules de formation proposés sur la plateforme</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setShowAddModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Ajouter une formation
          </Button>
        </div>
      </div>

      <div className="card">
        {/* Search */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par titre ou formateur..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-4">
              <Skeleton variant="table" count={1} />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Formation</th>
                  <th className="px-6 py-4">Organisme / Formateur</th>
                  <th className="px-6 py-4">Durée globale</th>
                  <th className="px-6 py-4">Étudiants inscrits</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 text-sm">{c.title}</td>
                    <td className="px-6 py-4 text-xs text-slate-600 font-semibold">{c.provider}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{c.duration}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-900">{c.studentsCount} inscrits</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleDeleteCourse(c.id, c.title)}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded"
                          title="Supprimer la formation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Training Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isSubmitting && setShowAddModal(false)} />
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden border border-slate-100">
            <form onSubmit={handleAddSubmit}>
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-black text-slate-900">Ajouter une formation</h3>
                <button type="button" onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Titre de la formation</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: AWS Certified Cloud Practitioner"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Organisme / Formateur</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: AWS Training Network"
                    value={newProvider}
                    onChange={e => setNewProvider(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Durée estimée</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: 12h, 3 semaines"
                    value={newDuration}
                    onChange={e => setNewDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>Annuler</Button>
                <Button type="submit" size="sm" loading={isSubmitting}>Publier</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
