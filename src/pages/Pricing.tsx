import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Zap, Star, Building2, Users, ArrowRight, HelpCircle, ShieldCheck, RefreshCw, CreditCard, Globe, ChevronDown } from 'lucide-react'
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
  agency: [
    {
      name: 'Standard',
      price: { monthly: 45000, annual: 450000 },
      currency: 'FCFA',
      desc: 'Idéal pour les petits cabinets de recrutement',
      color: 'border-slate-200',
      btnVariant: 'secondary' as const,
      features: [
        '20 ressources actives',
        '5 offres/mois',
        'Gestion de portefeuille RH',
        'Messagerie candidats',
      ],
      missing: ['Analytics avancés', 'Matching AI', 'Exports Excel'],
    },
    {
      name: 'Avancé',
      price: { monthly: 120000, annual: 1200000 },
      currency: 'FCFA',
      desc: 'Pour les cabinets en pleine croissance',
      color: 'border-brand-500',
      popular: true,
      btnVariant: 'primary' as const,
      features: [
        'Ressources illimitées',
        'Offres illimitées',
        'Analytics de placement',
        'Matching AI ressources/offres',
        'Exportation de données',
      ],
      missing: [],
    },
    {
      name: 'Partenaire',
      price: { monthly: 250000, annual: 2500000 },
      currency: 'FCFA',
      desc: 'L\'offre ultime pour les grands cabinets',
      color: 'border-slate-900',
      btnVariant: 'secondary' as const,
      features: [
        'Tout le plan Avancé',
        'Accès direct au vivier Admin RH',
        'Co-branding sur la plateforme',
        'Account Manager dédié',
        'Support 24/7',
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
  const [audience, setAudience] = useState<'candidate' | 'company' | 'agency'>('company')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const currentPlans = plans[audience]

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-20" style={{ background: 'linear-gradient(135deg, #0F1E3A 0%, #0F3B95 60%, #2563EB 100%)' }}>
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl" style={{ background: '#39D5F4' }} />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-5 blur-3xl" style={{ background: '#2563EB' }} />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-heading font-black tracking-widest uppercase border border-cyan-400/30" style={{ backgroundColor: 'rgba(57,213,244,0.1)', color: '#39D5F4' }}>
            Tarifs Eureka Job
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-white mt-4 mb-4 tracking-tight">
            Des plans adaptés à vos ambitions
          </h1>
          <p className="text-blue-200 text-base md:text-lg max-w-xl mx-auto leading-relaxed font-sans">
            Commencez gratuitement, passez à la vitesse supérieure quand vous le souhaitez. Sans frais cachés.
          </p>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-[-1px] left-0 right-0 pointer-events-none">
          <svg className="w-full block" viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 0C1200 40 960 60 720 60C480 60 240 40 0 0L0 60Z" fill="#F8FAFC" />
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Toggle audience */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-100/80 backdrop-blur-md border border-slate-200/50 p-1.5 rounded-2xl flex flex-wrap justify-center gap-1.5 max-w-lg shadow-sm">
            <button
              onClick={() => setAudience('candidate')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-black tracking-tight uppercase transition-all duration-300 ${audience === 'candidate' ? 'bg-gradient-to-r from-brand-600 to-blue-600 text-white shadow-lg shadow-brand-500/25 scale-[1.02]' : 'text-slate-600 hover:text-slate-800'}`}
            >
              <Users className="w-4 h-4" /> Candidats
            </button>
            <button
              onClick={() => setAudience('company')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-black tracking-tight uppercase transition-all duration-300 ${audience === 'company' ? 'bg-gradient-to-r from-brand-600 to-blue-600 text-white shadow-lg shadow-brand-500/25 scale-[1.02]' : 'text-slate-600 hover:text-slate-800'}`}
            >
              <Building2 className="w-4 h-4" /> Entreprises
            </button>
            <button
              onClick={() => setAudience('agency')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-black tracking-tight uppercase transition-all duration-300 ${audience === 'agency' ? 'bg-gradient-to-r from-brand-600 to-blue-600 text-white shadow-lg shadow-brand-500/25 scale-[1.02]' : 'text-slate-600 hover:text-slate-800'}`}
            >
              <Star className="w-4 h-4" /> Cabinets RH
            </button>
          </div>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center items-center gap-4 mb-16">
          <button
            onClick={() => setBilling('monthly')}
            className={`text-sm font-heading font-bold transition-all duration-300 ${billing === 'monthly' ? 'text-brand-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Mensuel
          </button>
          <div
            onClick={() => setBilling(billing === 'monthly' ? 'annual' : 'monthly')}
            className="w-14 h-7 rounded-full bg-slate-200/80 border border-slate-300/50 relative cursor-pointer flex items-center transition-colors p-1"
            style={{ backgroundColor: billing === 'annual' ? '#2563EB' : '' }}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${billing === 'annual' ? 'translate-x-7' : 'translate-x-0'}`} />
          </div>
          <button
            onClick={() => setBilling('annual')}
            className={`text-sm font-heading font-bold transition-all duration-300 flex items-center gap-1.5 ${billing === 'annual' ? 'text-brand-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Annuel
            <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200/60 px-2 py-0.5 rounded-full font-heading font-black uppercase tracking-wider animate-pulse">
              -20%
            </span>
          </button>
        </div>

        {/* Plans grid */}
        <div className={`grid grid-cols-1 gap-8 mb-20 ${currentPlans.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 max-w-4xl mx-auto'}`}>
          {currentPlans.map(plan => (
            <div 
              key={plan.name} 
              className={`group relative bg-white border border-slate-100 rounded-[28px] p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-10px_rgba(15,30,58,0.06)] ${plan.popular ? 'border-brand-500 shadow-[0_15px_40px_rgba(37,99,235,0.04)] bg-gradient-to-b from-white to-slate-50/30' : 'hover:border-slate-200'}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="flex items-center gap-1.5 bg-gradient-to-r from-brand-600 to-blue-600 text-white text-[9px] font-heading font-bold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md shadow-brand-500/20">
                    <Star className="w-2.5 h-2.5 fill-white" /> Recommandé
                  </span>
                </div>
              )}

              <div>
                <div className="mb-4">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-heading font-bold uppercase tracking-wider mb-2 ${plan.popular ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-600'}`}>
                    {plan.name}
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">{plan.desc}</p>
                </div>

                <div className="mb-5 pt-4 border-t border-slate-100">
                  {plan.price[billing] === -1 ? (
                    <div>
                      <p className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Sur devis</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium font-sans">Contactez notre équipe commerciale</p>
                    </div>
                  ) : plan.price[billing] === 0 ? (
                    <div>
                      <p className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Gratuit</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium font-sans">Pour toujours</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline text-slate-900">
                        <span className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
                          {plan.price[billing].toLocaleString('fr-FR')}
                        </span>
                        <span className="text-xs font-heading font-bold text-slate-400 ml-1.5 uppercase tracking-wider">
                          {plan.currency}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium font-sans">
                        {billing === 'annual' ? 'par an, facturé annuellement' : 'par mois'}
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  fullWidth
                  variant={plan.popular ? 'primary' : 'secondary'}
                  onClick={() => plan.price[billing] === -1 ? navigate('/contact') : navigate('/register?type=company')}
                  className={`rounded-xl h-10.5 text-xs flex items-center justify-center gap-2 group/btn ${plan.popular ? 'bg-gradient-to-r from-brand-600 to-blue-600 hover:shadow-md hover:shadow-brand-500/20' : ''}`}
                >
                  {plan.price[billing] === -1 ? 'Nous contacter' : plan.price[billing] === 0 ? 'Commencer gratuitement' : 'Commencer'}
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>

              <div className="mt-5 pt-5 border-t border-slate-100 space-y-2">
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-2.5">
                    <div className="w-4.5 h-4.5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />
                    </div>
                    <span className="text-xs text-slate-700 font-sans leading-normal">{f}</span>
                  </div>
                ))}
                {plan.missing?.map(f => (
                  <div key={f} className="flex items-start gap-2.5 opacity-40">
                    <div className="w-4.5 h-4.5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-1.5 h-0.5 bg-slate-400 rounded-full" />
                    </div>
                    <span className="text-xs text-slate-500 line-through font-sans leading-normal">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {[
            { icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />, bg: 'bg-emerald-50 border-emerald-100/50', label: 'Paiement sécurisé SSL', desc: 'Vos transactions cryptées' },
            { icon: <RefreshCw className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-50 border-blue-100/50', label: 'Sans engagement', desc: 'Résiliation en un clic' },
            { icon: <CreditCard className="w-6 h-6 text-purple-600" />, bg: 'bg-purple-50 border-purple-100/50', label: 'Orange Money & Wave', desc: 'Moyens locaux supportés' },
            { icon: <Globe className="w-6 h-6 text-brand-600" />, bg: 'bg-brand-50 border-brand-100/50', label: '100% Afrique de l\'Ouest', desc: 'Serveurs locaux performants' },
          ].map(t => (
            <div key={t.label} className="bg-white border border-slate-100 rounded-[24px] p-6 flex flex-col items-center text-center hover:shadow-md hover:border-slate-200 transition-all duration-300">
              <div className={`w-12 h-12 rounded-2xl ${t.bg} border flex items-center justify-center mb-4`}>
                {t.icon}
              </div>
              <p className="text-sm font-heading font-black text-slate-900 leading-tight">{t.label}</p>
              <p className="text-xs text-slate-400 mt-1 font-sans font-medium">{t.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-widest mb-4" style={{ backgroundColor: '#E6F2FF', color: '#2563EB' }}>
              FAQ
            </span>
            <h2 className="text-2xl md:text-3xl font-heading font-black text-slate-900 tracking-tight">Questions fréquentes</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-[24px] overflow-hidden transition-all duration-300 hover:shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <span className="font-heading font-bold text-slate-800 text-sm md:text-base leading-tight">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-brand-600' : 'rotate-0'}`} />
                </button>
                <div className={`transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                  <div className="px-6 pb-6 pt-2 text-sm text-slate-500 leading-relaxed font-sans border-t border-slate-50">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}
