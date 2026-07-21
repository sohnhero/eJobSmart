import { useState, useEffect } from 'react'
import {
  CreditCard, DollarSign, ArrowUpRight, TrendingUp, CheckCircle, Clock, X
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'

interface Transaction {
  id: number
  ref: string
  description: string
  amount: number
  date: string
  status: 'Payé' | 'En attente'
}

export default function FreelanceBilling() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)

  // Interactive Balance state
  const [balance, setBalance] = useState(1250000) // 1.25M FCFA
  const [withdrawn, setWithdrawn] = useState(1800000) // 1.8M FCFA
  const [pending, setPending] = useState(0)

  // Withdraw request modal state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawMethod, setWithdrawMethod] = useState('Wave')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, ref: 'INV-2026-004', description: 'Intégration Maquettes React - InnoTech', amount: 450000, date: '2026-06-15', status: 'Payé' },
    { id: 2, ref: 'INV-2026-003', description: 'Audit Sec Web - Ecobank (Jalon 1)', amount: 600000, date: '2026-06-01', status: 'Payé' },
    { id: 3, ref: 'INV-2026-005', description: 'Migration DB AWS - Express Logistique', amount: 950000, date: '2026-06-20', status: 'En attente' },
  ])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number(withdrawAmount)
    if (!withdrawAmount || amount <= 0) return

    if (amount > balance) {
      toast.error('Solde disponible insuffisant pour ce montant.')
      return
    }

    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    setIsSubmitting(false)

    setBalance(prev => prev - amount)
    setPending(prev => prev + amount)
    setShowWithdrawModal(false)
    setWithdrawAmount('')
    setPhoneNumber('')
    toast.success(`Demande de retrait de ${amount.toLocaleString('fr-FR')} FCFA via ${withdrawMethod} enregistrée !`)
  }

  return (
    <DashboardLayout role="freelance" userName="Modou Fall" userTitle="Consultant Tech">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            Gestion financière & Factures <CreditCard className="w-5 h-5 text-blue-600" />
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Suivez vos gains, facturez vos clients et demandez des retraits de fonds</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setShowWithdrawModal(true)} leftIcon={<ArrowUpRight className="w-4 h-4" />}>
            Demander un retrait
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <Skeleton variant="card" count={1} />
          <Skeleton variant="table" count={1} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-5 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
              <p className="text-xs font-bold text-blue-100 uppercase tracking-wider">Solde disponible</p>
              <h3 className="text-2xl font-black mt-2">{balance.toLocaleString('fr-FR')} FCFA</h3>
              <p className="text-[10px] text-blue-200 mt-2">Prêt à être retiré vers vos portefeuilles mobiles</p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Retraits effectués</p>
              <h3 className="text-2xl font-black text-slate-900 mt-2">{withdrawn.toLocaleString('fr-FR')} FCFA</h3>
              <p className="text-[10px] text-emerald-600 font-semibold mt-2">✓ Tous les virements confirmés</p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Retraits en attente</p>
              <h3 className="text-2xl font-black text-slate-900 mt-2">{pending.toLocaleString('fr-FR')} FCFA</h3>
              <p className="text-[10px] text-slate-400 mt-2">{pending > 0 ? 'En cours de validation...' : 'Aucun retrait en cours'}</p>
            </div>
          </div>

          {/* Transactions Log */}
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Historique des transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Référence</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Montant</th>
                    <th className="px-6 py-4">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800 text-xs">{t.ref}</td>
                      <td className="px-6 py-4 text-xs text-slate-600 font-medium">{t.description}</td>
                      <td className="px-6 py-4 text-xs text-slate-400">{new Date(t.date).toLocaleDateString('fr-FR')}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-900">{t.amount.toLocaleString('fr-FR')} FCFA</td>
                      <td className="px-6 py-4">
                        <Badge variant={t.status === 'Payé' ? 'green' : 'blue'}>{t.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Request Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isSubmitting && setShowWithdrawModal(false)} />
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden border border-slate-100">
            <form onSubmit={handleWithdrawSubmit}>
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-black text-slate-900">Demander un retrait</h3>
                <button type="button" onClick={() => setShowWithdrawModal(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Mode de retrait</label>
                  <select 
                    value={withdrawMethod} 
                    onChange={e => setWithdrawMethod(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none cursor-pointer"
                  >
                    <option value="Wave">Wave Sénégal</option>
                    <option value="Orange Money">Orange Money</option>
                    <option value="Virement Bancaire">Virement Bancaire</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Numéro de téléphone / Compte</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: +221 77 123 45 67"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Montant à retirer (FCFA)</label>
                  <input
                    type="number"
                    required
                    min="5000"
                    placeholder="ex: 200000"
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Solde disponible actuel : {balance.toLocaleString('fr-FR')} FCFA</p>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowWithdrawModal(false)}>Annuler</Button>
                <Button type="submit" size="sm" loading={isSubmitting}>Lancer le retrait</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
