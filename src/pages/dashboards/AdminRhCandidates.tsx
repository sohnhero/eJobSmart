import { useState } from 'react'
import {
  Users, Search, Filter, Mail,
  Phone, Shield, MoreVertical, CheckCircle, X, CheckSquare
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'

interface CandidateRecord {
  id: number
  name: string
  role: string
  status: 'Actif' | 'Inactif'
  verified: boolean
}

export default function AdminRhCandidates() {
  const [query, setQuery] = useState('')
  const [candidates, setCandidates] = useState<CandidateRecord[]>([
    { id: 1, name: 'Moussa Sene', role: 'Dev Backend', status: 'Actif', verified: true },
    { id: 2, name: 'Awa Diop', role: 'Data Scientist', status: 'Inactif', verified: false },
    { id: 3, name: 'Yoro Fall', role: 'Product Manager', status: 'Actif', verified: true },
  ])

  const handleToggleVerify = (id: number) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, verified: !c.verified } : c))
  }

  const handleToggleStatus = (id: number) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'Actif' ? 'Inactif' : 'Actif' } : c))
  }

  const filtered = candidates.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.role.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <DashboardLayout role="admin-rh" userName="Admin RH Internal">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Candidats inscrits</h1>
          <p className="text-slate-500 text-sm mt-0.5">Modération et vérification des comptes candidats</p>
        </div>
      </div>

      <div className="card">
        {/* Search */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Rechercher un candidat..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Candidat</th>
                <th className="px-6 py-4">Vérification</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={c.name} size="sm" />
                      <div>
                        <p className="text-sm font-bold text-slate-800">{c.name}</p>
                        <p className="text-xs text-slate-400">{c.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggleVerify(c.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                        c.verified 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      {c.verified ? 'Vérifié' : 'Non vérifié'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggleStatus(c.id)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                        c.status === 'Actif' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {c.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Contacter par mail">
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-400 text-sm">
                    Aucun candidat trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
