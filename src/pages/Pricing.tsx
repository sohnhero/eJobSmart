import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Zap, Star, Building2, Users, ArrowRight, HelpCircle, ShieldCheck, RefreshCw, CreditCard, Globe } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'

type Billing = 'monthly' | 'annual'

const plans = {
  candidate: [
    {
      name: 'Gratuit',
      price: { monthly: 0, annual: 0 },
      currency: 'FCFA',
      desc: 'Parfait pour commencer votre recherche d\'emploi',
      color: 'border-slate-200',
      btnVariant: 'secondary' as const,
      features: [
        'Profil candidat complet',
        'Postuler à 5 offres/mois',
        'Alertes emploi (2 max)',
        'Accès aux formations gratuites',
        'Messagerie avec recruteurs',
      ],
      missing: [
        'Score de matching avancé',
        'Profil mis en avant',
        'CV téléchargeable (entreprises)',
        'Accès prioritaire aux offres',
      ],
    },
    {
      name: 'Premium',
      price: { monthly: 5000, annual: 45000 },
      currency: 'FCFA',
      desc: 'Pour maximiser vos chances de trouver le bon poste',
      color: 'border-brand-500',
      popular: true,
      btnVariant: 'primary' as const,
      features: [
        'Candidatures illimitées',
        'Score de matching détaillé',
        'Profil mis en avant dans les résultats',
        'Alertes emploi illimitées',
        'Accès à toutes les formations',
        'Notifications SMS',
        'Export CV en PDF branded',
        'Statistiques de visibilité',
      ],
      missing: [],
    },
  ],
  company: [
    {
      name: 'Starter',
      price: { monthly: 75000, annual: 720000 },
      currency: 'FCFA',
      desc: 'Pour les PME qui commencent à recruter',
      color: 'border-slate-200',
      btnVariant: 'secondary' as const,
      features: [
        '5 offres actives simultanées',
        'Accès aux candidatures reçues',
        'Messagerie intégrée',
        'Tableau de bord basique',
        '2 recruteurs par compte',
      ],
      missing: [
        'Base CV propriétaire',
        'Scoring automatique',
        'Boost d\'offres',
        'Analytics avancés',
      ],
    },
    {
      name: 'Business',
      price: { monthly: 150000, annual: 1440000 },
      currency: 'FCFA',
      desc: 'La solution complète pour les entreprises actives',
      color: 'border-brand-500',
      popular: true,
      btnVariant: 'primary' as const,
      features: [
        'Offres actives illimitées',
        'Accès à la base CV propriétaire (500 profils/mois)',
        'Scoring & matching automatique',
        '5 boosts d\'offres inclus/mois',
        'Analytics & reporting avancés',
        'Multi-recruteurs (10 max)',
        'Kanban pipeline de recrutement',
        'Support prioritaire',
      ],
      missing: [],
    },
    {
      name: 'Enterprise',
      price: { monthly: -1, annual: -1 },
      currency: 'FCFA',
      desc: 'Pour les grandes entreprises avec besoins sur mesure',
      color: 'border-slate-900',
      btnVariant: 'secondary' as const,
      features: [
        'Tout le plan Business',
        'Base CV illimitée',
        'API d\'intégration ATS',
        'Account Manager dédié',
        'SLA garanti 99.9%',
        'SSO / LDAP',
        'Contrats-cadres et facturation centralisée',
        'Formation & onboarding équipe',
      ],
      missing: [],
    },
  ],
}

const faqs = [
  {
    q: 'Puis-je changer de plan à tout moment ?',
    a: 'Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment. Les changements prennent effet immédiatement et la facturation est ajustée au prorata.',
  },
  {
    q: 'Quels moyens de paiement acceptez-vous ?',
    a: 'Nous acceptons Orange Money, Wave, carte bancaire VISA/Mastercard, et virement bancaire pour les comptes Enterprise.',
  },
  {
    q: 'Y a-t-il un engagement de durée ?',
    a: 'Non, tous les plans sont sans engagement. Vous pouvez annuler à tout moment. Le plan annuel offre 2 mois offerts.',
  },
  {
    q: 'Qu\'est-ce que la base CV propriétaire ?',
    a: 'C\'est notre vivier de talents constitué de profils vérifiés et qualifiés. Les entreprises Business et Enterprise peuvent y accéder pour rechercher des candidats en dehors des candidatures reçues.',
  },
]

export default function Pricing() {
  const navigate = useNavigate()
  const [billing, setBilling] = useState<Billing>('monthly')
  const [audience, setAudience] = useState<'candidate' | 'company'>('company')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const currentPlans = plans[audience]

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-sm font-semibold text-blue-300 tracking-wider uppercase">Tarifs</span>
          <h1 className="text-3xl md:text-4xl font-black text-white mt-2 mb-3">
            Des plans adaptés à vos besoins
          </h1>
          <p className="text-blue-200 text-lg">
            Commencez gratuitement, évoluez à votre rythme. Pas de frais cachés.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Toggle audience */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-1.5 border border-slate-200 flex gap-1">
            <button
              onClick={() => setAudience('candidate')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${audience === 'candidate' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
            >
              <Users className="w-4 h-4" /> Candidats
            </button>
            <button
              onClick={() => setAudience('company')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${audience === 'company' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
            >
              <Building2 className="w-4 h-4" /> Entreprises & Cabinets
            </button>
          </div>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center items-center gap-4 mb-10">
          <button
            onClick={() => setBilling('monthly')}
            className={`text-sm font-semibold transition-colors ${billing === 'monthly' ? 'text-brand-600' : 'text-slate-400'}`}
          >
            Mensuel
          </button>
          <div
            onClick={() => setBilling(billing === 'monthly' ? 'annual' : 'monthly')}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${billing === 'annual' ? 'bg-brand-600' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${billing === 'annual' ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </div>
          <button
            onClick={() => setBilling('annual')}
            className={`text-sm font-semibold transition-colors ${billing === 'annual' ? 'text-brand-600' : 'text-slate-400'}`}
          >
            Annuel
            <span className="ml-1.5 text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">-20%</span>
          </button>
        </div>

        {/* Plans grid */}
        <div className={`grid grid-cols-1 gap-6 mb-16 ${currentPlans.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 max-w-3xl mx-auto'}`}>
          {currentPlans.map(plan => (
            <div key={plan.name} className={`card p-6 border-2 relative ${plan.color} ${(plan as typeof plan & { popular?: boolean }).popular ? 'shadow-premium' : ''}`}>
              {(plan as typeof plan & { popular?: boolean }).popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1 bg-brand-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    <Star className="w-3 h-3 fill-white" /> Populaire
                  </span>
                </div>
              )}

              <div className="mb-5">
                <h3 className="font-bold text-slate-900 text-lg mb-1">{plan.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{plan.desc}</p>
              </div>

              <div className="mb-6">
                {plan.price[billing] === -1 ? (
                  <div>
                    <p className="text-3xl font-black text-slate-900">Sur devis</p>
                    <p className="text-xs text-slate-400 mt-1">Contactez notre équipe commerciale</p>
                  </div>
                ) : plan.price[billing] === 0 ? (
                  <div>
                    <p className="text-3xl font-black text-slate-900">Gratuit</p>
                    <p className="text-xs text-slate-400 mt-1">Pour toujours</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-3xl font-black text-slate-900">
                      {plan.price[billing].toLocaleString('fr-FR')}
                      <span className="text-sm font-normal text-slate-400 ml-1">{plan.currency}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {billing === 'annual' ? 'par an, facturé annuellement' : 'par mois'}
                    </p>
                  </div>
                )}
              </div>

              <Button
                fullWidth
                variant={plan.btnVariant as 'primary' | 'secondary'}
                onClick={() => plan.price[billing] === -1 ? navigate('/contact') : navigate('/register?type=company')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {plan.price[billing] === -1 ? 'Nous contacter' : plan.price[billing] === 0 ? 'Commencer gratuitement' : 'Commencer'}
              </Button>

              <div className="mt-6 space-y-2.5">
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-emerald-600" />
                    </div>
                    <span className="text-sm text-slate-700">{f}</span>
                  </div>
                ))}
                {plan.missing?.map(f => (
                  <div key={f} className="flex items-start gap-2 opacity-40">
                    <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-1.5 h-0.5 bg-slate-400 rounded-full" />
                    </div>
                    <span className="text-sm text-slate-500 line-through">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-12 flex flex-wrap justify-center gap-8 text-center">
          {[
            { icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />, label: 'Paiement sécurisé SSL' },
            { icon: <RefreshCw className="w-5 h-5 text-blue-600" />, label: 'Sans engagement' },
            { icon: <CreditCard className="w-5 h-5 text-purple-600" />, label: 'Orange Money & Wave acceptés' },
            { icon: <Globe className="w-5 h-5 text-brand-600" />, label: 'Hébergé en Afrique de l\'Ouest' },
          ].map(t => (
            <div key={t.label} className="flex items-center gap-2.5">
              {t.icon}
              <span className="text-sm font-semibold text-slate-600">{t.label}</span>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-brand-600" />
            <h2 className="text-xl font-bold text-slate-900">Questions fréquentes</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-start justify-between p-5 text-left gap-4"
                >
                  <span className="font-semibold text-slate-900 text-sm">{faq.q}</span>
                  <Zap className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-all ${openFaq === i ? 'text-brand-600 rotate-180' : 'text-slate-400'}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}
