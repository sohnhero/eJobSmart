import {
  LayoutDashboard, Search, FileText, Star,
  TrendingUp, Clock, DollarSign, Briefcase,
  CheckCircle, Zap, ArrowRight,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

export default function FreelanceDashboard() {
  const stats = [
    { title: 'Missions en cours', value: '2', icon: Briefcase, iconColor: 'text-blue-600' },
    { title: 'Propositions envoyées', value: '12', icon: FileText, iconColor: 'text-purple-600', trend: 25, trendLabel: 'cette semaine' },
    { title: 'Chiffre d\'affaires', value: '2.5M', icon: DollarSign, iconColor: 'text-emerald-600', trend: 15, trendLabel: 'FCFA' },
    { title: 'Note moyenne', value: '4.9', icon: Star, iconColor: 'text-amber-500', trend: 100, trendLabel: '15 avis' },
  ]

  const activeMissions = [
    { id: 1, title: 'Développement API Node.js', company: 'InnoTech Africa', budget: '800k', deadline: 'Dans 12 jours', status: 'In Progress' },
    { id: 2, title: 'Audit de sécurité Web', company: 'Ecobank', budget: '1.2M', deadline: 'Dans 5 jours', status: 'At Risk' },
  ]

  return (
    <DashboardLayout role="freelance" userName="Modou Fall" userTitle="Freelance Fullstack">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Bienvenue, Modou ! 👋</h1>
          <p className="text-slate-500 text-sm mt-0.5">Voici un aperçu de vos missions et opportunités freelance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" leftIcon={<FileText className="w-4 h-4" />}>Mes Factures</Button>
          <Button size="sm" leftIcon={<Search className="w-4 h-4" />}>Trouver une mission</Button>
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
              <button className="text-xs font-semibold text-brand-600 hover:text-brand-800">Voir tout</button>
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
              <Button variant="white" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>Mettre à jour mon portfolio</Button>
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
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                <span className="text-xs font-semibold text-slate-700">Disponible immédiatement</span>
              </div>
              <button className="text-[10px] text-brand-600 font-bold hover:underline">Modifier</button>
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
    </DashboardLayout>
  )
}
