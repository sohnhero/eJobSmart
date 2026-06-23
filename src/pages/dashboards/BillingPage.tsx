import { useState } from 'react'
import {
  CreditCard, CheckCircle, Download,
  TrendingUp, Calendar, AlertCircle,
  Plus, ArrowRight,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

export default function BillingPage({ role = 'company' }: { role?: 'company' | 'agency' }) {
  const [activePlan, setActivePlan] = useState('Pro')

  const invoices = [
    { id: 'INV-2026-001', date: '2026-04-01', amount: '120,000 FCFA', status: 'Payée', method: 'Wave' },
    { id: 'INV-2026-002', date: '2026-03-01', amount: '120,000 FCFA', status: 'Payée', method: 'Carte Bancaire' },
    { id: 'INV-2026-003', date: '2026-02-01', amount: '120,000 FCFA', status: 'Payée', method: 'Orange Money' },
  ]

  const companyPlans = [
    { name: 'Standard', price: '45,000', features: ['5 offres actives', 'Stats basiques', 'Base CV (10 crédits)'] },
    { name: 'Pro', price: '120,000', features: ['Offres illimitées', 'Matching AI', 'Base CV complète', 'Support prioritaire'] },
    { name: 'Elite', price: '250,000', features: ['Tout Pro', 'Branding Employeur', 'Multi-utilisateurs', 'API Access'] },
  ]

  const agencyPlans = [
    { name: 'Standard', price: '30,000', features: ['20 ressources actives', '5 offres/mois', 'Stats basiques'] },
    { name: 'Avancé', price: '85,000', features: ['Ressources illimitées', 'Offres illimitées', 'Analytics avancés'] },
    { name: 'Partenaire', price: '150,000', features: ['Tout Avancé', 'Co-branding', 'Accès direct Admin RH'] },
  ]

  const plans = role === 'company' ? companyPlans : agencyPlans

  return (
    <DashboardLayout role={role}>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Abonnement & Facturation</h1>
        <p className="text-slate-500 text-sm mt-0.5">Gérez vos plans, vos crédits et vos factures</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Current Plan */}
        <div className="lg:col-span-2 card p-6 border-l-4 border-l-brand-600 bg-gradient-to-br from-white to-brand-50/20">
          <div className="flex items-start justify-between mb-6">
            <div>
              <Badge variant="blue" className="mb-2">Plan Actuel</Badge>
              <h2 className="text-3xl font-black text-slate-900">{role === 'company' ? 'Entreprise Pro' : 'Cabinet Avancé'}</h2>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Prochain renouvellement le 1 Mai 2026
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-brand-600">{role === 'company' ? '120,000' : '85,000'} <span className="text-xs font-normal text-slate-400">FCFA/mois</span></p>
              <button className="text-xs font-bold text-brand-600 hover:underline mt-1">Changer de mode de paiement</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-6">
            <div className="p-3 bg-white rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Crédits Base CV</p>
              <p className="text-lg font-black text-slate-900">Illimité</p>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Offres Boostées</p>
              <p className="text-lg font-black text-slate-900">3 <span className="text-xs font-normal text-slate-400">restantes</span></p>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Espaces Equipe</p>
              <p className="text-lg font-black text-slate-900">5 / 10</p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="card p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Mode de paiement</h3>
          <div className="p-4 border-2 border-brand-500 bg-brand-50/30 rounded-2xl relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 bg-white border border-slate-200 rounded flex items-center justify-center font-bold text-[10px] text-blue-800 italic">VISA</div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-800">•••• 4242</p>
                <p className="text-[10px] text-slate-400">Expire le 12/28</p>
              </div>
              <CheckCircle className="w-4 h-4 text-brand-600" />
            </div>
          </div>
          <button className="w-full py-3 border border-dashed border-slate-300 rounded-2xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Ajouter un mode de paiement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Plans Selection */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Comparer les plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map(plan => (
              <div key={plan.name} className={`card p-5 transition-all ${activePlan === plan.name ? 'ring-2 ring-brand-600 border-transparent shadow-xl' : 'hover:border-brand-200'}`}>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{plan.name}</h3>
                <p className="text-xl font-black text-slate-900 mb-4">{plan.price} <span className="text-[10px] font-normal text-slate-400">FCFA</span></p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="text-[10px] text-slate-600 flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-emerald-500" /> {f}
                    </li>
                  ))}
                </ul>
                <Button 
                  fullWidth 
                  size="sm" 
                  variant={activePlan === plan.name ? 'primary' : 'secondary'}
                  disabled={activePlan === plan.name}
                  onClick={() => setActivePlan(plan.name)}
                >
                  {activePlan === plan.name ? 'Plan Actuel' : 'Choisir'}
                </Button>
              </div>
            ))}
          </div>

          {/* Invoices */}
          <div className="card">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Historique des factures</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-3">N° Facture</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Montant</th>
                    <th className="px-6 py-3">Mode</th>
                    <th className="px-6 py-3">Statut</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map(inv => (
                    <tr key={inv.id} className="text-xs hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-700">{inv.id}</td>
                      <td className="px-6 py-4 text-slate-500">{new Date(inv.date).toLocaleDateString('fr-FR')}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">{inv.amount}</td>
                      <td className="px-6 py-4 text-slate-500">{inv.method}</td>
                      <td className="px-6 py-4"><Badge variant="green" size="sm">{inv.status}</Badge></td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-brand-600 transition-colors"><Download className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Units / Boosts */}
        <div className="space-y-6">
          <div className="card p-6 bg-slate-900 text-white">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-400" /> Booster vos offres
            </h3>
            <p className="text-xs text-slate-400 mb-6">Mettez vos annonces en tête de liste pour attirer 3x plus de candidats qualifiés.</p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xs font-medium">1 Boost (7 jours)</span>
                <span className="text-xs font-bold text-brand-400">15,000 FCFA</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xs font-medium">Pack 5 Boosts</span>
                <span className="text-xs font-bold text-brand-400">60,000 FCFA</span>
              </div>
            </div>
            <Button fullWidth size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>Acheter des crédits</Button>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-3 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" /> Besoin d'aide ?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Une question sur votre facture ou sur nos plans d'abonnement ? Notre équipe support est à votre disposition.
            </p>
            <button className="mt-3 text-xs font-bold text-brand-600 hover:underline">Contacter le support</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
