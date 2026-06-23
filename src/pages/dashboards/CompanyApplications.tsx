import { useState } from 'react'
import {
  Search, Filter, MoreVertical, CheckCircle, XCircle, Eye,
  MessageSquare, Calendar, Star, X, CheckCircle2, UserCheck, ShieldAlert
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import MatchScore from '../../components/ui/MatchScore'

interface RecruiterApplication {
  id: number
  name: string
  job: string
  date: string
  status: string
  score: number
  email: string
  phone: string
  skills: string[]
  experience: string
  bio: string
}

export default function CompanyApplications() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [jobFilter, setJobFilter] = useState('Toutes les offres')
  const [selectedApp, setSelectedApp] = useState<RecruiterApplication | null>(null)

  const [applications, setApplications] = useState<RecruiterApplication[]>([
    { 
      id: 1, name: 'Aminata Sow', job: 'Dev Frontend React', date: '2026-04-28', status: 'Vérifié', score: 94,
      email: 'aminata.sow@email.com', phone: '+221 77 567 12 34', skills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux'],
      experience: '4 ans', bio: 'Développeuse Frontend passionnée par la création d\'interfaces utilisateur intuitives et performantes.'
    },
    { 
      id: 2, name: 'Jean-Pierre Gomis', job: 'Dev Frontend React', date: '2026-04-27', status: 'En attente', score: 88,
      email: 'jp.gomis@email.com', phone: '+221 76 234 56 78', skills: ['React', 'JavaScript', 'HTML/CSS', 'Git'],
      experience: '2 ans', bio: 'Développeur junior curieux et motivé, cherchant à intégrer une équipe agile dynamique.'
    },
    { 
      id: 3, name: 'Samba Diouf', job: 'UX Designer', date: '2026-04-27', status: 'Vérifié', score: 82,
      email: 'samba.diouf@email.com', phone: '+221 78 890 12 34', skills: ['Figma', 'Wireframing', 'User Research', 'Prototyping'],
      experience: '5 ans', bio: 'Designer UX axé sur la recherche utilisateur et l\'optimisation des parcours clients complexes.'
    },
    { 
      id: 4, name: 'Fatou Kane', job: 'Dev Frontend React', date: '2026-04-26', status: 'Inactif', score: 75,
      email: 'fatou.kane@email.com', phone: '+221 70 345 67 89', skills: ['React', 'Next.js', 'REST APIs'],
      experience: '3 ans', bio: 'Développeuse web polyvalente avec une solide maîtrise de Next.js.'
    },
    { 
      id: 5, name: 'Modou Fall', job: 'Chef de Projet', date: '2026-04-25', status: 'Vérifié', score: 91,
      email: 'modou.fall@email.com', phone: '+221 77 321 09 87', skills: ['Agile', 'Scrum', 'Jira', 'Planning'],
      experience: '8 ans', bio: 'Scrum Master certifié avec une large expérience de la gestion d\'équipes de développement.'
    },
  ])

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesJob = jobFilter === 'Toutes les offres' || app.job === jobFilter
    return matchesSearch && matchesJob
  })

  const handleUpdateStatus = (id: number, newStatus: string) => {
    setApplications(prev => 
      prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
    )
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null)
    }
  }

  return (
    <DashboardLayout role="company" userName="Sonatel Digital" userTitle="Compte Entreprise">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Candidatures reçues</h1>
        <p className="text-slate-500 text-sm mt-0.5">Gerez et evaluez les profils des candidats</p>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un candidat..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={jobFilter} 
              onChange={e => setJobFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl text-xs px-3 py-2 outline-none cursor-pointer"
            >
              <option value="Toutes les offres">Toutes les offres</option>
              <option value="Dev Frontend React">Dev Frontend React</option>
              <option value="UX Designer">UX Designer</option>
              <option value="Chef de Projet">Chef de Projet</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Candidat</th>
                <th className="px-6 py-4">Offre visée</th>
                <th className="px-6 py-4">Score Matching</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map(app => (
                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={app.name} size="sm" />
                      <p className="text-sm font-bold text-slate-800">{app.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{app.job}</td>
                  <td className="px-6 py-4">
                    <MatchScore score={app.score} size="sm" />
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {new Date(app.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        title="Voir le profil" 
                        onClick={() => setSelectedApp(app)}
                        className="p-2 text-slate-400 hover:text-brand-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        title="Envoyer un message" 
                        onClick={() => navigate('/dashboard/company/messages')}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400 text-sm">
                    Aucun candidat trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CV Detail Drawer */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Background Overlay */}
            <div 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
              onClick={() => setSelectedApp(null)}
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-lg transform bg-white shadow-2xl transition-all duration-300 border-l border-slate-200 flex flex-col">
                {/* Header */}
                <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Dossier de candidature</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedApp.job}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedApp(null)}
                    className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Avatar & Contact */}
                  <div className="flex items-center gap-4">
                    <Avatar name={selectedApp.name} size="lg" />
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{selectedApp.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{selectedApp.experience} d'expérience</p>
                      <div className="flex flex-col gap-0.5 mt-2 text-xs text-slate-400">
                        <span>Email: {selectedApp.email}</span>
                        <span>Tél: {selectedApp.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary / Bio */}
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Profil professionnel</h4>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      {selectedApp.bio}
                    </p>
                  </div>

                  {/* Matching score & status */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card p-4 text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Score Matching</p>
                      <MatchScore score={selectedApp.score} />
                    </div>
                    <div className="card p-4 text-center flex flex-col items-center justify-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Statut</p>
                      <StatusBadge status={selectedApp.status} />
                    </div>
                  </div>

                  {/* Matched skills */}
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">Compétences clés</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedApp.skills.map(s => (
                        <span key={s} className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-xl border border-brand-100">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Resume file card */}
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">Curriculum Vitae</h4>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <div className="w-10 h-10 bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs rounded-xl">
                        PDF
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">CV_{selectedApp.name.replace(' ', '_')}.pdf</p>
                        <p className="text-[10px] text-slate-400">Document Principal · 185 Ko</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      leftIcon={<XCircle className="w-4 h-4 text-red-500" />}
                      onClick={() => handleUpdateStatus(selectedApp.id, 'Inactif')}
                    >
                      Refuser
                    </Button>
                    <Button 
                      size="sm" 
                      leftIcon={<CheckCircle className="w-4 h-4 text-emerald-500" />}
                      onClick={() => handleUpdateStatus(selectedApp.id, 'Vérifié')}
                    >
                      Sélectionner
                    </Button>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    leftIcon={<Calendar className="w-4 h-4 text-purple-600" />}
                    onClick={() => navigate('/dashboard/company/messages')}
                  >
                    Entretien
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
