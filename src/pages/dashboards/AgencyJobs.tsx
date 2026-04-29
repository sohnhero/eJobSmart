import {
  Plus, Search, Filter, Briefcase,
  Users, CheckCircle, Clock, MoreVertical,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const placementOffers = [
  { id: 1, title: 'Architecte Cloud', client: 'Bank of Africa', positions: 2, applicants: 15, status: 'Active' },
  { id: 2, title: 'Directeur Commercial', client: 'Teyliom', positions: 1, applicants: 8, status: 'Active' },
  { id: 3, title: 'Analyste Cyber', client: 'Orange SN', positions: 3, applicants: 24, status: 'Fermée' },
]

export default function AgencyJobs() {
  return (
    <DashboardLayout role="agency" userName="Cabinet Excellence RH">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Offres de placement</h1>
          <p className="text-slate-500 text-sm mt-0.5">Gérez les besoins en recrutement de vos clients</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>Nouvelle offre client</Button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Poste & Client</th>
                <th className="px-6 py-4">Besoins</th>
                <th className="px-6 py-4">Candidats</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {placementOffers.map(offer => (
                <tr key={offer.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800">{offer.title}</p>
                    <p className="text-xs text-slate-400">{offer.client}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{offer.positions} poste(s)</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-700">{offer.applicants}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={offer.status === 'Active' ? 'green' : 'slate'} size="sm">
                      {offer.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button className="p-2 text-slate-400 hover:text-brand-600"><Briefcase className="w-4 h-4" /></button>
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
