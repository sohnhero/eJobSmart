import {
  Search, Filter, MapPin, Briefcase,
  Clock, Heart, Share2, ChevronRight,
  Sparkles, SlidersHorizontal,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge, { ContractBadge } from '../../components/ui/Badge'
import MatchScore from '../../components/ui/MatchScore'
import { jobs } from '../../data/jobs'

export default function CandidateRecommendedJobs() {
  const navigate = useNavigate()
  
  // Simulation de recommandations basées sur le profil d'Amadou (Full Stack React/Node)
  const recommendedJobs = jobs.filter(j => 
    j.title.toLowerCase().includes('react') || 
    j.title.toLowerCase().includes('node') || 
    j.title.toLowerCase().includes('full stack')
  )

  return (
    <DashboardLayout role="candidate" userName="Amadou Diallo">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            Offres recommandées <Sparkles className="w-5 h-5 text-brand-600 fill-brand-600" />
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Basées sur vos compétences en React, Node.js et votre localisation à Dakar</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" leftIcon={<SlidersHorizontal className="w-4 h-4" />}>
            Ajuster mes préférences
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">{recommendedJobs.length} Offres trouvées</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Trier par :</span>
              <select className="text-xs font-bold text-slate-700 bg-transparent outline-none">
                <option>Meilleur Matching</option>
                <option>Plus récentes</option>
                <option>Salaire élevé</option>
              </select>
            </div>
          </div>

          {recommendedJobs.map((job, index) => (
            <div 
              key={job.id} 
              onClick={() => navigate(`/jobs/${job.id}`)}
              className="card p-5 group cursor-pointer hover:border-brand-500 transition-all relative overflow-hidden"
            >
              {/* Matching indicator at top-right */}
              <div className="absolute top-0 right-0 p-4">
                <MatchScore score={98 - index * 3} />
              </div>

              <div className="flex items-start gap-4 pr-16">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center p-2 flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors leading-tight mb-1 truncate">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
                    <p className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-slate-400" /> {job.company}
                    </p>
                    <p className="text-sm text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400" /> {job.city}
                    </p>
                    <ContractBadge type={job.contractType} />
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {['React', 'Node.js', 'TypeScript', 'Tailwind'].map(skill => (
                      <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-4">
                       <span className="text-xs font-bold text-emerald-600">
                         {job.salaryMin.toLocaleString('fr-FR')} - {job.salaryMax.toLocaleString('fr-FR')} {job.currency} / mois
                       </span>
                       <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> Il y a 2h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-red-500 transition-colors" onClick={(e) => e.stopPropagation()}><Heart className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-brand-600 transition-colors" onClick={(e) => e.stopPropagation()}><Share2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Sidebar */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-600" /> Filtres rapides
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Télétravail</label>
                <div className="flex flex-wrap gap-2">
                  {['Bureau', 'Hybride', 'Full Remote'].map(mode => (
                    <button key={mode} className="px-3 py-1.5 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 text-xs font-medium text-slate-600 rounded-xl transition-colors border border-slate-100">
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Salaire souhaité (FCFA)</label>
                <input type="range" min="0" max="2000000" className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600" />
                <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400">
                  <span>0</span>
                  <span>2M+</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-brand-600 text-white border-none">
            <h3 className="font-bold mb-2">Besoin d'aide ?</h3>
            <p className="text-xs text-blue-100 mb-4 leading-relaxed">
              Nos consultants RH peuvent vous aider à optimiser votre CV pour ces offres.
            </p>
            <Button variant="white" size="sm" fullWidth>Réserver une session</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
