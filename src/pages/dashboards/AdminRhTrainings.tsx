import { useState, useEffect } from 'react'
import {
  BookOpen, Plus, Trash2, Search, Send, Archive, X,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import { trainingsService } from '../../lib/services/trainings'
import { formatDurationHours } from '../../lib/training-labels'
import { extractApiErrorMessage } from '../../lib/api'
import type { Training, TrainingFormat, TrainingLevel } from '../../lib/types'

const formatOptions: { value: TrainingFormat; label: string }[] = [
  { value: 'online', label: 'En ligne' },
  { value: 'in_person', label: 'Présentiel' },
  { value: 'hybrid', label: 'Hybride' },
]
const levelOptions: { value: TrainingLevel; label: string }[] = [
  { value: 'beginner', label: 'Débutant' },
  { value: 'intermediate', label: 'Intermédiaire' },
  { value: 'advanced', label: 'Avancé' },
]

export default function AdminRhTrainings() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [courses, setCourses] = useState<Training[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)

  // Add training modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newInstructor, setNewInstructor] = useState('')
  const [newFormat, setNewFormat] = useState<TrainingFormat>('online')
  const [newLevel, setNewLevel] = useState<TrainingLevel>('beginner')
  const [newDuration, setNewDuration] = useState('10')
  const [newModuleTitle, setNewModuleTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const load = () => {
    setLoading(true)
    trainingsService.mine().then(setCourses).catch(() => setCourses([])).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newDescription.trim() || !newInstructor.trim() || !newModuleTitle.trim()) return

    setIsSubmitting(true)
    try {
      const created = await trainingsService.create({
        title: newTitle,
        description: newDescription,
        format: newFormat,
        level: newLevel,
        durationHours: Number(newDuration),
        instructorName: newInstructor,
        modules: [{ title: newModuleTitle, order: 0 }],
      })
      setCourses(prev => [created, ...prev])
      setShowAddModal(false)
      setNewTitle(''); setNewDescription(''); setNewInstructor(''); setNewModuleTitle(''); setNewDuration('10')
      toast.success(`La formation "${created.title}" a été créée (brouillon) !`)
    } catch (err) {
      toast.error(extractApiErrorMessage(err, 'Impossible de créer la formation'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePublish = async (t: Training) => {
    setBusyId(t._id)
    try {
      const updated = await trainingsService.publish(t._id)
      setCourses(prev => prev.map(c => c._id === t._id ? updated : c))
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  const handleArchive = async (t: Training) => {
    setBusyId(t._id)
    try {
      const updated = await trainingsService.archive(t._id)
      setCourses(prev => prev.map(c => c._id === t._id ? updated : c))
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  const handleDeleteCourse = async (t: Training) => {
    setBusyId(t._id)
    try {
      await trainingsService.remove(t._id)
      setCourses(prev => prev.filter(c => c._id !== t._id))
      toast.info(`Formation "${t.title}" supprimée.`)
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.instructorName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout role="admin-rh">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            Gestion du catalogue de formations <BookOpen className="w-5 h-5 text-brand-600" />
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Créez, publiez et gérez les modules de formation proposés sur la plateforme</p>
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
                  <th className="px-6 py-4">Formateur</th>
                  <th className="px-6 py-4">Durée</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Inscrits</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map(c => (
                  <tr key={c._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 text-sm">{c.title}</td>
                    <td className="px-6 py-4 text-xs text-slate-600 font-semibold">{c.instructorName}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{formatDurationHours(c.durationHours)}</td>
                    <td className="px-6 py-4"><StatusBadge status={c.status === 'draft' ? 'Brouillon' : c.status === 'archived' ? 'Expirée' : 'Active'} /></td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-900">{c.enrollmentsCount} inscrits</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        {c.status !== 'published' && (
                          <button disabled={busyId === c._id} onClick={() => handlePublish(c)} className="p-1.5 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded disabled:opacity-40" title="Publier">
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        {c.status === 'published' && (
                          <button disabled={busyId === c._id} onClick={() => handleArchive(c)} className="p-1.5 hover:bg-amber-50 text-slate-400 hover:text-amber-600 rounded disabled:opacity-40" title="Archiver">
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                        <button disabled={busyId === c._id} onClick={() => handleDeleteCourse(c)} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded disabled:opacity-40" title="Supprimer la formation">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCourses.length === 0 && (
                  <tr><td colSpan={6} className="p-12 text-center text-slate-400 text-sm">Aucune formation créée pour l'instant.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Training Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isSubmitting && setShowAddModal(false)} />
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden border border-slate-100 max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleAddSubmit}>
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between sticky top-0">
                <h3 className="font-black text-slate-900">Ajouter une formation</h3>
                <button type="button" onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Titre de la formation</label>
                  <input type="text" required placeholder="ex: AWS Cloud Foundations" value={newTitle} onChange={e => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
                  <textarea rows={3} required value={newDescription} onChange={e => setNewDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Formateur</label>
                  <input type="text" required placeholder="ex: Awa Ndiaye" value={newInstructor} onChange={e => setNewInstructor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Format</label>
                    <select value={newFormat} onChange={e => setNewFormat(e.target.value as TrainingFormat)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none cursor-pointer">
                      {formatOptions.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Niveau</label>
                    <select value={newLevel} onChange={e => setNewLevel(e.target.value as TrainingLevel)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none cursor-pointer">
                      {levelOptions.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Durée (heures)</label>
                  <input type="number" min="0" required value={newDuration} onChange={e => setNewDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Premier module</label>
                  <input type="text" required placeholder="ex: Introduction et contexte" value={newModuleTitle} onChange={e => setNewModuleTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20" />
                  <p className="text-[10px] text-slate-400 mt-1">D'autres modules pourront être ajoutés ultérieurement.</p>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>Annuler</Button>
                <Button type="submit" size="sm" loading={isSubmitting}>Créer</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
