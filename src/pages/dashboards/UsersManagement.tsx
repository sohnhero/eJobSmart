import { useState } from 'react'
import {
  Users, UserPlus, Search, Filter,
  MoreVertical, Shield, ShieldAlert,
  CheckCircle, XCircle, Mail,
  Download, Edit3, Trash2, X
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'

interface UserRecord {
  id: number
  name: string
  email: string
  role: string
  status: 'Vérifié' | 'En attente' | 'Inactif'
  joinDate: string
  lastLogin: string
}

export default function UsersManagement() {
  const [query, setQuery] = useState('')
  const [filterRole, setFilterRole] = useState('All')
  
  // User creation state
  const [showAddModal, setShowAddModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState('Candidat')

  const [userList, setUserList] = useState<UserRecord[]>([
    { id: 1, name: 'Amadou Diallo', email: 'amadou@gmail.com', role: 'Candidat', status: 'Vérifié', joinDate: '2026-04-20', lastLogin: 'Il y a 2h' },
    { id: 2, name: 'Sonatel Digital', email: 'hr@sonatel.sn', role: 'Entreprise', status: 'Vérifié', joinDate: '2026-03-15', lastLogin: 'Il y a 10m' },
    { id: 3, name: 'Cabinet Excellence', email: 'contact@excellence.sn', role: 'Cabinet RH', status: 'Vérifié', joinDate: '2026-04-02', lastLogin: 'Hier' },
    { id: 4, name: 'Fatou Kane', email: 'fkane@dev.sn', role: 'Freelance', status: 'En attente', joinDate: '2026-04-28', lastLogin: 'Jamais' },
    { id: 5, name: 'Modou Fall', email: 'modou@admin.sn', role: 'Admin RH', status: 'Vérifié', joinDate: '2026-01-10', lastLogin: 'Il y a 5m' },
  ])

  const handleDeleteUser = (id: number) => {
    setUserList(prev => prev.filter(u => u.id !== id))
  }

  const handleToggleSuspend = (id: number) => {
    setUserList(prev => prev.map(u => 
      u.id === id 
        ? { ...u, status: u.status === 'Inactif' ? 'Vérifié' : 'Inactif' } 
        : u
    ))
  }

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newEmail.trim()) return

    const newUser: UserRecord = {
      id: Date.now(),
      name: newName,
      email: newEmail,
      role: newRole,
      status: 'Vérifié',
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: 'Jamais'
    }

    setUserList(prev => [newUser, ...prev])
    setShowAddModal(false)
    setNewName('')
    setNewEmail('')
    setNewRole('Candidat')
  }

  const filteredUsers = userList.filter(u => {
    const matchesQuery = u.name.toLowerCase().includes(query.toLowerCase()) || 
                         u.email.toLowerCase().includes(query.toLowerCase())
    const matchesRole = filterRole === 'All' || u.role === filterRole
    return matchesQuery && matchesRole
  })

  return (
    <DashboardLayout role="admin" userName="Super Admin">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Gestion des Utilisateurs</h1>
          <p className="text-slate-500 text-sm mt-0.5">Contrôle total sur les comptes et les permissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setShowAddModal(true)} leftIcon={<UserPlus className="w-4 h-4" />}>
            Créer Utilisateur
          </Button>
        </div>
      </div>

      <div className="card">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>
            <select
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl text-sm px-4 py-2 outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
            >
              <option value="All">Tous les rôles</option>
              <option value="Candidat">Candidats</option>
              <option value="Freelance">Freelances</option>
              <option value="Entreprise">Entreprises</option>
              <option value="Cabinet RH">Cabinets RH</option>
              <option value="Admin RH">Admin RH</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Utilisateur</th>
                <th className="px-6 py-4">Rôle</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Date d'inscription</th>
                <th className="px-6 py-4">Dernière connexion</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} size="sm" />
                      <div>
                        <p className="text-sm font-bold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Badge variant={
                      user.role === 'Entreprise' ? 'purple' :
                      user.role === 'Cabinet RH' ? 'green' :
                      user.role === 'Freelance' ? 'blue' :
                      user.role === 'Admin RH' ? 'amber' : 'slate'
                    }>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(user.joinDate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => handleToggleSuspend(user.id)}
                        title={user.status === 'Inactif' ? 'Activer' : 'Suspendre'}
                        className={`p-2 rounded-lg transition-colors ${user.status === 'Inactif' ? 'text-emerald-600 hover:bg-emerald-50' : 'text-amber-600 hover:bg-amber-50'}`}
                      >
                        <ShieldAlert className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        title="Supprimer" 
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400 text-sm">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden border border-slate-100">
            <form onSubmit={handleAddUserSubmit}>
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-black text-slate-900">Créer un utilisateur</h3>
                <button type="button" onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nom / Raison Sociale</label>
                  <input 
                    type="text" placeholder="ex: Amadou Diallo, Sonatel..." required
                    value={newName} onChange={e => setNewName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Adresse email</label>
                  <input 
                    type="email" placeholder="email@domaine.com" required
                    value={newEmail} onChange={e => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Rôle initial</label>
                  <select 
                    value={newRole} onChange={e => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
                  >
                    <option value="Candidat">Candidat</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Entreprise">Entreprise</option>
                    <option value="Cabinet RH">Cabinet RH</option>
                    <option value="Admin RH">Admin RH</option>
                  </select>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>Annuler</Button>
                <Button type="submit" size="sm">Créer l'utilisateur</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
