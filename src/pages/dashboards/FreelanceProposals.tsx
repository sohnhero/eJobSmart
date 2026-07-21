import { useState, useEffect } from 'react'
import {
  FileText, Clock, DollarSign, CheckCircle2, XCircle, AlertCircle, Trash2
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'

interface Proposal {
  id: number
  title: string
  company: string
  submittedRate: number
  duration: string
  status: 'En cours' | 'Accepté' | 'Refusé'
  feedback?: string
}

export default function FreelanceProposals() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: 1,
      title: 'Audit de Performance Frontend Next.js',
      company: 'Wari Cash',
      submittedRate: 550000,
      duration: '4 jours',
      status: 'En cours',
    },
    {
      id: 2,
      title: 'Intégration Maquettes React & Tailwind',
      company: 'InnoTech Senegal',
      submittedRate: 450000,
      duration: '6 jours',
      status: 'Accepté',
      feedback: 'Félicitations ! Notre équipe technique a validé votre profil. Le contrat commence lundi.',
    },
    {
      id: 3,
      title: 'Migration de Base de Données vers AWS Postgres',
      company: 'Express Logistique',
      submittedRate: 900000,
      duration: '14 jours',
      status: 'Refusé',
      feedback: 'Nous avons retenu une proposition avec une expertise AWS DMS plus significative. Merci.',
    }
  ])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const handleRetractProposal = (id: number, title: string) => {
    setProposals(prev => prev.filter(p => p.id !== id))
    toast.warning(`La proposition pour "${title}" a été retirée.`)
  }

  return (
    <DashboardLayout role="freelance" userName="Modou Fall" userTitle="Consultant Tech">
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
                  <th className="px-6 py-4">Tarif proposé</th>
                  <th className="px-6 py-4">Temps proposé</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {proposals.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{p.title}</p>
                        <p className="text-xs text-slate-400">{p.company}</p>
                        {p.feedback && (
                          <div className={`mt-2 p-2.5 rounded-xl text-xs flex gap-2 ${
                            p.status === 'Accepté' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50/70 text-red-800'
                          }`}>
                            {p.status === 'Accepté' ? (
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            )}
                            <span className="leading-snug"><strong>Retour client :</strong> {p.feedback}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                      {p.submittedRate.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                      {p.duration}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={p.status === 'Accepté' ? 'green' : p.status === 'Refusé' ? 'red' : 'blue'}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {p.status === 'En cours' ? (
                        <button 
                          onClick={() => handleRetractProposal(p.id, p.title)}
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
                ))}

                {proposals.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400 text-sm">
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
