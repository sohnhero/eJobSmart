import { useState } from 'react'
import {
  LayoutDashboard, Search, FileText, Star,
  TrendingUp, Clock, DollarSign, Briefcase,
  CheckCircle, Zap, ArrowRight, X, Sparkles
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

interface FreelanceJob {
  id: number
  title: string
  company: string
  budget: string
  deadline: string
  desc: string
}

export default function FreelanceDashboard() {
  const navigate = useNavigate()
  
  // Interactive state
  const [isAvailable, setIsAvailable] = useState(true)
  const [proposalsCount, setProposalsCount] = useState(12)
  const [earnings, setEarnings] = useState(2500000)

  // Find missions state
  const [showFindModal, setShowFindModal] = useState(false)
  const [biddingJob, setBiddingJob] = useState<FreelanceJob | null>(null)
  const [bidRate, setBidRate] = useState('')
  const [bidTime, setBidTime] = useState('3 jours')
  const [bidSuccess, setBidSuccess] = useState(false)

  const [activeMissions, setActiveMissions] = useState([
    { id: 1, title: 'Développement API Node.js', company: 'InnoTech Africa', budget: '800k', deadline: 'Dans 12 jours', status: 'In Progress' },
    { id: 2, title: 'Audit de sécurité Web', company: 'Ecobank', budget: '1.2M', deadline: 'Dans 5 jours', status: 'At Risk' },
  ])

  const freelanceMissionsCatalog: FreelanceJob[] = [
    { id: 101, title: 'Intégration React & Tailwind CSS', company: 'Sonatel Digital', budget: '450k', deadline: '7 jours', desc: 'Nous recherchons un intégrateur React expert pour polir nos maquettes Figma.' },
    { id: 102, title: 'Migration base de données Postgres', company: 'Wave SN', budget: '900k', deadline: '15 jours', desc: 'Migration d\'une base MySQL vers AWS Aurora Postgres de manière transparente.' },
    { id: 103, title: 'Développement application React Native', company: 'Orange SN', budget: '1.8M', deadline: '30 jours', desc: 'Développement d\'une application pilote mobile pour le suivi des expéditions.' },
  ]

  const stats = [
    { title: 'Missions en cours', value: activeMissions.length.toString(), icon: Briefcase, iconColor: 'text-blue-600' },
    { title: 'Propositions envoyées', value: proposalsCount.toString(), icon: FileText, iconColor: 'text-purple-600', trend: 25, trendLabel: 'cette semaine' },
    { title: 'Chiffre d\'affaires', value: `${(earnings / 1000000).toFixed(1)}M`, icon: DollarSign, iconColor: 'text-emerald-600', trend: 15, trendLabel: 'FCFA' },
    { title: 'Note moyenne', value: '4.9', icon: Star, iconColor: 'text-amber-500', trend: 100, trendLabel: '15 avis' },
  ]

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!bidRate.trim()) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setBidSuccess(true)
      setProposalsCount(prev => prev + 1)
      // Simulate success callback
      setTimeout(() => {
        setBidSuccess(false)
        setBiddingJob(null)
        setBidRate('')
      }, 1500)
    }, 1000)
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <DashboardLayout role="freelance" userName="Modou Fall" userTitle="Freelance Fullstack">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Bienvenue, Modou ! 👋</h1>
          <p className="text-slate-500 text-sm mt-0.5">Voici un aperçu de vos missions et opportunités freelance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setShowFindModal(true)} leftIcon={<Search className="w-4 h-4" />}>
            Trouver une mission
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" /> Missions Actives
              </h2>
            </div>
            <div className="space-y-4">
              {activeMissions.map(mission => (
                <div key={mission.id} className="p-4 border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{mission.title}</h3>
                      <p className="text-xs text-slate-500">{mission.company}</p>
                    </div>
                    <Badge variant={mission.status === 'In Progress' ? 'green' : 'amber'}>{mission.status}</Badge>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-600">
                      <DollarSign className="w-3.5 h-3.5" /> {mission.budget} FCFA
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {mission.deadline}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2 text-white">Boostez votre profil Freelance !</h3>
              <p className="text-blue-100 text-sm mb-4 max-w-md">Ajoutez vos dernières réalisations à votre portfolio pour attirer plus d'entreprises.</p>
              <Button variant="white" size="sm" onClick={() => navigate('/dashboard/freelance/profile')}>Mettre à jour mon portfolio</Button>
            </div>
            <TrendingUp className="absolute -bottom-6 -right-6 w-32 h-32 text-blue-500/20 rotate-12" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-4 text-sm">Disponibilité</h3>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span className="text-xs font-semibold text-slate-700">
                  {isAvailable ? 'Disponible immédiatement' : 'Indisponible'}
                </span>
              </div>
              <button 
                onClick={() => setIsAvailable(!isAvailable)} 
                className="text-[10px] text-brand-600 font-bold hover:underline"
              >
                Modifier
              </button>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-4 text-sm flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" /> Avis récents
            </h3>
            <div className="space-y-4">
              {[
                { author: 'Fatou B.', rating: 5, text: 'Excellent travail sur l\'API ! Très réactif.' },
                { author: 'Ibrahima S.', rating: 4, text: 'Bonne expertise technique.' },
              ].map((review, i) => (
                <div key={i} className="pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold text-slate-800">{review.author}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`w-2.5 h-2.5 ${j < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed italic">"{review.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Find Missions Catalog Modal */}
      {showFindModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowFindModal(false)} />
          
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-slate-900">Missions Freelance</h3>
              <button onClick={() => setShowFindModal(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {freelanceMissionsCatalog.map(m => (
                <div key={m.id} className="p-4 border border-slate-200 rounded-2xl hover:border-brand-500 hover:bg-brand-50/5 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800">{m.title}</h4>
                      <p className="text-xs text-slate-500 mb-2">{m.company}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                      {m.budget} FCFA
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-4">{m.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Délai: {m.deadline}</span>
                    <Button size="sm" onClick={() => setBiddingJob(m)}>Proposer mes services</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bidding dialog modal */}
      {biddingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setBiddingJob(null)} />
          
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden border border-slate-100 p-6 text-center">
            {bidSuccess ? (
              <div>
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-1">Offre transmise !</h4>
                <p className="text-xs text-slate-500">Votre proposition commerciale a été soumise au client.</p>
              </div>
            ) : (
              <form onSubmit={handleBidSubmit} className="space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                  <h4 className="font-black text-slate-900 text-sm">Formuler ma proposition</h4>
                  <button type="button" onClick={() => setBiddingJob(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                </div>
                <p className="text-xs text-slate-500">Poste: <strong>{biddingJob.title}</strong> chez {biddingJob.company}</p>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Votre tarif souhaité (FCFA)</label>
                  <input 
                    type="text" placeholder="ex: 400,000" required
                    value={bidRate} onChange={e => setBidRate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Temps de réalisation</label>
                  <input 
                    type="text" placeholder="ex: 5 jours, 2 semaines"
                    value={bidTime} onChange={e => setBidTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setBiddingJob(null)} className="flex-1">Annuler</Button>
                  <Button type="submit" size="sm" loading={isSubmitting} className="flex-1">Soumettre</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
