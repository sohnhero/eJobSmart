import { useState, useEffect } from 'react'
import {
  CreditCard, DollarSign, ArrowUpRight, CheckCircle, FileText, Plus, Download, X
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'

interface Invoice {
  id: number
  ref: string
  client: string
  amount: number
  date: string
  status: 'Réglé' | 'Envoyé' | 'En retard'
}

export default function AgencyBilling() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)

  // Invoices list state
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 1, ref: 'FAC-2026-089', client: 'Sonatel Digital', amount: 1500000, date: '2026-06-10', status: 'Réglé' },
    { id: 2, ref: 'FAC-2026-090', client: 'Wave Senegal', amount: 2200000, date: '2026-06-22', status: 'Envoyé' },
    { id: 3, ref: 'FAC-2026-088', client: 'AXA Assurances', amount: 1800000, date: '2026-05-18', status: 'Réglé' },
  ])

  // New Invoice Modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [newClient, setNewClient] = useState('')
  const [newAmount, setNewAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleAddInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClient.trim() || !newAmount.trim()) return

    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 800))
    setIsSubmitting(false)

    const newInv: Invoice = {
      id: Date.now(),
      ref: `FAC-2026-0${invoices.length + 91}`,
      client: newClient,
      amount: Number(newAmount),
      date: new Date().toISOString().split('T')[0],
      status: 'Envoyé',
    }

    setInvoices(prev => [newInv, ...prev])
    setShowAddModal(false)
    setNewClient('')
    setNewAmount('')
    toast.success(`Facture ${newInv.ref} générée et envoyée à ${newClient} !`)
  }

  const handleDownloadInvoice = (ref: string) => {
    toast.success(`Téléchargement du PDF de la facture ${ref} lancé.`)
  }

  return (
    <DashboardLayout role="agency" userName="Cabinet Talent RH" userTitle="Directeur Associé">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            Facturation & Honoraires <CreditCard className="w-5 h-5 text-emerald-600" />
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Émettez des factures d'honoraires de placement et suivez les règlements clients</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setShowAddModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Créer une facture
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
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chiffre d'affaires facturé</p>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                {invoices.reduce((acc, inv) => acc + inv.amount, 0).toLocaleString('fr-FR')} FCFA
              </h3>
            </div>
            <div className="card p-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Honoraires encaissés</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-2">
                {invoices.filter(inv => inv.status === 'Réglé').reduce((acc, inv) => acc + inv.amount, 0).toLocaleString('fr-FR')} FCFA
              </h3>
            </div>
            <div className="card p-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">En attente de paiement</p>
              <h3 className="text-2xl font-black text-amber-600 mt-2">
                {invoices.filter(inv => inv.status === 'Envoyé').reduce((acc, inv) => acc + inv.amount, 0).toLocaleString('fr-FR')} FCFA
              </h3>
            </div>
          </div>

          {/* Invoices list */}
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Historique des honoraires de placement</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Référence</th>
                    <th className="px-6 py-4">Client partenaire</th>
                    <th className="px-6 py-4">Date d'émission</th>
                    <th className="px-6 py-4">Montant HT</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800 text-xs">{inv.ref}</td>
                      <td className="px-6 py-4 text-xs text-slate-600 font-semibold">{inv.client}</td>
                      <td className="px-6 py-4 text-xs text-slate-400">{new Date(inv.date).toLocaleDateString('fr-FR')}</td>
                      <td className="px-6 py-4 text-xs font-black text-slate-900">{inv.amount.toLocaleString('fr-FR')} FCFA</td>
                      <td className="px-6 py-4">
                        <Badge variant={inv.status === 'Réglé' ? 'green' : inv.status === 'En retard' ? 'red' : 'blue'}>{inv.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDownloadInvoice(inv.ref)}
                          className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-brand-600"
                          title="Télécharger la facture PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Invoice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isSubmitting && setShowAddModal(false)} />
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden border border-slate-100">
            <form onSubmit={handleAddInvoiceSubmit}>
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-black text-slate-900">Émettre une facture</h3>
                <button type="button" onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Client partenaire</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Sonatel Digital"
                    value={newClient}
                    onChange={e => setNewClient(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Montant Honoraires (FCFA)</label>
                  <input
                    type="number"
                    required
                    placeholder="ex: 1500000"
                    value={newAmount}
                    onChange={e => setNewAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>Annuler</Button>
                <Button type="submit" size="sm" loading={isSubmitting}>Émettre la facture</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
