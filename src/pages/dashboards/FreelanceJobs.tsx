import { useState, useEffect } from 'react'
import {
  Search, Filter, MapPin, Briefcase,
  Clock, DollarSign, Sparkles, ChevronRight, X, CheckCircle, Flame
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'

interface Mission {
  id: number
  title: string
  company: string
  budget: number // in FCFA
  duration: string
  desc: string
  tags: string[]
  clientReputation: number
  isHot?: boolean
}

export default function FreelanceJobs() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  
  // Bid Modal state
  const [biddingMission, setBiddingMission] = useState<Mission | null>(null)
  const [bidRate, setBidRate] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('5 jours')
  const [proposalText, setProposalText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  const missions: Mission[] = [
    {
      id: 201,
      title: 'Intégration Maquettes React & Tailwind',
      company: 'InnoTech Senegal',
      budget: 450000,
      duration: '7 jours',
      desc: 'Recherche intégrateur React expérimenté pour intégrer une quinzaine d\'écrans Figma avec des animations premium en Tailwind CSS.',
      tags: ['React', 'Tailwind CSS', 'Figma'],
      clientReputation: 4.8,
      isHot: true,
    },
    {
      id: 202,
      title: 'Migration de Base de Données vers AWS Postgres',
      company: 'Express Logistique',
      budget: 950000,
      duration: '15 jours',
      desc: 'Migration sans interruption d\'une base MySQL de production vers AWS Aurora PostgreSQL. Expérience requise avec AWS DMS.',
      tags: ['PostgreSQL', 'AWS', 'MySQL'],
      clientReputation: 4.5,
    },
    {
      id: 203,
      title: 'Développement d\'un MVP Application Flutter',
      company: 'TouchPay CI',
      budget: 1800000,
      duration: '30 jours',
      desc: 'Création d\'une application mobile pilote pour la Côte d\'Ivoire permettant d\'agréger plusieurs passerelles de paiement mobile.',
      tags: ['Flutter', 'Dart', 'API Payment'],
      clientReputation: 4.9,
      isHot: true,
    },
    {
      id: 204,
      title: 'Audit de Performance Frontend Next.js',
      company: 'Wari Cash',
      budget: 600000,
      duration: '4 jours',
      desc: 'Analyse et amélioration des Core Web Vitals (surtout LCP et INP) sur une application e-commerce Next.js existante.',
      tags: ['Next.js', 'Vercel', 'Core Web Vitals'],
      clientReputation: 4.2,
    }
  ]

  const filteredMissions = missions.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.desc.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !selectedTag || m.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const allTags = Array.from(new Set(missions.flatMap(m => m.tags)))

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bidRate.trim()) return

    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))
    setIsSubmitting(false)
    setIsSuccess(true)
    toast.success(`Votre offre de ${Number(bidRate).toLocaleString('fr-FR')} FCFA a été envoyée !`)
    setTimeout(() => {
      setBiddingMission(null)
      setBidRate('')
      setProposalText('')
      setIsSuccess(false)
    }, 1500)
  }

  return (
    <DashboardLayout role="freelance" userName="Modou Fall" userTitle="Consultant Tech">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          Trouver des missions <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">Explorez les projets freelance disponibles et formulez vos propositions commerciales</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par titre, mot-clé ou entreprise..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 shadow-sm"
            />
          </div>

          {loading ? (
            <Skeleton variant="card" count={2} />
          ) : (
            <div className="space-y-4">
              {filteredMissions.map(m => (
                <div key={m.id} className="card p-5 hover:border-blue-300 hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors text-base">{m.title}</h3>
                        {m.isHot && <Badge variant="amber">Urgent</Badge>}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{m.company} · Note client: ⭐ {m.clientReputation}</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100 flex-shrink-0">
                      {m.budget.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed line-clamp-2">{m.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {m.tags.map(t => (
                      <span key={t} className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-50 pt-4 text-xs">
                    <span className="text-slate-400">Durée estimée : <strong>{m.duration}</strong></span>
                    <Button size="sm" onClick={() => setBiddingMission(m)}>Déposer mon offre</Button>
                  </div>
                </div>
              ))}

              {filteredMissions.length === 0 && (
                <div className="card p-8 text-center text-slate-400 text-sm">
                  Aucune mission correspondant aux critères de recherche.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Filters */}
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-4 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" /> Technologies populaires
            </h3>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setSelectedTag(null)}
                className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-colors ${
                  !selectedTag 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Tous
              </button>
              {allTags.map(tag => (
                <button 
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-colors ${
                    selectedTag === tag 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bid Formulation Modal */}
      {biddingMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isSubmitting && setBiddingMission(null)} />
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden border border-slate-100 p-6">
            {isSuccess ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-1">Offre envoyée !</h4>
                <p className="text-xs text-slate-500">Votre proposition commerciale a été soumise au client.</p>
              </div>
            ) : (
              <form onSubmit={handleBidSubmit} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                  <h4 className="font-black text-slate-900 text-sm">Formuler ma proposition</h4>
                  <button type="button" onClick={() => setBiddingMission(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-slate-500">Projet: <strong>{biddingMission.title}</strong> chez {biddingMission.company}</p>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Votre tarif souhaité (FCFA)</label>
                  <input
                    type="number"
                    placeholder="ex: 450000"
                    required
                    value={bidRate}
                    onChange={e => setBidRate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Délai de réalisation estimé</label>
                  <input
                    type="text"
                    placeholder="ex: 6 jours"
                    required
                    value={deliveryTime}
                    onChange={e => setDeliveryTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Lettre d'accompagnement / Note</label>
                  <textarea
                    rows={3}
                    placeholder="Pourquoi devrions-nous retenir votre profil ?"
                    value={proposalText}
                    onChange={e => setProposalText(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 resize-none"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setBiddingMission(null)} className="flex-1">
                    Annuler
                  </Button>
                  <Button type="submit" size="sm" loading={isSubmitting} className="flex-1">
                    Soumettre la proposition
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
