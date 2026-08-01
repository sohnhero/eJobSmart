import { useState, useEffect } from 'react'
import {
  FileText, CheckCircle2, AlertCircle, Trash2
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { StatusBadge } from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import { applicationsService } from '../../lib/services/applications'
import { extractApiErrorMessage } from '../../lib/api'
import type { Application } from '../../lib/types'

const TERMINAL = ['Acceptée', 'Refusée', 'Annulée']

export default function FreelanceProposals() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [proposals, setProposals] = useState<Application[]>([])

  const load = () => {
    setLoading(true)
    applicationsService.mine().then(setProposals).catch(() => setProposals([])).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleRetractProposal = async (app: Application, title: string) => {
    try {
      await applicationsService.cancel(app._id)
      setProposals(prev => prev.filter(p => p._id !== app._id))
      toast.warning(`La proposition pour "${title}" a été retirée.`)
    } catch (err) {
      toast.error(extractApiErrorMessage(err))
    }
  }

  return (
    <DashboardLayout role="freelance">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          Mes propositions <FileText className="w-5 h-5 text-blue-600" />
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">Suivi de vos offres commerciales, devis et feedbacks clients</p>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6">
            <Skeleton variant="table" count={1} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Projet / Mission</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Envoyée le</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {proposals.map(p => {
                  const job = typeof p.job === 'string' ? null : p.job
                  return (
                    <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{job?.title ?? 'Mission'}</p>
                          <p className="text-xs text-slate-400">{job?.companyName}</p>
                          {p.coverLetter && (
                            <p className="mt-1 text-[11px] text-slate-500 whitespace-pre-line">{p.coverLetter}</p>
                          )}
                          {p.status === 'Refusée' && p.rejectionReason && (
                            <div className="mt-2 p-2.5 rounded-xl text-xs flex gap-2 bg-red-50/70 text-red-800">
                              <AlertCircle className="w-4 h-4 flex-shrink-0" />
                              <span className="leading-snug"><strong>Retour client :</strong> {p.rejectionReason}</span>
                            </div>
                          )}
                          {p.status === 'Acceptée' && (
                            <div className="mt-2 p-2.5 rounded-xl text-xs flex gap-2 bg-emerald-50 text-emerald-800">
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                              <span className="leading-snug">Votre proposition a été acceptée !</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                        {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!TERMINAL.includes(p.status) ? (
                          <button
                            onClick={() => handleRetractProposal(p, job?.title ?? 'cette mission')}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            title="Retirer la proposition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-xs text-slate-300">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })}

                {proposals.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-400 text-sm">
                      Vous n'avez soumis aucune proposition pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
