import { useState } from 'react'
import {
  Search, Filter, MapPin, Briefcase,
  Clock, Heart, Share2, ChevronRight,
  Sparkles, SlidersHorizontal, X, CheckCircle2, FileText
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Badge, { ContractBadge } from '../../components/ui/Badge'
import MatchScore from '../../components/ui/MatchScore'
import { jobs } from '../../data/jobs'

export default function CandidateRecommendedJobs() {
  const navigate = useNavigate()
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('')
  const [remoteFilter, setRemoteFilter] = useState('Tous')
  const [salaryFilter, setSalaryFilter] = useState(2500000)
  const [favorites, setFavorites] = useState<number[]>([])
  
  // Apply Modal state
  const [applyingJob, setApplyingJob] = useState<typeof jobs[0] | null>(null)
  const [coverMessage, setCoverMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Simulation de recommandations basées sur le profil d'Amadou (Full Stack React/Node)
  const recommendedJobs = jobs.filter(j => 
    j.title.toLowerCase().includes('react') || 
    j.title.toLowerCase().includes('node') || 
    j.title.toLowerCase().includes('full stack') ||
    j.title.toLowerCase().includes('developer')
  )

  const filteredJobs = recommendedJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRemote = remoteFilter === 'Tous' || job.remoteType === remoteFilter
    const matchesSalary = job.salaryMax <= salaryFilter || job.salaryMin <= salaryFilter
    return matchesSearch && matchesRemote && matchesSalary
  })

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    )
  }

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200))
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  const closeApplyModal = () => {
    setApplyingJob(null)
    setCoverMessage('')
    setIsSuccess(false)
  }

  return (
    <DashboardLayout role="candidate" userName="Amadou Diallo">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            Offres recommandées <Sparkles className="w-5 h-5 text-brand-600 fill-brand-600" />
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Basées sur vos compétences en React, Node.js et votre localisation à Dakar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search bar inside list */}
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher parmi les offres recommandées..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">{filteredJobs.length} Offres trouvées</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Trier par :</span>
              <select className="text-xs font-bold text-slate-700 bg-transparent outline-none">
                <option>Meilleur Matching</option>
                <option>Plus récentes</option>
                <option>Salaire élevé</option>
              </select>
            </div>
          </div>

          {filteredJobs.map((job, index) => (
            <div 
              key={job.id} 
              className="card p-5 group hover:border-brand-500 transition-all relative overflow-hidden flex flex-col md:flex-row md:items-start gap-4"
            >
              {/* Matching indicator at top-right */}
              <div className="absolute top-0 right-0 p-4">
                <MatchScore score={98 - index * 3} />
              </div>

              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center p-2 flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
              </div>

              <div className="flex-1 min-w-0 pr-16">
                <h3 
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="font-bold text-lg text-slate-900 group-hover:text-brand-600 cursor-pointer transition-colors leading-tight mb-1 truncate"
                >
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
                    <button 
                      onClick={() => toggleFavorite(job.id)}
                      className={`p-2 rounded-lg transition-colors ${favorites.includes(job.id) ? 'text-red-500 bg-red-50' : 'text-slate-400 hover:text-red-500 hover:bg-slate-50'}`}
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <Button 
                      size="sm"
                      onClick={() => setApplyingJob(job)}
                    >
                      Postuler
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredJobs.length === 0 && (
            <div className="card p-12 text-center text-slate-400">
              <Briefcase className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-semibold">Aucune offre ne correspond à vos critères de filtrage</p>
            </div>
          )}
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
                  {['Tous', 'Sur site', 'Télétravail', 'Hybride'].map(mode => (
                    <button 
                      key={mode} 
                      onClick={() => setRemoteFilter(mode)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all border ${
                        remoteFilter === mode 
                          ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-100' 
                          : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-brand-50 hover:text-brand-600'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Salaire max souhaité (FCFA)</label>
                <input 
                  type="range" 
                  min="500000" 
                  max="3000000" 
                  step="100000"
                  value={salaryFilter}
                  onChange={e => setSalaryFilter(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600" 
                />
                <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-600">
                  <span>500K FCFA</span>
                  <span className="text-brand-600 font-black">{salaryFilter.toLocaleString('fr-FR')} FCFA</span>
                  <span>3M+ FCFA</span>
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

      {/* Apply Modal */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeApplyModal} />
          
          {/* Content */}
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden border border-slate-100">
            {isSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">Candidature envoyée !</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Votre candidature pour le poste de <strong>"{applyingJob.title}"</strong> a été transmise avec succès à {applyingJob.company}.
                </p>
                <Button fullWidth onClick={closeApplyModal}>Fermer</Button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit}>
                {/* Header */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-slate-900">Postuler à l'offre</h3>
                    <p className="text-xs text-slate-500">{applyingJob.title} · {applyingJob.company}</p>
                  </div>
                  <button type="button" onClick={closeApplyModal} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                  {/* CV Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Votre Curriculum Vitae</label>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <FileText className="w-8 h-8 text-red-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">CV_Amadou_Diallo_2026.pdf</p>
                        <p className="text-[10px] text-slate-400">Document Principal · Modifié le 15/04/2026</p>
                      </div>
                    </div>
                  </div>

                  {/* Cover letter */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Lettre de motivation (Optionnel)</label>
                    <textarea 
                      rows={4}
                      value={coverMessage}
                      onChange={e => setCoverMessage(e.target.value)}
                      placeholder="Bonjour, je souhaite postuler à votre offre de..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 resize-none"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                  <Button type="button" variant="ghost" size="sm" onClick={closeApplyModal}>Annuler</Button>
                  <Button type="submit" size="sm" loading={isSubmitting}>Envoyer ma candidature</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
