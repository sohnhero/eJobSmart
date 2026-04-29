import { useState } from 'react'
import {
  HelpCircle, Search, ChevronDown, Plus,
  Users, Briefcase, CreditCard, Shield,
  MessageSquare, Zap, ArrowRight,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqs: FAQItem[] = [
  {
    category: 'Général',
    question: "Qu'est-ce que eJobSmart ?",
    answer: "eJobSmart est la première marketplace RH nouvelle génération en Afrique de l'Ouest. Nous connectons les entreprises, les cabinets de recrutement et les talents à travers une plateforme intelligente utilisant le matching IA pour optimiser les processus de recrutement."
  },
  {
    category: 'Général',
    question: "Comment fonctionne le score de matching ?",
    answer: "Notre algorithme analyse plus de 15 points de données, incluant vos compétences, votre expérience, votre localisation et vos préférences salariales, pour calculer un pourcentage de compatibilité avec chaque offre d'emploi."
  },
  {
    category: 'Candidats',
    question: "Mon profil est-il visible par tous les recruteurs ?",
    answer: "Vous avez un contrôle total sur votre visibilité. Vous pouvez choisir d'être visible par toutes les entreprises (Base CV), uniquement par celles auxquelles vous postulez, ou rester totalement confidentiel."
  },
  {
    category: 'Candidats',
    question: "Est-ce que l'inscription est gratuite pour les candidats ?",
    answer: "Oui, l'inscription et la postulation aux offres sont 100% gratuites pour tous les candidats et freelances sur eJobSmart."
  },
  {
    category: 'Recruteurs',
    question: "Quels documents sont nécessaires pour vérifier mon entreprise ?",
    answer: "Pour garantir la sécurité de la plateforme, nous demandons une copie de votre NINEA, votre Registre de Commerce (RC) et, pour les cabinets RH, votre agrément ministériel."
  },
  {
    category: 'Recruteurs',
    question: "Combien de temps reste une offre publiée ?",
    answer: "Par défaut, une offre reste active pendant 30 jours. Vous pouvez la clôturer manuellement à tout moment ou utiliser un 'Boost' pour prolonger sa visibilité et la remonter en tête de liste."
  },
  {
    category: 'Paiements',
    question: "Quels sont les modes de paiement acceptés ?",
    answer: "Nous acceptons les paiements locaux (Orange Money, Wave, Free Money) ainsi que les cartes bancaires (Visa, Mastercard) via notre partenaire de paiement sécurisé."
  },
  {
    category: 'Paiements',
    question: "Puis-je changer de plan d'abonnement à tout moment ?",
    answer: "Oui, vous pouvez passer à un plan supérieur à tout moment. La différence de tarif sera calculée au prorata pour le mois en cours."
  }
]

const categories = [
  { id: 'Général', icon: HelpCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'Candidats', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'Recruteurs', icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'Paiements', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
]

export default function FAQ() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Tous')
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const filteredFaqs = faqs.filter(f => {
    const matchesQuery = f.question.toLowerCase().includes(query.toLowerCase()) || 
                         f.answer.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = activeCategory === 'Tous' || f.category === activeCategory
    return matchesQuery && matchesCategory
  })

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section className="relative pt-20 pb-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e40af_0%,transparent_50%)] opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="blue" className="mb-6">Centre d'aide</Badge>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Comment pouvons-nous <br />
            <span className="bg-gradient-to-r from-blue-400 to-brand-400 bg-clip-text text-transparent">vous aider ?</span>
          </h1>
          
          <div className="max-w-2xl mx-auto relative mt-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une question (ex: matching, paiement, visibilité...)"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-lg"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center flex-wrap gap-4">
            <button
              onClick={() => setActiveCategory('Tous')}
              className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeCategory === 'Tous' 
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20' 
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Toutes les questions
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                  activeCategory === cat.id 
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <cat.icon className={`w-4 h-4 ${activeCategory === cat.id ? 'text-white' : cat.color}`} />
                {cat.id}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFaqs.length > 0 ? (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div 
                  key={index}
                  className={`group rounded-3xl border transition-all duration-300 ${
                    openIndex === index 
                    ? 'border-brand-200 bg-brand-50/30 shadow-sm' 
                    : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                  >
                    <span className={`font-bold text-lg transition-colors ${openIndex === index ? 'text-brand-700' : 'text-slate-800'}`}>
                      {faq.question}
                    </span>
                    <div className={`p-2 rounded-xl transition-all ${openIndex === index ? 'bg-brand-600 text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">Aucun résultat pour "{query}"</p>
              <button onClick={() => {setQuery(''); setActiveCategory('Tous')}} className="text-brand-600 font-bold mt-2 hover:underline">
                Réinitialiser les filtres
              </button>
            </div>
          )}

          {/* Still need help? */}
          <div className="mt-20 p-8 bg-slate-900 rounded-[32px] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <MessageSquare className="w-24 h-24 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Vous ne trouvez pas votre réponse ?</h3>
            <p className="text-blue-200 mb-8 max-w-md mx-auto">Notre équipe support est disponible du lundi au vendredi pour répondre à toutes vos questions.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="rounded-2xl shadow-xl shadow-brand-600/20">
                Nous contacter
                <ArrowRight className="w-4 h-4" />
              </Button>
              <button className="px-6 py-3 text-white font-bold hover:text-blue-300 transition-colors">
                Consulter la documentation
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function Badge({ children, variant = 'slate', className }: { children: React.ReactNode; variant?: string; className?: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    slate: 'bg-slate-100 text-slate-600 border-slate-200'
  }
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${colors[variant]} ${className}`}>
      {children}
    </span>
  )
}
