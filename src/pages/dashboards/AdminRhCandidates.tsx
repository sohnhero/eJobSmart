import {
  Users, Search, Filter, Mail,
  Phone, Shield, MoreVertical, CheckCircle,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'

const allCandidates = [
  { id: 1, name: 'Moussa Sene', role: 'Dev Backend', status: 'Actif', verified: true },
  { id: 2, name: 'Awa Diop', role: 'Data Scientist', status: 'Inactif', verified: false },
  { id: 3, name: 'Yoro Fall', role: 'Product Manager', status: 'Actif', verified: true },
]

export default function AdminRhCandidates() {
  return (
    <DashboardLayout role="admin-rh" userName="Admin RH Internal">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Candidats inscrits</h1>
          <p className="text-slate-500 text-sm mt-0.5">Modération et vérification des comptes candidats</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" leftIcon={<Shield className="w-4 h-4" />}>Vérifier les profils</Button>
        </div>
      </div>

      <div className="card">
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
              {allCandidates.map(c => (
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
                    {c.verified ? (
                      <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                        <CheckCircle className="w-3.5 h-3.5" /> Profil vérifié
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">Non vérifié</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={c.status === 'Actif' ? 'green' : 'slate'} size="sm">{c.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button className="p-2 text-slate-400 hover:text-blue-600"><Mail className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-slate-600"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
