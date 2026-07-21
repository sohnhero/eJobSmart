import { useState, useEffect } from 'react'
import {
  Search, Filter, MapPin, UserCheck, FileText, CheckCircle, AlertTriangle, Eye, Sparkles
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'

interface CVRecord {
  id: number
  name: string
  role: string
  location: string
  skills: string[]
  experience: string
  verified: boolean
  matchRate: number
}

export default function AdminRhCvDatabase() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [cvs, setCvs] = useState<CVRecord[]>([
    { id: 1, name: 'Aminata Sow', role: 'Expert Finance', location: 'Dakar, SN', skills: ['Audit', 'Comptabilité', 'SAP'], experience: '7 ans', verified: true, matchRate: 98 },
    { id: 2, name: 'Samba Diouf', role: 'Architecte Cloud', location: 'Saint-Louis, SN', skills: ['AWS', 'Docker', 'Kubernetes'], experience: '5 ans', verified: true, matchRate: 92 },
    { id: 3, name: 'Awa Ndiaye', role: 'UX Designer', location: 'Thiès, SN', skills: ['Figma', 'Prototypage', 'User Testing'], experience: '3 ans', verified: false, matchRate: 85 },
  ])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleToggleVerify = (id: number, name: string) => {
    setCvs(prev => prev.map(c => {
      if (c.id === id) {
        const nextState = !c.verified
        toast.success(nextState ? `Dossier de ${name} validé !` : `Validation retirée pour ${name}.`)
        return { ...c, verified: nextState }
      }
      return c
    }))
  }

  const handleFlagTalent = (name: string) => {
    toast.info(`Talent ${name} signalé pour examen approfondi.`)
  }

  const filteredCvs = cvs.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout role="admin-rh" userName="Admin RH Internal" userTitle="Vivier Manager">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          Base Vivier de Talents <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">Base de données interne de l'ensemble des dossiers de compétences inscrits</p>
      </div>

      <div className="card">
        {/* Search */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, rôle..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
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
                  <th className="px-6 py-4">Talent</th>
                  <th className="px-6 py-4">Expérience</th>
                  <th className="px-6 py-4">Compétences</th>
                  <th className="px-6 py-4 text-center">Score Matching</th>
                  <th className="px-6 py-4">Vérification</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCvs.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{c.name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {c.location} · {c.role}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-semibold">{c.experience}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {c.skills.map(s => (
                          <span key={s} className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-xs font-bold text-brand-600">{c.matchRate}%</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleVerify(c.id, c.name)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border ${
                          c.verified
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        {c.verified ? 'Certifié' : 'En attente'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button className="p-1.5 text-slate-400 hover:text-brand-600" title="Consulter CV"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleFlagTalent(c.name)} className="p-1.5 text-slate-400 hover:text-amber-600" title="Signaler"><AlertTriangle className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
